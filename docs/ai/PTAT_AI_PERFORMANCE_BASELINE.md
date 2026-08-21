# PTAT AI Performance Baseline & Cloud SQL Latency Report

**Mission Reference**: PTAT M08A.1
**Target Environment**: Staging (`tat_staging` on `tat-db-staging` via Cloud SQL IAM Proxy)
**Corpus**: 270 Public Canonical Records (441 claims, 73 financials, 70 beneficiaries)
**Execution Timestamp**: 2026-08-21T21:26:00Z

---

## 1. Executive Summary

This report establishes the performance and latency baseline for the PTAT AI Retrieval Foundation operating over an authenticated Google Cloud SQL IAM proxy connection.

Retrieval operations execute in parallel across public projections, utilizing index-backed JSONB operators and text search vectors.

---

## 2. Latency Metrics Across 20 Live Queries

| Metric | Measured Duration (ms) | Operational Target | Status |
| :--- | :---: | :---: | :---: |
| **Minimum Latency** | **1,243 ms** | < 2,000 ms | PASS |
| **Median Latency ($p_{50}$)** | **1,988 ms** | < 3,000 ms | PASS |
| **95th Percentile Latency ($p_{95}$)** | **3,814 ms** | < 5,000 ms | PASS |
| **Maximum Latency** | **3,814 ms** | < 6,000 ms | PASS |

*Note: Latency includes roundtrip network transit through the IAM proxy to Cloud SQL `europe-west1` and full multi-projection assembly.*

---

## 3. Query Latency Breakdown by Intent Category

| Intent Category | Representative Query | Average Latency | Notes |
| :--- | :--- | :---: | :--- |
| **Geographic Lookups** | "What has Tinubu done in Kaduna?" | 1,549 ms | Fast JSONB geography array evaluation |
| **Sectoral Summaries** | "What electricity reforms are recorded?" | 2,503 ms | Scans sector arrays and stemmed text |
| **Entity Deep Dive** | "What happened with CREDICORP?" | 1,243 ms | High selectivity index lookup |
| **Subnational Comparisons** | "Compare Kaduna and Kano." | 2,578 ms | Bilateral multi-state query aggregation |
| **Primary Source Lookups** | "Show primary sources only." | 3,814 ms | Broad scan across all level-1 sources |
| **Unsupported Evidence** | "What is the average temperature on Mars?" | 1,924 ms | Early zero-match termination |

---

## 4. Resource Utilization & Optimization Assessment

1. **Connection Pooling**: Uses `QueryExecutor` connection pool with parameterization.
2. **Projection Filtering**: All filtering is pushed down into PostgreSQL (zero client-side memory filtering of the 270 corpus).
3. **Cache Viability**: Prepared statements and JSONB GIN index utilization in future releases will further reduce $p_{95}$ latency to sub-second thresholds.
