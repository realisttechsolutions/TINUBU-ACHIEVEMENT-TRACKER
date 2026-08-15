# Research Ingestion Snapshot: Mission 02 (Pilot Dataset)

## Provenance & Metadata
- **Snapshot ID:** `m02`
- **Research Mission:** `TAT-RM-02` (Pilot Achievement Research)
- **Source Research Branch:** `research/mission-02-pilot-achievements`
- **Source Git Commit:** `3284182` (Head of Mission 02; research artifacts finalized in `da9b468`)
- **Research Contract Version:** `1.1.2` (`docs/research/TAT_RESEARCH_CONTRACT_V1_1_2.md`)
- **Canonical Vocabulary Version:** `1.1.2` (`canonical-vocabulary.v1.1.2.json`)
- **Snapshot Created At:** 2026-08-15
- **Aggregate Manifest Hash:** `c08a62fae06885c30fb527c4fd975f3a9de832b3aa864c1849ce505c23d8f3f6`
- **Total Dataset Files:** 19 CSV files
- **Total Ingestion Rows:** 276 rows

## Immutability Protocol
1. **Zero Manual Modification:** Files within this snapshot directory (`data/research-snapshots/m02/`) are strictly immutable and must NEVER be manually edited or patched.
2. **Hash Verification Gate:** Any change to any file in `csv/` will alter its SHA-256 hash and immediately cause the ingestion pipeline's `verify-snapshot` step to reject the import.
3. **Future Ingestion Snapshots:** Subsequent research waves (e.g. National Expansion, Q4 2026 reviews) must be added as distinct versioned directories (`m03/`, `m04/`, `national-2026-10/`) rather than modifying prior snapshots.

## Dataset Inventory Summary
- `achievement_record.csv` (30 production achievements)
- `source_capture.csv` (35 Level 1-5 primary sources)
- `claim_extraction.csv` (33 atomic claims)
- `claim_source_relationship.csv` (36 verified evidence relationships)
- `financial_record.csv` (8 non-aggregated financial entries)
- `beneficiary_record.csv` (8 stage-explicit beneficiary entries)
- `indicator_observation.csv` (4 macroeconomic observations)
- `indicator_record.csv` (3 indicator definitions)
- `policy_record.csv` (10 policy records)
- `programme_record.csv` (8 programme records)
- `project_record.csv` (8 project records)
- `timeline_event.csv` (15 timeline events)
- `contradiction_log.csv` (2 contradiction cases)
- `correction_record.csv` (2 correction records)
- `data_gap.csv` (5 identified research data gaps)
- `freshness_review.csv` (30 freshness review schedules)
- `publication_review.csv` (30 publication review states: 28 publication_ready, 2 publication_ready_with_qualification)
- `duplicate_review.csv` (3 duplicate analysis records)
- `entity_discovery.csv` (6 entity discovery candidate records)