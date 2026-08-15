# Supabase Data Contract V1 — Tinubu Achievement Tracker V2

> [!WARNING]
> **STATUS: DEPRECATED — SUPERSEDED BY RESEARCH CONTRACT V1.1**  
> This placeholder document has been formally superseded by [`TAT_RESEARCH_CONTRACT_V1_1_2.md`](./TAT_RESEARCH_CONTRACT_V1_1_2.md); current implementation proposals belong under `docs/engineering/`.

This document outlines historical proposed database naming standards.

---

## 1. Primary Naming & Type Rules
- All database column names MUST use `snake_case`.
- Primary keys MUST use `UUID` (or lowercase alphanumeric text slugs).
- Date fields MUST use ISO-8601 strings (`YYYY-MM-DD` or `YYYY-MM`).
- Multi-value text arrays MUST use Postgres `TEXT[]`.
