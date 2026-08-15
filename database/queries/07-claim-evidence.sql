SELECT
  e.claim_id, e.claim_type, e.claim_text, e.value_numeric, e.value_text, e.unit_code,
  e.reporting_period_label, e.data_value_nature, e.source_origin, e.verification_status,
  e.limitations, e.relationship_type, e.source_role, e.evidence_location, e.evidence_summary,
  e.source_id, e.source_title, e.publisher_name, e.source_type, e.source_level,
  e.original_url, e.archival_url, e.publication_date, e.publication_date_precision
FROM public_claim_evidence e
JOIN public_record_catalog r ON r.id = e.record_id
WHERE r.slug = $1
ORDER BY e.claim_id, e.relationship_type, e.source_id;
