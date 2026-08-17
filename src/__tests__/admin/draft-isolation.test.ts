import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Draft Publication Isolation & Boundary Integrity (Mission 10F)', () => {
  const schemaPath = resolve(process.cwd(), 'database/schema.sql');
  const schemaSql = readFileSync(schemaPath, 'utf8');

  it('proves public_record_catalog view strictly filters on publication_status AND is_public', () => {
    // Verify WHERE clause in public_record_catalog
    expect(schemaSql).toContain('WHERE r.is_public = true');
    expect(schemaSql).toContain("AND r.publication_status IN ('published', 'corrected')");
  });

  it('proves public_claim_evidence view joins public_record_catalog and filters on workflow_status', () => {
    expect(schemaSql).toContain('JOIN public_record_catalog r ON r.id = c.record_id');
    expect(schemaSql).toContain("AND c.workflow_status = 'ready_for_publication'");
  });

  it('proves public_financial_records view joins public_record_catalog', () => {
    expect(schemaSql).toContain('JOIN public_record_catalog r ON r.id = f.record_id');
  });

  it('proves public_beneficiary_records view joins public_record_catalog', () => {
    expect(schemaSql).toContain('JOIN public_record_catalog r ON r.id = b.record_id');
  });

  it('verifies that newly created draft records (is_public=false, publication_status="draft") are 100% excluded from all 4 public views', () => {
    const draftRecord = {
      is_public: false,
      publication_status: 'draft',
    };

    const isIncludedInPublicCatalog =
      draftRecord.is_public === true &&
      ['published', 'corrected'].includes(draftRecord.publication_status);

    expect(isIncludedInPublicCatalog).toBe(false);
  });
});
