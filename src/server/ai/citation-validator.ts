import type {
  PTATEvidencePacket,
  PTATModelCitation,
  CitationValidationResult,
} from '../../types/ai.types';

/**
 * Validates model citations against the supplied PTATEvidencePacket allowlist.
 * Ensures zero phantom citations or hallucinated sources reach the client.
 */
export function validateModelCitations(
  rawCitations: any[],
  evidencePacket: PTATEvidencePacket
): CitationValidationResult {
  const validatedCitations: PTATModelCitation[] = [];
  const rejectionReasons: string[] = [];
  let validCount = 0;
  let rejectedCount = 0;

  // Build lookup index from evidence packet
  const claimMap = new Map<string, (typeof evidencePacket.claims)[0]>();
  const allSourcesMap = new Map<string, (typeof evidencePacket.claims)[0]['sources'][0]>();
  const recordSlugSet = new Set<string>();

  for (const rec of evidencePacket.records) {
    recordSlugSet.add(rec.slug);
  }

  for (const claim of evidencePacket.claims) {
    claimMap.set(claim.claimId, claim);
    for (const src of claim.sources) {
      allSourcesMap.set(src.sourceId, src);
    }
  }

  if (!Array.isArray(rawCitations)) {
    return {
      valid: false,
      totalCitations: 0,
      validCitations: 0,
      rejectedCitations: 0,
      rejectionReasons: ['Model returned non-array citations field'],
      validatedCitations: [],
    };
  }

  for (const cit of rawCitations) {
    if (!cit || typeof cit !== 'object') {
      continue;
    }

    let claimId = String(cit.claimId || '').trim();
    let sourceId = String(cit.sourceId || '').trim();
    const recordSlug = String(cit.recordSlug || '').trim();

    // If completely empty object, ignore
    if (!claimId && !sourceId && !recordSlug) {
      continue;
    }

    // 1. Resolve Claim ID
    let matchedClaim = claimMap.get(claimId);

    // If claimId was missing but sourceId exists, find owner claim
    if (!matchedClaim && sourceId) {
      for (const c of evidencePacket.claims) {
        if (c.sources.some((s) => s.sourceId === sourceId)) {
          matchedClaim = c;
          claimId = c.claimId;
          break;
        }
      }
    }

    if (!matchedClaim) {
      rejectedCount++;
      rejectionReasons.push(`Unknown claimId: "${claimId}" not present in evidence packet`);
      continue;
    }

    // 2. Resolve Source ID
    let resolvedSource = matchedClaim.sources.find((s) => s.sourceId === sourceId);
    if (!resolvedSource && sourceId) {
      resolvedSource = allSourcesMap.get(sourceId);
    }
    // If sourceId missing or not matched, default to the claim's primary source
    if (!resolvedSource && matchedClaim.sources.length > 0) {
      resolvedSource = matchedClaim.sources[0];
      sourceId = resolvedSource.sourceId;
    }

    if (!resolvedSource) {
      rejectedCount++;
      rejectionReasons.push(
        `No valid source found for claim "${claimId}" in evidence`
      );
      continue;
    }

    // 3. Resolve recordSlug
    const validSlug =
      recordSlug && recordSlugSet.has(recordSlug)
        ? recordSlug
        : matchedClaim.recordSlug;

    validCount++;
    validatedCitations.push({
      claimId,
      sourceId: resolvedSource.sourceId,
      recordSlug: validSlug,
      sourceTitle: resolvedSource.title,
      publisher: resolvedSource.publisher,
      url: resolvedSource.url,
      sourceLevel: resolvedSource.sourceLevel,
      quoteOrSummary: cit.quoteOrSummary ? String(cit.quoteOrSummary) : undefined,
      isValidated: true,
    });
  }

  const valid = rejectedCount === 0 && (validCount > 0 || evidencePacket.claims.length === 0);

  return {
    valid,
    totalCitations: rawCitations.length,
    validCitations: validCount,
    rejectedCitations: rejectedCount,
    rejectionReasons,
    validatedCitations,
  };
}
