SELECT
  parent.code AS public_group_code,
  s.code AS sector_code,
  count(DISTINCT r.id)::int AS record_count,
  count(DISTINCT r.id) FILTER (WHERE r.verification_status = 'independently_corroborated')::int AS independently_corroborated_count
FROM public_record_catalog r
JOIN record_sectors rs ON rs.record_id = r.id AND rs.role_code = 'primary'
JOIN sectors s ON s.id = rs.sector_id
JOIN sectors parent ON parent.id = s.parent_sector_id
GROUP BY parent.code, s.code
ORDER BY parent.code, s.code;
