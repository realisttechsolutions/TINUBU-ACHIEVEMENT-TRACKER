import type { PTATAIContext, PTATSourceMode } from '../../types/ai.types';

export interface RoutingDecision {
  mode: PTATSourceMode;
  reason: string;
  isPoliticalOrPerformance: boolean;
  requiresFreshness: boolean;
}

const CURRENT_FRESHNESS_TERMS = [
  'latest',
  'currently',
  'today',
  'recent',
  'recently',
  'this month',
  'as of now',
  'this week',
  'right now',
  'current status',
  'update',
  'breaking',
];

const POLITICAL_PERFORMANCE_TERMS = [
  'tinubu',
  'president',
  'presidency',
  'federal government',
  'nigeria',
  'minister',
  'ministry',
  'nelfund',
  'credicorp',
  '3mtt',
  'acresal',
  'dicon',
  'ncgc',
  'budget',
  'disbursement',
  'subsidy',
  'election',
  'vote',
  'governor',
  'senate',
  'apc',
  'pdp',
  'lp',
];

export function determineIntelligenceRoute(
  query: string,
  ptatContext: PTATAIContext
): RoutingDecision {
  const normalized = (query || '').toLowerCase().trim();

  // Check if query mentions current/freshness terms
  const requiresFreshness = CURRENT_FRESHNESS_TERMS.some((term) =>
    normalized.includes(term)
  );

  // Check if query is about politics, public policy, government performance, or elections
  const isPoliticalOrPerformance = POLITICAL_PERFORMANCE_TERMS.some((term) =>
    normalized.includes(term)
  );

  const hasPtatEvidence =
    ptatContext.records.length > 0 &&
    ptatContext.claims.length > 0 &&
    ptatContext.retrievalConfidence.confidenceTier !== 'NONE';

  // Case 1: Strong PTAT evidence available
  if (hasPtatEvidence) {
    if (requiresFreshness && normalized.includes('2026') && !normalized.includes('august')) {
      return {
        mode: 'PTAT_PLUS_WEB',
        reason: 'PTAT contains foundational records but user explicitly requested latest current updates.',
        isPoliticalOrPerformance,
        requiresFreshness,
      };
    }
    return {
      mode: 'PTAT_ONLY',
      reason: 'Authoritative PTAT public records contain sufficient evidence to answer the query.',
      isPoliticalOrPerformance,
      requiresFreshness,
    };
  }

  // Case 2: No PTAT coverage, but query is political, current, or factual requiring live grounding
  if (isPoliticalOrPerformance || requiresFreshness) {
    return {
      mode: 'WEB_GROUNDED',
      reason: 'No PTAT catalog coverage for this specific query, but factual/current sourcing is required.',
      isPoliticalOrPerformance,
      requiresFreshness,
    };
  }

  // Case 3: Factual / external queries (e.g. current world leaders, tech specs, sports, geography)
  const isGeneralFact =
    normalized.includes('who is') ||
    normalized.includes('president of') ||
    normalized.includes('specifications') ||
    normalized.includes('specs') ||
    normalized.includes('iphone') ||
    normalized.includes('capital of') ||
    normalized.includes('population of') ||
    normalized.includes('happened in');

  if (isGeneralFact) {
    return {
      mode: 'WEB_GROUNDED',
      reason: 'Factual query benefiting from current web grounding verification.',
      isPoliticalOrPerformance,
      requiresFreshness,
    };
  }

  // Case 4: Low-risk general knowledge / conversational (e.g. Mars temperature, physics, math, greeting)
  return {
    mode: 'GENERAL',
    reason: 'Stable general knowledge or low-risk conversational query.',
    isPoliticalOrPerformance: false,
    requiresFreshness: false,
  };
}
