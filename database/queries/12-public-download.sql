SELECT
  r.slug,
  r.record_type,
  r.title,
  r.summary,
  r.implementation_status,
  r.verification_status,
  r.evidence_profile,
  r.qualification,
  s.code AS primary_sector,
  parent.code AS public_group,
  r.published_at
FROM public_record_catalog r
JOIN record_sectors rs ON rs.record_id = r.id AND rs.role_code = 'primary'
JOIN sectors s ON s.id = rs.sector_id
JOIN sectors parent ON parent.id = s.parent_sector_id
WHERE ($1::text IS NULL OR s.code = $1)
  AND ($2::text IS NULL OR r.implementation_status = $2)
ORDER BY r.published_at DESC, r.slug
LIMIT $3 OFFSET $4;
