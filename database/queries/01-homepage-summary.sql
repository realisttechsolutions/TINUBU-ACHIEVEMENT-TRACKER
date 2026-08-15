SELECT
  count(*)::int AS published_records,
  count(*) FILTER (WHERE implementation_status IN ('completed', 'operational', 'outcome_reported', 'independently_assessed'))::int AS delivered_or_operational,
  count(*) FILTER (WHERE verification_status = 'independently_corroborated')::int AS independently_corroborated,
  max(published_at) AS latest_published_at
FROM public_record_catalog;
