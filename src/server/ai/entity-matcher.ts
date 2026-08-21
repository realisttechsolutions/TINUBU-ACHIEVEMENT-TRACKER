import type { PTATAIRecord } from '../../types/ai.types';
import { buildGenericAcronymRegex } from './retrieval-engine';
import { STOP_WORDS } from './intent-classifier';

export interface EntityMatchResult {
  name: string;
  slug: string;
  recordType: string;
  confidence: number;
}

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
      // Significant token overlap or Generic Acronym Expansion
      if (cleanQueryTokens.length > 0) {
        let matchCount = 0;
        for (const t of cleanQueryTokens) {
          if (normTitle.includes(t) || normSlug.includes(t)) {
            matchCount++;
          } else {
            const acrPat = buildGenericAcronymRegex(t, 'js');
            if (acrPat) {
              const rx = new RegExp(acrPat, 'i');
              if (rx.test(record.title) || rx.test(record.slug) || rx.test(record.summary)) {
                matchCount++;
              }
            }
          }
        }
        score = (matchCount / cleanQueryTokens.length) * 0.85;
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
