# Supabase Data Contract & Complete 35-Entity Relationship Map — Tinubu Achievement Tracker V2

This document provides the complete database entity relationship map, table specifications, foreign key definitions, many-to-many relationship structures, RLS rules, and ingestion order for Supabase backend developers (Codex).

---

## 1. Complete 35-Entity Map Inventory

| # | Entity Name | Table Name | Purpose | MVP / Later | RLS Visibility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | User Profile | `profiles` | User auth & role management | MVP | Authenticated Self |
| **2** | Research Actor | `research_actors` | Researcher/Agent audit identities | MVP | Internal Staff Only |
| **3** | Institution | `institutions` | Canonical MDAs, international bodies | MVP | Public Read |
| **4** | Institution Alias | `institution_aliases` | MDA name variants & former names | Later | Public Read |
| **5** | Sector | `sectors` | Primary 5 platform sectors | MVP | Public Read |
| **6** | Subsector | `subsectors` | Granular sector categories | MVP | Public Read |
| **7** | Geographic Unit | `geographic_units` | States, FCT, zones, points, corridors | MVP | Public Read |
| **8** | Geographic Alias | `geographic_aliases` | Alternate place names | Later | Internal Staff Only |
| **9** | Geographic Coverage | `geographic_coverages` | Many-to-many record-location map | MVP | Public Read |
| **10** | Policy | `policies` | Executive orders, acts, regulations | MVP | Public Read (Filtered) |
| **11** | Physical Project | `projects` | Built capital infrastructure assets | MVP | Public Read (Filtered) |
| **12** | Programme | `programmes` | Social interventions & credit schemes | MVP | Public Read (Filtered) |
| **13** | Achievement | `achievements` | Central verified achievement records | MVP | Public Read (Filtered) |
| **14** | Indicator | `indicators` | Performance metrics & time-series | MVP | Public Read |
| **15** | Indicator Observation| `indicator_observations` | Dated numeric values for indicators | MVP | Public Read |
| **16** | Timeline Event | `timeline_events` | Chronological policy/project milestones | MVP | Public Read |
| **17** | Milestone | `milestones` | Step-by-step progress events | MVP | Public Read |
| **18** | Beneficiary Record | `beneficiary_records` | Applicant vs disbursed recipient counts | MVP | Public Read |
| **19** | Financial Record | `financial_records` | Approval vs release vs expenditure | MVP | Public Read |
| **20** | Source | `sources` | Cited documents, gazettes, bulletins | MVP | Public Read |
| **21** | Source File | `source_files` | Stored PDF documents / gazette scans | Later | Internal Staff Only |
| **22** | Source Snapshot | `source_snapshots` | Archived web snapshots & wayback links | Later | Internal Staff Only |
| **23** | Source Relationship | `source_relationships` | Maps sources to claims with explicit roles | MVP | Public Read |
| **24** | Evidence Claim | `evidence_claims` | Atomic factual claims extracted from text | Later | Internal Staff Only |
| **25** | Claim-Source Map | `claim_source_relationships`| Atomic claim attribution links | Later | Internal Staff Only |
| **26** | Report | `reports` | Downloadable executive briefs & PDFs | MVP | Public Read |
| **27** | Dataset | `datasets` | Bulk downloadable CSV/JSON exports | MVP | Public Read |
| **28** | Methodology | `methodologies` | Data classification & calculation specs | MVP | Public Read |
| **29** | Correction | `corrections` | Revision logs & figure corrections | MVP | Public Read |
| **30** | Record Version | `record_versions` | Historical version control audits | Later | Internal Staff Only |
| **31** | Research Task | `research_tasks` | Task allocation for human/AI researchers | Later | Internal Staff Only |
| **32** | Research Batch | `research_batches` | Batch ID tracking for CSV ingestion | MVP | Internal Staff Only |
| **33** | Review Decision | `review_decisions` | Editorial sign-off logs | MVP | Internal Staff Only |
| **34** | Data Gap | `data_gaps` | Identified research priorities & missing data | Later | Internal Staff Only |
| **35** | Freshness Review | `freshness_reviews` | Scheduled audit timestamps & stale alerts | MVP | Internal Staff Only |

---

## 2. Core Relational Schema Blueprint (DDL Examples)

```sql
-- 1. INSTITUTIONS TABLE
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  acronym VARCHAR(50),
  category VARCHAR(50) NOT NULL CHECK (category IN ('ministry', 'agency', 'commission', 'judiciary', 'legislature', 'international', 'media', 'think_tank')),
  official_website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ACHIEVEMENTS TABLE
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
  lead_institution_id UUID REFERENCES public.institutions(id),
  geopolitical_zone VARCHAR(100),
  start_date VARCHAR(50),
  completion_or_current_date VARCHAR(50),
  verification_date VARCHAR(50) NOT NULL,
  featured_image TEXT,
  
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

-- 3. FINANCIAL RECORDS TABLE (Separating Approval, Funding Release, and Expenditure)
CREATE TABLE public.financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('achievement', 'project', 'programme', 'policy')),
  entity_id UUID NOT NULL,
  financial_type VARCHAR(50) NOT NULL CHECK (financial_type IN ('budget_allocation', 'fec_approved_contract', 'released_funding', 'expenditure_disbursed', 'private_investment')),
  amount NUMERIC(18, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
  reporting_period VARCHAR(50) NOT NULL,
  source_id UUID REFERENCES public.sources(id),
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BENEFICIARY RECORDS TABLE (Separating Applicants from Active Recipients)
CREATE TABLE public.beneficiary_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('achievement', 'programme', 'project')),
  entity_id UUID NOT NULL,
  beneficiary_stage VARCHAR(50) NOT NULL CHECK (beneficiary_stage IN ('applicant', 'registered_participant', 'approved_beneficiary', 'disbursement_recipient', 'active_beneficiary')),
  count_value BIGINT NOT NULL,
  beneficiary_type VARCHAR(50) NOT NULL CHECK (beneficiary_type IN ('individual', 'household', 'msme', 'student', 'farmer', 'patient')),
  reporting_period VARCHAR(50) NOT NULL,
  source_id UUID REFERENCES public.sources(id),
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Many-to-Many Relationship Tables

1. `achievement_geographies` (`achievement_id`, `geographic_unit_id`, `coverage_role`)
2. `achievement_sources` (`achievement_id`, `source_id`, `source_role`, `evidence_page`)
3. `policy_institutions` (`policy_id`, `institution_id`, `relationship_role`)
4. `project_sources` (`project_id`, `source_id`, `source_role`)
5. `programme_beneficiaries` (`programme_id`, `beneficiary_record_id`)

---

## 4. MVP Ingestion Order

To satisfy foreign key dependencies during batch CSV ingestion:
1. `sectors` & `subsectors`
2. `institutions`
3. `geographic_units`
4. `sources`
5. `policies`, `projects`, `programmes`
6. `achievements`
7. `financial_records` & `beneficiary_records`
8. `milestones` & `indicator_observations`
9. Relationship maps (`achievement_sources`, `achievement_geographies`)
