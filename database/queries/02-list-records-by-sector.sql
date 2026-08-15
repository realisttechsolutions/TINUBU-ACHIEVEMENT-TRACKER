SELECT DISTINCT
  r.id, r.slug, r.record_type, r.title, r.summary, r.implementation_status,
  s.code AS sector_code, parent.code AS public_group_code, r.published_at
FROM public_record_catalog r
JOIN record_sectors rs ON rs.record_id = r.id
JOIN sectors s ON s.id = rs.sector_id
JOIN sectors parent ON parent.id = s.parent_sector_id
WHERE s.code = $1 AND rs.role_code = 'primary'
ORDER BY r.published_at DESC, r.id
LIMIT $2 OFFSET $3;
