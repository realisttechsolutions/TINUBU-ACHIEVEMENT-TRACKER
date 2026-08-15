SELECT
  r.*,
  COALESCE((
    SELECT jsonb_agg(jsonb_build_object('code', s.code, 'label', s.label, 'role', rs.role_code) ORDER BY rs.role_code, s.code)
    FROM record_sectors rs JOIN sectors s ON s.id = rs.sector_id WHERE rs.record_id = r.id
  ), '[]'::jsonb) AS sectors,
  COALESCE((
    SELECT jsonb_agg(jsonb_build_object('name', i.canonical_name, 'shortName', i.short_name, 'role', ri.role_code) ORDER BY ri.role_code, i.canonical_name)
    FROM record_institutions ri JOIN institutions i ON i.id = ri.institution_id WHERE ri.record_id = r.id
  ), '[]'::jsonb) AS institutions,
  COALESCE((
    SELECT jsonb_agg(jsonb_build_object('code', g.code, 'name', g.name, 'type', g.geography_type, 'role', rg.coverage_role) ORDER BY g.name)
    FROM record_geographies rg JOIN geographic_units g ON g.id = rg.geographic_unit_id
    WHERE rg.record_id = r.id AND rg.sensitivity_class = 'public'
  ), '[]'::jsonb) AS geographies
FROM public_record_catalog r
WHERE r.slug = $1;
