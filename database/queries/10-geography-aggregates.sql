SELECT
  g.code AS geography_code,
  g.name AS geography_name,
  g.geography_type,
  count(DISTINCT r.id)::int AS record_count
FROM public_record_catalog r
JOIN record_geographies rg ON rg.record_id = r.id AND rg.sensitivity_class = 'public'
JOIN geographic_units g ON g.id = rg.geographic_unit_id AND g.sensitivity_class = 'public'
GROUP BY g.code, g.name, g.geography_type
ORDER BY g.name;
