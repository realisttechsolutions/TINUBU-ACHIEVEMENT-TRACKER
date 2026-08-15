SELECT DISTINCT r.id, r.slug, r.record_type, r.title, r.summary, r.implementation_status, r.published_at
FROM public_record_catalog r
WHERE
  to_tsvector('simple', r.title || ' ' || r.summary) @@ plainto_tsquery('simple', $1)
  OR EXISTS (
    SELECT 1
    FROM record_institutions ri
    JOIN institutions i ON i.id = ri.institution_id
    WHERE ri.record_id = r.id AND lower(i.canonical_name) LIKE '%' || lower($1) || '%'
  )
  OR EXISTS (
    SELECT 1
    FROM record_sectors rs
    JOIN sectors s ON s.id = rs.sector_id
    WHERE rs.record_id = r.id AND lower(s.label) LIKE '%' || lower($1) || '%'
  )
ORDER BY r.published_at DESC, r.id
LIMIT $2 OFFSET $3;
