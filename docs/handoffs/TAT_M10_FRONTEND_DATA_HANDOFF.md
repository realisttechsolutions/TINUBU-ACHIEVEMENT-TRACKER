# Mission 10 Frontend Data Layer Handoff Specification

## 1. Repository Abstraction

Frontend components and server pages access relational data via `src/data/repositories/`:
- `AchievementRepository.getCatalog(limit, offset)`: Fetches paginated published records from `public_record_catalog`.
- `AchievementRepository.getBySlug(slug)`: Fetches a single published record with detailed attributes.
- `AchievementRepository.getEvidenceForRecord(recordId)`: Fetches verified claims and linked sources from `public_claim_evidence`.
- `AchievementRepository.getFinancialsForRecord(recordId)`: Fetches disaggregated financial allocations from `public_financial_records`.
- `AchievementRepository.getBeneficiariesForRecord(recordId)`: Fetches stage-separated beneficiary counts from `public_beneficiary_records`.
- `EvidenceRepository.getSources(limit)`: Fetches verified public sources.
- `MetricsRepository.getIndicators()`: Fetches active indicator series and observations.

## 2. Server Boundary & Connection Lifecycle
- In Production (Firebase App Hosting): Utilizes connection pooling to Cloud SQL PostgreSQL via `DATABASE_URL`.
- In Local / CI: Automatically falls back to in-process PGlite with zero configuration required.
