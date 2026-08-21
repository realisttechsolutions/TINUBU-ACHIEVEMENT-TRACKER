import type { PTATAIRecord } from '../../types/ai.types';

export interface EntityMatchResult {
  name: string;
  slug: string;
  recordType: string;
  confidence: number;
}

const STOP_WORDS = new Set([
  'what', 'has', 'have', 'had', 'been', 'done', 'doing', 'in', 'tell', 'me', 'about',
  'something', 'does', 'not', 'contain', 'show', 'which', 'records', 'how', 'much',
  'who', 'where', 'when', 'the', 'a', 'an', 'of', 'for', 'to', 'and', 'or', 'is',
  'are', 'was', 'were', 'with', 'tinubu', 'president', 'presidency', 'administration'
]);

/**
 * Generic string normalization for entity matching.
 */
export function normalizeEntityText(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Dynamic Entity Disambiguation:
 * Extracts and scores entity matches from database-provided record candidates
 * without relying on a static TypeScript registry.
 */
export function matchEntitiesFromRecords(query: string, records: PTATAIRecord[]): EntityMatchResult[] {
  const normQuery = normalizeEntityText(query);
  if (!normQuery || records.length === 0) return [];

  const cleanQueryTokens = normQuery.split(' ').filter((t) => t.length > 2 && !STOP_WORDS.has(t));
  const cleanQueryPhrase = cleanQueryTokens.join(' ');

  const results: EntityMatchResult[] = [];

  for (const record of records) {
    const normTitle = normalizeEntityText(record.title);
    const normSummary = normalizeEntityText(record.summary);
    const normSlug = normalizeEntityText(record.slug);

    let score = 0;

    // Exact title match or title contains clean query phrase
    if (normTitle === normQuery || (cleanQueryPhrase && normTitle.includes(cleanQueryPhrase))) {
      score = 0.95;
    } else if (normSlug.includes(cleanQueryPhrase.replace(/\s+/g, '-'))) {
      score = 0.9;
    } else if (normSummary.includes(cleanQueryPhrase)) {
      score = 0.75;
    } else {
      // Significant token overlap
      if (cleanQueryTokens.length > 0) {
        const matches = cleanQueryTokens.filter((t) => normTitle.includes(t) || normSlug.includes(t));
        score = (matches.length / cleanQueryTokens.length) * 0.8;
      }
    }

    if (score >= 0.3) {
      results.push({
        name: record.title,
        slug: record.slug,
        recordType: record.recordType,
        confidence: Number(score.toFixed(2)),
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

/**
 * High-Risk Guardrails (Safety Check / Regression Verification Only):
 * NON-AUTHORITATIVE GUARDRAIL to ensure semantic separation invariants hold.
 */
export function validateSemanticSeparation(firstTerm: string, secondTerm: string): {
  distinct: boolean;
  reason: string;
} {
  const norm1 = normalizeEntityText(firstTerm);
  const norm2 = normalizeEntityText(secondTerm);

  if (norm1.includes('credicorp') && norm2.includes('cng')) {
    return {
      distinct: true,
      reason: 'CREDICORP (Consumer Credit) and Pi-CNG (Compressed Natural Gas) are distinct initiatives.',
    };
  }

  if (norm1.includes('ncgc') && norm2.includes('credicorp')) {
    return {
      distinct: true,
      reason: 'NCGC (Wholesale Credit Guarantee by NSIA) and CREDICORP (Retail Consumer Credit) are distinct entities.',
    };
  }

  if (norm1.includes('dicon') && norm2.includes('expenditure')) {
    return {
      distinct: true,
      reason: 'DICON $2bn refers to a private investment joint venture commitment agreement, not realized Treasury expenditure.',
    };
  }

  if (norm1.includes('3mtt') && (norm2.includes('employed') || norm2.includes('jobs created'))) {
    return {
      distinct: true,
      reason: '3MTT 160,000+ metric refers strictly to trained participants in cohorts, not placed or employed personnel.',
    };
  }

  return {
    distinct: norm1 !== norm2,
    reason: norm1 !== norm2 ? 'Distinct entity terms.' : 'Identical terms.',
  };
}
