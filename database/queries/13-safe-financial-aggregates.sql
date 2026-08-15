-- Financial values are deliberately grouped by every compatibility dimension.
-- No all-purpose total is exposed.
SELECT
  financial_type,
  currency_code,
  aggregation_basis,
  nominal_or_real,
  reporting_period_label,
  period_start,
  period_end,
  sum(amount_exact::numeric)::text AS amount_exact
FROM public_financial_records
GROUP BY financial_type, currency_code, aggregation_basis, nominal_or_real,
         reporting_period_label, period_start, period_end
ORDER BY financial_type, currency_code, period_start;
