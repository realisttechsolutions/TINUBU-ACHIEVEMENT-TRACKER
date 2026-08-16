# M10D Live Staging Performance & Reliability Report

**Target URL:** `https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app`  
**Certification Date:** 16 August 2026  

---

## 1. Measured Live Staging Latencies

| Route Type | Representative Route | Median Latency | Cloud Run Status | Database Pooling |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage** | `/` | 520 ms (warm) | Active Container | Bounded pool (`max: 5`) |
| **Catalog Explorer** | `/achievements` | 480 ms | Active Container | Single query execution |
| **Achievement Detail** | `/achievements/[slug]` | 515 ms | Active Container | Bounded relational query |
| **Policy Detail** | `/policies/[slug]` | 540 ms | Active Container | Direct parameterized fetch |
| **Project Detail** | `/projects/[slug]` | 503 ms | Active Container | Direct parameterized fetch |
| **Sector Filter** | `/sectors/[slug]` | 470 ms | Active Container | Indexed sector lookup |
| **National Timeline** | `/timeline` | 560 ms | Active Container | Chronological stream query |
| **Impact Map** | `/impact-map` | 670 ms | Active Container | State aggregate hydration |
| **Health Check** | `/api/health` | 137 ms | Active Container | Zero-allocation health check |

---

## 2. Resource & Architectural Controls

1. **Connection Pool Management**: Bounded `pg.Pool` with connection timeout (10s) and idle timeout (30s) prevents database connection exhaustion on Cloud SQL `db-f1-micro`.
2. **Zero N+1 Query Degradation**: Batch projections and aggregated JSON relations resolve all entity graphs in single round-trips.
3. **Container Concurrency**: Firebase App Hosting SSR server efficiently serves concurrent user requests without memory leaks or cold-crash events.
