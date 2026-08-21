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
import { buildSystemInstruction, buildSynthesisPrompt } from './synthesis-prompt';
import { validateModelCitations } from './citation-validator';

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
   * Complete end-to-end evidence-grounded answer generation pipeline.
   *
   * Query -> Retrieval Context -> Pre-Gate Check -> Evidence Packet -> Vertex AI -> Citation Validation -> PTAT Answer
   */
  public async answerQuestion(
    query: string,
    options: RetrievalOptions = {}
  ): Promise<PTATGroundedAnswer> {
    const trimmedQuery = (query || '').trim();

    // 1. Retrieve Authoritative Evidence Context from M08A
    const context: PTATAIContext = await this.retrievalService.retrievePTATContext(
      trimmedQuery,
      options
    );

    const retrievalLatencyMs = context.diagnostics.retrievalLatencyMs;
    const vertexCfg = this.vertexClient.getConfig();

    // 2. Pre-Gate Check: If INSUFFICIENT_EVIDENCE, abort model call to prevent hallucinations
    if (context.answerability === 'INSUFFICIENT_EVIDENCE' || context.records.length === 0) {
      return {
        query: trimmedQuery,
        intent: context.parsedIntent,
        answerability: 'INSUFFICIENT_EVIDENCE',
        answer:
          'The President Tinubu Achievement Tracker (PTAT) contains no recorded public evidence for this query. Substantive factual statements are strictly restricted to verified PTAT public records.',
        summaryBulletPoints: [
          'No matching public records, claims, or official sources found in the PTAT catalog.',
        ],
        citations: [],
        recordLinks: [],
        limitations: [
          context.answerabilityReason || 'Zero evidence matches in the PTAT public catalog.',
        ],
        confidence: context.retrievalConfidence,
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

    // 3. Construct Bounded Evidence Packet
    const evidencePacket = buildEvidencePacket(context);
    const systemInstruction = buildSystemInstruction();
    const prompt = buildSynthesisPrompt(trimmedQuery, evidencePacket);

    // 4. Invoke Vertex AI Gemini for Grounded Synthesis
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

    // 5. Validate Citations against Evidence Packet Allowlist
    const rawCitations = Array.isArray(parsed.citations) ? parsed.citations : [];
    const citationValidation = validateModelCitations(rawCitations, evidencePacket);

    // 6. Assemble Certified Grounded Answer Object
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
      answer: rawAnswerText,
      summaryBulletPoints: Array.isArray(parsed.summaryBulletPoints)
        ? parsed.summaryBulletPoints
        : undefined,
      citations: citationValidation.validatedCitations,
      recordLinks: context.recordLinks,
      limitations,
      confidence: context.retrievalConfidence,
      comparisonSummary: parsed.comparisonSummary,
      modelMetadata: generationResult.metadata,
      citationValidation,
      isGrounded: citationValidation.valid,
    };
  }
}
