# Sector & Subsector Taxonomy — Tinubu Achievement Tracker V2

This document details the 5 Primary Umbrella Sectors, the Sector Coverage Matrix across 15 major domains, and the technical justification for the 5-sector umbrella structure.

---

## 1. The 5 Primary Umbrella Sectors & Slugs

1. **`economy`** (Economic Reforms, Fiscal & Monetary Systems, Trade, Investment)
2. **`security`** (Security Progress, Defense, Policing, Maritime & National Stability)
3. **`infrastructure`** (Infrastructure, Transportation, Power, Works, Digital Infrastructure)
4. **`social-services`** (Social Services, Education, Health, Youth, Empowerment, Poverty Alleviation)
5. **`governance`** (Governance, Institutional Reform, Anti-Corruption, Transparency, Foreign Affairs)

---

## 2. Sector Coverage Matrix Across 15 Major Domains

| Domain | Canonical Sector Slug | Subsector Name | Merge / Inclusion Rationale | Public Navigation Label |
| :--- | :--- | :--- | :--- | :--- |
| **1. Economy & Fiscal Reforms** | `economy` | `fiscal-and-monetary` | Core macroeconomic domain | Economic Reforms |
| **2. Security & Stability** | `security` | `defense-and-policing` | Core national security domain | Security Progress |
| **3. Infrastructure & Transport** | `infrastructure` | `roads-rail-ports` | Capital physical infrastructure | Infrastructure |
| **4. Agriculture & Food Security** | `economy` | `agriculture-food-security` | Merged into Economy for trade & production focus | Agriculture & Food Security |
| **5. Education & Human Capital** | `social-services` | `education-student-loans` | Merged under Social Services | Education & Student Loans |
| **6. Healthcare & Public Health** | `social-services` | `healthcare-public-health` | Merged under Social Services | Healthcare & Public Health |
| **7. Social Protection & Welfare** | `social-services` | `social-investment` | Merged under Social Services | Social Investment |
| **8. Youth, Employment & Skills** | `social-services` | `youth-employment-skills` | Merged under Social Services | Youth & Empowerment |
| **9. Power, Energy & Mining** | `infrastructure` | `power-energy-resources` | Merged under Infrastructure | Energy & Power |
| **10. Digital Economy & Tech** | `economy` | `digital-economy-innovation`| Merged under Economy | Digital Economy |
| **11. Housing & Urban Dev.** | `infrastructure` | `housing-urban-development`| Merged under Infrastructure | Housing & Urban Dev. |
| **12. Environment & Climate** | `infrastructure` | `environment-climate` | Merged under Infrastructure | Environment & Climate |
| **13. Governance & Public Service** | `governance` | `civil-service-anti-corruption`| Core governance domain | Governance & Reform |
| **14. Foreign Affairs & Diplomacy** | `governance` | `foreign-affairs-diplomacy` | Merged under Governance | Diplomacy & Foreign Policy |
| **15. Creative Economy & Tourism** | `economy` | `creative-economy-tourism` | Merged under Economy | Creative Economy |

---

## 3. Justification for Option A (5 Umbrella Sectors)
- **UI & Navigation Simplicity**: 5 top-level categories prevent header clutter on mobile viewports (320px–768px).
- **Subsector Database Queries**: Preserves granular subsector filtering via `subsector` fields without fragmenting database primary keys.
