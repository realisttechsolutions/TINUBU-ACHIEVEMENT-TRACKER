SELECT t.id, t.event_type, t.title, t.description, t.date_value, t.date_precision,
       t.period_start, t.period_end, t.reporting_period_label, t.provisional
FROM timeline_events t
JOIN public_record_catalog r ON r.id = t.record_id
WHERE r.slug = $1 AND t.is_public = true
ORDER BY COALESCE(t.date_value, t.period_start) ASC, t.id;
