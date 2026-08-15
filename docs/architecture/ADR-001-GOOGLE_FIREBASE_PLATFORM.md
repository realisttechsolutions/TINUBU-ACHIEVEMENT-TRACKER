# Architectural Decision Record (ADR-001)
## Strategic Platform Selection: Google Cloud / Firebase Ecosystem Mandate and Permanent Supabase Exclusion

**Status:** APPROVED / CANONICAL  
**Date:** 2026-08-15  
**Deciders:** Technical Architecture Board, Lead Systems Architect  
**Scope:** Whole Platform (Tinubu Achievement Tracker V2 — Web, Backend, Cloud, Identity, AI Intelligence)

---

## 1. Context and Problem Statement

The Tinubu Achievement Tracker (TAT) is Nigeria's authoritative, evidence-backed public progress tracking platform covering federal policy reforms, capital infrastructure projects, macroeconomic indicators, and institutional milestones for the administration of President Bola Ahmed Tinubu (2023–2026).

During the initial engineering exploration phase, lightweight third-party BaaS alternatives (such as Supabase / PostgreSQL hosted wrappers) were evaluated alongside enterprise Google Cloud / Firebase native services.

A definitive architectural standard is required to establish permanent technology boundaries across all engineering missions (Missions 01 through 18), preventing vendor drift, authentication fragmentation, dual-taxonomy contamination, and ensuring seamless integration with Google's sovereign AI infrastructure (Vertex AI / Gemini 1.5 Pro).

---

## 2. Decision: Permanent Adoption of Google Ecosystem & Complete Supabase Exclusion

We definitively decide:
1. **Google Ecosystem Exclusivity:** The Tinubu Achievement Tracker platform will exclusively use the Google enterprise ecosystem:
   - **Framework & Application Runtime:** Next.js 14+ App Router on **Firebase App Hosting** (Google Cloud Run compute backend)
   - **Data Layer:** Firebase Firestore (canonical document database) + Google Cloud Storage (evidence documents, gazette PDFs, high-resolution imagery)
   - **Authentication & RBAC:** Firebase Authentication with Google Identity Platform (MFA, claims-based RBAC, audit logging)
   - **Serverless & Async Ingestion:** Google Cloud Functions (2nd Gen) + Cloud Tasks
   - **AI Intelligence Experience ("Ask the Tracker"):** Google Cloud Vertex AI (Gemini 1.5 Pro with Grounded Search and Firestore Vector Embeddings)
   - **Monitoring & Security:** Google Cloud Logging, Cloud Monitoring, Cloud Armor, and Security Command Center.
2. **Supabase Exclusion Mandate:** Supabase is **PERMANENTLY EXCLUDED** from the approved architecture.
   - No Supabase client libraries (`@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, etc.) shall be introduced.
   - No Supabase schemas, connection strings, or edge functions shall be created.
   - Any reference to Supabase in legacy exploration documents is declared non-canonical and superseded by this ADR.

---

## 3. Rationale and Technical Comparison

| Dimension | Google Cloud / Firebase Ecosystem (Selected) | Supabase (Excluded) | Rationale |
| :--- | :--- | :--- | :--- |
| **App Hosting & SSR** | Firebase App Hosting natively builds Next.js App Router applications with zero-config Cloud Run autoscaling, edge CDN routing, and global caching. | Requires external hosting (Vercel, AWS ECS, or Fly.io) creating multi-cloud complexity and egress cost overhead. | Unifies compute, hosting, CDN, and database inside a single VPC and Google security boundary. |
| **AI Integration** | Direct low-latency VPC peering with Vertex AI and Gemini 1.5 Pro for grounding research claims against 19 canonical schemas. | Requires third-party external API calls across cloud boundaries with additional latency and data governance friction. | Sovereign AI integration with official Nigerian government evidentiary standards. |
| **Authentication & RBAC** | Firebase Auth with custom claims (`superadmin`, `reviewer`, `mda_editor`, `analyst`) integrated with Google Cloud IAM. | Separate proprietary auth layer with Postgres Row Level Security (RLS) policies requiring PostgreSQL-specific DDL scripts. | Aligns with existing Google Cloud security benchmarks and multi-agent governance protocols. |
| **Data Scalability** | Firestore multi-region active-active replication with 99.999% SLA for massive national read traffic on election and policy release cycles. | Single Postgres instance requiring connection poolers (PgBouncer) and vertical scaling management. | High elasticity during high-traffic national announcements with zero maintenance windows. |
| **Vendor Cohesion** | Single vendor invoice, single IAM permission model, unified audit trail via Google Cloud Audit Logs. | Fragmented vendor posture across Supabase, Vercel, and OpenAI/Anthropic. | Simplifies compliance, security accreditation, and sovereign Nigerian data stewardship. |

---

## 4. Consequences and Governance

### Positive Consequences
- **Zero Architecture Fragmentation:** All engineering agents (Antigravity, Codex, human engineers) adhere to one unified toolchain.
- **Seamless Data Flow:** Research Mission outputs (CSV/JSON 19 schemas) map directly into Firestore collections and Cloud Storage buckets without SQL migration hurdles.
- **Enterprise SLA:** Backed by Google Cloud's enterprise SLAs and global edge CDN presence.
- **Direct Next.js SSR Support:** Firebase App Hosting provides first-class, official support for Next.js App Router dynamic routes, server components, and static prerendering.

### Negative / Mitigated Consequences
- *Document vs Relational Storage:* Complex multi-table joins are avoided by designing denormalized view models (`dataAdapter.ts`) with strict JSON Schema validation upfront during ingestion.

---

## 5. Compliance Verification

All code reviews, CI/CD pipelines, and agent audits MUST enforce:
1. `grep -rn "supabase" package.json src/` must return 0 results.
2. All environment variables must follow the `NEXT_PUBLIC_FIREBASE_*` and `FIREBASE_*` standard defined in `TAT_ENVIRONMENT_VARIABLE_STANDARD.md`.
3. Deployment targets must compile to Next.js App Router for Firebase App Hosting (`apphosting.yaml`).