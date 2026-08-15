SELECT id, slug, record_type, title, summary, implementation_status, verification_status, published_at
FROM public_record_catalog
WHERE implementation_status = $1
ORDER BY published_at DESC, id
LIMIT $2 OFFSET $3;
