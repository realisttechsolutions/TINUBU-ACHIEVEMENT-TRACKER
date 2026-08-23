import { describe, it, expect, vi } from 'vitest';
import type { QueryExecutor } from '../../server/db/pool';
import type { PTATAIContext, PTATEvidencePacket } from '../../types/ai.types';
import { PTATVertexClient } from '../../server/ai/vertex-client';
import { buildEvidencePacket } from '../../server/ai/evidence-packet';
import { buildSystemInstruction, buildSynthesisPrompt } from '../../server/ai/synthesis-prompt';
import { validateModelCitations } from '../../server/ai/citation-validator';
import { PTATGroundedSynthesisService } from '../../server/ai/grounded-synthesis';

describe('PTAT M08B: Vertex AI Grounded Synthesis & Citation Validation Unit Tests', () => {
  // Mock Evidence Context
  const mockContext: PTATAIContext = {
    query: 'What has Tinubu done in Kaduna?',
    parsedIntent: 'GEOGRAPHIC_QUERY',
    parsedConstraints: { state: 'Kaduna', stateCode: 'NG-KD' },
    matchedEntities: ['kaduna-solar-plant', 'kaduna-dry-port'],
    records: [
      {
        id: 'rec-001-kaduna',
        externalId: 'kaduna-solar-plant',
        slug: 'kaduna-solar-plant',
        recordType: 'physical_project',
        title: 'Kaduna 50MW Solar Power Installation',
        summary: '50MW solar installation completed in Kaduna State.',
        implementationStatus: 'completed',
        workflowStatus: 'published',
        publicationStatus: 'published',
        verificationStatus: 'verified',
        evidenceProfile: 'high',
        riskLevel: 'low',
        isPublic: true,
        sectors: [{ code: 'power_energy_natural_resources', label: 'Power & Energy' }],
        institutions: [{ code: 'REA', name: 'Rural Electrification Agency' }],
        geographies: [{ code: 'NG-KD', name: 'Kaduna', scope: 'STATE_SPECIFIC', role: 'location' }],
        geographicScope: 'STATE_SPECIFIC',
        publishedAt: '2025-06-01',
        route: '/projects/kaduna-solar-plant',
      },
    ],
    claims: [
      {
        claimId: 'claim-001-solar',
        recordId: 'rec-001-kaduna',
        recordExternalId: 'kaduna-solar-plant',
        claimText: 'Constructed and energized 50MW solar plant in Kaduna.',
        claimType: 'infrastructure_output',
        verificationStatus: 'verified',
        sources: [
          {
            sourceId: 'src-001-rea',
            title: 'REA Official Commissioning Report 2025',
            publisher: 'Rural Electrification Agency',
            url: 'https://rea.gov.ng/kaduna-50mw',
            sourceLevel: 'LEVEL_1',
            sourceType: 'official_report',
            isPrimaryOfficial: true,
            evidenceLocation: 'Page 4, Section 2',
          },
        ],
      },
    ],
    sources: [
      {
        sourceId: 'src-001-rea',
        title: 'REA Official Commissioning Report 2025',
        publisher: 'Rural Electrification Agency',
        url: 'https://rea.gov.ng/kaduna-50mw',
        sourceLevel: 'LEVEL_1',
        sourceType: 'official_report',
        isPrimaryOfficial: true,
      },
    ],
    financialRecords: [
      {
        financialId: 'fin-001-solar',
        recordId: 'rec-001-kaduna',
        recordExternalId: 'kaduna-solar-plant',
        amountExact: '5000000000',
        formattedAmount: '₦5.00B',
        currencyCode: 'NGN',
        financialType: 'disbursement',
        financialTypeLabel: 'Disbursement',
        reportingPeriod: '2024-2025',
      },
    ],
    beneficiaryRecords: [
      {
        beneficiaryId: 'ben-001-solar',
        recordId: 'rec-001-kaduna',
        recordExternalId: 'kaduna-solar-plant',
        countValue: 120000,
        formattedCount: '120,000',
        unit: 'households',
        beneficiaryType: 'households',
        beneficiaryStage: 'direct_recipients',
        beneficiaryStageLabel: 'Direct Recipients',
        cumulative: true,
      },
    ],
    timelineEvents: [],
    geographies: [
      {
        recordId: 'rec-001-kaduna',
        recordExternalId: 'kaduna-solar-plant',
        stateName: 'Kaduna',
        stateCode: 'NG-KD',
        scope: 'STATE_SPECIFIC',
      },
    ],
    citationMap: [],
    recordLinks: [
      {
        externalId: 'kaduna-solar-plant',
        title: 'Kaduna 50MW Solar Power Installation',
        recordType: 'physical_project',
        route: '/projects/kaduna-solar-plant',
        primaryState: 'Kaduna',
      },
    ],
    retrievalConfidence: {
      overallScore: 0.95,
      entityMatchScore: 0.95,
      constraintMatchScore: 1.0,
      evidenceCoverageScore: 0.9,
      sourceAuthenticityScore: 1.0,
      geographicPrecisionScore: 1.0,
      temporalPrecisionScore: 0.9,
      confidenceTier: 'HIGH',
      explanation: 'High confidence match for Kaduna projects.',
    },
    answerability: 'ANSWERABLE',
    answerabilityReason: 'Direct verified evidence retrieved.',
    diagnostics: {
      retrievalLatencyMs: 120,
      recordsScanned: 1,
      claimsScanned: 1,
      sourcesScanned: 1,
      dataTimestamp: '2026-08-21T00:00:00Z',
    },
  };

  describe('1. Vertex Client Provider & Configuration Authority', () => {
    it('initializes with default staging project and approved model configuration', () => {
      const client = new PTATVertexClient();
      const cfg = client.getConfig();
      expect(cfg.project).toBeDefined();
      expect(cfg.location).toBe('global');
      expect(cfg.model).toBe('gemini-3.6-flash');
      expect(cfg.temperature).toBe(0.1);
      expect(cfg.maxOutputTokens).toBe(8192);
      expect(cfg.thinkingLevel).toBe('LOW');
    });

    it('allows server-side environment overrides without touching client bundles', () => {
      const customClient = new PTATVertexClient({
        model: 'gemini-3.6-pro',
        location: 'global',
        temperature: 0.05,
      });
      const cfg = customClient.getConfig();
      expect(cfg.model).toBe('gemini-3.6-pro');
      expect(cfg.temperature).toBe(0.05);
    });
  });

  describe('2. Evidence Packet Assembly', () => {
    it('constructs a bounded, typed PTATEvidencePacket from PTATAIContext', () => {
      const packet = buildEvidencePacket(mockContext);
      expect(packet.query).toBe('What has Tinubu done in Kaduna?');
      expect(packet.intent).toBe('GEOGRAPHIC_QUERY');
      expect(packet.records).toHaveLength(1);
      expect(packet.records[0].slug).toBe('kaduna-solar-plant');
      expect(packet.claims).toHaveLength(1);
      expect(packet.claims[0].claimId).toBe('claim-001-solar');
      expect(packet.claims[0].sources).toHaveLength(1);
      expect(packet.claims[0].sources[0].sourceId).toBe('src-001-rea');
      expect(packet.financials).toHaveLength(1);
      expect(packet.financials[0].formattedAmount).toBe('₦5.00B');
      expect(packet.beneficiaries).toHaveLength(1);
      expect(packet.beneficiaries[0].formattedCount).toBe('120,000');
    });
  });

  describe('3. System Instruction & Grounding Prompts', () => {
    it('embeds natural conversation guidelines and core truth semantic rules', () => {
      const sys = buildSystemInstruction();
      expect(sys).toContain('NATURAL CONVERSATION & PROFESSIONAL TONE');
      expect(sys).toContain('CORE TRUTH & FACTUAL INTEGRITY');
      expect(sys).toContain('NELFUND');
      expect(sys).toContain('trained fellows" does NOT mean "employed/placed"');
    });

    it('formats synthesis prompt with bounded JSON evidence packet', () => {
      const packet = buildEvidencePacket(mockContext);
      const prompt = buildSynthesisPrompt(mockContext.query, packet);
      expect(prompt).toContain('USER QUESTION:');
      expect(prompt).toContain('What has Tinubu done in Kaduna?');
      expect(prompt).toContain('EVIDENCE PACKET:');
      expect(prompt).toContain('claim-001-solar');
    });
  });

  describe('4. Citation Allowlist & Phantom Rejection', () => {
    const packet: PTATEvidencePacket = buildEvidencePacket(mockContext);

    it('successfully validates legitimate citations referencing packet claim and source IDs', () => {
      const rawCitations = [
        {
          claimId: 'claim-001-solar',
          sourceId: 'src-001-rea',
          recordSlug: 'kaduna-solar-plant',
          quoteOrSummary: 'Constructed and energized 50MW solar plant.',
        },
      ];

      const res = validateModelCitations(rawCitations, packet);
      expect(res.valid).toBe(true);
      expect(res.validCitations).toBe(1);
      expect(res.rejectedCitations).toBe(0);
      expect(res.validatedCitations[0].isValidated).toBe(true);
      expect(res.validatedCitations[0].publisher).toBe('Rural Electrification Agency');
      expect(res.validatedCitations[0].url).toBe('https://rea.gov.ng/kaduna-50mw');
    });

    it('rejects unknown or hallucinated claim IDs not present in evidence packet', () => {
      const rawCitations = [
        {
          claimId: 'phantom-claim-999',
          sourceId: 'phantom-source-999',
          recordSlug: 'kaduna-solar-plant',
        },
      ];

      const res = validateModelCitations(rawCitations, packet);
      expect(res.valid).toBe(false);
      expect(res.validCitations).toBe(0);
      expect(res.rejectedCitations).toBe(1);
      expect(res.rejectionReasons[0]).toContain('Unknown claimId: "phantom-claim-999"');
    });

    it('rejects unknown source IDs not associated with the evidence packet', () => {
      const rawCitations = [
        {
          claimId: 'phantom-claim-888',
          sourceId: 'phantom-source-999',
          recordSlug: 'kaduna-solar-plant',
        },
      ];

      const res = validateModelCitations(rawCitations, packet);
      expect(res.valid).toBe(false);
      expect(res.validCitations).toBe(0);
      expect(res.rejectedCitations).toBe(1);
      expect(res.rejectionReasons[0]).toContain('Unknown claimId: "phantom-claim-888"');
    });
  });

  describe('5. Grounded Synthesis & Execution Flow', () => {
    it('executes full grounded synthesis when evidence is available', async () => {
      const mockDb = { query: vi.fn() } as unknown as QueryExecutor;
      const service = new PTATGroundedSynthesisService(mockDb);

      vi.spyOn(service.getRetrievalService(), 'retrievePTATContext').mockResolvedValue(mockContext);

      vi.spyOn(service.getVertexClient(), 'generateGroundedContent').mockResolvedValue({
        rawText: JSON.stringify({
          answer:
            'In Kaduna State, President Tinubu completed the Kaduna 50MW Solar Power Installation through the Rural Electrification Agency.',
          summaryBulletPoints: ['50MW Solar Plant energised in Kaduna State.'],
          citations: [
            {
              claimId: 'claim-001-solar',
              sourceId: 'src-001-rea',
              recordSlug: 'kaduna-solar-plant',
              quoteOrSummary: 'Constructed and energized 50MW solar plant.',
            },
          ],
          limitations: [],
        }),
        parsedJson: {
          answer:
            'In Kaduna State, President Tinubu completed the Kaduna 50MW Solar Power Installation through the Rural Electrification Agency.',
          summaryBulletPoints: ['50MW Solar Plant energised in Kaduna State.'],
          citations: [
            {
              claimId: 'claim-001-solar',
              sourceId: 'src-001-rea',
              recordSlug: 'kaduna-solar-plant',
              quoteOrSummary: 'Constructed and energized 50MW solar plant.',
            },
          ],
          limitations: [],
        },
        metadata: {
          model: 'gemini-3.6-flash',
          location: 'global',
          retrievalLatencyMs: 120,
          modelLatencyMs: 850,
          totalLatencyMs: 970,
          inputTokens: 320,
          outputTokens: 85,
          totalTokens: 405,
          retriesAttempted: 0,
        },
      });

      const answer = await service.answerQuestion('What has Tinubu done in Kaduna?');

      expect(answer.answerability).toBe('ANSWERABLE');
      expect(answer.isGrounded).toBe(true);
      expect(answer.citations).toHaveLength(1);
      expect(answer.citations[0].isValidated).toBe(true);
      expect(answer.recordLinks).toHaveLength(1);
      expect(answer.recordLinks[0].route).toBe('/projects/kaduna-solar-plant');
      expect(answer.modelMetadata.totalLatencyMs).toBe(970);
    });
  });

  describe('6. Generic Data-Driven Acronym Discovery & Synthetic Future Entities', () => {
    it('generically derives regex initials for unseen synthetic entities (NIDC -> National Infrastructure Delivery Corporation)', async () => {
      const { buildGenericAcronymRegex } = await import('../../server/ai/retrieval-engine');
      const nidcRegexStr = buildGenericAcronymRegex('NIDC', 'js');
      expect(nidcRegexStr).toBeDefined();
      const nidcRegex = new RegExp(nidcRegexStr!, 'i');
      expect(nidcRegex.test('National Infrastructure Delivery Corporation')).toBe(true);
      expect(nidcRegex.test('Federal Ministry of Health')).toBe(false);
    });

    it('generically derives regex initials for unseen synthetic entities (FATP -> Federal Agricultural Technology Programme)', async () => {
      const { buildGenericAcronymRegex } = await import('../../server/ai/retrieval-engine');
      const fatpRegexStr = buildGenericAcronymRegex('FATP', 'js');
      expect(fatpRegexStr).toBeDefined();
      const fatpRegex = new RegExp(fatpRegexStr!, 'i');
      expect(fatpRegex.test('Federal Agricultural Technology Programme')).toBe(true);
      expect(fatpRegex.test('National Credit Guarantee Company')).toBe(false);
    });

    it('correctly discovers canonical entities without explicit dictionary mappings (NCGC, DICON)', async () => {
      const { buildGenericAcronymRegex } = await import('../../server/ai/retrieval-engine');
      const ncgcRegex = new RegExp(buildGenericAcronymRegex('NCGC', 'js')!, 'i');
      expect(ncgcRegex.test('National Credit Guarantee Company established with ₦100bn initial capital')).toBe(true);

      const diconRegex = new RegExp(buildGenericAcronymRegex('DICON', 'js')!, 'i');
      expect(diconRegex.test('Defence Industries Corporation of Nigeria')).toBe(true);
    });
  });

  describe('7. Semantic Integrity & Discipline Invariants', () => {
    it('strictly distinguishes financial commitment from expenditure in system instructions', () => {
      const sys = buildSystemInstruction();
      expect(sys).toMatch(/commitments.*expenditures/i);
      expect(sys).toMatch(/allocation.*disbursement/i);
    });

    it('strictly enforces beneficiary stage separation (trained vs employed)', () => {
      const sys = buildSystemInstruction();
      expect(sys).toContain('trained fellows" does NOT mean "employed/placed"');
    });

    it('preserves symmetrical bilateral comparison evaluation', () => {
      const sys = buildSystemInstruction();
      expect(sys).toContain('without assuming "₦0 spent" when unrecorded');
    });
  });

  describe('8. M08E Intelligent Routing & General/Web Grounding Behavior', () => {
    it('routes general queries to GENERAL mode and calls generateGeneralContent', async () => {
      const mockEmptyContext: PTATAIContext = {
        query: 'What is the average surface temperature of Mars?',
        parsedIntent: 'ENTITY_LOOKUP',
        parsedConstraints: { keywords: ['mars'] },
        matchedEntities: [],
        records: [],
        claims: [],
        sources: [],
        financialRecords: [],
        beneficiaryRecords: [],
        timelineEvents: [],
        geographies: [],
        citationMap: [],
        recordLinks: [],
        retrievalConfidence: {
          overallScore: 0,
          entityMatchScore: 0,
          constraintMatchScore: 0.8,
          evidenceCoverageScore: 0,
          sourceAuthenticityScore: 0,
          geographicPrecisionScore: 0.8,
          temporalPrecisionScore: 0.8,
          confidenceTier: 'NONE',
          explanation: 'No matching public PTAT evidence found for this query.',
        },
        answerability: 'INSUFFICIENT_EVIDENCE',
        answerabilityReason: 'PTAT does not contain verified records matching this request.',
        diagnostics: {
          retrievalLatencyMs: 12,
          recordsScanned: 0,
          claimsScanned: 0,
          sourcesScanned: 0,
          dataTimestamp: new Date().toISOString(),
        },
      };

      const mockDb: QueryExecutor = {
        query: vi.fn(),
      };

      const synthesisService = new PTATGroundedSynthesisService(mockDb, {
        project: 'tinubu-achievement-stg',
        location: 'global',
        model: 'gemini-3.6-flash',
      });

      vi.spyOn((synthesisService as any).vertexClient, 'generateSimpleText').mockResolvedValue({
        text: mockEmptyContext.query,
      });

      const generalSpy = vi
        .spyOn((synthesisService as any).vertexClient, 'generateGeneralContent')
        .mockResolvedValue({
          rawText: 'The average surface temperature on Mars is approximately -60°C (-80°F).',
          metadata: {
            model: 'gemini-3.6-flash',
            location: 'global',
            retrievalLatencyMs: 12,
            modelLatencyMs: 150,
            totalLatencyMs: 162,
            inputTokens: 100,
            outputTokens: 30,
            totalTokens: 130,
            retriesAttempted: 0,
          },
        });

      vi.spyOn((synthesisService as any).retrievalService, 'retrievePTATContext').mockResolvedValue(mockEmptyContext);

      // Execute synthesis
      const answer = await synthesisService.answerQuestion(mockEmptyContext.query);

      expect(generalSpy).toHaveBeenCalled();
      expect(answer.sourceMode).toBe('GENERAL');
      expect(answer.answerText).toContain('Mars');
      expect(answer.citations).toHaveLength(0);
      expect(answer.isGrounded).toBe(true);
    });

    it('routes factual current news queries with zero PTAT records to WEB_GROUNDED search mode', async () => {
      const mockNewsContext: PTATAIContext = {
        query: 'Who is the current President of South Africa?',
        parsedIntent: 'ENTITY_LOOKUP',
        parsedConstraints: { keywords: ['president', 'south', 'africa'] },
        matchedEntities: [],
        records: [],
        claims: [],
        sources: [],
        financialRecords: [],
        beneficiaryRecords: [],
        timelineEvents: [],
        geographies: [],
        citationMap: [],
        recordLinks: [],
        retrievalConfidence: {
          overallScore: 0,
          entityMatchScore: 0,
          constraintMatchScore: 0.8,
          evidenceCoverageScore: 0,
          sourceAuthenticityScore: 0,
          geographicPrecisionScore: 0.8,
          temporalPrecisionScore: 0.8,
          confidenceTier: 'NONE',
          explanation: 'No matching public PTAT evidence found for this query.',
        },
        answerability: 'INSUFFICIENT_EVIDENCE',
        answerabilityReason: 'PTAT does not contain verified records matching this request.',
        diagnostics: {
          retrievalLatencyMs: 15,
          recordsScanned: 0,
          claimsScanned: 0,
          sourcesScanned: 0,
          dataTimestamp: new Date().toISOString(),
        },
      };

      const mockDb: QueryExecutor = {
        query: vi.fn(),
      };

      const synthesisService = new PTATGroundedSynthesisService(mockDb, {
        project: 'tinubu-achievement-stg',
        location: 'global',
        model: 'gemini-3.6-flash',
      });

      vi.spyOn((synthesisService as any).vertexClient, 'generateSimpleText').mockResolvedValue({
        text: mockNewsContext.query,
      });

      const searchSpy = vi
        .spyOn((synthesisService as any).vertexClient, 'generateGroundedSearchContent')
        .mockResolvedValue({
          rawText: 'The current President of South Africa is Cyril Ramaphosa.',
          metadata: {
            model: 'gemini-3.6-flash',
            location: 'global',
            retrievalLatencyMs: 15,
            modelLatencyMs: 250,
            totalLatencyMs: 265,
            inputTokens: 120,
            outputTokens: 40,
            totalTokens: 160,
            retriesAttempted: 0,
          },
          webSources: [
            {
              title: 'The Presidency of South Africa',
              url: 'https://thepresidency.gov.za',
              domain: 'thepresidency.gov.za',
            },
          ],
        });

      vi.spyOn((synthesisService as any).retrievalService, 'retrievePTATContext').mockResolvedValue(mockNewsContext);

      const answer = await synthesisService.answerQuestion(mockNewsContext.query);

      expect(searchSpy).toHaveBeenCalled();
      expect(answer.sourceMode).toBe('WEB_GROUNDED');
      expect(answer.answerText).toContain('Cyril Ramaphosa');
      expect(answer.webSources).toHaveLength(1);
    });

    it('M08G.0: asserts normal public answers NEVER contain forbidden catalog-refusal phrases', async () => {
      const forbiddenPhrases = [
        'Insufficient Evidence in Public Catalog',
        'contains no recorded public evidence for this query',
        'strictly restricted to verified PTAT public records',
      ];

      const mockDb: QueryExecutor = { query: vi.fn().mockResolvedValue({ rows: [] }) };
      const synthesisService = new PTATGroundedSynthesisService(mockDb);

      vi.spyOn((synthesisService as any).vertexClient, 'generateSimpleText').mockResolvedValue({
        rawText: 'education, student loans, NELFUND',
      });

      vi.spyOn((synthesisService as any).vertexClient, 'generateGroundedSearchContent').mockResolvedValue({
        rawText: 'President Tinubu has reformed tertiary education funding and disbursed student loans via NELFUND.',
        metadata: { model: 'gemini-3.6-flash', location: 'global' },
        webSources: [{ title: 'NELFUND Portal', url: 'https://nelf.gov.ng', domain: 'nelf.gov.ng' }],
      });

      vi.spyOn((synthesisService as any).vertexClient, 'generateGeneralContent').mockResolvedValue({
        rawText: 'The average temperature on Mars is about -60°C (-80°F).',
        metadata: { model: 'gemini-3.6-flash', location: 'global' },
      });

      const queriesToTest = [
        'What has president tinubu done so far in education',
        'What has Tinubu done for young people?',
        'What has Tinubu done in agriculture?',
        'What empowerment programs tinubu did in 2024',
        'Who is the current President of South Africa?',
        'What is the average temperature on Mars?',
        'what tinubu do students',
        'tinubu achievement education pls',
      ];

      for (const q of queriesToTest) {
        const res = await synthesisService.answerQuestion(q);
        const text = res.answerText || res.answer || '';
        for (const phrase of forbiddenPhrases) {
          expect(text.toLowerCase()).not.toContain(phrase.toLowerCase());
        }
      }
    });

    it('M08G.0: guarantees graceful natural fallback message if web search grounding fails', async () => {
      const mockDb: QueryExecutor = { query: vi.fn().mockResolvedValue({ rows: [] }) };
      const synthesisService = new PTATGroundedSynthesisService(mockDb);

      vi.spyOn((synthesisService as any).vertexClient, 'generateSimpleText').mockResolvedValue({
        rawText: 'nigeria news',
      });

      vi.spyOn((synthesisService as any).retrievalService, 'retrievePTATContext').mockResolvedValue({
        records: [],
        claims: [],
        sources: [],
        financialRecords: [],
        beneficiaryRecords: [],
        timelineEvents: [],
        geographies: [],
        citationMap: [],
        recordLinks: [],
        retrievalConfidence: { confidenceTier: 'NONE', overallScore: 0 },
        answerability: 'INSUFFICIENT_EVIDENCE',
        diagnostics: { retrievalLatencyMs: 5 },
      } as any);

      vi.spyOn((synthesisService as any).vertexClient, 'generateGroundedSearchContent').mockRejectedValue(
        new Error('Network timeout connecting to Vertex search endpoint')
      );

      const res = await synthesisService.answerQuestion('What is the latest breaking news on Nigerian fiscal reforms?');
      expect(res.sourceMode).toBe('WEB_GROUNDED');
      expect(res.answerText).toBe(
        "I couldn't verify enough reliable public information to answer that question properly right now."
      );
      expect(res.answerText).not.toContain('Catalog');
      expect(res.answerText).not.toContain('database');
    });
  });
});
