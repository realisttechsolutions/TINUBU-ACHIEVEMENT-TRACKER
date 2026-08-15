# Research-to-Development Handoff & Supabase Blueprint — Tinubu Achievement Tracker V2

> [!WARNING]
> **STATUS: DEPRECATED — SUPABASE ASSUMPTIONS RETIRED**  
> The project architecture has transitioned from Supabase to **Firebase SQL Connect / Cloud SQL PostgreSQL**. This legacy document contains historical Supabase DDL and RLS proposals that are not applicable to Firebase SQL Connect. See [`docs/engineering/CODEX_M01_FIREBASE_SQL_CONNECT_DATABASE_REVIEW.md`](../engineering/CODEX_M01_FIREBASE_SQL_CONNECT_DATABASE_REVIEW.md) and [`TAT_FRONTEND_CONTRACT_ALIGNMENT_REQUIREMENTS.md`](./TAT_FRONTEND_CONTRACT_ALIGNMENT_REQUIREMENTS.md).

This document provides historical pre-consolidation Supabase proposals.

---

## 1. Supabase Relational Database Schema Blueprint

### 1.1 Core Database Tables Overview

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│          achievements           │       │            policies             │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id (PK)                         │       │ id (PK)                         │
│ slug (UNIQUE)                   │       │ slug (UNIQUE)                   │
│ title                           │       │ title                           │
│ sector_id (FK -> sectors.id)    │       │ sector_id (FK -> sectors.id)    │
│ publication_status              │       │ legal_authority                 │
└──────────────┬──────────────────┘       └──────────────┬──────────────────┘
               │                                         │
               │ 1:N                                     │ 1:N
               ▼                                         ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│       achievement_sources       │       │         policy_sources          │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id (PK)                         │       │ id (PK)                         │
│ achievement_id (FK)             │       │ policy_id (FK)                  │
│ source_name                     │       │ source_name                     │
│ source_url                      │       │ source_url                      │
│ level (1-5)                     │       │ document_type                   │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

---

### 1.2 Table Specifications & Column Definitions

#### Table: `achievements`
```sql
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  short_title VARCHAR(100),
  achievement_type VARCHAR(50) NOT NULL CHECK (achievement_type IN ('physical-project', 'policy-reform', 'programme-intervention', 'institutional-improvement', 'reported-outcome')),
  sector_slug VARCHAR(50) NOT NULL CHECK (sector_slug IN ('economy', 'security', 'infrastructure', 'social-services', 'governance')),
  summary TEXT NOT NULL,
  full_description TEXT NOT NULL,
  impact_outcome TEXT NOT NULL,
  beneficiaries_or_scope TEXT NOT NULL,
  status VARCHAR(50) NOT NULL,
  classification VARCHAR(50) NOT NULL CHECK (classification IN ('Actual', 'Provisional', 'Projected', 'Target')),
  publication_status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'under-review', 'publishable', 'publishable-with-qualification', 'rejected', 'archived')),
  lead_ministry_or_agency VARCHAR(255) NOT NULL,
  geopolitical_zone VARCHAR(100),
  states_covered TEXT[], -- Array of state names or ISO codes
  start_date VARCHAR(50),
  completion_or_current_date VARCHAR(50),
  verification_date VARCHAR(50) NOT NULL,
  featured_image TEXT,
  related_achievement_slugs TEXT[],
  
  -- Internal Audit Fields
  internal_notes TEXT,
  researcher_id VARCHAR(100),
  verifier_id VARCHAR(100),
  evidence_raw_url TEXT,
  rejection_reason TEXT,
  qualification_notes TEXT,
  confidence_score INT CHECK (confidence_score BETWEEN 1 AND 5),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX idx_achievements_slug ON public.achievements(slug);
CREATE INDEX idx_achievements_sector ON public.achievements(sector_slug);
CREATE INDEX idx_achievements_pub_status ON public.achievements(publication_status);
CREATE INDEX idx_achievements_type ON public.achievements(achievement_type);
```

#### Table: `achievement_sources`
```sql
CREATE TABLE public.achievement_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url TEXT,
  level INT NOT NULL CHECK (level BETWEEN 1 AND 5),
  publication_date VARCHAR(50),
  document_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sources_achievement_id ON public.achievement_sources(achievement_id);
```

#### Table: `achievement_milestones`
```sql
CREATE TABLE public.achievement_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  date VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_milestones_achievement_id ON public.achievement_milestones(achievement_id);
```

#### Table: `policies`
```sql
CREATE TABLE public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  short_title VARCHAR(100),
  policy_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  publication_status VARCHAR(50) NOT NULL DEFAULT 'draft',
  legal_authority VARCHAR(100) NOT NULL,
  authority_reference VARCHAR(255),
  sector_slug VARCHAR(50) NOT NULL,
  lead_agency VARCHAR(255) NOT NULL,
  responsible_institutions TEXT[],
  summary TEXT NOT NULL,
  full_description TEXT NOT NULL,
  background_context TEXT,
  key_objectives TEXT[],
  effective_date VARCHAR(50) NOT NULL,
  announcement_date VARCHAR(50),
  approval_date VARCHAR(50),
  states_covered TEXT[],
  geopolitical_scope VARCHAR(100),
  reported_outcomes TEXT[],
  
  -- Internal Audit Fields
  internal_notes TEXT,
  researcher_id VARCHAR(100),
  verifier_id VARCHAR(100),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 2. Row-Level Security (RLS) Strategy

To ensure public frontend queries only retrieve approved, public-facing records while preventing unauthorized edits or leak of internal audit notes:

```sql
-- Enable RLS on achievements table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- 1. Public Anonymous Read Policy (Frontend Web App)
CREATE POLICY "Public Read Access for Approved Records"
ON public.achievements
FOR SELECT
USING (
  publication_status IN ('publishable', 'publishable-with-qualification')
);

-- 2. Authenticated Researcher / Admin Access
CREATE POLICY "Full Access for Authenticated Editorial Staff"
ON public.achievements
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' IN ('researcher', 'editor', 'admin')
)
WITH CHECK (
  auth.jwt() ->> 'role' IN ('researcher', 'editor', 'admin')
);
```

---

## 3. Database to Frontend TypeScript Data Contract

| Supabase DB Column | TypeScript Interface Field (`src/types/achievement.ts`) | Transformation / Notes |
| :--- | :--- | :--- |
| `id` | `id: string` | Direct string |
| `slug` | `slug: string` | Direct string |
| `title` | `title: string` | Direct string |
| `short_title` | `shortTitle?: string` | Optional string |
| `achievement_type` | `achievementType: AchievementType` | Enum mapping |
| `sector_slug` | `sector: "economy" \| ...` | Enum mapping |
| `summary` | `summary: string` | Direct string |
| `full_description` | `fullDescription: string` | Direct string |
| `impact_outcome` | `impactOutcome: string` | Direct string |
| `beneficiaries_or_scope` | `beneficiariesOrScope: string` | Direct string |
| `status` | `status: AchievementStatus` | Status badge enum |
| `classification` | `classification: DataClassification` | Data classification enum |
| `publication_status` | `publicationStatus: PublicationStatus` | Publication status enum |
| `lead_ministry_or_agency` | `leadMinistryOrAgency: string` | Direct string |
| `geopolitical_zone` | `geopoliticalZone?: string` | Optional string |
| `states_covered` | `statesCovered?: string[]` | Postgres `TEXT[]` -> TS Array |
| `start_date` | `startDate?: string` | Optional string |
| `completion_or_current_date` | `completionOrCurrentDate?: string` | Optional string |
| `verification_date` | `verificationDate: string` | Direct string |
| `featured_image` | `featuredImage?: string` | Optional URL string |
| `related_achievement_slugs` | `relatedAchievementSlugs?: string[]` | Postgres `TEXT[]` -> TS Array |
| *(Relational Table)* `achievement_sources` | `sources: AchievementSource[]` | Joined via `achievement_id` |
| *(Relational Table)* `achievement_milestones` | `milestones?: AchievementMilestone[]` | Joined via `achievement_id` |

---

## 4. Key Handoff Decisions for Codex

1. **Storage Choice**: Supabase Postgres database with relational tables for `achievements`, `sources`, `milestones`, `policies`, and `indicators`.
2. **Authentication & Roles**: Integration with Supabase Auth using custom JWT claims for roles (`researcher`, `editor`, `admin`).
3. **Data Ingestion Tooling**: Automated Node.js ingestion script (`scripts/ingest-csv.ts`) to validate research CSV templates against JSON Schemas before inserting into Supabase staging tables.
4. **Fallback Mechanism**: Static fallback data (`src/data/achievements/achievements.data.ts`) will be maintained as a compile-time fallback in case of database network latency or offline mode.

## 5. Public Disclosure Component
Frontend must render the explicit achievements-focused disclosure notice in the global footer (`GlobalFooter.tsx`) and methodology page (`/data-sources`): *"The Tinubu Achievement Tracker is an achievements-focused public information platform. It documents verified policies, projects, and measurable progress, citing official and independent sources. It is not an independent audit organisation."*
