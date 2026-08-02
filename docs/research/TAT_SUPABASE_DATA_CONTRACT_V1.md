# Supabase Data Contract V1 — Tinubu Achievement Tracker V2

This document outlines the proposed database standards for Supabase integration.

---

## 1. Primary Naming & Type Rules
- All database column names MUST use `snake_case`.
- Primary keys MUST use `UUID` (or lowercase alphanumeric text slugs).
- Date fields MUST use ISO-8601 strings (`YYYY-MM-DD` or `YYYY-MM`).
- Multi-value text arrays MUST use Postgres `TEXT[]`.
