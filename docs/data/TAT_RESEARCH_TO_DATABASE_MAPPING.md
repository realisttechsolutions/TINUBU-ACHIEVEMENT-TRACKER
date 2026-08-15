# Research CSV to PostgreSQL Relational Mapping Specification

## 1. Entity & Field Mapping Rules

| M02 Research CSV | Relational Target Table | Mapping Logic | Deterministic Key |
| :--- | :--- | :--- | :--- |
| `achievement_record.csv` | `records` + `achievement_profiles` | `record_type = 'achievement'`, slug generation, status normalization | `externalIdToUuid(achievement_id, 0x10)` |
| `source_record.csv` | `sources` | SHA-256 validation, domain extraction, url formatting | `externalIdToUuid(source_id, 0x20)` |
| `evidence_claim_record.csv` | `evidence_claims` | Type alignment, numeric value parsing | `externalIdToUuid(claim_id, 0x30)` |
| `claim_source_link.csv` | `claim_source_relationships` | Relationship typing, evidence location extraction | `externalIdToUuid(claim_id + source_id, 0x35)` |
| `financial_record.csv` | `financial_records` | Currency validation (NGN/USD), stage normalization | `externalIdToUuid(financial_id, 0x40)` |
| `beneficiary_record.csv` | `beneficiary_records` | Stage differentiation (`registered`, `trained`, etc.) | `externalIdToUuid(beneficiary_id, 0x50)` |
| `indicator_record.csv` | `indicators` | Frequency mapping, causal prohibition guard | `externalIdToUuid(indicator_id, 0x60)` |
| `indicator_observation.csv` | `indicator_observations` | Period boundaries (`period_start`, `period_end`) | `externalIdToUuid(observation_id, 0x65)` |
| `timeline_event.csv` | `timeline_events` | Date precision check (`exact_day`, `quarter`, etc.) | `externalIdToUuid(event_id, 0x70)` |
| `contradiction_record.csv` | `corrections` | Contradiction classification & status tracking | `externalIdToUuid(contradiction_id, 0x80)` |
| `correction_record.csv` | `corrections` | Revision history & audit notes | `externalIdToUuid(correction_id, 0x85)` |
