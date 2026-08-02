# Record Taxonomy & Qualification Standards — Tinubu Achievement Tracker V2

This document defines the 20 conceptual record types recognized by the platform and their qualification rules.

---

## 1. The 20 Conceptual Record Types

| # | Record Type | Conceptual Definition | Primary Evidence Required | Supabase Destination |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `Achievement` | Verified government action or milestone | Level 1-2 Gazette or Report | `achievements` |
| **2** | `Policy` | Structural policy framework or directive | Level 1 Executive Order / Act | `policies` |
| **3** | `Reform` | Systemic regulatory or fiscal overhaul | Level 1 Gazette / Regulation | `policies` |
| **4** | `Executive Action` | Direct Presidential directive or order | Level 1 Signed Order | `policies` |
| **5** | `Legislation` | Signed Act of National Assembly | Level 1 Enacted Act | `policies` |
| **6** | `Regulation` | Gazetted administrative rule | Level 1 Gazette | `policies` |
| **7** | `Programme` | Structured social or credit scheme | Level 1-2 Guidelines | `programmes` |
| **8** | `Intervention` | Targeted emergency or relief scheme | Level 2 MDA Report | `programmes` |
| **9** | `Physical Project` | Built capital infrastructure asset | Level 1-2 FEC / Works Record | `projects` |
| **10** | `Institutional Reform` | Agency digitisation or restructuring | Level 2 Circular | `achievements` |
| **11** | `Reported Outcome` | Empirical statistical outcome reached | Level 2 NBS / CBN Bulletin | `achievements` |
| **12** | `Timeline Event` | Dated implementation step | Level 1-4 Media / Gazette | `timeline_events` |
| **13** | `Milestone` | Progress step within a project | Level 2 Project Report | `milestones` |
| **14** | `Indicator` | Performance metric definition | Level 2 NBS Metadata | `indicators` |
| **15** | `Indicator Observation` | Dated numeric metric value | Level 2 NBS Bulletin | `indicator_observations` |
| **16** | `Source` | Document or legal record citation | Level 1-5 URL / Scan | `sources` |
| **17** | `Correction or Revision` | Documented figure update log | Level 1-2 Revision | `corrections` |
| **18** | `Report` | Downloadable PDF executive brief | Level 1-5 Research Export | `reports` |
| **19** | `Dataset` | Bulk CSV/JSON data download | Level 1-5 Research Export | `datasets` |
| **20** | `Methodology` | Calculation & classification guide | Public Research Spec | `methodologies` |

---

## 2. Ineligible Content Rules
- **Unverified Claims**: Unsubstantiated social media statements (Level 6) are strictly ineligible for publication.
- **Pure Speeches/Announcements**: Speeches without legislative, executive, or procurement backing cannot be published as completed delivery achievements.
