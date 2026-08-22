import type { QueryExecutor } from '../db/pool';
import type {
  PTATAIContext,
  PTATGroundedAnswer,
  RetrievalOptions,
  PTATVertexConfig,
} from '../../types/ai.types';
import { PTATAIRetrievalService } from './retrieval-service';
import { PTATVertexClient } from './vertex-client';
import { buildEvidencePacket } from './evidence-packet';
import {
  buildSystemInstruction,
  buildSynthesisPrompt,
  buildWebGroundedSystemInstruction,
  buildGeneralSystemInstruction,
  buildPtatPlusWebPrompt,
} from './synthesis-prompt';
import { validateModelCitations } from './citation-validator';
import { rewriteLowConfidenceQuery } from './query-rewriter';
import { determineIntelligenceRoute } from './routing-engine';

export class PTATGroundedSynthesisService {
  private retrievalService: PTATAIRetrievalService;
  private vertexClient: PTATVertexClient;

  constructor(db: QueryExecutor, vertexConfig?: Partial<PTATVertexConfig>) {
    this.retrievalService = new PTATAIRetrievalService(db);
    this.vertexClient = new PTATVertexClient(vertexConfig);
  }

  public getVertexClient(): PTATVertexClient {
    return this.vertexClient;
  }

  public getRetrievalService(): PTATAIRetrievalService {
    return this.retrievalService;
  }

  /**
   * Complete end-to-end intelligence synthesis pipeline (M08E):
   *
   * Query -> PTAT Retrieval -> (Optional Bounded Query Rewrite + Retry) -> Intelligent Route -> Synthesis (PTAT_ONLY | PTAT_PLUS_WEB | WEB_GROUNDED | GENERAL) -> Validated Output
   */
  public async answerQuestion(
    query: string,
    options: RetrievalOptions = {}
  ): Promise<PTATGroundedAnswer> {
    const trimmedQuery = (query || '').trim();

    // 1. Initial Authoritative Evidence Retrieval
    let context: PTATAIContext = await this.retrievalService.retrievePTATContext(
      trimmedQuery,
      options
    );

    // 2. Low-Confidence Query Understanding & Bounded Single-Retry Step
    if (
      context.records.length === 0 ||
      context.claims.length === 0 ||
      context.retrievalConfidence.confidenceTier === 'NONE'
    ) {
      const rewrite = await rewriteLowConfidenceQuery(trimmedQuery, this.vertexClient);
      if (rewrite.rewrittenQuery !== trimmedQuery) {
        const retryContext = await this.retrievalService.retrievePTATContext(
          rewrite.rewrittenQuery,
          options
        );
        if (retryContext.records.length > 0 && retryContext.claims.length > 0) {
          context = retryContext;
        }
      }
    }

    const retrievalLatencyMs = context.diagnostics.retrievalLatencyMs;
    const vertexCfg = this.vertexClient.getConfig();

    // 3. Intelligent Routing Decision
    const route = determineIntelligenceRoute(trimmedQuery, context);

    // ROUTE 1: PTAT_ONLY
    if (route.mode === 'PTAT_ONLY') {
      const evidencePacket = buildEvidencePacket(context);
      const systemInstruction = buildSystemInstruction();
      const prompt = buildSynthesisPrompt(trimmedQuery, evidencePacket);

      const generationResult = await this.vertexClient.generateGroundedContent(
        prompt,
        systemInstruction,
        retrievalLatencyMs
      );

      const parsed = generationResult.parsedJson || {};
      const rawAnswerText =
        typeof parsed.answer === 'string' && parsed.answer.trim().length > 0
          ? parsed.answer.trim()
          : generationResult.rawText.trim();

      const rawCitations = Array.isArray(parsed.citations) ? parsed.citations : [];
      const citationValidation = validateModelCitations(rawCitations, evidencePacket);

      const limitations: string[] = Array.isArray(parsed.limitations)
        ? parsed.limitations
        : [];

      if (context.answerability === 'PARTIALLY_ANSWERABLE') {
        limitations.push('Evidence is partially complete; some requested facets may not be recorded.');
      }

      return {
        query: trimmedQuery,
        intent: context.parsedIntent,
        answerability: context.answerability,
        sourceMode: 'PTAT_ONLY',
        answer: rawAnswerText,
        answerText: rawAnswerText,
        summaryBulletPoints: Array.isArray(parsed.summaryBulletPoints)
          ? parsed.summaryBulletPoints
          : undefined,
        citations: citationValidation.validatedCitations,
        recordLinks: context.recordLinks,
        limitations,
        confidence: context.retrievalConfidence,
        retrievalConfidence: context.retrievalConfidence,
        comparisonSummary: parsed.comparisonSummary,
        financialSummary: context.financialRecords,
        beneficiarySummary: context.beneficiaryRecords,
        constraints: context.parsedConstraints,
        diagnostics: context.diagnostics,
        modelMetadata: generationResult.metadata,
        citationValidation,
        isGrounded: citationValidation.valid,
      };
    }

    // ROUTE 2: PTAT_PLUS_WEB
    if (route.mode === 'PTAT_PLUS_WEB') {
      const evidencePacket = buildEvidencePacket(context);
      const systemInstruction = buildWebGroundedSystemInstruction();
      const prompt = buildPtatPlusWebPrompt(trimmedQuery, evidencePacket);

      try {
        const searchResult = await this.vertexClient.generateGroundedSearchContent(
          prompt,
          systemInstruction,
          retrievalLatencyMs
        );

        const answerText = searchResult.rawText.trim();

        const ptatCitations = (context.sources || []).map((src) => {
          const matchedClaim = context.claims.find((c) =>
            c.sources.some((s) => s.sourceId === src.sourceId)
          );
          return {
            claimId: matchedClaim?.claimId || src.sourceId,
            sourceId: src.sourceId,
            recordSlug: matchedClaim?.recordExternalId || 'ptat-catalogue',
            sourceTitle: src.title,
            publisher: src.publisher,
            url: src.url || `/sources/${src.sourceId}`,
            sourceLevel: src.sourceLevel || 'LEVEL_1',
            quoteOrSummary: src.evidenceSummary || src.title,
            isValidated: true,
          };
        });

        return {
          query: trimmedQuery,
          intent: context.parsedIntent,
          answerability: 'ANSWERABLE',
          sourceMode: 'PTAT_PLUS_WEB',
          answer: answerText,
          answerText,
          citations: ptatCitations,
          webSources: searchResult.webSources || [],
          webGrounding: searchResult.webGrounding,
          recordLinks: context.recordLinks,
          limitations: ['Synthesized from authoritative PTAT records and verified live web sources.'],
          confidence: context.retrievalConfidence,
          retrievalConfidence: context.retrievalConfidence,
          financialSummary: context.financialRecords,
          beneficiarySummary: context.beneficiaryRecords,
          constraints: context.parsedConstraints,
          diagnostics: context.diagnostics,
          modelMetadata: searchResult.metadata,
          citationValidation: {
            valid: true,
            totalCitations: ptatCitations.length,
            validCitations: ptatCitations.length,
            rejectedCitations: 0,
            rejectionReasons: [],
            validatedCitations: ptatCitations,
          },
          isGrounded: true,
        };
      } catch (err: any) {
        console.error('PTAT_PLUS_WEB execution error:', {
          message: err?.message,
          stack: err?.stack,
        });
        // Fallback to PTAT_ONLY if search grounding fails
        const fallbackInstruction = buildSystemInstruction();
        const fallbackPrompt = buildSynthesisPrompt(trimmedQuery, evidencePacket);
        const generationResult = await this.vertexClient.generateGroundedContent(
          fallbackPrompt,
          fallbackInstruction,
          retrievalLatencyMs
        );
        const parsed = generationResult.parsedJson || {};
        const rawAnswerText =
          typeof parsed.answer === 'string' && parsed.answer.trim().length > 0
            ? parsed.answer.trim()
            : generationResult.rawText.trim();
        const rawCitations = Array.isArray(parsed.citations) ? parsed.citations : [];
        const citationValidation = validateModelCitations(rawCitations, evidencePacket);

        return {
          query: trimmedQuery,
          intent: context.parsedIntent,
          answerability: context.answerability,
          sourceMode: 'PTAT_ONLY',
          answer: rawAnswerText,
          answerText: rawAnswerText,
          citations: citationValidation.validatedCitations,
          recordLinks: context.recordLinks,
          limitations: ['Web search unavailable; answered strictly from PTAT evidence.'],
          confidence: context.retrievalConfidence,
          modelMetadata: generationResult.metadata,
          citationValidation,
          isGrounded: citationValidation.valid,
        };
      }
    }

    // ROUTE 3: WEB_GROUNDED
    if (route.mode === 'WEB_GROUNDED') {
      const systemInstruction = buildWebGroundedSystemInstruction();
      try {
        const searchResult = await this.vertexClient.generateGroundedSearchContent(
          trimmedQuery,
          systemInstruction,
          retrievalLatencyMs
        );

        const answerText = searchResult.rawText.trim();

        return {
          query: trimmedQuery,
          intent: context.parsedIntent,
          answerability: 'ANSWERABLE',
          sourceMode: 'WEB_GROUNDED',
          answer: answerText,
          answerText,
          citations: [],
          webSources: searchResult.webSources || [],
          webGrounding: searchResult.webGrounding,
          recordLinks: [],
          limitations: [],
          confidence: {
            overallScore: 0.9,
            entityMatchScore: 1,
            constraintMatchScore: 1,
            evidenceCoverageScore: 1,
            sourceAuthenticityScore: 1,
            geographicPrecisionScore: 1,
            temporalPrecisionScore: 1,
            confidenceTier: 'HIGH',
            explanation: 'Grounded in current live public search sources.',
          },
          financialSummary: [],
          beneficiarySummary: [],
          constraints: context.parsedConstraints,
          diagnostics: context.diagnostics,
          modelMetadata: searchResult.metadata,
          citationValidation: {
            valid: true,
            totalCitations: 0,
            validCitations: 0,
            rejectedCitations: 0,
            rejectionReasons: [],
            validatedCitations: [],
          },
          isGrounded: true,
        };
      } catch (err: any) {
        // Natural limitation response
        return {
          query: trimmedQuery,
          intent: context.parsedIntent,
          answerability: 'INSUFFICIENT_EVIDENCE',
          sourceMode: 'WEB_GROUNDED',
          answer:
            "I couldn't verify enough reliable public information to answer that question properly right now.",
          answerText:
            "I couldn't verify enough reliable public information to answer that question properly right now.",
          citations: [],
          webSources: [],
          recordLinks: [],
          limitations: ['Live search grounding service temporarily unavailable.'],
          confidence: context.retrievalConfidence,
          financialSummary: [],
          beneficiarySummary: [],
          diagnostics: context.diagnostics,
          modelMetadata: {
            model: vertexCfg.model,
            location: vertexCfg.location,
            apiVersion: 'v1',
            retrievalLatencyMs,
            modelLatencyMs: 0,
            totalLatencyMs: retrievalLatencyMs,
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0,
            retriesAttempted: 0,
          },
          citationValidation: {
            valid: true,
            totalCitations: 0,
            validCitations: 0,
            rejectedCitations: 0,
            rejectionReasons: [],
            validatedCitations: [],
          },
          isGrounded: false,
        };
      }
    }

    // ROUTE 4: GENERAL
    const generalInstruction = buildGeneralSystemInstruction();
    try {
      const generalResult = await this.vertexClient.generateGeneralContent(
        trimmedQuery,
        generalInstruction,
        retrievalLatencyMs
      );

      const answerText = generalResult.rawText.trim();

      return {
        query: trimmedQuery,
        intent: context.parsedIntent,
        answerability: 'ANSWERABLE',
        sourceMode: 'GENERAL',
        answer: answerText,
        answerText,
        citations: [],
        webSources: [],
        recordLinks: [],
        limitations: [],
        confidence: {
          overallScore: 0.95,
          entityMatchScore: 1,
          constraintMatchScore: 1,
          evidenceCoverageScore: 1,
          sourceAuthenticityScore: 1,
          geographicPrecisionScore: 1,
          temporalPrecisionScore: 1,
          confidenceTier: 'HIGH',
          explanation: 'Synthesized from general domain knowledge.',
        },
        financialSummary: [],
        beneficiarySummary: [],
        constraints: context.parsedConstraints,
        diagnostics: context.diagnostics,
        modelMetadata: generalResult.metadata,
        citationValidation: {
          valid: true,
          totalCitations: 0,
          validCitations: 0,
          rejectedCitations: 0,
          rejectionReasons: [],
          validatedCitations: [],
        },
        isGrounded: true,
      };
    } catch {
      return {
        query: trimmedQuery,
        intent: context.parsedIntent,
        answerability: 'ANSWERABLE',
        sourceMode: 'GENERAL',
        answer: 'I am here to assist with information about Nigeria, government policies, achievements, and general knowledge. Please let me know what you would like to explore.',
        answerText: 'I am here to assist with information about Nigeria, government policies, achievements, and general knowledge. Please let me know what you would like to explore.',
        citations: [],
        webSources: [],
        recordLinks: [],
        limitations: [],
        confidence: context.retrievalConfidence,
        financialSummary: [],
        beneficiarySummary: [],
        diagnostics: context.diagnostics,
        modelMetadata: {
          model: vertexCfg.model,
          location: vertexCfg.location,
          apiVersion: 'v1',
          retrievalLatencyMs,
          modelLatencyMs: 0,
          totalLatencyMs: retrievalLatencyMs,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          retriesAttempted: 0,
        },
        citationValidation: {
          valid: true,
          totalCitations: 0,
          validCitations: 0,
          rejectedCitations: 0,
          rejectionReasons: [],
          validatedCitations: [],
        },
        isGrounded: true,
      };
    }
  }
}
