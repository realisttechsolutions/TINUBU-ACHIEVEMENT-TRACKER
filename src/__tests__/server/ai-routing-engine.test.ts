import { describe, it, expect } from 'vitest';
import { determineIntelligenceRoute } from '../../server/ai/routing-engine';
import { rewriteLowConfidenceQuery } from '../../server/ai/query-rewriter';
import type { PTATAIContext } from '../../types/ai.types';

describe('PTAT M08E: Intelligent Routing & Query Normalization Unit Tests', () => {
  const baseConfidence = {
    overallScore: 0.85,
    entityMatchScore: 1,
    constraintMatchScore: 1,
    evidenceCoverageScore: 1,
    sourceAuthenticityScore: 1,
    geographicPrecisionScore: 1,
    temporalPrecisionScore: 1,
    confidenceTier: 'HIGH' as const,
    explanation: 'High confidence match',
  };

  const mockPtatContext: PTATAIContext = {
    query: 'What is NELFUND?',
    parsedIntent: 'PROGRAMME_QUERY',
    parsedConstraints: {},
    matchedEntities: ['nelfund'],
    records: [{ id: '1', externalId: 'nelfund', slug: 'nelfund', recordType: 'programme', title: 'NELFUND', summary: '', implementationStatus: 'operational', workflowStatus: 'published', publicationStatus: 'published', verificationStatus: 'verified', evidenceProfile: 'high', riskLevel: 'low', isPublic: true, sectors: [], institutions: [], geographies: [], geographicScope: 'NATIONWIDE', route: '/programmes/nelfund' }],
    claims: [{ claimId: 'c1', recordId: '1', recordExternalId: 'nelfund', claimText: 'Disbursed funds', claimType: 'financial', sources: [] }],
    sources: [{ sourceId: 's1', title: 'NELFUND Portal', publisher: 'NELFUND', sourceLevel: 'LEVEL_1', sourceType: 'portal', isPrimaryOfficial: true }],
    financialRecords: [],
    beneficiaryRecords: [],
    timelineEvents: [],
    geographies: [],
    citationMap: [],
    recordLinks: [],
    retrievalConfidence: baseConfidence,
    answerability: 'ANSWERABLE',
    answerabilityReason: 'Matched',
    diagnostics: { retrievalLatencyMs: 10, recordsScanned: 1, claimsScanned: 1, sourcesScanned: 1, dataTimestamp: '' },
  };

  const mockEmptyContext: PTATAIContext = {
    ...mockPtatContext,
    records: [],
    claims: [],
    sources: [],
    retrievalConfidence: { ...baseConfidence, confidenceTier: 'NONE' },
    answerability: 'INSUFFICIENT_EVIDENCE',
  };

  describe('1. Routing Engine Logic', () => {
    it('routes high-confidence PTAT queries to PTAT_ONLY mode', () => {
      const decision = determineIntelligenceRoute('What is NELFUND?', mockPtatContext);
      expect(decision.mode).toBe('PTAT_ONLY');
    });

    it('routes PTAT queries with explicit 2026 freshness requests to PTAT_PLUS_WEB mode', () => {
      const decision = determineIntelligenceRoute('What is the latest 2026 update on NELFUND as of now?', mockPtatContext);
      expect(decision.mode).toBe('PTAT_PLUS_WEB');
    });

    it('routes political / government queries with zero PTAT records to WEB_GROUNDED mode', () => {
      const decision = determineIntelligenceRoute('Who is the Minister of Foreign Affairs?', mockEmptyContext);
      expect(decision.mode).toBe('WEB_GROUNDED');
    });

    it('routes foreign politics and world leader queries to WEB_GROUNDED mode', () => {
      const decision = determineIntelligenceRoute('Who is the current President of South Africa?', mockEmptyContext);
      expect(decision.mode).toBe('WEB_GROUNDED');
    });

    it('routes tech specifications and current news queries to WEB_GROUNDED mode', () => {
      const decision = determineIntelligenceRoute('What are the specifications of the iPhone 16?', mockEmptyContext);
      expect(decision.mode).toBe('WEB_GROUNDED');
    });

    it('routes stable general knowledge questions (e.g. Mars temperature) to GENERAL mode', () => {
      const decision = determineIntelligenceRoute('What is the average temperature on Mars?', mockEmptyContext);
      expect(decision.mode).toBe('GENERAL');
    });
  });

  describe('2. Low-Confidence Query Rewriting & Paraphrase Tolerance', () => {
    it('expands informal "empowerment programs" phrasing to include youth skills and credit terms', async () => {
      const rewrite = await rewriteLowConfidenceQuery('What empowerment programs tinubu did in 2024');
      expect(rewrite.expandedKeywords.length).toBeGreaterThan(0);
      expect(rewrite.inferredSector).toBe('Youth, Employment and Skills');
      expect(rewrite.rewrittenQuery).toContain('youth');
    });

    it('normalizes "empower young Nigerians in 2024" to relevant policy keywords', async () => {
      const rewrite = await rewriteLowConfidenceQuery('What programmes did Tinubu introduce to empower young Nigerians in 2024?');
      expect(rewrite.expandedKeywords.length).toBeGreaterThan(0);
      expect(rewrite.rewrittenQuery).toContain('training');
    });
  });
});
