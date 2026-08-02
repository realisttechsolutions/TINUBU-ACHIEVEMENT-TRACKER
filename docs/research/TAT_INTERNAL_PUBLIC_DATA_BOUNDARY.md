# Internal vs Public Data Boundaries — Tinubu Achievement Tracker V2

This document defines visibility boundaries and RLS policies.

---

## 1. Field Separation
- **Public API Fields**: `id`, `slug`, `title`, `summary`, `full_description`, `status`, `classification`, `verification_date`, `sources`.
- **Internal Audit Fields**: `internal_notes`, `researcher_id`, `evidence_raw_url`, `rejection_reason`, `qualification_notes`.

---

## 2. Row Level Security (RLS) Rules
- Public read access is permitted ONLY where `publication_status IN ('publishable', 'publishable_with_qualification')`.
- Authenticated write access requires `role IN ('researcher', 'editor', 'admin')`.
