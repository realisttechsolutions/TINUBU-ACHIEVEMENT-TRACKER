import type {
  AnswerabilityStatus,
  PTATAIConfidence,
  PTATAIContext,
  PTATAICitation,
  PTATAIRecordLink,
  PTATAIComparisonBundle,
  QueryConstraints,
  QueryIntent,
} from '../../types/ai.types';
import type { RawRetrievalResults } from './retrieval-engine';

export function assembleAnswerContext(
  query: string,
  intent: QueryIntent,
  constraints: QueryConstraints,
  matchedEntities: string[],
  retrieval: RawRetrievalResults,
  comparisonData?: {
    firstResults: RawRetrievalResults;
    secondResults: RawRetrievalResults;
  },
): PTATAIContext {
  const { records, claims, sources, financials, beneficiaries, timelines, geographies, stats } = retrieval;

  // 1. Build Citation Map
  const citationMap: PTATAICitation[] = [];
  let citationCounter = 1;

  for (const claim of claims) {
    const parentRecord = records.find((r) => r.id === claim.recordId || r.slug === claim.recordExternalId);
    for (const src of claim.sources) {
      citationMap.push({
        citationId: `CIT-${citationCounter++}`,
        claimId: claim.claimId,
        claimText: claim.claimText,
        sourceId: src.sourceId,
        sourceTitle: src.title,
        publisher: src.publisher,
        url: src.url,
        sourceLevel: src.sourceLevel,
        recordExternalId: claim.recordExternalId,
        recordTitle: parentRecord ? parentRecord.title : 'PTAT Record',
        recordUrl: parentRecord ? parentRecord.route : `/records/${claim.recordExternalId}`,
      });
    }
  }

  // 2. Build Record Links
  const recordLinks: PTATAIRecordLink[] = records.map((r) => {
    const primaryGeo = r.geographies.length > 0 ? r.geographies[0].name : undefined;
    return {
      externalId: r.externalId,
      title: r.title,
      recordType: r.recordType,
      route: r.route,
      primaryState: primaryGeo,
    };
  });

  // 3. Compute Deterministic Retrieval Confidence
  let entityMatchScore = 0.5;
  if (matchedEntities.length > 0) {
    entityMatchScore = 1.0;
  } else if (!constraints.entityName) {
    entityMatchScore = 0.8;
  }

  let constraintMatchScore = 0.5;
  const activeConstraints = [constraints.state, constraints.sector, constraints.recordType, constraints.year, constraints.statusConstraint].filter(Boolean);
  if (activeConstraints.length === 0) {
    constraintMatchScore = 0.8;
  } else if (records.length > 0) {
    constraintMatchScore = 0.95;
  }

  const evidenceCoverageScore = records.length > 0 ? Math.min(1.0, claims.length / (records.length * 1.2)) : 0.0;
  const officialSourcesCount = sources.filter((s) => s.isPrimaryOfficial || s.sourceLevel === 'LEVEL_1').length;
  const sourceAuthenticityScore = sources.length > 0 ? officialSourcesCount / sources.length : 0.0;
  const geographicPrecisionScore = constraints.state ? (records.some((r) => r.geographicScope === 'STATE_SPECIFIC' || r.geographicScope === 'FCT_SPECIFIC') ? 1.0 : 0.7) : 0.8;
  const temporalPrecisionScore = constraints.year ? 0.9 : 0.8;

  const overallScore = Number(
    (
      entityMatchScore * 0.25 +
      constraintMatchScore * 0.2 +
      evidenceCoverageScore * 0.2 +
      sourceAuthenticityScore * 0.15 +
      geographicPrecisionScore * 0.1 +
      temporalPrecisionScore * 0.1
    ).toFixed(2),
  );

  let confidenceTier: PTATAIConfidence['confidenceTier'] = 'LOW';
  if (records.length === 0) {
    confidenceTier = 'NONE';
  } else if (overallScore >= 0.8) {
    confidenceTier = 'HIGH';
  } else if (overallScore >= 0.5) {
    confidenceTier = 'MEDIUM';
  }

  const retrievalConfidence: PTATAIConfidence = {
    overallScore: records.length === 0 ? 0.0 : overallScore,
    entityMatchScore,
    constraintMatchScore,
    evidenceCoverageScore,
    sourceAuthenticityScore,
    geographicPrecisionScore,
    temporalPrecisionScore,
    confidenceTier,
    explanation:
      records.length === 0
        ? 'No matching public PTAT evidence found for this query.'
        : `High-fidelity grounding based on ${records.length} canonical records, ${claims.length} claims, and ${sources.length} sources.`,
  };

  // 4. Determine Answerability
  let answerability: AnswerabilityStatus = 'INSUFFICIENT_EVIDENCE';
  let answerabilityReason = 'PTAT does not contain verified records matching this request.';

  if (records.length > 0 && claims.length > 0 && sources.length > 0) {
    answerability = 'ANSWERABLE';
    answerabilityReason = `Authoritative PTAT evidence retrieved: ${records.length} records, ${claims.length} claims, ${sources.length} citations.`;
  } else if (records.length > 0) {
    answerability = 'PARTIALLY_ANSWERABLE';
    answerabilityReason = `PTAT records located (${records.length}), but claim or source documentation is limited.`;
  }

  // 5. Handle Comparison Bundle if Applicable
  let comparison: PTATAIComparisonBundle | undefined;
  if (comparisonData && constraints.comparisonTargets) {
    const { firstResults, secondResults } = comparisonData;
    comparison = {
      comparisonType: constraints.comparisonTargets.type,
      firstSubject: {
        name: constraints.comparisonTargets.first,
        matchedRecords: firstResults.records,
        totalRecords: firstResults.records.length,
        financialSummary: {
          totalAmountNGN: firstResults.financials.reduce((acc, f) => acc + (f.currencyCode === 'NGN' ? Number(f.amountExact) : 0), 0).toString(),
          formattedTotal: `₦${firstResults.financials.reduce((acc, f) => acc + (f.currencyCode === 'NGN' ? Number(f.amountExact) : 0), 0).toLocaleString()}`,
        },
        beneficiarySummary: {
          totalBeneficiaries: firstResults.beneficiaries.reduce((acc, b) => acc + b.countValue, 0),
        },
      },
      secondSubject: {
        name: constraints.comparisonTargets.second,
        matchedRecords: secondResults.records,
        totalRecords: secondResults.records.length,
        financialSummary: {
          totalAmountNGN: secondResults.financials.reduce((acc, f) => acc + (f.currencyCode === 'NGN' ? Number(f.amountExact) : 0), 0).toString(),
          formattedTotal: `₦${secondResults.financials.reduce((acc, f) => acc + (f.currencyCode === 'NGN' ? Number(f.amountExact) : 0), 0).toLocaleString()}`,
        },
        beneficiarySummary: {
          totalBeneficiaries: secondResults.beneficiaries.reduce((acc, b) => acc + b.countValue, 0),
        },
      },
      comparisonDimensions: ['Total Public Records', 'Sectoral Spread', 'Financial Allocations', 'Beneficiary Impact', 'Completion / Delivery Status'],
    };
  }

  return {
    query,
    parsedIntent: intent,
    parsedConstraints: constraints,
    matchedEntities,
    records,
    claims,
    sources,
    financialRecords: financials,
    beneficiaryRecords: beneficiaries,
    timelineEvents: timelines,
    geographies,
    citationMap,
    recordLinks,
    retrievalConfidence,
    answerability,
    answerabilityReason,
    comparison,
    diagnostics: {
      retrievalLatencyMs: stats.latencyMs,
      recordsScanned: stats.recordsScanned,
      claimsScanned: stats.claimsScanned,
      sourcesScanned: stats.sourcesScanned,
      dataTimestamp: new Date().toISOString(),
    },
  };
}
