# Tinubu Achievement Tracker — Hierarchical Sector Taxonomy (v1.1)

**Standard Version:** 1.1  
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1  
**Schema Mapping:** `research/schemas/canonical-vocabulary.v1.1.json`  

---

## 1. Architectural Principles

Research Contract v1.1 adopts a **three-level hierarchical taxonomy** separating public user navigation from granular research classification:
- **Level 1 (Public Navigation Group):** 5 broad public umbrella categories for primary web navigation and dashboard groupings.
- **Level 2 (Canonical Research Sector):** 15 first-class canonical research domains representing primary ministerial portfolios, economic sectors, and reform areas.
- **Level 3 (Subsector):** Specific operational, infrastructural, or thematic sub-domains within a canonical research sector.

---

## 2. Level 1: Public Navigation Groups (5 Umbrella Categories)

| # | Public Group Slug | Public Label | Description | Canonical Research Sectors Included |
|---|---|---|---|---|
| 1 | `economy` | Economy & Macro Reforms | Macroeconomic policy, fiscal reforms, monetary stability, trade, industry, energy, and digital economy. | `economy_fiscal_reforms`, `power_energy_natural_resources`, `agriculture_food_security`, `digital_economy_science_innovation` |
| 2 | `security` | Security & National Stability | Defense, national security, counter-terrorism, border control, policing, and rule of law. | `security_national_stability` |
| 3 | `infrastructure` | Infrastructure & Urban Delivery | Transport corridors, roads, bridges, rail, aviation, maritime ports, power grid, and housing. | `infrastructure_transportation`, `housing_urban_development` |
| 4 | `social_services` | Social Investment & Human Capital | Education, healthcare, student financial aid, consumer credit, social welfare, environment, and creative arts. | `education_human_capital`, `healthcare_public_health`, `social_protection_human_development`, `youth_employment_skills`, `environment_climate`, `culture_tourism_creative_economy` |
| 5 | `governance` | Governance & Global Relations | Public service digitization, anti-corruption, civil service turnaround, judicial reforms, and foreign affairs. | `governance_public_service`, `foreign_affairs_international_cooperation` |

---

## 3. Level 2: Canonical Research Sectors (15 First-Class Domains)

```text
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                15 CANONICAL RESEARCH SECTORS                                      |
+────────────────────────────────────────┬──────────────────────────────────────────────────────────+
| Canonical Code                         | Public Name & Core Scope                                 |
+────────────────────────────────────────┼──────────────────────────────────────────────────────────+
| 1. economy_fiscal_reforms              | Economy and Fiscal Reforms (Macro, Tax, Revenue, FX, DMO)|
| 2. security_national_stability         | Security and National Stability (Defense, Police, Intel) |
| 3. infrastructure_transportation       | Infrastructure and Transportation (Roads, Rail, Ports)   |
| 4. agriculture_food_security           | Agriculture and Food Security (Crops, Inputs, Storage)   |
| 5. education_human_capital             | Education and Human Capital (Tertiary, Basic, TVET)      |
| 6. healthcare_public_health            | Healthcare and Public Health (Primary Health, Insurance) |
| 7. social_protection_human_development | Social Protection & Human Development (Welfare, Relief)  |
| 8. youth_employment_skills             | Youth, Employment and Skills (Apprenticeships, Tech Jobs)|
| 9. power_energy_natural_resources      | Power, Energy & Natural Resources (Grid, Gas, Renewables)|
| 10. digital_economy_science_innovation | Digital Economy, Science & Innovation (Telecom, AI, IT)  |
| 11. housing_urban_development          | Housing and Urban Development (Renewed Hope Estates)     |
| 12. environment_climate                | Environment and Climate (Afforestation, Erosion, ESG)   |
| 13. governance_public_service          | Governance and Public Service (Civil Service, Reforms)   |
| 14. foreign_affairs_international_coop | Foreign Affairs & Global Cooperation (Bilateral, FDI)    |
| 15. culture_tourism_creative_economy   | Culture, Tourism, Media & Creative Economy (Film, Arts)  |
+────────────────────────────────────────┴──────────────────────────────────────────────────────────+
```

---

## 4. Detailed Sector Profiles & Subsectors

### 1. Economy and Fiscal Reforms (`economy_fiscal_reforms`)
- **Parent Group:** `economy`
- **Definition:** Monetary policy, foreign exchange unification, tax policy harmonization, fiscal deficit management, debt sustainability, capital market reforms, and sovereign wealth management.
- **Lead MDAs:** Federal Ministry of Finance, Central Bank of Nigeria (CBN), Federal Inland Revenue Service (FIRS), Debt Management Office (DMO), Budget Office of the Federation.
- **Subsectors:** `macroeconomic_policy`, `taxation_and_fiscal_policy`, `monetary_and_exchange_rate_reforms`, `debt_management`, `customs_and_trade_facilitation`, `capital_markets_and_investment`.

### 2. Security and National Stability (`security_national_stability`)
- **Parent Group:** `security`
- **Definition:** Counter-terrorism operations, border security, defense capability enhancements, policing reforms, maritime security (Deep Blue Project), and judicial security coordination.
- **Lead MDAs:** Ministry of Defence, Office of the National Security Adviser (ONSA), Nigerian Armed Forces, Nigeria Police Force, Nigeria Customs Service, Nigeria Immigration Service.
- **Subsectors:** `counter_terrorism_and_internal_security`, `defense_modernization_and_procurement`, `border_and_immigration_security`, `maritime_security`, `police_reform_and_community_policing`.

### 3. Infrastructure and Transportation (`infrastructure_transportation`)
- **Parent Group:** `infrastructure`
- **Definition:** Interstate highway corridors, arterial bridges, standard gauge rail lines, international airport terminals, deep sea ports, inland waterways, and multimodal transport logistics.
- **Lead MDAs:** Federal Ministry of Works, Federal Ministry of Transportation, Federal Ministry of Aviation and Aerospace Development, Federal Ministry of Marine and Blue Economy, Nigerian Ports Authority (NPA), Nigerian Railway Corporation (NRC), Federal Airports Authority of Nigeria (FAAN).
- **Subsectors:** `highways_and_arterial_roads`, `bridges_and_tunnels`, `rail_transport_and_metro`, `aviation_and_airports`, `maritime_ports_and_shipping`, `inland_waterways`.

### 4. Agriculture and Food Security (`agriculture_food_security`)
- **Parent Group:** `economy`
- **Definition:** Food security emergency declarations, dry-season farming, grain reserves, agricultural mechanization, agro-processing zones, livestock reforms, and smallholder input subsidies.
- **Lead MDAs:** Federal Ministry of Agriculture and Food Security, Federal Ministry of Livestock Development, Bank of Agriculture (BOA), National Agricultural Land Development Authority (NALDA).
- **Subsectors:** `crop_production_and_inputs`, `food_reserves_and_price_stabilization`, `agricultural_mechanization_and_irrigation`, `livestock_and_dairy_development`, `agro_processing_and_export`.

### 5. Education and Human Capital (`education_human_capital`)
- **Parent Group:** `social_services`
- **Definition:** Tertiary education financing (NELFUND student loans), basic education infrastructure (UBEC), vocational and technical education (TVET), curriculum modernization, and educator welfare.
- **Lead MDAs:** Federal Ministry of Education, National Student Financial Aid Scheme (NELFUND), Universal Basic Education Commission (UBEC), Tertiary Education Trust Fund (TETFund), National Universities Commission (NUC).
- **Subsectors:** `student_loans_and_financial_aid`, `tertiary_education_infrastructure`, `basic_and_secondary_education`, `technical_and_vocational_education`, `curriculum_and_teacher_development`.

### 6. Healthcare and Public Health (`healthcare_public_health`)
- **Parent Group:** `social_services`
- **Definition:** Primary healthcare revitalisation, National Health Insurance Authority (NHIA) expansion, local pharmaceutical manufacturing executive orders, tertiary hospital equipment upgrades, and disease surveillance.
- **Lead MDAs:** Federal Ministry of Health and Social Welfare, National Primary Health Care Development Agency (NPHCDA), National Health Insurance Authority (NHIA), NAFDAC, Nigeria Centre for Disease Control (NCDC).
- **Subsectors:** `primary_healthcare_revitalization`, `health_insurance_and_financial_protection`, `local_pharmaceutical_manufacturing`, `tertiary_hospital_modernization`, `maternal_and_child_health`.

### 7. Social Protection and Human Development (`social_protection_human_development`)
- **Parent Group:** `social_services`
- **Definition:** National Social Safety Net programmes, conditional cash transfers, consumer credit facility (CREDICORP), humanitarian relief, elderly welfare, and disability inclusion initiatives.
- **Lead MDAs:** Federal Ministry of Humanitarian Affairs and Poverty Reduction, Nigerian Consumer Credit Corporation (CREDICORP), National Social Investment Programme Agency (NSIPA).
- **Subsectors:** `conditional_cash_transfers`, `consumer_credit_schemes`, `poverty_alleviation_programmes`, `humanitarian_relief_and_rehabilitation`, `disability_and_social_inclusion`.

### 8. Youth, Employment and Skills (`youth_employment_skills`)
- **Parent Group:** `social_services`
- **Definition:** Youth investment funds (NYIF), digital skills accelerators (3MTT), industrial training programmes (ITF), MSME apprenticeships, and job placement initiatives.
- **Lead MDAs:** Federal Ministry of Youth Development, Federal Ministry of Labour and Employment, Industrial Training Fund (ITF), Small and Medium Enterprises Development Agency of Nigeria (SMEDAN).
- **Subsectors:** `national_youth_investment_fund`, `digital_skills_and_3mtt`, `vocational_apprenticeships`, `entrepreneurship_and_msme_grants`, `labour_standards_and_employment_services`.

### 9. Power, Energy and Natural Resources (`power_energy_natural_resources`)
- **Parent Group:** `economy`
- **Definition:** Electricity Act 2023 state electricity market decentralisation, Presidential Power Initiative (Siemens), gas monetization (Decade of Gas), solar mini-grids (REA), and solid minerals development.
- **Lead MDAs:** Federal Ministry of Power, Federal Ministry of Petroleum Resources, Federal Ministry of Solid Minerals Development, Nigerian Electricity Regulatory Commission (NERC), Rural Electrification Agency (REA), Nigerian National Petroleum Company Limited (NNPCL), Nigerian Upstream Petroleum Regulatory Commission (NUPRC).
- **Subsectors:** `power_generation_and_grid_transmission`, `state_electricity_market_devolution`, `rural_and_renewable_electrification`, `oil_and_gas_upstream_reforms`, `domestic_gas_utilization`, `solid_minerals_and_mining`.

### 10. Digital Economy, Science and Innovation (`digital_economy_science_innovation`)
- **Parent Group:** `economy`
- **Definition:** National broadband expansion, fiber-optic backbone rollout, National Artificial Intelligence Strategy, digital public infrastructure (NIN/NIMC), tech startup support, and space technology.
- **Lead MDAs:** Federal Ministry of Communications, Innovation and Digital Economy, Nigerian Communications Commission (NCC), National Information Technology Development Agency (NITDA), National Identity Management Commission (NIMC), Galaxy Backbone.
- **Subsectors:** `broadband_and_telecom_infrastructure`, `digital_public_infrastructure_and_identity`, `ai_and_emerging_technologies`, `tech_startup_ecosystem_and_funding`, `e_governance_and_cybersecurity`.

### 11. Housing and Urban Development (`housing_urban_development`)
- **Parent Group:** `infrastructure`
- **Definition:** Renewed Hope Cities and Estates, Federal Mortgage Bank recapitalisation, national land registry reforms, urban renewal, and affordable housing public-private partnerships.
- **Lead MDAs:** Federal Ministry of Housing and Urban Development, Federal Mortgage Bank of Nigeria (FMBN), Federal Housing Authority (FHA).
- **Subsectors:** `renewed_hope_cities_and_estates`, `mortgage_finance_and_origination`, `social_and_affordable_housing`, `land_registry_reforms_and_titling`, `urban_renewal_and_infrastructure`.

### 12. Environment and Climate (`environment_climate`)
- **Parent Group:** `social_services`
- **Definition:** Great Green Wall afforestation, flood control and erosion management (NEWMAP), climate change transition frameworks, carbon market initiatives, and circular economy waste management.
- **Lead MDAs:** Federal Ministry of Environment, National Council on Climate Change (NCCC), National Agency for the Great Green Wall (NAGGW), HYPREP.
- **Subsectors:** `great_green_wall_and_afforestation`, `flood_control_and_erosion_remediation`, `climate_transition_and_carbon_markets`, `environmental_remediation_and_hyprep`, `waste_management_and_circular_economy`.

### 13. Governance and Public Service (`governance_public_service`)
- **Parent Group:** `governance`
- **Definition:** Federal civil service automation, Oronsaye Report administrative restructuring, public sector procurement reform, anti-corruption enforcement, and judicial welfare enhancements.
- **Lead MDAs:** Office of the Head of the Civil Service of the Federation (OHCSF), Bureau of Public Procurement (BPP), Economic and Financial Crimes Commission (EFCC), Independent Corrupt Practices Commission (ICPC), Federal Ministry of Justice.
- **Subsectors:** `civil_service_digitization_and_automation`, `administrative_restructuring_and_efficiency`, `public_procurement_reforms`, `anti_corruption_and_transparency`, `judicial_reforms_and_rule_of_law`.

### 14. Foreign Affairs and International Cooperation (`foreign_affairs_international_cooperation`)
- **Parent Group:** `governance`
- **Definition:** 4D foreign policy doctrine (Democracy, Development, Demography, Diaspora), bilateral trade and investment pacts, multilateral diplomacy (ECOWAS, AU, G20, BRICS engagement), and consular improvements.
- **Lead MDAs:** Federal Ministry of Foreign Affairs, Federal Ministry of Industry, Trade and Investment, Nigerian Investment Promotion Commission (NIPC), Nigerians in Diaspora Commission (NiDCOM).
- **Subsectors:** `4d_foreign_policy_and_diplomacy`, `bilateral_trade_and_investment_treaties`, `multilateral_and_regional_cooperation`, `diaspora_engagement_and_remittances`, `consular_and_passport_reforms`.

### 15. Culture, Tourism, Media and Creative Economy (`culture_tourism_creative_economy`)
- **Parent Group:** `social_services`
- **Definition:** Creative economy financing facilities (IDICE), intellectual property protection, heritage preservation, national tourism masterplan, and film/music industry export facilitation.
- **Lead MDAs:** Federal Ministry of Art, Culture and the Creative Economy, Federal Ministry of Tourism, Federal Ministry of Information and National Orientation, National Council for Arts and Culture (NCAC), National Film and Video Censors Board (NFVCB).
- **Subsectors:** `creative_industry_financing_and_idice`, `intellectual_property_and_copyright`, `film_music_and_performing_arts`, `heritage_conservation_and_museums`, `tourism_infrastructure_and_promotion`.
