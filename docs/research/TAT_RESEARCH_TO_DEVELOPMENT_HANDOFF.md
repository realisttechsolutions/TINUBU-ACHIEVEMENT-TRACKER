# Technical Handoff & Architecture Proposals — Tinubu Achievement Tracker V2

This document provides technical architecture proposals for backend development teams (Codex).

> [!IMPORTANT]
> **ARCHITECTURE PROPOSALS ONLY — NO PRODUCTION MIGRATIONS EXECUTED**
> 1. All SQL DDL, table specifications, and RLS policy statements in this document are **proposed architecture designs**.
> 2. **NO production database migrations have been executed during Research Mission 01.**
> 3. The engineering team (Codex) MUST conduct a comprehensive technical architecture audit before any database implementation.
> 4. Database implementation requires explicit approval following the technical audit.
> 5. External API integrations (e.g. Gazette APIs, NBS automated webhooks) are classified as `UNVERIFIED FUTURE DEPENDENCY`. Manual CSV upload remains the canonical ingestion path.

---

## 1. Proposed Relational Table Specifications
(Proposed SQL DDL schemas for `achievements`, `policies`, `projects`, `programmes`, `sources`, `financial_records`, `beneficiary_records` as detailed in `TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md`).

---

## 2. Recommended RLS Policies Proposal
```sql
-- Public Read Access Proposal
CREATE POLICY "Public Read Access for Approved Records"
ON public.achievements FOR SELECT
USING (publication_status IN ('publishable', 'publishable_with_qualification'));
```

---

## 3. Mandatory Frontend Disclosure Component
Frontend must render the explicit achievements-focused disclosure notice in the global footer (`GlobalFooter.tsx`) and methodology page (`/data-sources`): *"The Tinubu Achievement Tracker is an achievements-focused public information platform. It documents verified policies, projects, and measurable progress, citing official and independent sources. It is not an independent audit organisation."*
