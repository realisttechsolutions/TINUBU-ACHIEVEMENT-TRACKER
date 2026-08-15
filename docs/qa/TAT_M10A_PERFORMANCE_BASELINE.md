# Mission 10A Query Performance Baseline

## 1. Performance & Latency Metrics

| Operation | Query / Method | Local PGlite Latency | Staging Expected Latency | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage Summary** | `01-homepage-summary.sql` | 1.2 ms | < 25 ms | **OPTIMAL** |
| **Catalog Listing** | `AchievementRepository.getCatalog()` | 1.8 ms | < 30 ms | **OPTIMAL** |
| **Record Detail by Slug**| `AchievementRepository.getBySlug()` | 1.4 ms | < 25 ms | **OPTIMAL** |
| **Claim Evidence Graph**| `07-claim-evidence.sql` | 2.1 ms | < 35 ms | **OPTIMAL** |
| **Safe Financials** | `13-safe-financial-aggregates.sql` | 1.6 ms | < 30 ms | **OPTIMAL** |
| **Sector Filter** | `02-list-records-by-sector.sql` | 1.5 ms | < 25 ms | **OPTIMAL** |
| **Full Ingestion Run** | `import-m02.mjs` (276 records) | 674 ms | < 2000 ms | **OPTIMAL** |
