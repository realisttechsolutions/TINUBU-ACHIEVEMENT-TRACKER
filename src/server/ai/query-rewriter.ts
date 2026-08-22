import { PTATVertexClient } from './vertex-client';

export interface RewriteResult {
  rewrittenQuery: string;
  expandedKeywords: string[];
  inferredSector?: string;
  inferredYear?: number;
}

/**
 * Fast local semantic normalization rules for high-frequency user colloquialisms.
 */
const COMMON_PARAPHRASES: Record<string, { terms: string[]; sector?: string }> = {
  empowerment: {
    terms: ['youth employment', 'skills training', '3MTT', 'credit access', 'student loans', 'NELFUND', 'CREDICORP', 'MSME grants'],
    sector: 'Youth, Employment and Skills',
  },
  empower: {
    terms: ['youth skills', 'training', '3MTT', 'employment support', 'credit', 'NELFUND'],
    sector: 'Youth, Employment and Skills',
  },
  'job creation': {
    terms: ['employment', '3MTT fellows', 'vocational training', 'credit support'],
    sector: 'Youth, Employment and Skills',
  },
  jobs: {
    terms: ['employment', '3MTT training', 'youth initiatives'],
    sector: 'Youth, Employment and Skills',
  },
  'small business': {
    terms: ['MSME', 'enterprise', 'credit guarantee', 'NCGC', 'BOI'],
    sector: 'Economy and Fiscal Reforms',
  },
  'student loan': {
    terms: ['NELFUND', 'higher education act 2024', 'tuition fees', 'stipends'],
    sector: 'Education and Human Capital',
  },
};

/**
 * Perform generic semantic query rewrite/normalization for low-confidence queries.
 * Bounded: At most 1 attempt, no recursive loops.
 */
export async function rewriteLowConfidenceQuery(
  rawQuery: string,
  vertexClient?: PTATVertexClient
): Promise<RewriteResult> {
  const normalized = (rawQuery || '').toLowerCase().trim();

  // 1. Fast heuristic expansion
  const expandedKeywords: string[] = [];
  let inferredSector: string | undefined = undefined;

  for (const [key, meta] of Object.entries(COMMON_PARAPHRASES)) {
    if (normalized.includes(key)) {
      expandedKeywords.push(...meta.terms);
      if (!inferredSector && meta.sector) {
        inferredSector = meta.sector;
      }
    }
  }

  // Extract year if present
  const yearMatch = normalized.match(/\b(2023|2024|2025|2026)\b/);
  const inferredYear = yearMatch ? parseInt(yearMatch[0], 10) : undefined;

  if (expandedKeywords.length > 0) {
    const combinedQuery = `${rawQuery} ${expandedKeywords.slice(0, 4).join(' ')}`;
    return {
      rewrittenQuery: combinedQuery,
      expandedKeywords,
      inferredSector,
      inferredYear,
    };
  }

  // 2. If no heuristic rule matched and Vertex client is available, perform a lightweight semantic rewrite
  if (vertexClient) {
    try {
      const prompt = `You are a search query normalizer for the President Tinubu Achievement Tracker (PTAT).
The user asked: "${rawQuery}"

This query did not match exact database keywords. Provide 3 to 5 clear, objective, official search keywords or synonymous terms for Nigerian public policy and government achievements related to this query.
Output ONLY a comma-separated list of terms. Do not explain.`;

      const res = await vertexClient.generateSimpleText(prompt, { maxOutputTokens: 60, temperature: 0.1 });
      const terms = res.rawText
        .split(',')
        .map((t) => t.trim().replace(/^["'`]|["'`]$/g, ''))
        .filter((t) => t.length > 1 && t.length < 50);

      if (terms.length > 0) {
        return {
          rewrittenQuery: `${rawQuery} ${terms.slice(0, 3).join(' ')}`,
          expandedKeywords: terms,
          inferredSector,
          inferredYear,
        };
      }
    } catch {
      // Fall back safely to raw query
    }
  }

  return {
    rewrittenQuery: rawQuery,
    expandedKeywords: [],
    inferredSector,
    inferredYear,
  };
}
