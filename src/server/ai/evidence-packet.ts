import type { PTATAIContext, PTATEvidencePacket } from '../../types/ai.types';

/**
 * Transforms an M08A PTATAIContext retrieval bundle into a bounded,
 * structured PTATEvidencePacket suitable for Vertex AI synthesis.
 */
export function buildEvidencePacket(context: PTATAIContext): PTATEvidencePacket {
  return {
    query: context.query,
    intent: context.parsedIntent,
    answerability: context.answerability,
    entities: context.matchedEntities,
    records: context.records.map((r) => ({
      recordId: r.id,
      slug: r.slug,
      recordType: r.recordType,
      title: r.title,
      summary: r.summary,
      implementationStatus: r.implementationStatus,
      verificationStatus: r.verificationStatus,
      geographicScope: r.geographicScope,
      geographies: r.geographies.map((g) => ({
        name: g.name,
        code: g.code,
        scope: g.scope,
      })),
      sectors: r.sectors,
      institutions: r.institutions,
    })),
    claims: context.claims.map((c) => ({
      claimId: c.claimId,
      recordId: c.recordId,
      recordSlug: c.recordExternalId,
      claimText: c.claimText,
      claimType: c.claimType,
      ...(c.dataValueNature ? { dataValueNature: c.dataValueNature } : {}),
      ...(c.verificationStatus ? { verificationStatus: c.verificationStatus } : {}),
      sources: c.sources.map((s) => ({
        sourceId: s.sourceId,
        title: s.title,
        publisher: s.publisher,
        ...(s.url ? { url: s.url } : {}),
        sourceLevel: s.sourceLevel,
        isPrimaryOfficial: s.isPrimaryOfficial,
      })),
    })),
    financials: context.financialRecords.map((f) => ({
      financialId: f.financialId,
      recordSlug: f.recordExternalId,
      financialType: f.financialType,
      financialTypeLabel: f.financialTypeLabel,
      amountExact: f.amountExact,
      formattedAmount: f.formattedAmount,
      currencyCode: f.currencyCode,
      ...(f.reportingPeriod ? { reportingPeriod: f.reportingPeriod } : {}),
    })),
    beneficiaries: context.beneficiaryRecords.map((b) => ({
      beneficiaryId: b.beneficiaryId,
      recordSlug: b.recordExternalId,
      beneficiaryType: b.beneficiaryType,
      beneficiaryStage: b.beneficiaryStage,
      beneficiaryStageLabel: b.beneficiaryStageLabel,
      countValue: b.countValue,
      formattedCount: b.formattedCount,
      unit: b.unit,
      cumulative: b.cumulative,
      ...(b.reportingPeriod ? { reportingPeriod: b.reportingPeriod } : {}),
    })),
    comparison: context.comparison
      ? {
          firstSubjectName: context.comparison.firstSubject.name,
          firstSubjectRecords: context.comparison.firstSubject.matchedRecords.map((r) => r.slug),
          secondSubjectName: context.comparison.secondSubject.name,
          secondSubjectRecords: context.comparison.secondSubject.matchedRecords.map((r) => r.slug),
          dimensions: context.comparison.comparisonDimensions,
        }
      : undefined,
  };
}
