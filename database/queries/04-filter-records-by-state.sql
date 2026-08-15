SELECT DISTINCT
  r.id, r.slug, r.record_type, r.title, r.summary, g.code AS geography_code, g.name AS geography_name
FROM public_record_catalog r
JOIN record_geographies rg ON rg.record_id = r.id
JOIN geographic_units g ON g.id = rg.geographic_unit_id
WHERE g.code = $1 AND rg.sensitivity_class = 'public'
ORDER BY r.title, r.id
LIMIT $2 OFFSET $3;
