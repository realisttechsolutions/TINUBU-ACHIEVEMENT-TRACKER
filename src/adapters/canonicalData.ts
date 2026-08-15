/**
 * Tinubu Achievement Tracker — Synthetic Demonstration Dataset (Contract v1.1.2)
 * ALL RECORDS IN THIS FILE ARE EXPLICITLY MARKED AS DEMONSTRATION / SYNTHETIC DATA
 * FOR FRONTEND PROTOTYPING AND VALIDATOR TESTING PRIOR TO RESEARCH MISSION 02.
 */

import {
  AchievementViewModel,
  SectorViewModel,
  ProjectViewModel,
  PolicyViewModel,
  ProgrammeViewModel,
  TimelineEventViewModel,
  StateProfileViewModel,
  DatasetResourceViewModel
} from "./types";

export const CANONICAL_PUBLIC_GROUPS = [
  { id: 'economy', label: 'Economy & Macro Reforms', description: 'Fiscal stability, monetary unification, energy markets, and digital innovation.' },
  { id: 'security', label: 'Security & National Stability', description: 'Counter-terrorism, defense readiness, border control, and internal policing.' },
  { id: 'infrastructure', label: 'Infrastructure & Urban Delivery', description: 'Transport corridors, highways, rail links, maritime ports, and housing.' },
  { id: 'social_services', label: 'Social Investment & Capital', description: 'Student financial aid, healthcare expansion, consumer credit, and social development.' },
  { id: 'governance', label: 'Governance & Global Relations', description: 'Civil service digitization, anti-corruption, judicial turnaround, and international diplomacy.' }
] as const;

export const CANONICAL_SECTORS: SectorViewModel[] = [
  {
    id: "economy_fiscal_reforms",
    sectorId: "economy_fiscal_reforms",
    name: "Economy and Fiscal Reforms",
    publicLabel: "Economy & Fiscal Reforms",
    slug: "economy-fiscal-reforms",
    parentPublicGroup: "economy",
    parentPublicGroupLabel: "Economy & Macro Reforms",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "TrendingUp",
    summary: "Macroeconomic policy realignment, foreign exchange unification, non-oil revenue mobilization, and debt service sustainability.",
    description: "Systemic restructuring of federal fiscal management, consolidation of single revenue windows, and removal of distortionary market subsidies.",
    keyObjectives: [
      "Unification of multiple official FX windows into a transparent market system",
      "Tripling federal non-oil tax revenue mobilization via automated collection",
      "Reducing debt-service-to-revenue ratio from >95% to sustainable fiscal bounds"
    ],
    leadInstitutions: ["Federal Ministry of Finance", "Central Bank of Nigeria", "Federal Inland Revenue Service", "Debt Management Office"],
    achievementCount: 14,
    projectCount: 4,
    policyCount: 6,
    highlightStat: {
      label: "Gross External Reserves",
      value: "$38.5 Billion",
      subtext: "Highest recorded liquidity level in 36 months"
    },
    featuredAchievementSlug: "fx-market-unification-single-window",
    isDemo: true
  },
  {
    id: "security_national_stability",
    sectorId: "security_national_stability",
    name: "Security and National Stability",
    publicLabel: "Security & National Stability",
    slug: "security-national-stability",
    parentPublicGroup: "security",
    parentPublicGroupLabel: "Security & National Stability",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "ShieldCheck",
    summary: "Modernization of armed forces equipment, inter-agency tactical intelligence fusion, and kinetic neutralization of insurgent networks.",
    description: "Multi-domain defense overhaul focusing on frontline air support assets, maritime territorial dominance, and non-kinetic community peace initiatives.",
    keyObjectives: [
      "Modernization of combat aviation wings and tactical armored fleets",
      "Restoration of safe transit across agricultural corridors in the North",
      "Securing Gulf of Guinea maritime waterways and curbing crude oil theft"
    ],
    leadInstitutions: ["Ministry of Defence", "Armed Forces of Nigeria", "Nigeria Police Force", "Office of the National Security Adviser"],
    achievementCount: 12,
    projectCount: 5,
    policyCount: 3,
    highlightStat: {
      label: "Displaced Communities Resettled",
      value: "142 Localities",
      subtext: "Secured for voluntary agricultural return"
    },
    featuredAchievementSlug: "counter-insurgency-tactical-aviation-modernization",
    isDemo: true
  },
  {
    id: "infrastructure_transportation",
    sectorId: "infrastructure_transportation",
    name: "Infrastructure and Transportation",
    publicLabel: "Infrastructure & Transportation",
    slug: "infrastructure-transportation",
    parentPublicGroup: "infrastructure",
    parentPublicGroupLabel: "Infrastructure & Urban Delivery",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Building2",
    summary: "Strategic national transport corridors, Lagos-Calabar coastal superhighway, Sokoto-Badagry artery, and rail network expansion.",
    description: "Accelerating capital engineering across multimodal corridors to connect agricultural hubs, deep sea ports, and manufacturing corridors.",
    keyObjectives: [
      "Construction of the 700km Lagos-Calabar Coastal Highway",
      "Revitalization of the 1,068km Sokoto-Badagry Superhighway corridor",
      "Standard gauge railway interconnectivity between major economic hubs"
    ],
    leadInstitutions: ["Federal Ministry of Works", "Federal Ministry of Transportation", "Federal Road Maintenance Agency", "Nigerian Railway Corporation"],
    achievementCount: 18,
    projectCount: 12,
    policyCount: 2,
    highlightStat: {
      label: "Highway Corridors Active",
      value: "2,400+ km",
      subtext: "Under simultaneous asphalt rehabilitation"
    },
    featuredAchievementSlug: "lagos-calabar-coastal-highway-section-1",
    isDemo: true
  },
  {
    id: "agriculture_food_security",
    sectorId: "agriculture_food_security",
    name: "Agriculture and Food Security",
    publicLabel: "Agriculture & Food Security",
    slug: "agriculture-food-security",
    parentPublicGroup: "economy",
    parentPublicGroupLabel: "Economy & Macro Reforms",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Wheat",
    summary: "Dry-season farming acceleration, strategic grain reserves release, mechanized equipment hubs, and fertilizer support.",
    description: "Declaring a national food security state of emergency to boost staple crop yields, establish green corridors, and stabilize household food inflation.",
    keyObjectives: [
      "Nationwide dry-season wheat, rice, and maize cultivation on 500,000 hectares",
      "Deployment of 2,000 modernized agricultural tractor units to farming clusters",
      "Release of 102,000 metric tonnes of grain from strategic reserves"
    ],
    leadInstitutions: ["Federal Ministry of Agriculture and Food Security", "Bank of Agriculture", "National Agricultural Land Development Authority"],
    achievementCount: 9,
    projectCount: 6,
    policyCount: 4,
    highlightStat: {
      label: "Dry-Season Cultivation Area",
      value: "250,000 Hectares",
      subtext: "Dedicated to high-yield wheat and staple grains"
    },
    featuredAchievementSlug: "national-dry-season-farming-initiative",
    isDemo: true
  },
  {
    id: "education_human_capital",
    sectorId: "education_human_capital",
    name: "Education and Human Capital",
    publicLabel: "Education & Human Capital",
    slug: "education-human-capital",
    parentPublicGroup: "social_services",
    parentPublicGroupLabel: "Social Investment & Capital",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "GraduationCap",
    summary: "National Student Financial Aid Scheme (NELFUND), institutional vocational modernization, and tertiary infrastructure grants.",
    description: "Ensuring zero tertiary student dropouts on financial grounds via interest-free student loans, upkeep stipends, and technical skills vouchers.",
    keyObjectives: [
      "Full digital rollout of interest-free loans and student stipends",
      "Upgrade of 100+ federal technical colleges and vocational centers",
      "Integration of digital literacy curriculum across basic education schools"
    ],
    leadInstitutions: ["Federal Ministry of Education", "National Student Financial Aid Scheme", "TETFund", "Universal Basic Education Commission"],
    achievementCount: 11,
    projectCount: 5,
    policyCount: 3,
    highlightStat: {
      label: "Verified Student Beneficiaries",
      value: "350,000+ Students",
      subtext: "Disbursed to accredited tertiary institutions"
    },
    featuredAchievementSlug: "nelfund-student-loan-disbursement",
    isDemo: true
  },
  {
    id: "healthcare_public_health",
    sectorId: "healthcare_public_health",
    name: "Healthcare and Public Health",
    publicLabel: "Healthcare & Public Health",
    slug: "healthcare-public-health",
    parentPublicGroup: "social_services",
    parentPublicGroupLabel: "Social Investment & Capital",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "HeartPulse",
    summary: "Primary healthcare center revitalization, Executive Order on local pharmaceutical manufacturing, and oncology diagnostic center upgrades.",
    description: "Unlocking the healthcare value chain, eliminating tariffs on active pharmaceutical ingredients, and revamping 8,800 primary health centers.",
    keyObjectives: [
      "Tariff and VAT exemption on imported pharmaceutical machinery and raw materials",
      "Revitalization and solar electrification of 8,800 primary health centers",
      "Expansion of the National Health Insurance Authority vulnerable fund"
    ],
    leadInstitutions: ["Federal Ministry of Health and Social Welfare", "National Primary Health Care Development Agency", "NHIA", "NAFDAC"],
    achievementCount: 8,
    projectCount: 7,
    policyCount: 3,
    highlightStat: {
      label: "Primary Health Centers Revitalized",
      value: "2,150 Centers",
      subtext: "Equipped with maternal and diagnostic equipment"
    },
    featuredAchievementSlug: "pharmaceutical-value-chain-executive-order",
    isDemo: true
  },
  {
    id: "social_protection_human_development",
    sectorId: "social_protection_human_development",
    name: "Social Protection and Human Development",
    publicLabel: "Social Protection & Welfare",
    slug: "social-protection-human-development",
    parentPublicGroup: "social_services",
    parentPublicGroupLabel: "Social Investment & Capital",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Users",
    summary: "National Social Safety Net Register restructuring, biometric cash transfers, CREDICORP consumer credit, and elderly welfare.",
    description: "Re-engineering social safety systems with BVN and NIN biometric validation to deliver direct cash transfers and consumer credit to verified households.",
    keyObjectives: [
      "Biometric validation of 15 Million vulnerable households on National Register",
      "Consumer Credit Corporation (CREDICORP) nationwide rollout for workers",
      "Targeted conditional cash transfers to poorest deciles"
    ],
    leadInstitutions: ["Federal Ministry of Humanitarian Affairs and Poverty Reduction", "CREDICORP", "National Social Safety-Nets Coordinating Office"],
    achievementCount: 10,
    projectCount: 3,
    policyCount: 4,
    highlightStat: {
      label: "Consumer Credit Disbursed",
      value: "₦100+ Billion",
      subtext: "Catalyzing working-class domestic asset acquisition"
    },
    featuredAchievementSlug: "credicorp-consumer-credit-rollout",
    isDemo: true
  },
  {
    id: "youth_employment_skills",
    sectorId: "youth_employment_skills",
    name: "Youth, Employment and Skills",
    publicLabel: "Youth, Employment & Skills",
    slug: "youth-employment-skills",
    parentPublicGroup: "social_services",
    parentPublicGroupLabel: "Social Investment & Capital",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Zap",
    summary: "3 Million Technical Talent (3MTT) scheme, National Youth Investment Fund recapitalization, and apprenticeship certifications.",
    description: "Building Nigeria's talent pipeline as a global net exporter of tech skills and powering youth micro-enterprises with matching capital grants.",
    keyObjectives: [
      "Training and placement of 3 million tech talents across 36 states and FCT",
      "₦110 Billion National Youth Investment Fund (NYIF) restructuring",
      "National Apprenticeship Scheme rollout across industrial clusters"
    ],
    leadInstitutions: ["Federal Ministry of Youth Development", "Federal Ministry of Communications, Innovation & Digital Economy", "ITF"],
    achievementCount: 7,
    projectCount: 4,
    policyCount: 2,
    highlightStat: {
      label: "3MTT Fellows in Training",
      value: "300,000 Cohort 1 & 2",
      subtext: "Equipped with AI, cloud, and engineering tracks"
    },
    featuredAchievementSlug: "3mtt-technical-talent-fellowship",
    isDemo: true
  },
  {
    id: "power_energy_natural_resources",
    sectorId: "power_energy_natural_resources",
    name: "Power, Energy and Natural Resources",
    publicLabel: "Power, Energy & Natural Resources",
    slug: "power-energy-natural-resources",
    parentPublicGroup: "economy",
    parentPublicGroupLabel: "Economy & Macro Reforms",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Flame",
    summary: "Electricity Act 2023 state power devolution, Presidential Metering Initiative, gas flare commercialization, and renewable solar minigrids.",
    description: "Decentralizing the national grid to empower States as sub-national electricity markets, closing the metering gap, and monetizing natural gas reserves.",
    keyObjectives: [
      "Implementation of Electricity Act 2023 enabling State Electricity Regulatory Commissions",
      "Deployment of 2 Million smart prepaid meters under Presidential Metering Initiative",
      "Presidential Compressed Natural Gas (PCNGi) transport conversion rollout"
    ],
    leadInstitutions: ["Federal Ministry of Power", "Federal Ministry of Petroleum Resources", "NERC", "Rural Electrification Agency", "PCNGi"],
    achievementCount: 15,
    projectCount: 8,
    policyCount: 5,
    highlightStat: {
      label: "States Granted Electricity Autonomy",
      value: "10+ States",
      subtext: "Regulating independent sub-national power markets"
    },
    featuredAchievementSlug: "electricity-act-state-devolution",
    isDemo: true
  },
  {
    id: "digital_economy_science_innovation",
    sectorId: "digital_economy_science_innovation",
    name: "Digital Economy, Science and Innovation",
    publicLabel: "Digital Economy & Innovation",
    slug: "digital-economy-science-innovation",
    parentPublicGroup: "economy",
    parentPublicGroupLabel: "Economy & Macro Reforms",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Cpu",
    summary: "National 90,000km Fiber-Optic Backbone SPV, Artificial Intelligence Strategy, Digital Public Infrastructure, and Start-up Act incentives.",
    description: "Deepening broadband penetration from coast to hinterland, scaling Nigeria's AI computing stack, and digitizing public identity systems.",
    keyObjectives: [
      "Deployment of 90,000 km national fiber-optic backbone through public-private SPV",
      "Establishment of the National Artificial Intelligence Research Scheme (NAIRS)",
      "Digitization of citizen public records and tax e-invoicing portals"
    ],
    leadInstitutions: ["Federal Ministry of Communications, Innovation and Digital Economy", "NITDA", "NCC", "Galaxy Backbone"],
    achievementCount: 9,
    projectCount: 5,
    policyCount: 3,
    highlightStat: {
      label: "Fiber-Optic Network Targeted",
      value: "90,000 km",
      subtext: "Bridging inland digital connectivity divides"
    },
    featuredAchievementSlug: "national-broadband-fiber-spv-deployment",
    isDemo: true
  },
  {
    id: "housing_urban_development",
    sectorId: "housing_urban_development",
    name: "Housing and Urban Development",
    publicLabel: "Housing & Urban Development",
    slug: "housing-urban-development",
    parentPublicGroup: "infrastructure",
    parentPublicGroupLabel: "Infrastructure & Urban Delivery",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Home",
    summary: "Renewed Hope Cities and Estates construction, mortgage refinance recapitalization, and urban slum regeneration.",
    description: "Constructing 50,000 affordable housing units across the 6 geopolitical zones and reforming land registry titles to unlock housing equity.",
    keyObjectives: [
      "Construction of Renewed Hope Cities (Karsana, Abuja, and 12 pilot states)",
      "Recapitalization of the Federal Mortgage Bank of Nigeria (FMBN)",
      "National Title Documentation and Urban Slum Renewal Scheme"
    ],
    leadInstitutions: ["Federal Ministry of Housing and Urban Development", "Federal Mortgage Bank of Nigeria", "Federal Housing Authority"],
    achievementCount: 6,
    projectCount: 6,
    policyCount: 2,
    highlightStat: {
      label: "Housing Units Under Construction",
      value: "10,000+ Units",
      subtext: "Across Phase 1 Renewed Hope Cities"
    },
    featuredAchievementSlug: "renewed-hope-cities-phase-1",
    isDemo: true
  },
  {
    id: "environment_climate",
    sectorId: "environment_climate",
    name: "Environment and Climate",
    publicLabel: "Environment & Climate",
    slug: "environment-climate",
    parentPublicGroup: "social_services",
    parentPublicGroupLabel: "Social Investment & Capital",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Trees",
    summary: "Great Green Wall desertification barrier, mangrove coastal restoration, carbon market framework, and flood mitigation channels.",
    description: "Mobilizing green climate finance, protecting agricultural belts from Sahelian encroaching dunes, and restoring Niger Delta coastal mangrove ecosystems.",
    keyObjectives: [
      "Restoration of 50,000 hectares along the Northern Great Green Wall corridor",
      "Operationalization of the Nigeria Carbon Market Activation Plan (NCMAP)",
      "Construction of regional flood diversion and drainage infrastructure"
    ],
    leadInstitutions: ["Federal Ministry of Environment", "National Council on Climate Change", "National Agency for the Great Green Wall"],
    achievementCount: 5,
    projectCount: 4,
    policyCount: 2,
    highlightStat: {
      label: "Hectares Restored Along Sahel",
      value: "35,000 Ha",
      subtext: "Shielding farming communities from desertification"
    },
    featuredAchievementSlug: "great-green-wall-ecosystem-restoration",
    isDemo: true
  },
  {
    id: "governance_public_service",
    sectorId: "governance_public_service",
    name: "Governance and Public Service",
    publicLabel: "Governance & Public Service",
    slug: "governance-public-service",
    parentPublicGroup: "governance",
    parentPublicGroupLabel: "Governance & Global Relations",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Landmark",
    summary: "Civil service payroll digitization, Oronsaye report restructuring, judicial salary review, and local government financial autonomy.",
    description: "Enforcing statutory financial autonomy for Nigeria's 774 Local Government Areas, digitizing civil service payrolls, and streamlining federal agencies.",
    keyObjectives: [
      "Supreme Court landmark judgment enforcing direct financial allocations to 774 LGAs",
      "Implementation of 300% salary and welfare increase for judicial officers",
      "Integration of AI audit tools to eliminate phantom workers from IPPIS"
    ],
    leadInstitutions: ["Office of the Head of the Civil Service of the Federation", "Federal Ministry of Justice", "National Judicial Council"],
    achievementCount: 7,
    projectCount: 2,
    policyCount: 5,
    highlightStat: {
      label: "LGAs With Direct Autonomy",
      value: "774 Councils",
      subtext: "Receiving unhindered direct statutory treasury allocations"
    },
    featuredAchievementSlug: "local-government-financial-autonomy",
    isDemo: true
  },
  {
    id: "foreign_affairs_international_cooperation",
    sectorId: "foreign_affairs_international_cooperation",
    name: "Foreign Affairs and International Cooperation",
    publicLabel: "Foreign Affairs & Global Trade",
    slug: "foreign-affairs-international-cooperation",
    parentPublicGroup: "governance",
    parentPublicGroupLabel: "Governance & Global Relations",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Globe",
    summary: "4D Foreign Policy doctrine (Democracy, Development, Demography, Diaspora), bilateral FDI pacts, and visa reciprocity agreements.",
    description: "Re-asserting Nigeria's strategic leadership in ECOWAS and the African Union while mobilizing foreign direct investment commitments across G20 partners.",
    keyObjectives: [
      "Operationalization of the 4D Foreign Policy Framework",
      "Securing over $30 Billion in multi-sector bilateral investment commitments",
      "Streamlined e-visa processing and enhanced consular assistance for the Diaspora"
    ],
    leadInstitutions: ["Ministry of Foreign Affairs", "Nigerian Investment Promotion Commission", "NiDCOM"],
    achievementCount: 6,
    projectCount: 1,
    policyCount: 3,
    highlightStat: {
      label: "Bilateral FDI Commitments Mobilized",
      value: "$30+ Billion",
      subtext: "From global investment summits across Asia, Europe & Americas"
    },
    featuredAchievementSlug: "4d-foreign-policy-and-fdi-mobilization",
    isDemo: true
  },
  {
    id: "culture_tourism_creative_economy",
    sectorId: "culture_tourism_creative_economy",
    name: "Culture, Tourism, Media and Creative Economy",
    publicLabel: "Creative Economy & Culture",
    slug: "culture-tourism-creative-economy",
    parentPublicGroup: "social_services",
    parentPublicGroupLabel: "Social Investment & Capital",
    hierarchyLevel: "LEVEL_2_SECTOR",
    iconName: "Music",
    summary: "Creative Economy Development Fund, intellectual property rights enforcement, National Arts Theatre renovation, and heritage preservation.",
    description: "Positioning Nollywood, Afrobeat, and Nigerian visual arts as major foreign exchange generators with creative credit facilities and modernized cultural venues.",
    keyObjectives: [
      "Completion and commissioning of the renovated National Theatre Complex in Lagos",
      "Establishment of the $617 Million Investment in Digital and Creative Enterprises (iDICE)",
      "Establishment of modern intellectual property registry to protect creative royalties"
    ],
    leadInstitutions: ["Federal Ministry of Art, Culture and the Creative Economy", "Federal Ministry of Tourism", "National Theatre Management"],
    achievementCount: 5,
    projectCount: 2,
    policyCount: 2,
    highlightStat: {
      label: "Creative Sector Catalytic Fund",
      value: "$617 Million",
      subtext: "Mobilized under iDICE for young creative entrepreneurs"
    },
    featuredAchievementSlug: "national-arts-theatre-restoration-and-idice",
    isDemo: true
  }
];

export const DEMO_ACHIEVEMENTS: AchievementViewModel[] = [
  {
    id: "ACH-DEMO-001",
    slug: "nelfund-student-loan-disbursement",
    title: "National Student Financial Aid Scheme (NELFUND) Operational Rollout",
    summary: "Establishment and full digital rollout of interest-free loans and monthly upkeep stipends to over 350,000 verified Nigerian students in public tertiary institutions.",
    description: "Following the enactment of the Student Loans (Access to Higher Education) Act 2024, the Federal Government institutionalized NELFUND as an autonomous statutory fund. The scheme features a 100% digital portal with BVN, NIN, and JAMB validation, ensuring direct tuition payments to accredited institutions and upkeep disbursements straight to student bank accounts.",
    publicNavigationGroup: "social_services",
    publicNavigationGroupLabel: "Social Investment & Capital",
    sectorId: "education_human_capital",
    sectorName: "Education and Human Capital",
    subsector: "student_loans_and_financial_aid",
    recordType: "achievement",
    recordTypeLabel: "High-Impact Achievement",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2024-05-24",
    datePrecision: "exact_day",
    leadMda: "National Student Financial Aid Scheme (NELFUND)",
    statesCovered: ["National", "All 36 States", "FCT"],
    geographicScope: "national",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "verified_administrative_disbursement",
    evidenceProfileLabel: "Verified Administrative Disbursement",
    financialMetrics: [
      {
        financialType: "funding_released",
        financialTypeLabel: "Funding Released",
        amount: 50000000000,
        currency: "NGN",
        formattedAmount: "₦50.00 Billion",
        reportingPeriod: "2024-Q3",
        aggregationBasis: "cumulative",
        nominalOrReal: "nominal",
        sourceInstitution: "Federal Ministry of Finance"
      }
    ],
    beneficiaryMetrics: [
      {
        stage: "disbursement_recipient",
        stageLabel: "Disbursement Recipient",
        count: 350000,
        formattedCount: "350,000 Students",
        beneficiaryType: "students",
        countBasis: "cumulative_to_date",
        reportingPeriod: "2024-Q3",
        doubleCountingNote: "Biometrically verified against unique NIN and BVN entries."
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-001",
        claimText: "President Bola Ahmed Tinubu signed the Student Loans (Access to Higher Education) Act into law on 3 April 2024, removing income restrictions and enabling direct institutional tuition payments.",
        claimType: "legal_status",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-001",
            title: "Student Loans (Access to Higher Education) Act 2024 Official Gazette",
            publisher: "Federal Republic of Nigeria Official Gazette",
            sourceLevel: "LEVEL_1",
            sourceRole: "primary",
            sourceRoleLabel: "Primary Statutory Instrument",
            sourceType: "gazette",
            documentNumber: "Vol. 111, No. 42",
            evidenceLocation: "Section 2(1) - 6(4)",
            publicationDate: "2024-04-03"
          }
        ]
      },
      {
        claimId: "CLM-DEMO-002",
        claimText: "Over ₦50 Billion in tuition and student upkeep stipends was disbursed across 120 federal and state tertiary institutions as of Q3 2024.",
        claimType: "financial_value",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "independently_corroborated",
        sources: [
          {
            sourceId: "SRC-DEMO-002",
            title: "NELFUND Quarterly Institutional Disbursement Report Q3 2024",
            publisher: "National Student Financial Aid Scheme",
            sourceLevel: "LEVEL_2",
            sourceRole: "official_statistical",
            sourceRoleLabel: "Official Administrative Data",
            sourceType: "statistical_bulletin",
            evidenceLocation: "Table 4.2 - Disbursement Summary",
            publicationDate: "2024-10-15"
          }
        ]
      }
    ],
    relatedPolicySlugs: ["student-loans-enactment-act-2024"],
    isDemo: true
  },
  {
    id: "ACH-DEMO-002",
    slug: "lagos-calabar-coastal-highway-section-1",
    title: "Lagos-Calabar Coastal Highway 700km Multi-Lane Corridors (Section 1)",
    summary: "Construction and rapid paving of the 47km Section 1 (Victoria Island to Lekki Deep Sea Port) featuring 10-lane concrete reinforced pavement.",
    description: "The 700-kilometer Lagos-Calabar Coastal Highway connects 9 coastal states from Lagos to Cross River. Section 1 utilizes continuously reinforced concrete pavement (CRCP) engineered for extreme heavy-duty logistics freight, connecting major maritime hubs with industrial processing corridors.",
    publicNavigationGroup: "infrastructure",
    publicNavigationGroupLabel: "Infrastructure & Urban Delivery",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    subsector: "highways_and_arterial_roads",
    recordType: "physical_project",
    recordTypeLabel: "Physical Infrastructure Project",
    status: "implementation_ongoing",
    statusLabel: "Ongoing Execution",
    statusCategory: "execution",
    date: "2024-03-01",
    datePrecision: "exact_day",
    leadMda: "Federal Ministry of Works",
    statesCovered: ["Lagos", "Ogun", "Ondo", "Edo", "Delta", "Bayelsa", "Rivers", "Akwa Ibom", "Cross River"],
    geographicScope: "corridor",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "direct_physical_delivery",
    evidenceProfileLabel: "Direct Physical Delivery",
    progressPercentage: 35.5,
    contractor: "Hitech Construction Company Ltd",
    financialMetrics: [
      {
        financialType: "approved_funding",
        financialTypeLabel: "Approved Funding",
        amount: 1060000000000,
        currency: "NGN",
        formattedAmount: "₦1.06 Trillion",
        reportingPeriod: "2024-Q1",
        aggregationBasis: "period",
        nominalOrReal: "nominal",
        sourceInstitution: "Federal Executive Council"
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-003",
        claimText: "Federal Executive Council approved the contract for the 47.47km Section 1 of the Lagos-Calabar Coastal Highway project in February 2024.",
        claimType: "policy_action",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-003",
            title: "Federal Executive Council Resolution on Coastal Highway Contract Award",
            publisher: "Cabinet Secretariat, State House Abuja",
            sourceLevel: "LEVEL_1",
            sourceRole: "primary",
            sourceRoleLabel: "Executive Council Resolution",
            sourceType: "gazette",
            publicationDate: "2024-02-27"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-003",
    slug: "fx-market-unification-single-window",
    title: "Foreign Exchange Market Unification & National Single Window System",
    summary: "Abolition of multiple exchange rate regimes, restoration of autonomous FX liquidity, and launch of the National Single Window portal for automated port clearance.",
    description: "The Central Bank of Nigeria unified disparate FX windows into the Nigerian Foreign Exchange Market (NFEM), eliminating arbitrage incentives and clearing a verified $7 Billion in inherited forward contract backlogs. Concurrently, the Presidential Steering Committee launched the National Single Window system, connecting customs, port authorities, and commercial banks to reduce port dwell times.",
    publicNavigationGroup: "economy",
    publicNavigationGroupLabel: "Economy & Macro Reforms",
    sectorId: "economy_fiscal_reforms",
    sectorName: "Economy and Fiscal Reforms",
    subsector: "monetary_and_exchange_rate_reforms",
    recordType: "reform",
    recordTypeLabel: "Structural Reform",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2023-06-14",
    datePrecision: "exact_day",
    leadMda: "Central Bank of Nigeria & Federal Ministry of Finance",
    statesCovered: ["National"],
    geographicScope: "national",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "independently_reported",
    verificationStatus: "independently_corroborated",
    publicationStatus: "published",
    evidenceProfile: "statistical_indicator_movement",
    evidenceProfileLabel: "Statistical Indicator Movement",
    financialMetrics: [
      {
        financialType: "revenue_generated",
        financialTypeLabel: "Cleared Backlog",
        amount: 7000000000,
        currency: "USD",
        formattedAmount: "$7.00 Billion",
        reportingPeriod: "2024-Q1",
        aggregationBasis: "cumulative",
        nominalOrReal: "nominal",
        sourceInstitution: "Central Bank of Nigeria"
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-004",
        claimText: "CBN Circular TED/FEM/PUB/FPC/001/007 formally abolished segmentation across the I&E window, re-introducing the 'willing buyer, willing seller' model.",
        claimType: "legal_status",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-004",
            title: "CBN Circular on Operational Changes to Foreign Exchange Market",
            publisher: "Central Bank of Nigeria",
            sourceLevel: "LEVEL_1",
            sourceRole: "primary",
            sourceRoleLabel: "Statutory Regulatory Circular",
            sourceType: "economic_report",
            documentNumber: "TED/FEM/PUB/FPC/001/007",
            publicationDate: "2023-06-14"
          },
          {
            sourceId: "SRC-DEMO-005",
            title: "IMF Nigeria Staff Concluding Statement of the 2024 Article IV Mission",
            publisher: "International Monetary Fund (IMF)",
            sourceLevel: "LEVEL_3",
            sourceRole: "independent_assessment",
            sourceRoleLabel: "Multilateral Independent Corroboration",
            sourceType: "multilateral_report",
            publicationDate: "2024-02-12"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-004",
    slug: "electricity-act-state-devolution",
    title: "Electricity Act 2023 Enforcement & State Power Autonomy Devolution",
    summary: "Enactment of the landmark Electricity Act 2023, decentralizing power generation and regulatory authority from federal exclusivity to State Governments.",
    description: "President Tinubu assented to the Electricity Act 2023 within weeks of inauguration, breaking the 60-year federal monopoly over power transmission and licensing. Over 10 state governments—including Lagos, Enugu, Ekiti, Ondo, and Oyo—have since established independent State Electricity Regulatory Commissions (SERCs) to manage intra-state power generation, distribution, and tariff regimes.",
    publicNavigationGroup: "economy",
    publicNavigationGroupLabel: "Economy & Macro Reforms",
    sectorId: "power_energy_natural_resources",
    sectorName: "Power, Energy and Natural Resources",
    subsector: "power_sector_reforms_and_grid_modernization",
    recordType: "legislation",
    recordTypeLabel: "Legislation / Statute",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2023-06-09",
    datePrecision: "exact_day",
    leadMda: "Nigerian Electricity Regulatory Commission (NERC)",
    statesCovered: ["Lagos", "Enugu", "Ekiti", "Ondo", "Oyo", "Imo", "Edo", "Kano", "Cross River"],
    geographicScope: "multi_state",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "statutory_legal_enactment",
    evidenceProfileLabel: "Statutory / Legal Enactment",
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-005",
        claimText: "Electricity Act 2023 (Act No. 22) repealed the Electric Power Sector Reform Act 2005, granting States statutory powers to issue generation and distribution licenses.",
        claimType: "legal_status",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-006",
            title: "Electricity Act 2023 Official Gazette",
            publisher: "Federal Republic of Nigeria Official Gazette",
            sourceLevel: "LEVEL_1",
            sourceRole: "primary",
            sourceRoleLabel: "Statute Act Gazette",
            sourceType: "act_statute",
            documentNumber: "Act No. 22 of 2023",
            publicationDate: "2023-06-09"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-005",
    slug: "local-government-financial-autonomy",
    title: "Supreme Court Landmark Judgment Enforcing 774 LGA Financial Autonomy",
    summary: "Constitutional litigation leading to the Supreme Court ruling that mandates direct treasury allocations to all 774 Local Government Areas, halting state joint accounts.",
    description: "The Federal Government, through the Attorney-General of the Federation, instituted landmark constitutional litigation against all 36 state governors to safeguard local government independence. In a unanimous verdict delivered on 11 July 2024, the Supreme Court held that state governments lack constitutional power to withhold or administer federation allocations belonging to democratically elected local government councils.",
    publicNavigationGroup: "governance",
    publicNavigationGroupLabel: "Governance & Global Relations",
    sectorId: "governance_public_service",
    sectorName: "Governance and Public Service",
    subsector: "constitutional_and_institutional_reforms",
    recordType: "executive_action",
    recordTypeLabel: "Executive Action & Judicial Milestone",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2024-07-11",
    datePrecision: "exact_day",
    leadMda: "Federal Ministry of Justice & Office of the Accountant-General",
    statesCovered: ["National", "All 774 LGAs"],
    geographicScope: "national",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "statutory_legal_enactment",
    evidenceProfileLabel: "Statutory / Legal Enactment",
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-006",
        claimText: "Supreme Court Suit SC/CV/343/2024 ordered the Accountant-General of the Federation to pay statutory revenues directly into council bank accounts.",
        claimType: "legal_status",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-007",
            title: "Supreme Court of Nigeria Judgment in AGF v. 36 State Governors (SC/CV/343/2024)",
            publisher: "Supreme Court of Nigeria",
            sourceLevel: "LEVEL_1",
            sourceRole: "primary",
            sourceRoleLabel: "Supreme Court Judgment",
            sourceType: "court_ruling",
            documentNumber: "SC/CV/343/2024",
            publicationDate: "2024-07-11"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-006",
    slug: "credicorp-consumer-credit-rollout",
    title: "Nigerian Consumer Credit Corporation (CREDICORP) Rollout",
    summary: "Establishment and operationalization of CREDICORP, disbursing low-interest consumer credit to over 100,000 civil servants and private sector workers.",
    description: "The Nigerian Consumer Credit Corporation was established with an initial ₦100 Billion catalytic capital injection to eliminate cash upfront purchasing constraints for working Nigerians. Working through commercial microfinance partners, CREDICORP provides credit guarantees and direct soft financing for solar home systems, vehicle conversions to CNG, and domestic manufacturing purchases.",
    publicNavigationGroup: "social_services",
    publicNavigationGroupLabel: "Social Investment & Capital",
    sectorId: "social_protection_human_development",
    sectorName: "Social Protection and Human Development",
    subsector: "consumer_credit_and_financial_inclusion",
    recordType: "programme",
    recordTypeLabel: "Social Intervention Scheme",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2024-04-24",
    datePrecision: "exact_day",
    leadMda: "Nigerian Consumer Credit Corporation (CREDICORP)",
    statesCovered: ["National"],
    geographicScope: "national",
    featured: false,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "verified_administrative_disbursement",
    evidenceProfileLabel: "Verified Administrative Disbursement",
    financialMetrics: [
      {
        financialType: "approved_funding",
        financialTypeLabel: "Approved Seed Capital",
        amount: 100000000000,
        currency: "NGN",
        formattedAmount: "₦100.00 Billion",
        reportingPeriod: "2024-Q2",
        aggregationBasis: "period",
        nominalOrReal: "nominal",
        sourceInstitution: "Federal Ministry of Finance"
      }
    ],
    beneficiaryMetrics: [
      {
        stage: "disbursement_recipient",
        stageLabel: "Active Credit Recipients",
        count: 100000,
        formattedCount: "100,000+ Workers",
        beneficiaryType: "individuals",
        countBasis: "cumulative_to_date",
        reportingPeriod: "2024-Q3"
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-007",
        claimText: "Presidential Directive established CREDICORP in April 2024, deploying initial tranches to civil servants through partner financial institutions.",
        claimType: "policy_action",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-008",
            title: "Presidential Statement on Consumer Credit Scheme Operational Launch",
            publisher: "State House Press Corps",
            sourceLevel: "LEVEL_5",
            sourceRole: "primary",
            sourceRoleLabel: "State House Release",
            sourceType: "state_house_release",
            publicationDate: "2024-04-24"
          }
        ]
      }
    ],
    isDemo: true
  }
];

export const DEMO_PROJECTS: ProjectViewModel[] = [
  {
    id: "PRJ-DEMO-001",
    slug: "lagos-calabar-coastal-highway-section-1",
    title: "Lagos-Calabar Coastal Superhighway (Section 1: 47.47km)",
    summary: "10-lane continuously reinforced concrete pavement highway linking Victoria Island, Lekki Free Trade Zone, and the deep sea corridor.",
    projectType: "highway_road",
    projectTypeLabel: "Highway & Arterial Road",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    executingAgency: "Federal Ministry of Works",
    status: "implementation_ongoing",
    statusLabel: "Ongoing Execution",
    progressPercentage: 35.5,
    contractor: "Hitech Construction Company Ltd",
    statesCovered: ["Lagos", "Ogun"],
    startDate: "2024-03-01",
    completionOrCurrentDate: "2025-12-31",
    datePrecision: "exact_day",
    contractValue: "₦1.06 Trillion",
    disbursedValue: "₦370 Billion",
    evidenceClaims: [],
    isDemo: true
  },
  {
    id: "PRJ-DEMO-002",
    slug: "sokoto-badagry-superhighway-phase-1",
    title: "Sokoto-Badagry 1,068km National Agricultural & Trade Artery (Phase 1)",
    summary: "1,068km trans-Saharan economic corridor connecting Sokoto, Kebbi, Niger, Kwara, Oyo, Ogun, and Lagos to accelerate agricultural export logistics.",
    projectType: "highway_road",
    projectTypeLabel: "Highway & Arterial Road",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    executingAgency: "Federal Ministry of Works",
    status: "implementation_planning",
    statusLabel: "Planning & Mobilization",
    progressPercentage: 12.0,
    contractor: "Hitech Construction Ltd & CCECC",
    statesCovered: ["Sokoto", "Kebbi", "Niger", "Kwara", "Oyo", "Ogun", "Lagos"],
    startDate: "2024-06-01",
    completionOrCurrentDate: "2027-05-29",
    datePrecision: "month",
    contractValue: "₦3.2 Trillion",
    evidenceClaims: [],
    isDemo: true
  },
  {
    id: "PRJ-DEMO-003",
    slug: "renewed-hope-cities-karsana-abuja",
    title: "Renewed Hope City Estate (Karsana, Abuja: 3,112 Units)",
    summary: "Integrated modern residential city comprising 1-3 bedroom apartments, duplexes, and townhouses with solar minigrid and green spaces.",
    projectType: "housing_estate",
    projectTypeLabel: "Housing Development & Estate",
    sectorId: "housing_urban_development",
    sectorName: "Housing and Urban Development",
    executingAgency: "Federal Ministry of Housing and Urban Development",
    status: "implementation_ongoing",
    statusLabel: "Ongoing Execution",
    progressPercentage: 48.0,
    contractor: "Renewed Hope Cities Consortium",
    statesCovered: ["FCT"],
    startDate: "2024-02-15",
    completionOrCurrentDate: "2025-06-30",
    datePrecision: "exact_day",
    contractValue: "₦260 Billion",
    evidenceClaims: [],
    isDemo: true
  },
  {
    id: "PRJ-DEMO-004",
    slug: "national-arts-theatre-renovation",
    title: "National Theatre Complex & Creative Cultural Hub Restoration",
    summary: "Full structural rehabilitation of the 5,000-seat main bowl, cinemas, exhibition pavilions, and creative incubator studios in Iganmu, Lagos.",
    projectType: "public_building",
    projectTypeLabel: "Public Civil Building & Heritage",
    sectorId: "culture_tourism_creative_economy",
    sectorName: "Culture, Tourism, Media and Creative Economy",
    executingAgency: "Federal Ministry of Art, Culture and the Creative Economy & Bankers Committee",
    status: "completed",
    statusLabel: "Completed",
    progressPercentage: 100.0,
    contractor: "Cappa & D'Alberto Plc",
    statesCovered: ["Lagos"],
    startDate: "2021-07-01",
    completionOrCurrentDate: "2024-08-15",
    datePrecision: "exact_day",
    contractValue: "₦45 Billion",
    evidenceClaims: [],
    isDemo: true
  }
];

export const DEMO_POLICIES: PolicyViewModel[] = [
  {
    id: "POL-DEMO-001",
    slug: "student-loans-enactment-act-2024",
    title: "Student Loans (Access to Higher Education) Act 2024",
    summary: "Repealed previous restrictive clauses to make tuition loans and upkeep stipends universally accessible to qualified Nigerian students.",
    policyType: "statutory_act",
    policyTypeLabel: "Statutory Act of National Assembly",
    sectorId: "education_human_capital",
    sectorName: "Education and Human Capital",
    leadMinistry: "Federal Ministry of Education",
    status: "enacted",
    statusLabel: "Enacted into Law",
    approvalDate: "2024-04-03",
    effectiveDate: "2024-04-03",
    gazetteNumber: "Vol. 111, No. 42",
    datePrecision: "exact_day",
    evidenceClaims: [],
    isDemo: true
  },
  {
    id: "POL-DEMO-002",
    slug: "pharmaceutical-value-chain-executive-order",
    title: "Executive Order on Local Pharmaceutical & Healthcare Manufacturing",
    summary: "Exempts zero-tariff active pharmaceutical ingredients (APIs), packaging, and medical machinery from VAT and customs import tariffs.",
    policyType: "executive_order",
    policyTypeLabel: "Presidential Executive Order",
    sectorId: "healthcare_public_health",
    sectorName: "Healthcare and Public Health",
    leadMinistry: "Federal Ministry of Health and Social Welfare",
    status: "effective",
    statusLabel: "In Force",
    approvalDate: "2024-06-28",
    effectiveDate: "2024-06-28",
    datePrecision: "exact_day",
    evidenceClaims: [],
    isDemo: true
  },
  {
    id: "POL-DEMO-003",
    slug: "electricity-act-2023",
    title: "Electricity Act 2023 (Power Devolution Statute)",
    summary: "Decentralized national power regulation and empowered all 36 States to license intra-state generation, distribution, and minigrid grids.",
    policyType: "statutory_act",
    policyTypeLabel: "Statutory Act of National Assembly",
    sectorId: "power_energy_natural_resources",
    sectorName: "Power, Energy and Natural Resources",
    leadMinistry: "Federal Ministry of Power",
    status: "effective",
    statusLabel: "In Force",
    approvalDate: "2023-06-09",
    effectiveDate: "2023-06-09",
    gazetteNumber: "Act No. 22 of 2023",
    datePrecision: "exact_day",
    evidenceClaims: [],
    isDemo: true
  }
];

export const DEMO_PROGRAMMES: ProgrammeViewModel[] = [
  {
    id: "PRG-DEMO-001",
    slug: "nelfund-student-aid-programme",
    title: "National Student Financial Aid Scheme (NELFUND)",
    summary: "Multi-year tertiary loan and stipend platform providing 100% digital student aid to university, polytechnic, and college students.",
    programmeType: "financial_credit",
    programmeTypeLabel: "Financial & Credit Scheme",
    sectorId: "education_human_capital",
    sectorName: "Education and Human Capital",
    coordinatingAgency: "National Student Financial Aid Scheme (NELFUND)",
    status: "operational",
    statusLabel: "Operational",
    launchDate: "2024-05-24",
    datePrecision: "exact_day",
    targetBeneficiaryType: "students",
    targetBeneficiaryTypeLabel: "Tertiary Students",
    beneficiaryCountFormatted: "350,000+ Students",
    statesCovered: ["National"],
    evidenceClaims: [],
    isDemo: true
  },
  {
    id: "PRG-DEMO-002",
    slug: "3mtt-technical-talent-fellowship",
    title: "3 Million Technical Talent (3MTT) Fellowship",
    summary: "Nationwide capacity accelerator placing Nigerian youth into funded software, cloud, data, AI, and cybersecurity training cohorts.",
    programmeType: "youth_employment",
    programmeTypeLabel: "Youth Employment & Skills Scheme",
    sectorId: "youth_employment_skills",
    sectorName: "Youth, Employment and Skills",
    coordinatingAgency: "Federal Ministry of Communications, Innovation & Digital Economy",
    status: "operational",
    statusLabel: "Operational",
    launchDate: "2023-11-01",
    datePrecision: "exact_day",
    targetBeneficiaryType: "students",
    targetBeneficiaryTypeLabel: "Tech Fellows & Trainees",
    beneficiaryCountFormatted: "300,000 Cohort 1 & 2 Fellows",
    statesCovered: ["National", "All 36 States", "FCT"],
    evidenceClaims: [],
    isDemo: true
  }
];

export const DEMO_TIMELINE_EVENTS: TimelineEventViewModel[] = [
  {
    id: "TLE-DEMO-001",
    recordId: "ACH-DEMO-004",
    title: "President Assents to the Landmark Electricity Act 2023",
    summary: "President Tinubu signed the Electricity Act 2023 into law, empowering states to establish independent power regulatory commissions.",
    eventType: "enactment",
    eventTypeLabel: "Legislative Enactment",
    eventDate: "2023-06-09",
    datePrecision: "exact_day",
    sectorId: "power_energy_natural_resources",
    sectorName: "Power, Energy and Natural Resources",
    leadActor: "President Bola Ahmed Tinubu",
    sourceCitation: {
      sourceId: "SRC-DEMO-006",
      title: "Electricity Act 2023 Official Gazette",
      publisher: "Federal Republic of Nigeria Official Gazette",
      sourceLevel: "LEVEL_1",
      sourceRole: "primary",
      sourceRoleLabel: "Statute Act Gazette",
      sourceType: "act_statute"
    },
    isDemo: true
  },
  {
    id: "TLE-DEMO-002",
    recordId: "ACH-DEMO-003",
    title: "Central Bank Formally Unifies Multiple Official FX Regimes",
    summary: "Operational guidance collapsed official windows into the autonomous market, clearing billions in inherited forward backlogs.",
    eventType: "operation",
    eventTypeLabel: "Operational Reform",
    eventDate: "2023-06-14",
    datePrecision: "exact_day",
    sectorId: "economy_fiscal_reforms",
    sectorName: "Economy and Fiscal Reforms",
    leadActor: "Central Bank of Nigeria",
    sourceCitation: {
      sourceId: "SRC-DEMO-004",
      title: "CBN FX Market Operational Guidelines Circular",
      publisher: "Central Bank of Nigeria",
      sourceLevel: "LEVEL_1",
      sourceRole: "primary",
      sourceRoleLabel: "Statutory Regulatory Circular",
      sourceType: "economic_report"
    },
    isDemo: true
  },
  {
    id: "TLE-DEMO-003",
    recordId: "ACH-DEMO-002",
    title: "FEC Approves 700km Lagos-Calabar Coastal Highway Corridor",
    summary: "Federal Executive Council sanctioned the award of Section 1 construction linking Victoria Island to the Lekki Deep Sea Port.",
    eventType: "approval",
    eventTypeLabel: "FEC Approval",
    eventDate: "2024-02-27",
    datePrecision: "exact_day",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    leadActor: "Federal Executive Council",
    isDemo: true
  },
  {
    id: "TLE-DEMO-004",
    recordId: "ACH-DEMO-001",
    title: "President Signs Student Loans (Access to Higher Education) Act 2024",
    summary: "Landmark enactment establishing NELFUND with sustainable funding envelopes and zero-interest terms for tertiary students.",
    eventType: "enactment",
    eventTypeLabel: "Legislative Enactment",
    eventDate: "2024-04-03",
    datePrecision: "exact_day",
    sectorId: "education_human_capital",
    sectorName: "Education and Human Capital",
    leadActor: "President Bola Ahmed Tinubu",
    isDemo: true
  },
  {
    id: "TLE-DEMO-005",
    recordId: "ACH-DEMO-001",
    title: "NELFUND Opens Student Loan Application Portal for 100+ Institutions",
    summary: "Over 350,000 applications processed in the first 90 days with automated institutional tuition disbursements.",
    eventType: "operation",
    eventTypeLabel: "Public Service Launch",
    eventDate: "2024-05-24",
    datePrecision: "exact_day",
    sectorId: "education_human_capital",
    sectorName: "Education and Human Capital",
    leadActor: "NELFUND Executive Management",
    isDemo: true
  },
  {
    id: "TLE-DEMO-006",
    recordId: "ACH-DEMO-005",
    title: "Supreme Court Renders Landmark Verdict on 774 LGA Financial Autonomy",
    summary: "The apex court unanimously ruled that state governments cannot withhold statutory federation revenues belonging to local councils.",
    eventType: "outcome_report",
    eventTypeLabel: "Judicial Landmark",
    eventDate: "2024-07-11",
    datePrecision: "exact_day",
    sectorId: "governance_public_service",
    sectorName: "Governance and Public Service",
    leadActor: "Supreme Court of Nigeria",
    isDemo: true
  }
];

export const DEMO_NIGERIA_STATES: StateProfileViewModel[] = [
  { slug: "abia", name: "Abia", code: "AB", capital: "Umuahia", geopoliticalZone: "South East", projectCount: 6, programmeCount: 4, achievementCount: 5, highlightProject: "Enugu-Port Harcourt Expressway Rehabilitation (Lokpanta-Aba)", sectorsActive: ["Infrastructure", "Trade", "Power"], isDemo: true },
  { slug: "adamawa", name: "Adamawa", code: "AD", capital: "Yola", geopoliticalZone: "North East", projectCount: 5, programmeCount: 5, achievementCount: 4, highlightProject: "Mayo Belwa-Jada-Ganye Road Corridor & Dry Season Grain Hubs", sectorsActive: ["Agriculture", "Security", "Transport"], isDemo: true },
  { slug: "akwa-ibom", name: "Akwa Ibom", code: "AK", capital: "Uyo", geopoliticalZone: "South South", projectCount: 8, programmeCount: 6, achievementCount: 7, highlightProject: "Lagos-Calabar Coastal Highway (Section 3) & Ibom Deep Sea Rail Link", sectorsActive: ["Infrastructure", "Petroleum", "Marine"], isDemo: true },
  { slug: "anambra", name: "Anambra", code: "AN", capital: "Awka", geopoliticalZone: "South East", projectCount: 7, programmeCount: 5, achievementCount: 6, highlightProject: "Second Niger Bridge Access Roads & Industrial Gas Pipeline Spur", sectorsActive: ["Industry", "Infrastructure", "Commerce"], isDemo: true },
  { slug: "bauchi", name: "Bauchi", code: "BA", capital: "Bauchi", geopoliticalZone: "North East", projectCount: 5, programmeCount: 4, achievementCount: 4, highlightProject: "Kolmani River Oilfield Development & Bauchi-Gombe Solar Grid", sectorsActive: ["Energy", "Agriculture", "Education"], isDemo: true },
  { slug: "bayelsa", name: "Bayelsa", code: "BY", capital: "Yenagoa", geopoliticalZone: "South South", projectCount: 6, programmeCount: 4, achievementCount: 5, highlightProject: "Nembe-Brass Road Infrastructure & Coastal Mangrove Protection", sectorsActive: ["Marine", "Environment", "Power"], isDemo: true },
  { slug: "benue", name: "Benue", code: "BE", capital: "Makurdi", geopoliticalZone: "North Central", projectCount: 6, programmeCount: 6, achievementCount: 5, highlightProject: "National Food Security Grain Silos Expansion & Makurdi River Port", sectorsActive: ["Agriculture", "Transport", "Health"], isDemo: true },
  { slug: "borno", name: "Borno", code: "BO", capital: "Maiduguri", geopoliticalZone: "North East", projectCount: 9, programmeCount: 7, achievementCount: 8, highlightProject: "Maiduguri Emergency Power Plant 50MW & Displaced Community Resettlement", sectorsActive: ["Security", "Power", "Humanitarian"], isDemo: true },
  { slug: "cross-river", name: "Cross River", code: "CR", capital: "Calabar", geopoliticalZone: "South South", projectCount: 7, programmeCount: 5, achievementCount: 6, highlightProject: "Lagos-Calabar Coastal Highway Terminal Hub & Calabar Port Dredging", sectorsActive: ["Infrastructure", "Tourism", "Forestry"], isDemo: true },
  { slug: "delta", name: "Delta", code: "DE", capital: "Asaba", geopoliticalZone: "South South", projectCount: 8, programmeCount: 5, achievementCount: 7, highlightProject: "Warri Port Modernization & Escravos Gas Commercialization Facility", sectorsActive: ["Petroleum", "Maritime", "Infrastructure"], isDemo: true },
  { slug: "ebonyi", name: "Ebonyi", code: "EB", capital: "Abakaliki", geopoliticalZone: "South East", projectCount: 5, programmeCount: 4, achievementCount: 4, highlightProject: "Abakaliki-Afikpo Highway Rehabilitation & National Rice Processing Hub", sectorsActive: ["Agriculture", "Works", "Education"], isDemo: true },
  { slug: "edo", name: "Edo", code: "ED", capital: "Benin City", geopoliticalZone: "South South", projectCount: 7, programmeCount: 6, achievementCount: 6, highlightProject: "Benin-Auchi-Okene Dual Carriage Modernization & Modular Refinery Expansions", sectorsActive: ["Power", "Transport", "Creative"], isDemo: true },
  { slug: "ekiti", name: "Ekiti", code: "EK", capital: "Ado Ekiti", geopoliticalZone: "South West", projectCount: 5, programmeCount: 5, achievementCount: 4, highlightProject: "Ekiti Knowledge Zone Broadband Ring & State Power Regulatory Devolution", sectorsActive: ["Innovation", "Power", "Agriculture"], isDemo: true },
  { slug: "enugu", name: "Enugu", code: "EN", capital: "Enugu", geopoliticalZone: "South East", projectCount: 8, programmeCount: 6, achievementCount: 7, highlightProject: "Enugu State Independent Power Market & Akanu Ibiam Cargo Terminal Upgrade", sectorsActive: ["Aviation", "Power", "Education"], isDemo: true },
  { slug: "fct", name: "Federal Capital Territory", code: "FC", capital: "Abuja", geopoliticalZone: "North Central", projectCount: 16, programmeCount: 10, achievementCount: 14, highlightProject: "Abuja Light Rail Metro Commercial Operation & Karsana Renewed Hope City", sectorsActive: ["Infrastructure", "Housing", "Urban Transport", "Digital"], isDemo: true },
  { slug: "gombe", name: "Gombe", code: "GO", capital: "Gombe", geopoliticalZone: "North East", projectCount: 5, programmeCount: 5, achievementCount: 4, highlightProject: "Dadinkowa Dam Hydro Infrastructure & Northeast Regional Industrial Park", sectorsActive: ["Energy", "Industry", "Agriculture"], isDemo: true },
  { slug: "imo", name: "Imo", code: "IM", capital: "Owerri", geopoliticalZone: "South East", projectCount: 6, programmeCount: 5, achievementCount: 5, highlightProject: "Owerri-Aba Dualized Corridor & State Electricity Commission Operationalization", sectorsActive: ["Infrastructure", "Power", "Commerce"], isDemo: true },
  { slug: "jigawa", name: "Jigawa", code: "JI", capital: "Dutse", geopoliticalZone: "North West", projectCount: 6, programmeCount: 5, achievementCount: 5, highlightProject: "Hadejia Valley Dry Season Wheat Cultivation & Solar Minigrid Electrification", sectorsActive: ["Agriculture", "Renewable Energy", "Health"], isDemo: true },
  { slug: "kaduna", name: "Kaduna", code: "KD", capital: "Kaduna", geopoliticalZone: "North West", projectCount: 10, programmeCount: 7, achievementCount: 8, highlightProject: "Abuja-Kaduna-Kano Highway Reconstruction & 3MTT Regional Tech Hub", sectorsActive: ["Transport", "Defense", "Digital Economy"], isDemo: true },
  { slug: "kano", name: "Kano", code: "KN", capital: "Kano", geopoliticalZone: "North West", projectCount: 12, programmeCount: 8, achievementCount: 10, highlightProject: "Kano-Maradi Rail Link Construction & Dala Inland Dry Port Freight Hub", sectorsActive: ["Transport", "Commerce", "Agriculture"], isDemo: true },
  { slug: "katsina", name: "Katsina", code: "KT", capital: "Katsina", geopoliticalZone: "North West", projectCount: 7, programmeCount: 5, achievementCount: 5, highlightProject: "Kano-Katsina Dual Carriageway & Border Surveillance Security Post", sectorsActive: ["Security", "Works", "Agriculture"], isDemo: true },
  { slug: "kebbi", name: "Kebbi", code: "KB", capital: "Birnin Kebbi", geopoliticalZone: "North West", projectCount: 6, programmeCount: 6, achievementCount: 5, highlightProject: "Sokoto-Badagry Highway Section & Large Scale Solar Irrigation Rice Hubs", sectorsActive: ["Agriculture", "Transport", "Energy"], isDemo: true },
  { slug: "kogi", name: "Kogi", code: "KG", capital: "Lokoja", geopoliticalZone: "North Central", projectCount: 7, programmeCount: 5, achievementCount: 6, highlightProject: "Ajaokuta Steel Re-Engineering Roadmap & Lokoja Inland Waterways Pier", sectorsActive: ["Solid Minerals", "Transport", "Steel"], isDemo: true },
  { slug: "kwara", name: "Kwara", code: "KW", capital: "Ilorin", geopoliticalZone: "North Central", projectCount: 6, programmeCount: 5, achievementCount: 5, highlightProject: "Ilorin-Jebba-Mokwa Freight Corridor & Livestock Transformation Center", sectorsActive: ["Agriculture", "Education", "Works"], isDemo: true },
  { slug: "lagos", name: "Lagos", code: "LA", capital: "Ikeja", geopoliticalZone: "South West", projectCount: 22, programmeCount: 12, achievementCount: 18, highlightProject: "Lagos-Calabar Coastal Highway 700km Section 1 & National Theatre Creative City", sectorsActive: ["Transport", "Finance", "Creative Economy", "Digital"], isDemo: true },
  { slug: "nasarawa", name: "Nasarawa", code: "NA", capital: "Lafia", geopoliticalZone: "North Central", projectCount: 5, programmeCount: 4, achievementCount: 4, highlightProject: "Lithium Processing Megaplant (Endo) & Lafia-Abuja Transit Bypass", sectorsActive: ["Solid Minerals", "Energy", "Agriculture"], isDemo: true },
  { slug: "niger", name: "Niger", code: "NI", capital: "Minna", geopoliticalZone: "North Central", projectCount: 8, programmeCount: 6, achievementCount: 7, highlightProject: "Zungeru 700MW Hydroelectric Plant Operational Handover & Agro-Mechanization Fleet", sectorsActive: ["Power", "Agriculture", "Transport"], isDemo: true },
  { slug: "ogun", name: "Ogun", code: "OG", capital: "Abeokuta", geopoliticalZone: "South West", projectCount: 9, programmeCount: 6, achievementCount: 7, highlightProject: "Lagos-Ibadan Expressway Modernization Finishing & Gateway Agro-Cargo Airport Rail Spur", sectorsActive: ["Manufacturing", "Aviation", "Works"], isDemo: true },
  { slug: "ondo", name: "Ondo", code: "ON", capital: "Akure", geopoliticalZone: "South West", projectCount: 6, programmeCount: 5, achievementCount: 5, highlightProject: "Port Ondo Deep Sea Harbor Approvals & Bitumen Extraction Concessions", sectorsActive: ["Solid Minerals", "Marine", "Power"], isDemo: true },
  { slug: "osun", name: "Osun", code: "OS", capital: "Osogbo", geopoliticalZone: "South West", projectCount: 5, programmeCount: 5, achievementCount: 4, highlightProject: "Osogbo Transmission Substation Upgrade & Primary Healthcare Revamp", sectorsActive: ["Health", "Power", "Culture"], isDemo: true },
  { slug: "oyo", name: "Oyo", code: "OY", capital: "Ibadan", geopoliticalZone: "South West", projectCount: 8, programmeCount: 6, achievementCount: 6, highlightProject: "Ibadan-Ilorin Dual Carriageway Completion & Oyo State Electricity Regulatory Autonomy", sectorsActive: ["Transport", "Power", "Education"], isDemo: true },
  { slug: "plateau", name: "Plateau", code: "PL", capital: "Jos", geopoliticalZone: "North Central", projectCount: 6, programmeCount: 5, achievementCount: 5, highlightProject: "Jos-Akwanga Highway Overhaul & Potato Value Chain Processing Hub", sectorsActive: ["Agriculture", "Tourism", "Security"], isDemo: true },
  { slug: "rivers", name: "Rivers", code: "RI", capital: "Port Harcourt", geopoliticalZone: "South South", projectCount: 11, programmeCount: 7, achievementCount: 9, highlightProject: "Port Harcourt Refinery Revamped Operations & Eastern Railway Corridor Modernization", sectorsActive: ["Petroleum", "Rail", "Infrastructure"], isDemo: true },
  { slug: "sokoto", name: "Sokoto", code: "SO", capital: "Sokoto", geopoliticalZone: "North West", projectCount: 6, programmeCount: 5, achievementCount: 5, highlightProject: "Sokoto-Badagry Highway Starting Superhub & Goronyo Dam Solar Water Channel", sectorsActive: ["Transport", "Water", "Security"], isDemo: true },
  { slug: "taraba", name: "Taraba", code: "TA", capital: "Jalingo", geopoliticalZone: "North East", projectCount: 5, programmeCount: 4, achievementCount: 4, highlightProject: "Mambilla Power Corridor Access Infrastructure & High-Plateau Tea Farming Expansion", sectorsActive: ["Agriculture", "Power", "Environment"], isDemo: true },
  { slug: "yobe", name: "Yobe", code: "YO", capital: "Damaturu", geopoliticalZone: "North East", projectCount: 5, programmeCount: 5, achievementCount: 4, highlightProject: "Great Green Wall Shelterbelt Tree Planting & Potiskum Truck Transit Park", sectorsActive: ["Environment", "Transport", "Security"], isDemo: true },
  { slug: "zamfara", name: "Zamfara", code: "ZA", capital: "Gusau", geopoliticalZone: "North West", projectCount: 6, programmeCount: 4, achievementCount: 4, highlightProject: "Anti-Banditry Tactical Drone Operation Centers & Clean Gold Mining Reform Initiative", sectorsActive: ["Security", "Solid Minerals", "Agriculture"], isDemo: true }
];

export const DEMO_DATASETS: DatasetResourceViewModel[] = [
  {
    id: "DS-DEMO-001",
    title: "Master Public Achievements & Initiatives Registry",
    description: "Complete structured dataset of all documented achievements, capital projects, structural reforms, and social programmes under the administration (29 May 2023 – August 2026).",
    category: "core",
    recordCount: 142,
    periodCovered: "May 2023 — August 2026",
    lastUpdated: "2026-08-15",
    fileFormats: ["CSV", "JSON", "PDF"],
    isDemo: true
  },
  {
    id: "DS-DEMO-002",
    title: "National Capital Infrastructure & Highway Corridors Dataset",
    description: "Detailed inventory of road, rail, power, and civil engineering projects including contractors, progress percentages, contract values, and location coordinates.",
    category: "sector",
    recordCount: 54,
    periodCovered: "May 2023 — August 2026",
    lastUpdated: "2026-08-15",
    fileFormats: ["CSV", "JSON"],
    isDemo: true
  },
  {
    id: "DS-DEMO-003",
    title: "National Administration Chronological Milestone Timeline",
    description: "Full chronological event stream linking executive policy announcements, FEC approvals, legislative enactments, and verified outcome observation reports.",
    category: "timeline",
    recordCount: 88,
    periodCovered: "May 2023 — August 2026",
    lastUpdated: "2026-08-15",
    fileFormats: ["CSV", "JSON", "TXT"],
    isDemo: true
  },
  {
    id: "DS-DEMO-004",
    title: "36 States & FCT Sub-National Federal Impact Dataset",
    description: "State-by-state matrix mapping federal capital investments, active MDAs, social protection rollouts, and infrastructure projects across all 6 geopolitical zones.",
    category: "state",
    recordCount: 37,
    periodCovered: "May 2023 — August 2026",
    lastUpdated: "2026-08-15",
    fileFormats: ["CSV", "JSON"],
    isDemo: true
  },
  {
    id: "DS-DEMO-005",
    title: "Six-Tier Primary Sources & Evidence Bibliography Index",
    description: "Comprehensive citation directory cataloguing Official Gazettes, Acts of National Assembly, NBS Statistical Bulletins, CBN Reports, and Multilateral Audits.",
    category: "evidence",
    recordCount: 210,
    periodCovered: "May 2023 — August 2026",
    lastUpdated: "2026-08-15",
    fileFormats: ["CSV", "JSON", "PDF"],
    isDemo: true
  }
];
