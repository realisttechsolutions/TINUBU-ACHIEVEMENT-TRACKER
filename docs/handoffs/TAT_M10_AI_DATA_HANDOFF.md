# Mission 10 AI Integration & Data Layer Handoff Specification

## 1. AI Integration Protocol

Per project architectural invariants, AI features (e.g. natural language search, automated summarization, chat assistants) are decoupled from the canonical research database and must interface strictly through validated read-only views:
1. **Source of Truth**: AI models must never directly query raw database tables or generate synthetic claims.
2. **Access Boundary**: AI retrieval must consume structured outputs from `public_record_catalog` and `public_claim_evidence`.
3. **Attribution Requirement**: Any AI-generated summary or response must include explicit source references (`source_title`, `publisher_name`, `original_url`) mapped from `public_claim_evidence`.
