SELECT
  i.id, i.slug, i.name, i.definition, i.unit, i.frequency, i.methodology,
  o.value_numeric, o.value_display, o.reporting_period_label, o.period_start, o.period_end,
  o.data_value_nature, o.source_origin, o.verification_status, o.provisional,
  g.code AS geography_code
FROM indicators i
JOIN indicator_observations o ON o.indicator_id = i.id
JOIN public_claim_evidence e ON e.claim_id = o.claim_id
LEFT JOIN geographic_units g ON g.id = o.geographic_unit_id AND g.sensitivity_class = 'public'
WHERE i.active = true
GROUP BY i.id, i.slug, i.name, i.definition, i.unit, i.frequency, i.methodology,
         o.value_numeric, o.value_display, o.reporting_period_label, o.period_start, o.period_end,
         o.data_value_nature, o.source_origin, o.verification_status, o.provisional, g.code
ORDER BY i.name, o.period_start;
