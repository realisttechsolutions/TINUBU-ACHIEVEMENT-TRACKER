import type { PTATAIContext, PTATSourceMode } from '../../types/ai.types';

export interface RoutingDecision {
  mode: PTATSourceMode;
  reason: string;
  isPoliticalOrPerformance: boolean;
  requiresFreshness: boolean;
}

const CURRENT_FRESHNESS_TERMS = [
  'latest',
  'current',
  'currently',
  'today',
  'recent',
  'recently',
  'this week',
  'this month',
  'as of now',
  'new update',
  'most recent',
  'latest available update',
  'latest on',
  'what is the latest',
  'what happened',
  'breaking',
  'news today',
];

const POLITICAL_PERFORMANCE_TERMS = [
  'tinubu',
  'president',
  'presidency',
  'federal government',
  'federal',
  'nigeria',
  'nigerian',
  'minister',
  'ministry',
  'nelfund',
  'credicorp',
  '3mtt',
  'acresal',
  'dicon',
  'ncgc',
  'ubec',
  'tetfund',
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
  'education',
  'schools',
  'universities',
  'students',
  'health',
  'healthcare',
  'agriculture',
  'farming',
  'roads',
  'power',
  'electricity',
  'housing',
  'empowerment',
  'skills',
  'youth',
  'economy',
  'reform',
  'policy',
  'project',
  'programme',
  'achievement',
];

export function determineIntelligenceRoute(
  query: string,
  ptatContext: PTATAIContext
): RoutingDecision {
  const normalized = (query || '').toLowerCase().trim();

  // 1. Detect generic freshness / temporal intent
  const requiresFreshness = CURRENT_FRESHNESS_TERMS.some((term) =>
    normalized.includes(term)
  );

  // 2. Detect public policy / government / political topics
  const isPoliticalOrPerformance = POLITICAL_PERFORMANCE_TERMS.some((term) =>
    normalized.includes(term)
  );

  const hasPtatEvidence =
    ptatContext.records.length > 0 &&
    ptatContext.claims.length > 0 &&
    ptatContext.retrievalConfidence.confidenceTier !== 'NONE';

  // Special Case: Open-ended temporal / breaking news requests (e.g. "what happened in Nigeria today", "breaking news")
  // Even if broad keyword search matched historical records, an open-ended "today / what happened" question requires live web search.
  const isOpenEndedLiveNews =
    normalized.includes('what happened') ||
    normalized.includes('today') ||
    normalized.includes('breaking');

  if (isOpenEndedLiveNews && (!hasPtatEvidence || ptatContext.records.length > 5 || normalized.includes('nigeria today'))) {
    return {
      mode: 'WEB_GROUNDED',
      reason: 'Open-ended current news or temporal event inquiry requiring live web grounding.',
      isPoliticalOrPerformance,
      requiresFreshness: true,
    };
  }

  // Case 1: PTAT evidence available in database
  if (hasPtatEvidence) {
    // If the user explicitly asks for the latest/current updates, route to PTAT_PLUS_WEB
    // so PTAT provides authoritative baseline evidence and Google Search supplements real-time updates.
    if (requiresFreshness) {
      return {
        mode: 'PTAT_PLUS_WEB',
        reason: 'PTAT contains foundational records, supplemented with live web grounding for requested current updates.',
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
    normalized.includes('population of');

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
