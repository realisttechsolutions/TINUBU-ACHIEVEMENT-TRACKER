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
    it('embeds evidence-containment doctrine and financial semantic rules', () => {
      const sys = buildSystemInstruction();
      expect(sys).toContain('EVIDENCE-CONTAINMENT CONTROL & STRICT EVIDENCE GROUNDING');
      expect(sys).toContain('DO NOT use general training knowledge');
      expect(sys).toContain('DICON');
      expect(sys).toContain('NELFUND');
      expect(sys).toContain('CREDICORP is distinct from Pi-CNG');
      expect(sys).toContain('3MTT "trained" does NOT mean "employed"');
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

  describe('5. Grounded Synthesis Pre-Gate & Unsupported Evidence Handling', () => {
    it('bypasses Vertex AI call when answerability is INSUFFICIENT_EVIDENCE', async () => {
      const insufficientContext: PTATAIContext = {
        ...mockContext,
        query: 'What is the average temperature on planet Mars?',
        answerability: 'INSUFFICIENT_EVIDENCE',
        records: [],
        claims: [],
        sources: [],
        financialRecords: [],
        beneficiaryRecords: [],
        recordLinks: [],
        answerabilityReason: 'No public records found.',
      };

      const mockDb = { query: vi.fn() } as unknown as QueryExecutor;
      const service = new PTATGroundedSynthesisService(mockDb);

      // Mock retrievalService to return insufficientContext
      vi.spyOn(service.getRetrievalService(), 'retrievePTATContext').mockResolvedValue(
        insufficientContext
      );

      // Spy on vertexClient to ensure generateGroundedContent is NEVER called
      const vertexSpy = vi.spyOn(service.getVertexClient(), 'generateGroundedContent');

      const answer = await service.answerQuestion('What is the average temperature on planet Mars?');

      expect(vertexSpy).not.toHaveBeenCalled();
      expect(answer.answerability).toBe('INSUFFICIENT_EVIDENCE');
      expect(answer.citations).toHaveLength(0);
      expect(answer.recordLinks).toHaveLength(0);
      expect(answer.modelMetadata.modelLatencyMs).toBe(0);
      expect(answer.modelMetadata.inputTokens).toBe(0);
      expect(answer.isGrounded).toBe(true);
      expect(answer.answer).toContain('contains no recorded public evidence');
    });

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
      expect(sys).toMatch(/commitment.*expenditure/i);
      expect(sys).toMatch(/allocation.*disbursement/i);
    });

    it('strictly enforces beneficiary stage separation (trained vs employed)', () => {
      const sys = buildSystemInstruction();
      expect(sys).toContain('trained" does NOT mean "employed"');
    });

    it('preserves symmetrical bilateral comparison evaluation', () => {
      const sys = buildSystemInstruction();
      expect(sys).toContain('No recorded financial observation in PTAT" must NEVER be converted to "₦0 spent"');
    });
  });
});
