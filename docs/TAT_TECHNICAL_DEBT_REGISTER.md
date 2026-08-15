# TAT Technical Debt Register
## Architectural Backlog & Resolution Tracking

**Status:** ACTIVE  
**Last Updated:** 2026-08-15  

---

## 1. Resolved Debt Items (Mission 09)

| ID | Category | Description | Status | Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **DEBT-001** | Architecture | SPA client-side routing with zero server-side SEO pre-rendering. | **RESOLVED (M09)** | Migrated to Next.js 14 App Router; 82 SSG pages pre-rendered with dynamic OpenGraph metadata. |
| **DEBT-002** | Routing | Legacy Vite routes (`/economic-reforms`, etc.) had no HTTP 308 permanent redirect headers. | **RESOLVED (M09)** | Implemented HTTP 308 permanent redirects in `next.config.mjs`. |
| **DEBT-003** | Test Suite | Vitest tests coupled to React Router memory context. | **RESOLVED (M09)** | Universal navigation adapter (`src/lib/navigation.tsx`) bridging Next.js and test runners seamlessly. |
| **DEBT-004** | Hosting | Static SPA build not configured for containerized Google Cloud serverless hosting. | **RESOLVED (M09)** | Configured `apphosting.yaml` for Firebase App Hosting on Google Cloud Run. |

---

## 2. Active Debt Items (Scheduled for Missions 10–13)

| ID | Category | Description | Target Milestone | Plan |
| :--- | :--- | :--- | :--- | :--- |
| **DEBT-005** | Data Layer | Static seed data in `src/data/` needs live sync with Firestore production collections. | **Mission 10 & 12** | Implement Firestore client/admin SDK queries in `dataAdapter.ts`. |
| **DEBT-006** | Auth | Mock admin/editor role checks need Firebase Auth custom claims integration. | **Mission 11** | Implement Firebase Auth + Google Identity Platform RBAC. |
| **DEBT-007** | Search | Client-side search filtering should be augmented with Vertex AI vector search. | **Mission 13 & 16** | Connect "Ask the Tracker" to Gemini 1.5 Pro + Firestore vector index. |