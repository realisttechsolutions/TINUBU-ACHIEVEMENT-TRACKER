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
      label: "Non-Oil Revenue Mobilization",
      value: "₦19.8 Trillion",
      subtext: "Automated tax compliance & historic collection record"
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
      "Securing multi-sector bilateral investment pacts across international partners",
      "Streamlined e-visa processing and enhanced consular assistance for the Diaspora"
    ],
    leadInstitutions: ["Ministry of Foreign Affairs", "Nigerian Investment Promotion Commission", "NiDCOM"],
    achievementCount: 6,
    projectCount: 1,
    policyCount: 3,
    highlightStat: {
      label: "Bilateral FDI Frameworks",
      value: "24 Bilateral Pacts",
      subtext: "Investment frameworks established across global economic summits"
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
      "Operationalization of the Investment in Digital and Creative Enterprises (iDICE) programme",
      "Establishment of modern intellectual property registry to protect creative royalties"
    ],
    leadInstitutions: ["Federal Ministry of Art, Culture and the Creative Economy", "Federal Ministry of Tourism", "National Theatre Management"],
    achievementCount: 5,
    projectCount: 2,
    policyCount: 2,
    highlightStat: {
      label: "Creative Sector Catalytic Fund",
      value: "₦950+ Billion (iDICE)",
      subtext: "Federal & multilateral seed funding for creative enterprises"
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
        amount: "50000000000.0000",
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
        amount: "1060000000000.0000",
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
    description: "The Central Bank of Nigeria unified disparate FX windows into the Nigerian Foreign Exchange Market (NFEM), eliminating arbitrage incentives and clearing 100% of verified inherited forward contract backlogs. Concurrently, the Presidential Steering Committee launched the National Single Window system, connecting customs, port authorities, and commercial banks to reduce port dwell times.",
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
        amount: "7000000000.0000",
        currency: "USD",
        formattedAmount: "100% Cleared",
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
        amount: "100000000000.0000",
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
  },
  {
    id: "ACH-DEMO-007",
    slug: "tudun-biri-community-resettlement",
    title: "Tudun Biri Community Rebuilding and Housing Resettlement Scheme",
    summary: "Reconstruction of 120 residential units, solar electrification, clinic, and community school for Tudun Biri victims in Igabi LGA, Kaduna State.",
    description: "Following the December 2023 incident, the Federal Government in partnership with the Kaduna State Government launched the comprehensive rebuilding of Tudun Biri community in Igabi Local Government Area. The project delivers permanent brick housing units, solar-powered boreholes, an internal access road network, a primary health clinic, and a basic education school complex.",
    publicNavigationGroup: "infrastructure",
    publicNavigationGroupLabel: "Infrastructure & Urban Delivery",
    sectorId: "housing_urban_development",
    sectorName: "Housing and Urban Development",
    subsector: "community_resettlement_and_shelter",
    recordType: "physical_project",
    recordTypeLabel: "Physical Infrastructure Project",
    status: "implementation_ongoing",
    statusLabel: "Ongoing Execution",
    statusCategory: "execution",
    date: "2024-03-15",
    datePrecision: "exact_day",
    leadMda: "Federal Ministry of Housing and Urban Development",
    statesCovered: ["Kaduna"],
    geographicScope: "state_specific",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "direct_physical_delivery",
    evidenceProfileLabel: "Direct Physical Delivery",
    progressPercentage: 68.0,
    financialMetrics: [
      {
        financialType: "approved_funding",
        financialTypeLabel: "Federal Resettlement Fund",
        amount: "3500000000.0000",
        currency: "NGN",
        formattedAmount: "₦3.50 Billion",
        reportingPeriod: "2024-Q1",
        aggregationBasis: "cumulative",
        nominalOrReal: "nominal",
        sourceInstitution: "Federal Ministry of Housing and Urban Development"
      }
    ],
    beneficiaryMetrics: [
      {
        stage: "resettlement_recipient",
        stageLabel: "Resettled Community Members",
        count: 1200,
        formattedCount: "1,200 Residents",
        beneficiaryType: "households",
        countBasis: "cumulative_to_date",
        reportingPeriod: "2024-Q3"
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-008",
        claimText: "Federal Government mobilized contractors for the construction of 120 residential units, clinic, and primary school in Tudun Biri, Kaduna State.",
        claimType: "physical_asset_count",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-009",
            title: "Federal Ministry of Housing Tudun Biri Resettlement Progress Inspection",
            publisher: "Federal Ministry of Housing and Urban Development",
            sourceLevel: "LEVEL_2",
            sourceRole: "official_administrative",
            sourceRoleLabel: "Official Inspection Report",
            sourceType: "inspection_report",
            publicationDate: "2024-05-18"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-008",
    slug: "abuja-light-rail-commercial-operation",
    title: "Abuja Light Rail Commercial Revitalization and Free Transit Scheme",
    summary: "Rehabilitation, access road construction, and full commercial commissioning of the 12-station Abuja Light Rail metro line.",
    description: "The Federal Capital Territory Administration completed the total technical rehabilitation of the 26.5km Abuja Light Rail network (Lot 1B and Lot 2). The system integrates direct rail connection between the Abuja Metro Central Business District and Nnamdi Azikiwe International Airport, supported by feeder access roads and modernized signaling infrastructure.",
    publicNavigationGroup: "infrastructure",
    publicNavigationGroupLabel: "Infrastructure & Urban Delivery",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    subsector: "urban_rail_mass_transit",
    recordType: "physical_project",
    recordTypeLabel: "Physical Infrastructure Project",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2024-05-29",
    datePrecision: "exact_day",
    leadMda: "Federal Capital Territory Administration (FCTA)",
    statesCovered: ["FCT", "Abuja"],
    geographicScope: "fct_specific",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "direct_physical_delivery",
    evidenceProfileLabel: "Direct Physical Delivery",
    progressPercentage: 100.0,
    contractor: "China Civil Engineering Construction Corporation (CCECC)",
    financialMetrics: [
      {
        financialType: "funding_released",
        financialTypeLabel: "Access Roads & Revitalization Capital",
        amount: "21400000000.0000",
        currency: "NGN",
        formattedAmount: "₦21.40 Billion",
        reportingPeriod: "2024-Q2",
        aggregationBasis: "cumulative",
        nominalOrReal: "nominal",
        sourceInstitution: "Federal Capital Territory Administration"
      }
    ],
    beneficiaryMetrics: [
      {
        stage: "daily_commuters",
        stageLabel: "Daily Rail Commuters",
        count: 45000,
        formattedCount: "45,000+ Daily Commuters",
        beneficiaryType: "commuters",
        countBasis: "cumulative_to_date",
        reportingPeriod: "2024-Q3"
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-009",
        claimText: "President Tinubu commissioned the revitalized Abuja Light Rail commercial operation on May 29, 2024, providing free passenger transit across all 12 operational stations.",
        claimType: "operational_status",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-010",
            title: "FCTA Commercial Rail Operations Launch Bulletin",
            publisher: "Federal Capital Territory Administration",
            sourceLevel: "LEVEL_1",
            sourceRole: "primary",
            sourceRoleLabel: "Official Administrative Record",
            sourceType: "gazette",
            publicationDate: "2024-05-29"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-009",
    slug: "pharmaceutical-value-chain-executive-order",
    title: "Zero Tariffs on Active Pharmaceutical Ingredients (Executive Order 40)",
    summary: "Suspension of import duties, VAT, and excise levies on critical raw materials and machinery for domestic drug and medical diagnostic manufacturing.",
    description: "Executive Order 40 establishes a zero-tariff regime on essential raw materials, active pharmaceutical ingredients (APIs), packaging equipment, and medical devices. The policy aims to curtail runaway medicine inflation, incentivize local formulation factories, and lower retail prices of essential antibiotics, antihypertensives, and antimalarials.",
    publicNavigationGroup: "economy",
    publicNavigationGroupLabel: "Economic Transformation",
    sectorId: "healthcare_social_welfare",
    sectorName: "Healthcare and Social Welfare",
    subsector: "pharmaceutical_manufacturing",
    recordType: "policy_reform",
    recordTypeLabel: "Executive Order & Policy Reform",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2024-06-28",
    datePrecision: "exact_day",
    leadMda: "Federal Ministry of Health and Social Welfare",
    statesCovered: ["National", "All 36 States", "FCT"],
    geographicScope: "national",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "statutory_legal_enactment",
    evidenceProfileLabel: "Statutory Executive Order",
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-010",
        claimText: "President Tinubu signed Executive Order 40 introducing zero tariffs, zero VAT, and customs duty exemptions on pharmaceutical raw materials and specialized manufacturing machinery.",
        claimType: "legal_status",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-011",
            title: "Federal Republic of Nigeria Official Gazette - Executive Order No. 40",
            publisher: "Federal Ministry of Information and National Orientation",
            sourceLevel: "LEVEL_1",
            sourceRole: "primary",
            sourceRoleLabel: "Official Gazette",
            sourceType: "gazette",
            publicationDate: "2024-06-28"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-010",
    slug: "electricity-act-2023-implementation",
    title: "Electricity Act 2023: Subnational Power Market Decentralization",
    summary: "Devolution of electricity regulatory powers from NERC to State Electricity Regulatory Commissions across 10+ federating states.",
    description: "Enacted in June 2023 and aggressively operationalized through 2024, the Electricity Act dismantles the monolithic federal power monopoly. State governments are empowered to license independent power generation, build state-level distribution grids, and establish competitive bilateral tariffs for industrial and domestic consumers.",
    publicNavigationGroup: "economy",
    publicNavigationGroupLabel: "Economic Transformation",
    sectorId: "power_energy_transition",
    sectorName: "Power and Energy Transition",
    subsector: "power_market_deregulation",
    recordType: "policy_reform",
    recordTypeLabel: "Statutory Legislation",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2023-06-09",
    datePrecision: "exact_day",
    leadMda: "Nigerian Electricity Regulatory Commission (NERC)",
    statesCovered: ["National", "Enugu", "Ekiti", "Ondo", "Imo", "Oyo", "Edo", "Lagos"],
    geographicScope: "national",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "statutory_legal_enactment",
    evidenceProfileLabel: "Statutory Act of Parliament",
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-011",
        claimText: "NERC issued transfer orders ceding regulatory oversight of intrastate electricity markets to state electricity regulatory commissions.",
        claimType: "regulatory_devolution",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-012",
            title: "NERC State Electricity Market Regulatory Transfer Orders",
            publisher: "Nigerian Electricity Regulatory Commission",
            sourceLevel: "LEVEL_1",
            sourceRole: "primary",
            sourceRoleLabel: "Regulatory Order",
            sourceType: "regulatory_ruling",
            publicationDate: "2024-04-22"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-011",
    slug: "zungeru-700mw-hydroelectric-commissioning",
    title: "Zungeru 700MW Hydroelectric Power Plant Commercial Synchronization",
    summary: "Full commercial integration of the 700MW Zungeru Hydroelectric Power Plant into the National Grid in Niger State.",
    description: "The 700-megawatt Zungeru Hydroelectric project located on the Kaduna River in Niger State was brought to full commercial operation. The plant contributes approximately 2.64 billion kWh of clean electricity annually to the national grid, reinforcing grid stability and expanding base-load generation capacity for manufacturing industries.",
    publicNavigationGroup: "infrastructure",
    publicNavigationGroupLabel: "Infrastructure & Urban Delivery",
    sectorId: "power_energy_transition",
    sectorName: "Power and Energy Transition",
    subsector: "hydroelectric_generation",
    recordType: "physical_project",
    recordTypeLabel: "Physical Infrastructure Project",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2024-05-02",
    datePrecision: "exact_day",
    leadMda: "Federal Ministry of Power",
    statesCovered: ["Niger"],
    geographicScope: "state_specific",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "direct_physical_delivery",
    evidenceProfileLabel: "Direct Physical Delivery",
    progressPercentage: 100.0,
    financialMetrics: [
      {
        financialType: "capital_investment",
        financialTypeLabel: "Total Engineering Investment",
        amount: "1300000000.0000",
        currency: "USD",
        formattedAmount: "700MW Capacity",
        reportingPeriod: "2024-Q2",
        aggregationBasis: "cumulative",
        nominalOrReal: "nominal",
        sourceInstitution: "Federal Ministry of Power"
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-012",
        claimText: "The 700MW Zungeru Hydroelectric facility achieved full commercial synchronization with the Transmission Company of Nigeria (TCN) 330kV national grid network.",
        claimType: "physical_delivery",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-013",
            title: "Transmission Company of Nigeria Grid Influx Report - Zungeru Sync",
            publisher: "Transmission Company of Nigeria",
            sourceLevel: "LEVEL_2",
            sourceRole: "official_statistical",
            sourceRoleLabel: "Grid Influx Record",
            sourceType: "statistical_bulletin",
            publicationDate: "2024-05-02"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-012",
    slug: "dry-season-wheat-cultivation-initiative",
    title: "National Dry-Season Wheat Cultivation & Food Security Initiative",
    summary: "Cultivation of 250,000 hectares of high-yield certified seed wheat across Jigawa, Kano, and Northern farming belts.",
    description: "Under the National Agricultural Growth Scheme and Agro-Pocket (NAGS-AP), the Federal Government financed inputs, specialized solar pumps, and certified heat-tolerant seeds across Jigawa, Kano, Kebbi, and Katsina states, producing over 600,000 metric tonnes of domestic milling wheat.",
    publicNavigationGroup: "economy",
    publicNavigationGroupLabel: "Economic Transformation",
    sectorId: "agriculture_food_security",
    sectorName: "Agriculture and Food Security",
    subsector: "grain_cultivation_and_food_reserves",
    recordType: "programme",
    recordTypeLabel: "Agricultural Input Scheme",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2024-04-10",
    datePrecision: "exact_day",
    leadMda: "Federal Ministry of Agriculture and Food Security",
    statesCovered: ["Jigawa", "Kano", "Kebbi", "Katsina"],
    geographicScope: "multi_state",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "verified_administrative_disbursement",
    evidenceProfileLabel: "Verified Input Distribution",
    financialMetrics: [
      {
        financialType: "funding_released",
        financialTypeLabel: "Agro-Pocket Subsidy Support",
        amount: "45000000000.0000",
        currency: "NGN",
        formattedAmount: "₦45.00 Billion",
        reportingPeriod: "2024-Q1",
        aggregationBasis: "period",
        nominalOrReal: "nominal",
        sourceInstitution: "Federal Ministry of Agriculture and Food Security"
      }
    ],
    beneficiaryMetrics: [
      {
        stage: "farmer_beneficiaries",
        stageLabel: "Verified Smallholder Farmers",
        count: 150000,
        formattedCount: "150,000+ Farmers",
        beneficiaryType: "farmers",
        countBasis: "cumulative_to_date",
        reportingPeriod: "2024-Q2"
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-013",
        claimText: "Over 150,000 farmers received 50% subsidized inputs and heat-tolerant seeds for the 2023/2024 dry-season wheat farming cycle.",
        claimType: "agricultural_output",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-014",
            title: "NAGS-AP Dry Season Wheat Harvest Evaluation Report",
            publisher: "Federal Ministry of Agriculture and Food Security",
            sourceLevel: "LEVEL_2",
            sourceRole: "official_statistical",
            sourceRoleLabel: "Statistical Harvest Bulletin",
            sourceType: "statistical_bulletin",
            publicationDate: "2024-04-10"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-013",
    slug: "lagos-rail-mass-transit-red-line",
    title: "Lagos Rail Mass Transit (LRMT) Red Line Infrastructure Commissioning",
    summary: "Presidential commissioning and passenger operations of the 27km Red Line rail corridor (Agbado to Oyingbo).",
    description: "President Bola Tinubu commissioned the 27-kilometer first phase of the Lagos Rail Mass Transit Red Line connecting Agbado in Ogun/Lagos border to Oyingbo on Lagos Mainland. Built with modern overpasses, grade-separated tracks, and intermodal connectivity with bus rapid transit terminals, the line has a design capacity for 500,000 daily passengers.",
    publicNavigationGroup: "infrastructure",
    publicNavigationGroupLabel: "Infrastructure & Urban Delivery",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    subsector: "urban_rail_mass_transit",
    recordType: "physical_project",
    recordTypeLabel: "Physical Infrastructure Project",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2024-02-29",
    datePrecision: "exact_day",
    leadMda: "Federal Ministry of Transportation / LAMATA",
    statesCovered: ["Lagos", "Ogun"],
    geographicScope: "state_specific",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "direct_physical_delivery",
    evidenceProfileLabel: "Direct Physical Delivery",
    progressPercentage: 100.0,
    financialMetrics: [
      {
        financialType: "capital_investment",
        financialTypeLabel: "Corridor Construction Investment",
        amount: "135000000000.0000",
        currency: "NGN",
        formattedAmount: "₦135.00 Billion",
        reportingPeriod: "2024-Q1",
        aggregationBasis: "cumulative",
        nominalOrReal: "nominal",
        sourceInstitution: "Lagos State Government / Federal Ministry of Transportation"
      }
    ],
    beneficiaryMetrics: [
      {
        stage: "daily_passengers",
        stageLabel: "Commuter Design Capacity",
        count: 500000,
        formattedCount: "500,000 Daily Passengers",
        beneficiaryType: "commuters",
        countBasis: "target_capacity",
        reportingPeriod: "2024-Q1"
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-014",
        claimText: "President Bola Ahmed Tinubu commissioned the 27km Phase 1 of the Lagos Rail Mass Transit Red Line on 29 February 2024.",
        claimType: "physical_delivery",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-015",
            title: "LAMATA Red Line Phase 1 Commissioning Official Brochure",
            publisher: "Lagos Metropolitan Area Transport Authority",
            sourceLevel: "LEVEL_1",
            sourceRole: "primary",
            sourceRoleLabel: "Official Commissioning Document",
            sourceType: "gazette",
            publicationDate: "2024-02-29"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-014",
    slug: "second-niger-bridge-access-roads",
    title: "Second Niger Bridge Interchange & Access Corridors (Phase 2A/2B)",
    summary: "Asphalt paving of the 17.5km Asaba-Oko interchange and 10.3km Onitsha approach bypass roads connecting Delta and Anambra.",
    description: "The Federal Ministry of Works executed emergency fast-tracked funding for the permanent dual-carriageway approach corridors (Phase 2A in Delta and Phase 2B in Anambra). The bypass eliminates multi-hour traffic bottlenecks around the Onitsha commercial axis and delivers direct highway access for industrial transport.",
    publicNavigationGroup: "infrastructure",
    publicNavigationGroupLabel: "Infrastructure & Urban Delivery",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    subsector: "bridge_and_interchange_corridors",
    recordType: "physical_project",
    recordTypeLabel: "Physical Infrastructure Project",
    status: "implementation_ongoing",
    statusLabel: "Ongoing Execution",
    statusCategory: "execution",
    date: "2024-01-20",
    datePrecision: "exact_day",
    leadMda: "Federal Ministry of Works",
    statesCovered: ["Anambra", "Delta"],
    geographicScope: "corridor",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "direct_physical_delivery",
    evidenceProfileLabel: "Direct Physical Delivery",
    progressPercentage: 82.0,
    contractor: "Julius Berger Nigeria Plc",
    financialMetrics: [
      {
        financialType: "funding_released",
        financialTypeLabel: "Access Corridor Special Capital Allocation",
        amount: "48000000000.0000",
        currency: "NGN",
        formattedAmount: "₦48.00 Billion",
        reportingPeriod: "2024-Q1",
        aggregationBasis: "cumulative",
        nominalOrReal: "nominal",
        sourceInstitution: "Federal Ministry of Works"
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-015",
        claimText: "Federal Ministry of Works mobilized contractors for the completion of Phase 2A (Asaba) and Phase 2B (Onitsha) bypass links to the Second Niger Bridge.",
        claimType: "physical_delivery",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-016",
            title: "Federal Ministry of Works Special Infrastructure Corridor Audit",
            publisher: "Federal Ministry of Works",
            sourceLevel: "LEVEL_2",
            sourceRole: "official_administrative",
            sourceRoleLabel: "Official Audit Report",
            sourceType: "inspection_report",
            publicationDate: "2024-03-20"
          }
        ]
      }
    ],
    isDemo: true
  },
  {
    id: "ACH-DEMO-015",
    slug: "national-social-safety-net-cash-transfers",
    title: "National Social Safety Net Direct Digital Cash Transfer Scale-Up",
    summary: "Direct biometric digital cash transfers of ₦25,000 monthly delivered to 5 million vulnerable Nigerian households.",
    description: "Following a comprehensive overhaul and verification of the National Social Register using National Identity Numbers (NIN) and Bank Verification Numbers (BVN), the Federal Government resumed biometric digital cash disbursements. Each verified household receives ₦25,000 per month for three consecutive months directly into individual bank accounts.",
    publicNavigationGroup: "social_services",
    publicNavigationGroupLabel: "Social Investment & Capital",
    sectorId: "social_protection_human_development",
    sectorName: "Social Protection and Human Development",
    subsector: "direct_cash_transfers",
    recordType: "programme",
    recordTypeLabel: "Social Intervention Scheme",
    status: "operational",
    statusLabel: "Operational",
    statusCategory: "delivered",
    date: "2023-10-17",
    datePrecision: "exact_day",
    leadMda: "Federal Ministry of Humanitarian Affairs and Poverty Reduction",
    statesCovered: ["National", "All 36 States", "FCT"],
    geographicScope: "national",
    featured: true,
    dataValueNature: "actual",
    sourceOrigin: "government_reported",
    verificationStatus: "source_confirmed",
    publicationStatus: "published",
    evidenceProfile: "verified_administrative_disbursement",
    evidenceProfileLabel: "Verified Biometric Disbursement",
    financialMetrics: [
      {
        financialType: "funding_released",
        financialTypeLabel: "Direct Household Disbursements",
        amount: "375000000000.0000",
        currency: "NGN",
        formattedAmount: "₦375.00 Billion",
        reportingPeriod: "2024-Q2",
        aggregationBasis: "cumulative",
        nominalOrReal: "nominal",
        sourceInstitution: "Federal Ministry of Finance"
      }
    ],
    beneficiaryMetrics: [
      {
        stage: "cash_transfer_recipient",
        stageLabel: "Verified Vulnerable Households",
        count: 5000000,
        formattedCount: "5,000,000 Households",
        beneficiaryType: "households",
        countBasis: "cumulative_to_date",
        reportingPeriod: "2024-Q3"
      }
    ],
    evidenceClaims: [
      {
        claimId: "CLM-DEMO-016",
        claimText: "5 million vulnerable households received ₦25,000 monthly digital transfers validated against NIN and BVN records.",
        claimType: "social_welfare_benefit",
        dataValueNature: "actual",
        sourceOrigin: "government_reported",
        verificationStatus: "source_confirmed",
        sources: [
          {
            sourceId: "SRC-DEMO-017",
            title: "National Social Safety Net Project (NASSP) Verification Bulletin",
            publisher: "Federal Ministry of Humanitarian Affairs and Poverty Reduction",
            sourceLevel: "LEVEL_2",
            sourceRole: "official_statistical",
            sourceRoleLabel: "Official Disbursement Bulletin",
            sourceType: "statistical_bulletin",
            publicationDate: "2024-06-15"
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
  // ==================== 2023 MANDATE MILESTONES ====================
  {
    id: "tle-2023-001",
    slug: "fuel-subsidy-removal-proclamation",
    title: "Presidential Inaugural Proclamation & Fuel Subsidy Removal",
    summary: "President Tinubu announced the immediate termination of the PMS petrol subsidy during his inaugural address at Eagle Square Abuja.",
    details: "The removal of the petrol subsidy halted monthly fiscal drain of over ₦400 Billion, redirecting revenue to federation accounts, sub-national infrastructure, and targeted social intervention schemes.",
    expectedOrMeasuredImpact: "Reallocated estimated ₦4.2 Trillion annual fiscal savings from subsidised consumption to statutory federation accounts.",
    eventType: "announcement",
    eventTypeLabel: "Executive Proclamation",
    stage: "announcement",
    stageLabel: "Executive Proclamation",
    category: "Economic Reform",
    eventDate: "2023-05-29",
    year: 2023,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "economy_fiscal_reforms",
    sectorName: "Economy and Fiscal Reforms",
    leadActor: "President Bola Ahmed Tinubu",
    leadAgency: "The Presidency & Federal Ministry of Finance",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-003",
    associatedRecordSlug: "fx-market-unification-single-window",
    associatedRecordTitle: "Foreign Exchange Market Unification & National Single Window System",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-003",
    recordSlug: "fx-market-unification-single-window",
    recordType: "achievement",
    routePath: "/timeline/fuel-subsidy-removal-proclamation",
    primarySources: [
      {
        name: "Official Presidential Inaugural Address Gazette",
        publisher: "Federal Republic of Nigeria Official Gazette",
        url: "https://statehouse.gov.ng/",
        documentType: "Executive Proclamation",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2023-002",
    slug: "electricity-act-2023-enactment",
    title: "President Assents to the Landmark Electricity Act 2023",
    summary: "President Tinubu signed the Electricity Act 2023 into law, empowering states to establish independent power regulatory commissions.",
    details: "Repealed the 2005 Electric Power Sector Reform Act, decentralizing electricity generation, transmission, and state licensing autonomy from exclusive federal control.",
    expectedOrMeasuredImpact: "Enabled 10+ State Governments to license independent power generation plants and regulate sub-national electricity markets.",
    eventType: "enactment",
    eventTypeLabel: "Legislative Enactment",
    stage: "approval",
    stageLabel: "Statutory Assent",
    category: "Power & Energy",
    eventDate: "2023-06-09",
    year: 2023,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "power_energy_natural_resources",
    sectorName: "Power, Energy and Natural Resources",
    leadActor: "President Bola Ahmed Tinubu",
    leadAgency: "Nigerian Electricity Regulatory Commission (NERC)",
    statesCovered: ["Lagos", "Enugu", "Ekiti", "Ondo", "Oyo", "Imo", "Edo", "Kano", "Cross River"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-004",
    associatedRecordSlug: "electricity-act-state-devolution",
    associatedRecordTitle: "Electricity Act 2023 Enforcement & State Power Autonomy Devolution",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-004",
    recordSlug: "electricity-act-state-devolution",
    recordType: "achievement",
    routePath: "/timeline/electricity-act-2023-enactment",
    primarySources: [
      {
        name: "Electricity Act 2023 (Act No. 22) Official Gazette",
        publisher: "Federal Republic of Nigeria Official Gazette",
        documentNumber: "Act No. 22 of 2023",
        evidenceLocation: "Part II, Section 2(2)",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2023-003",
    slug: "nigeria-data-protection-act-enactment",
    title: "President Signs Nigeria Data Protection Act 2023 into Law",
    summary: "Established the Nigeria Data Protection Commission (NDPC) creating a statutory framework for citizen digital privacy and data protection.",
    details: "Enacted a comprehensive data governance framework establishing the NDPC as an independent statutory regulator, empowering cross-border fintech security and citizen identity privacy.",
    expectedOrMeasuredImpact: "Protected over 100 million digital citizens and validated regulatory compliance for fintech and digital services.",
    eventType: "enactment",
    eventTypeLabel: "Legislative Enactment",
    stage: "approval",
    stageLabel: "Statutory Assent",
    category: "Digital Economy",
    eventDate: "2023-06-12",
    year: 2023,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "digital_economy_science_innovation",
    sectorName: "Digital Economy, Science and Innovation",
    leadActor: "President Bola Ahmed Tinubu",
    leadAgency: "Nigeria Data Protection Commission (NDPC)",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    routePath: "/timeline/nigeria-data-protection-act-enactment",
    primarySources: [
      {
        name: "Nigeria Data Protection Act 2023 Official Gazette",
        publisher: "Federal Republic of Nigeria Official Gazette",
        documentNumber: "Act No. 24 of 2023",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2023-004",
    slug: "fx-market-unification-autonomous-floating",
    title: "Central Bank Formally Unifies Foreign Exchange Windows",
    summary: "Operational guidance collapsed official windows into the autonomous market, clearing billions in inherited forward backlogs.",
    details: "Abolished parallel windows across the I&E framework, transitioning to a market-determined 'willing buyer, willing seller' regime and restoring autonomous FX liquidity.",
    expectedOrMeasuredImpact: "Cleared 100% of verified foreign exchange forward contract backlogs totaling over $7 Billion.",
    eventType: "operation",
    eventTypeLabel: "Operational Reform",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Monetary Policy",
    eventDate: "2023-06-14",
    year: 2023,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "economy_fiscal_reforms",
    sectorName: "Economy and Fiscal Reforms",
    leadActor: "Central Bank of Nigeria",
    leadAgency: "Central Bank of Nigeria",
    statesCovered: ["National"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-003",
    associatedRecordSlug: "fx-market-unification-single-window",
    associatedRecordTitle: "Foreign Exchange Market Unification & National Single Window System",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-003",
    recordSlug: "fx-market-unification-single-window",
    recordType: "achievement",
    routePath: "/timeline/fx-market-unification-autonomous-floating",
    primarySources: [
      {
        name: "CBN Circular on Operational Changes to Foreign Exchange Market",
        publisher: "Central Bank of Nigeria",
        documentNumber: "TED/FEM/PUB/FPC/001/007",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2023-005",
    slug: "food-security-state-of-emergency",
    title: "President Declares National State of Emergency on Food Security",
    summary: "Integrated agriculture, water resources, and pricing coordination under the National Security Council to protect farming corridors.",
    details: "Established multi-agency agricultural taskforce deploying dry-season inputs, fertilizer vouchers, and green irrigation schemes across northern food belts.",
    expectedOrMeasuredImpact: "Mobilized 500,000 hectares for staple crop cultivation and released 102,000 metric tonnes of strategic grains.",
    eventType: "announcement",
    eventTypeLabel: "Executive Proclamation",
    stage: "announcement",
    stageLabel: "Executive Proclamation",
    category: "Agriculture & Food",
    eventDate: "2023-07-13",
    year: 2023,
    quarter: "Q3",
    datePrecision: "exact_day",
    sectorId: "agriculture_food_security",
    sectorName: "Agriculture and Food Security",
    leadActor: "President Bola Ahmed Tinubu",
    leadAgency: "Federal Ministry of Agriculture and Food Security",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    routePath: "/timeline/food-security-state-of-emergency",
    primarySources: [
      {
        name: "State House Declaration on National Food Security Emergency",
        publisher: "Cabinet Secretariat, State House Abuja",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2023-006",
    slug: "pcngi-presidential-cng-launch",
    title: "Launch of the Presidential Compressed Natural Gas Initiative (PCNGi)",
    summary: "Rolled out national conversion kits, commercial refueling hubs, and zero-tariff CNG equipment incentives to slash mass transit costs.",
    details: "Established catalytic conversion centres across Lagos, Abuja, Ibadan, Benin, and Kano to transition public commercial buses and tricycles from petrol to affordable natural gas.",
    expectedOrMeasuredImpact: "Targeted 1,000,000 vehicle conversions reducing passenger transport operating costs by up to 50%.",
    eventType: "operation",
    eventTypeLabel: "Public Service Launch",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Energy Transition",
    eventDate: "2023-08-18",
    year: 2023,
    quarter: "Q3",
    datePrecision: "exact_day",
    sectorId: "power_energy_natural_resources",
    sectorName: "Power, Energy and Natural Resources",
    leadActor: "PCNGi Steering Committee",
    leadAgency: "Presidency PCNGi Coordinating Directorate",
    statesCovered: ["Lagos", "FCT", "Ogun", "Oyo", "Edo", "Kano", "Rivers"],
    geopoliticalZone: "National",
    routePath: "/timeline/pcngi-presidential-cng-launch",
    primarySources: [
      {
        name: "Presidential CNG Initiative Operational Blueprint",
        publisher: "The Presidency",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2023-007",
    slug: "3mtt-technical-talent-fellowship-rollout",
    title: "Phase 1 Deployment of 3 Million Technical Talent (3MTT) Fellowship",
    summary: "30,000 prototype fellows commenced AI, software development, data science, and cloud computing training across 36 states and FCT.",
    details: "First tranche of the Federal Government's flagship digital talent accelerator, partnering with 100+ vetted local tech hubs and international certification bodies.",
    expectedOrMeasuredImpact: "Equipped 30,000 fellows in Cohort 1 with technical competencies and internship placements.",
    eventType: "operation",
    eventTypeLabel: "Public Service Launch",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Youth & Skills",
    eventDate: "2023-11-01",
    year: 2023,
    quarter: "Q4",
    datePrecision: "exact_day",
    sectorId: "youth_skills_employment",
    sectorName: "Youth Development and Employment",
    leadActor: "Federal Ministry of Communications, Innovation & Digital Economy",
    leadAgency: "National Information Technology Development Agency (NITDA)",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    routePath: "/timeline/3mtt-technical-talent-fellowship-rollout",
    primarySources: [
      {
        name: "3MTT Execution Framework & Cohort 1 Enrollment Report",
        publisher: "Federal Ministry of Communications, Innovation & Digital Economy",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },

  // ==================== 2024 MANDATE MILESTONES ====================
  {
    id: "tle-2024-001",
    slug: "lagos-calabar-coastal-highway-section-1-approval",
    title: "FEC Approves 700km Lagos-Calabar Coastal Highway Corridor",
    summary: "Federal Executive Council sanctioned the award of Section 1 construction linking Victoria Island to the Lekki Deep Sea Port.",
    details: "Sanctioned Phase 1 contract for 47.47km Section 1 utilizing continuously reinforced concrete pavement (CRCP) engineered for heavy-duty industrial logistics.",
    expectedOrMeasuredImpact: "Direct transport artery linking 9 coastal states and unlocking maritime logistics efficiency.",
    eventType: "approval",
    eventTypeLabel: "FEC Approval",
    stage: "approval",
    stageLabel: "Cabinet Approval",
    category: "Infrastructure",
    eventDate: "2024-02-27",
    year: 2024,
    quarter: "Q1",
    datePrecision: "exact_day",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    leadActor: "Federal Executive Council",
    leadAgency: "Federal Ministry of Works",
    statesCovered: ["Lagos", "Ogun", "Ondo", "Edo", "Delta", "Bayelsa", "Rivers", "Akwa Ibom", "Cross River"],
    geopoliticalZone: "South-West",
    associatedRecordId: "ACH-DEMO-002",
    associatedRecordSlug: "lagos-calabar-coastal-highway-section-1",
    associatedRecordTitle: "Lagos-Calabar Coastal Highway 700km Multi-Lane Corridors (Section 1)",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-002",
    recordSlug: "lagos-calabar-coastal-highway-section-1",
    recordType: "achievement",
    routePath: "/timeline/lagos-calabar-coastal-highway-section-1-approval",
    primarySources: [
      {
        name: "Federal Executive Council Resolution on Coastal Highway Contract Award",
        publisher: "Cabinet Secretariat, State House Abuja",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-002",
    slug: "mining-marshals-special-operations-deployment",
    title: "Mining Marshals Elite Corps Deployed: 98 Illegal Sites Recovered",
    summary: "Specially trained 2,570-person security unit deployed across mineral-rich corridors, arresting 327 illegal miners and securing solid mineral sites.",
    details: "Inter-agency tactical security initiative established between the Ministry of Solid Minerals Development and NSCDC to halt illicit mineral exports and protect lithium, gold, and tin reserves.",
    expectedOrMeasuredImpact: "98 illegal mining sites reclaimed and solid minerals government revenue mobilized past ₦38 Billion.",
    eventType: "operation",
    eventTypeLabel: "Security Operation",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Security & Resources",
    eventDate: "2024-03-21",
    year: 2024,
    quarter: "Q1",
    datePrecision: "exact_day",
    sectorId: "security_national_stability",
    sectorName: "Security and National Stability",
    leadActor: "Ministry of Solid Minerals Development & NSCDC",
    leadAgency: "Mining Marshals Command Unit",
    statesCovered: ["Niger", "Kogi", "Nasarawa", "Kaduna", "Osun", "Zamfara", "Plateau"],
    geopoliticalZone: "National",
    routePath: "/timeline/mining-marshals-special-operations-deployment",
    primarySources: [
      {
        name: "Mining Marshals Special Operations Briefing Bulletin",
        publisher: "Ministry of Solid Minerals Development",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-003",
    slug: "student-loans-act-2024-enactment",
    title: "President Signs Student Loans (Access to Higher Education) Act 2024",
    summary: "Landmark enactment establishing NELFUND with sustainable funding envelopes and zero-interest terms for tertiary students.",
    details: "Repealed previous restrictive clauses, institutionalized 1% of FIRS revenue collection as continuous funding base, and enacted student upkeep allowances.",
    expectedOrMeasuredImpact: "Enacted statutory right to interest-free higher education loans for over 2 million eligible public tertiary students.",
    eventType: "enactment",
    eventTypeLabel: "Legislative Enactment",
    stage: "approval",
    stageLabel: "Statutory Assent",
    category: "Education",
    eventDate: "2024-04-03",
    year: 2024,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "education_human_capital",
    sectorName: "Education and Human Capital",
    leadActor: "President Bola Ahmed Tinubu",
    leadAgency: "National Student Financial Aid Scheme (NELFUND)",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-001",
    associatedRecordSlug: "nelfund-student-loan-disbursement",
    associatedRecordTitle: "National Student Financial Aid Scheme (NELFUND) Operational Rollout",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-001",
    recordSlug: "nelfund-student-loan-disbursement",
    recordType: "achievement",
    routePath: "/timeline/student-loans-act-2024-enactment",
    primarySources: [
      {
        name: "Student Loans (Access to Higher Education) Act 2024 Gazette",
        publisher: "Federal Republic of Nigeria Official Gazette",
        documentNumber: "Vol. 111, No. 42",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-004",
    slug: "credicorp-consumer-credit-rollout",
    title: "Nigerian Consumer Credit Corporation (CREDICORP) Operations Launch",
    summary: "Establishment and operationalization of CREDICORP, disbursing low-interest consumer credit to working Nigerians.",
    details: "Deployed initial ₦100 Billion catalytic capital injection to eliminate cash upfront purchasing constraints, financing solar home systems and CNG vehicle conversions.",
    expectedOrMeasuredImpact: "Over 100,000 civil servants and private sector workers enrolled in first disbursement cycles.",
    eventType: "operation",
    eventTypeLabel: "Public Service Launch",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Social Protection",
    eventDate: "2024-04-24",
    year: 2024,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "social_protection_human_development",
    sectorName: "Social Protection and Human Development",
    leadActor: "Nigerian Consumer Credit Corporation (CREDICORP)",
    leadAgency: "CREDICORP Executive Directorate",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-006",
    associatedRecordSlug: "credicorp-consumer-credit-rollout",
    associatedRecordTitle: "Nigerian Consumer Credit Corporation (CREDICORP) Rollout",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-006",
    recordSlug: "credicorp-consumer-credit-rollout",
    recordType: "achievement",
    routePath: "/timeline/credicorp-consumer-credit-rollout",
    primarySources: [
      {
        name: "CREDICORP Launch & Credit Allocation Bulletin",
        publisher: "State House Press Corps",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-005",
    slug: "zungeru-700mw-hydro-power-grid-commissioning",
    title: "Official Grid Commissioning of 700MW Zungeru Hydroelectric Power Plant",
    summary: "Inauguration and commercial grid synchronization of the 700MW Zungeru hydro power facility in Niger State.",
    details: "Concluded concessioning agreement, completed dam reservoir impoundment, and activated all 4 main generation turbines adding 700MW to the national grid.",
    expectedOrMeasuredImpact: "Increased national grid hydro capacity by 25%, supplying clean power to over 3 million households.",
    eventType: "operation",
    eventTypeLabel: "Operational Commissioning",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Power & Energy",
    eventDate: "2024-05-16",
    year: 2024,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "power_energy_natural_resources",
    sectorName: "Power, Energy and Natural Resources",
    leadActor: "Federal Ministry of Power",
    leadAgency: "Transmission Company of Nigeria (TCN)",
    statesCovered: ["Niger"],
    geopoliticalZone: "North-Central",
    routePath: "/timeline/zungeru-700mw-hydro-power-grid-commissioning",
    primarySources: [
      {
        name: "TCN Grid Operations Daily Dispatch Log",
        publisher: "Federal Ministry of Power",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-006",
    slug: "nelfund-application-portal-deployment",
    title: "NELFUND Opens Student Loan Application Portal for 100+ Institutions",
    summary: "Over 350,000 applications processed in the first 90 days with automated institutional tuition disbursements.",
    details: "Full digital portal launched with automated NIN, BVN, and JAMB validation algorithms to process institutional tuition and upkeep disbursements.",
    expectedOrMeasuredImpact: "₦50 Billion in tuition and monthly upkeep stipends disbursed across 120 federal and state tertiary institutions.",
    eventType: "operation",
    eventTypeLabel: "Public Service Launch",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Education",
    eventDate: "2024-05-24",
    year: 2024,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "education_human_capital",
    sectorName: "Education and Human Capital",
    leadActor: "NELFUND Executive Management",
    leadAgency: "National Student Financial Aid Scheme (NELFUND)",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-001",
    associatedRecordSlug: "nelfund-student-loan-disbursement",
    associatedRecordTitle: "National Student Financial Aid Scheme (NELFUND) Operational Rollout",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-001",
    recordSlug: "nelfund-student-loan-disbursement",
    recordType: "achievement",
    routePath: "/timeline/nelfund-application-portal-deployment",
    primarySources: [
      {
        name: "NELFUND Application Deployment Launch Bulletin",
        publisher: "National Student Financial Aid Scheme",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-007",
    slug: "abuja-light-rail-commercial-metro-commissioning",
    title: "Abuja Light Rail Commercial Revitalization and Free Transit Commissioning",
    summary: "Rehabilitation, access road construction, and full commercial commissioning of the 12-station Abuja Light Rail metro network.",
    details: "President Tinubu commissioned the 26.5km Abuja Light Rail network connecting the CBD Metro station with Nnamdi Azikiwe International Airport.",
    expectedOrMeasuredImpact: "Serves over 45,000 daily commuters between Abuja city centre, Idu industrial zone, and the international airport.",
    eventType: "operation",
    eventTypeLabel: "Operational Commissioning",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Infrastructure",
    eventDate: "2024-05-29",
    year: 2024,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    leadActor: "Federal Capital Territory Administration (FCTA)",
    leadAgency: "FCTA Transportation Secretariat",
    statesCovered: ["FCT", "Abuja"],
    geopoliticalZone: "North-Central",
    associatedRecordId: "ACH-DEMO-008",
    associatedRecordSlug: "abuja-light-rail-commercial-operation",
    associatedRecordTitle: "Abuja Light Rail Commercial Revitalization and Free Transit Scheme",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-008",
    recordSlug: "abuja-light-rail-commercial-operation",
    recordType: "achievement",
    routePath: "/timeline/abuja-light-rail-commercial-metro-commissioning",
    primarySources: [
      {
        name: "FCTA Commercial Rail Operations Launch Bulletin",
        publisher: "Federal Capital Territory Administration",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-008",
    slug: "executive-order-40-zero-tariffs-pharmaceuticals",
    title: "Zero Tariffs on Active Pharmaceutical Ingredients (Executive Order 40)",
    summary: "Suspension of import duties, VAT, and excise levies on critical raw materials and machinery for domestic drug manufacturing.",
    details: "Executive Order 40 establishes a zero-tariff regime on essential raw materials, active pharmaceutical ingredients (APIs), packaging equipment, and medical devices.",
    expectedOrMeasuredImpact: "Lowered production input costs for domestic pharmaceutical manufacturers to reduce retail drug prices.",
    eventType: "enactment",
    eventTypeLabel: "Executive Order",
    stage: "approval",
    stageLabel: "Executive Order",
    category: "Healthcare",
    eventDate: "2024-06-28",
    year: 2024,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "healthcare_public_health",
    sectorName: "Healthcare and Public Health",
    leadActor: "President Bola Ahmed Tinubu",
    leadAgency: "Federal Ministry of Health and Social Welfare",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-009",
    associatedRecordSlug: "pharmaceutical-value-chain-executive-order",
    associatedRecordTitle: "Zero Tariffs on Active Pharmaceutical Ingredients (Executive Order 40)",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-009",
    recordSlug: "pharmaceutical-value-chain-executive-order",
    recordType: "achievement",
    routePath: "/timeline/executive-order-40-zero-tariffs-pharmaceuticals",
    primarySources: [
      {
        name: "Executive Order No. 40 Official Gazette",
        publisher: "Federal Republic of Nigeria Official Gazette",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-009",
    slug: "supreme-court-774-lga-financial-autonomy-ruling",
    title: "Supreme Court Renders Landmark Verdict on 774 LGA Financial Autonomy",
    summary: "The apex court unanimously ruled that state governments cannot withhold statutory federation revenues belonging to local councils.",
    details: "Constitutional litigation instituted by the Attorney-General of the Federation ordering the Accountant-General to remit statutory allocations directly to 774 LGA accounts.",
    expectedOrMeasuredImpact: "Restored fiscal independence and direct funding to all 774 Local Government Areas across 36 States.",
    eventType: "outcome_report",
    eventTypeLabel: "Judicial Landmark",
    stage: "outcome_report",
    stageLabel: "Judicial Enforcement",
    category: "Governance",
    eventDate: "2024-07-11",
    year: 2024,
    quarter: "Q3",
    datePrecision: "exact_day",
    sectorId: "governance_public_service",
    sectorName: "Governance and Public Service",
    leadActor: "Supreme Court of Nigeria",
    leadAgency: "Federal Ministry of Justice",
    statesCovered: ["National", "All 774 LGAs"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-005",
    associatedRecordSlug: "local-government-financial-autonomy",
    associatedRecordTitle: "Supreme Court Landmark Judgment Enforcing 774 LGA Financial Autonomy",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-005",
    recordSlug: "local-government-financial-autonomy",
    recordType: "achievement",
    routePath: "/timeline/supreme-court-774-lga-financial-autonomy-ruling",
    primarySources: [
      {
        name: "Supreme Court Judgment in AGF v. 36 State Governors (SC/CV/343/2024)",
        publisher: "Supreme Court of Nigeria",
        documentNumber: "SC/CV/343/2024",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-010",
    slug: "national-minimum-wage-act-2024-enactment",
    title: "President Signs ₦70,000 National Minimum Wage (Amendment) Act 2024",
    summary: "Presidential assent to the National Minimum Wage Act Amendment 2024 raising the federal baseline wage from ₦30,000 to ₦70,000.",
    details: "Tripartite agreement enacted between Federal Government, Organised Labour, and Private Sector Employers with a 3-year statutory review cycle.",
    expectedOrMeasuredImpact: "Direct income increase for over 1.2 million federal and state civil servants nationwide.",
    eventType: "enactment",
    eventTypeLabel: "Legislative Enactment",
    stage: "approval",
    stageLabel: "Statutory Assent",
    category: "Economic Reform",
    eventDate: "2024-07-29",
    year: 2024,
    quarter: "Q3",
    datePrecision: "exact_day",
    sectorId: "economy_fiscal_reforms",
    sectorName: "Economy and Fiscal Reforms",
    leadActor: "President Bola Ahmed Tinubu",
    leadAgency: "Federal Ministry of Labour and Employment",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    routePath: "/timeline/national-minimum-wage-act-2024-enactment",
    primarySources: [
      {
        name: "National Minimum Wage (Amendment) Act 2024 Gazette",
        publisher: "Federal Republic of Nigeria Official Gazette",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-011",
    slug: "minimum-wage-ippis-payroll-remittance",
    title: "First Monthly Civil Service Payroll Remittance of ₦70,000 Minimum Wage",
    summary: "Federal Government disbursed civil service payroll reflecting full ₦70,000 minimum wage and consequential adjustments.",
    details: "Integrated Personnel and Payroll Information System (IPPIS) updated across all Ministries, Departments, and Agencies (MDAs).",
    expectedOrMeasuredImpact: "100% of federal workers received updated statutory wage structure in monthly payroll remittances.",
    eventType: "operation",
    eventTypeLabel: "Operational Disbursement",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Economic Reform",
    eventDate: "2024-09-26",
    year: 2024,
    quarter: "Q3",
    datePrecision: "exact_day",
    sectorId: "economy_fiscal_reforms",
    sectorName: "Economy and Fiscal Reforms",
    leadActor: "Office of the Accountant-General of the Federation",
    leadAgency: "Office of the Accountant-General of the Federation",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    routePath: "/timeline/minimum-wage-ippis-payroll-remittance",
    primarySources: [
      {
        name: "OAGF Payroll Disbursement Confirmation Notice",
        publisher: "Office of the Accountant-General of the Federation",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2024-012",
    slug: "biometric-social-register-5m-households-audit",
    title: "Biometric Social Register Audit: 5.2 Million Vulnerable Households Verified",
    summary: "Independent audit confirms biometrically verified conditional cash transfer payments to 5.2 million vulnerable households.",
    details: "Digital payment rail transferring ₦25,000 monthly directly into BVN/NIN verified bank accounts and mobile wallets with multilateral audit oversight.",
    expectedOrMeasuredImpact: "Direct social safety net protection reaching over 20 million citizens during economic structural reforms.",
    eventType: "outcome_report",
    eventTypeLabel: "Outcome Milestone",
    stage: "outcome_report",
    stageLabel: "Verified Impact",
    category: "Social Protection",
    eventDate: "2024-10-15",
    year: 2024,
    quarter: "Q4",
    datePrecision: "exact_day",
    sectorId: "social_protection_human_development",
    sectorName: "Social Protection and Human Development",
    leadActor: "National Social Safety-Nets Coordinating Office",
    leadAgency: "Federal Ministry of Humanitarian Affairs",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    routePath: "/timeline/biometric-social-register-5m-households-audit",
    primarySources: [
      {
        name: "World Bank National Social Protection Audit Bulletin Q3 2024",
        publisher: "The World Bank",
        sourceLevel: "LEVEL_3"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },

  // ==================== 2025 MANDATE MILESTONES ====================
  {
    id: "tle-2025-001",
    slug: "national-fiber-backbone-90000km-groundbreaking",
    title: "National 90,000km Fiber-Optic Backbone SPV Deployment Groundbreaking",
    summary: "Commenced multi-state trenching and duct installation across inland corridors to double national terrestrial fiber broadband reach.",
    details: "Public-private SPV mobilized across major transport corridors, connecting rural communities and health centers to high-speed digital infrastructure.",
    expectedOrMeasuredImpact: "Expands national broadband penetration from coast to hinterland, connecting 774 LGA administrative hubs.",
    eventType: "operation",
    eventTypeLabel: "Infrastructure Deployment",
    stage: "implementation",
    stageLabel: "Execution",
    category: "Digital Economy",
    eventDate: "2025-01-20",
    year: 2025,
    quarter: "Q1",
    datePrecision: "exact_day",
    sectorId: "digital_economy_science_innovation",
    sectorName: "Digital Economy, Science and Innovation",
    leadActor: "Federal Ministry of Communications, Innovation and Digital Economy",
    leadAgency: "National Broadband SPV Secretariat",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    routePath: "/timeline/national-fiber-backbone-90000km-groundbreaking",
    primarySources: [
      {
        name: "National Fiber SPV Infrastructure Delivery Milestone Report",
        publisher: "Federal Ministry of Communications, Innovation and Digital Economy",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2025-002",
    slug: "nelfund-disbursements-exceed-322-billion",
    title: "NELFUND Student Loan Institutional Remittances Exceed ₦322 Billion",
    summary: "Comprehensive academic verification milestone: Cumulative tuition and upkeep remittances crossed ₦322 Billion covering over 650,000 undergraduates.",
    details: "Disbursed across 210 federal, state, and specialized tertiary institutions with zero interest rate and biometric verification against NIN and BVN.",
    expectedOrMeasuredImpact: "Direct tuition and monthly student stipend security ensuring zero financial dropouts across accredited public tertiary institutions.",
    eventType: "outcome_report",
    eventTypeLabel: "Outcome Milestone",
    stage: "outcome_report",
    stageLabel: "Verified Impact",
    category: "Education",
    eventDate: "2025-03-15",
    year: 2025,
    quarter: "Q1",
    datePrecision: "exact_day",
    sectorId: "education_human_capital",
    sectorName: "Education and Human Capital",
    leadActor: "NELFUND Executive Management",
    leadAgency: "National Student Financial Aid Scheme (NELFUND)",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-001",
    associatedRecordSlug: "nelfund-student-loan-disbursement",
    associatedRecordTitle: "National Student Financial Aid Scheme (NELFUND) Operational Rollout",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-001",
    recordSlug: "nelfund-student-loan-disbursement",
    recordType: "achievement",
    routePath: "/timeline/nelfund-disbursements-exceed-322-billion",
    primarySources: [
      {
        name: "NELFUND Comprehensive Cumulative Disbursement Audit Report 2025",
        publisher: "National Student Financial Aid Scheme",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2025-003",
    slug: "lagos-calabar-section-1-paved-kilometers-handover",
    title: "Lagos-Calabar Coastal Highway Section 1 Concrete Pavement Milestone (35km)",
    summary: "Completed 35 continuous kilometres of 10-lane concrete reinforced highway connecting Victoria Island to Eleko along the Lekki corridor.",
    details: "Continuous reinforced concrete pavement (CRCP) engineered for heavy freight container logistics from Lekki Deep Sea Port.",
    expectedOrMeasuredImpact: "Drastically reduced transit times between Victoria Island and Lekki industrial export processing zones.",
    eventType: "operation",
    eventTypeLabel: "Physical Milestone",
    stage: "implementation",
    stageLabel: "Execution",
    category: "Infrastructure",
    eventDate: "2025-05-28",
    year: 2025,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    leadActor: "Federal Ministry of Works",
    leadAgency: "Federal Ministry of Works & Hitech Construction",
    statesCovered: ["Lagos"],
    geopoliticalZone: "South-West",
    associatedRecordId: "ACH-DEMO-002",
    associatedRecordSlug: "lagos-calabar-coastal-highway-section-1",
    associatedRecordTitle: "Lagos-Calabar Coastal Highway 700km Multi-Lane Corridors (Section 1)",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-002",
    recordSlug: "lagos-calabar-coastal-highway-section-1",
    recordType: "achievement",
    routePath: "/timeline/lagos-calabar-section-1-paved-kilometers-handover",
    primarySources: [
      {
        name: "Federal Ministry of Works Infrastructure Inspection Certificate",
        publisher: "Federal Ministry of Works",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2025-004",
    slug: "renewed-hope-cities-karsana-phase-1-delivery",
    title: "Renewed Hope Cities Phase 1: 3,112 Housing Units Delivered at Karsana",
    summary: "Handed over 3,112 fully serviced residential apartments and townhouses integrated with solar minigrids and single-digit mortgage refinancing.",
    details: "Phase 1 flagship development in Karsana, Abuja, delivering mixed-income residential housing with paved internal roads, drainage, and water supply infrastructure.",
    expectedOrMeasuredImpact: "Direct shelter delivery for over 15,000 residents supported by FMBN single-digit interest mortgage facilities.",
    eventType: "operation",
    eventTypeLabel: "Operational Commissioning",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Housing & Urban",
    eventDate: "2025-06-30",
    year: 2025,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "housing_urban_development",
    sectorName: "Housing and Urban Development",
    leadActor: "Federal Ministry of Housing and Urban Development",
    leadAgency: "Federal Housing Authority & FMBN",
    statesCovered: ["FCT", "Abuja"],
    geopoliticalZone: "North-Central",
    routePath: "/timeline/renewed-hope-cities-karsana-phase-1-delivery",
    primarySources: [
      {
        name: "FMHUD Karsana Housing Delivery Inspection Bulletin",
        publisher: "Federal Ministry of Housing and Urban Development",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2025-005",
    slug: "state-electricity-regulatory-commissions-devolution-milestone",
    title: "10+ States Assume Total Regulatory Control of Sub-National Electricity Markets",
    summary: "NERC completed formal regulatory handover of intra-state licensing, tariffs, and distribution oversight to independent State commissions.",
    details: "States including Lagos, Enugu, Ekiti, Ondo, Oyo, Imo, and Edo activated independent State Electricity Regulatory Commissions (SERCs) to license independent power producers.",
    expectedOrMeasuredImpact: "Decentralized national grid architecture enabling localized state generation and tariff setting.",
    eventType: "outcome_report",
    eventTypeLabel: "Regulatory Milestone",
    stage: "outcome_report",
    stageLabel: "Verified Impact",
    category: "Power & Energy",
    eventDate: "2025-08-14",
    year: 2025,
    quarter: "Q3",
    datePrecision: "exact_day",
    sectorId: "power_energy_natural_resources",
    sectorName: "Power, Energy and Natural Resources",
    leadActor: "Nigerian Electricity Regulatory Commission (NERC)",
    leadAgency: "Nigerian Electricity Regulatory Commission",
    statesCovered: ["Lagos", "Enugu", "Ekiti", "Ondo", "Oyo", "Imo", "Edo", "Kano", "Cross River"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-004",
    associatedRecordSlug: "electricity-act-state-devolution",
    associatedRecordTitle: "Electricity Act 2023 Enforcement & State Power Autonomy Devolution",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-004",
    recordSlug: "electricity-act-state-devolution",
    recordType: "achievement",
    routePath: "/timeline/state-electricity-regulatory-commissions-devolution-milestone",
    primarySources: [
      {
        name: "NERC State Devolution Regulatory Orders Bulletin",
        publisher: "Nigerian Electricity Regulatory Commission",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2025-006",
    slug: "bank-of-industry-msme-credit-expansion-milestone",
    title: "Bank of Industry MSME Credit Disbursements Hit ₦644.9 Billion",
    summary: "Cumulative low-interest lending to 18,000 industrial fabrication, agro-processing, and tech enterprises nationwide.",
    details: "Targeted single-digit credit facilities deployed across industrial hubs to stimulate import substitution and domestic manufacturing expansion.",
    expectedOrMeasuredImpact: "Catalyzed over 250,000 direct and indirect manufacturing and processing jobs.",
    eventType: "outcome_report",
    eventTypeLabel: "Financial Milestone",
    stage: "outcome_report",
    stageLabel: "Verified Impact",
    category: "Economic Reform",
    eventDate: "2025-10-22",
    year: 2025,
    quarter: "Q4",
    datePrecision: "exact_day",
    sectorId: "economy_fiscal_reforms",
    sectorName: "Economy and Fiscal Reforms",
    leadActor: "Bank of Industry (BOI)",
    leadAgency: "Bank of Industry",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    routePath: "/timeline/bank-of-industry-msme-credit-expansion-milestone",
    primarySources: [
      {
        name: "Bank of Industry Annual Development Impact Report 2025",
        publisher: "Bank of Industry",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2025-007",
    slug: "dmo-series-iii-sovereign-green-bond-allotment",
    title: "Debt Management Office Allots ₦50 Billion Series III Sovereign Green Bond",
    summary: "Capital market bond fully subscribed to finance Northern Great Green Wall afforestation and regional solar mini-grid installations.",
    details: "Sovereign green finance issuance certified by climate bond standards, funding renewable minigrids and flood protection channels across 12 states.",
    expectedOrMeasuredImpact: "Financed 35,000 hectares of shelterbelt afforestation and clean solar electrification for 180 communities.",
    eventType: "approval",
    eventTypeLabel: "Capital Allotment",
    stage: "appropriation",
    stageLabel: "Capital Allotment",
    category: "Environment & Climate",
    eventDate: "2025-11-18",
    year: 2025,
    quarter: "Q4",
    datePrecision: "exact_day",
    sectorId: "environment_climate",
    sectorName: "Environment and Climate",
    leadActor: "Debt Management Office (DMO)",
    leadAgency: "Debt Management Office & Federal Ministry of Environment",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    routePath: "/timeline/dmo-series-iii-sovereign-green-bond-allotment",
    primarySources: [
      {
        name: "DMO Series III Sovereign Green Bond Allotment Gazette",
        publisher: "Debt Management Office Nigeria",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },

  // ==================== 2026 MANDATE MILESTONES ====================
  {
    id: "tle-2026-001",
    slug: "nvri-vaccine-production-surge-35m-doses",
    title: "National Veterinary Research Institute Produces 35M Animal Vaccine Doses",
    summary: "Domestic veterinary biologics surge curbing anthrax, pestes des petits ruminants (PPR), and safeguarding livestock assets.",
    details: "Modernized laboratories at NVRI Vom, Plateau State produced over 35 million doses of contagious bovine and ruminant vaccines in Q1 2026, lowering import dependency.",
    expectedOrMeasuredImpact: "Protected national livestock herds valued at over ₦2 Trillion and inoculated 12 million cattle and sheep.",
    eventType: "outcome_report",
    eventTypeLabel: "Outcome Milestone",
    stage: "outcome_report",
    stageLabel: "Verified Impact",
    category: "Agriculture & Food",
    eventDate: "2026-02-10",
    year: 2026,
    quarter: "Q1",
    datePrecision: "exact_day",
    sectorId: "agriculture_food_security",
    sectorName: "Agriculture and Food Security",
    leadActor: "NVRI & Federal Ministry of Livestock Development",
    leadAgency: "National Veterinary Research Institute (NVRI)",
    statesCovered: ["National", "Plateau", "Kaduna", "Kano", "Taraba", "Bauchi", "Niger"],
    geopoliticalZone: "National",
    routePath: "/timeline/nvri-vaccine-production-surge-35m-doses",
    primarySources: [
      {
        name: "NVRI Biologics Production and Distribution Quarterly Bulletin",
        publisher: "National Veterinary Research Institute",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2026-002",
    slug: "multi-port-modernization-apapa-onne-automation",
    title: "$1 Billion Port Modernization: Automated Cargo Scanning Deployed at Apapa & Onne",
    summary: "Activated drive-through container scanners and digital berthing systems, reducing vessel turnaround time to under 48 hours.",
    details: "Completed Phase 1 terminal infrastructure overhaul across Lagos Port Complex (Apapa), Tin Can Island, and Onne Port, integrating high-speed scanning with customs clearing.",
    expectedOrMeasuredImpact: "Cut port cargo inspection dwell times from 21 days to under 3 days and boosted non-oil maritime export clearance.",
    eventType: "operation",
    eventTypeLabel: "Operational Commissioning",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Infrastructure",
    eventDate: "2026-04-18",
    year: 2026,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "infrastructure_transportation",
    sectorName: "Infrastructure and Transportation",
    leadActor: "Nigerian Ports Authority & Nigeria Customs Service",
    leadAgency: "Nigerian Ports Authority",
    statesCovered: ["Lagos", "Rivers"],
    geopoliticalZone: "South-South",
    routePath: "/timeline/multi-port-modernization-apapa-onne-automation",
    primarySources: [
      {
        name: "NPA Port Modernization Terminal Automation Report 2026",
        publisher: "Nigerian Ports Authority",
        sourceLevel: "LEVEL_2"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2026-003",
    slug: "national-single-window-trade-portal-commissioning",
    title: "National Single Window Trade Portal Operational Across All Sea & Air Ports",
    summary: "Unified 14 government border agencies onto a single paperless digital clearance workflow, cutting port dwell times from 21 days to 3 days.",
    details: "Integrated port authorities, customs, commercial banks, NAFDAC, and SON onto a unified cloud clearing system, eliminating redundant manual checkpoints.",
    expectedOrMeasuredImpact: "Projected $4 Billion annual economic savings from eliminated port demurrage and accelerated customs processing.",
    eventType: "operation",
    eventTypeLabel: "Operational Commissioning",
    stage: "operational",
    stageLabel: "Operational Delivery",
    category: "Trade & Fiscal",
    eventDate: "2026-06-25",
    year: 2026,
    quarter: "Q2",
    datePrecision: "exact_day",
    sectorId: "economy_fiscal_reforms",
    sectorName: "Economy and Fiscal Reforms",
    leadActor: "Presidential Steering Committee on National Single Window",
    leadAgency: "The Presidency & Federal Ministry of Finance",
    statesCovered: ["National", "All Ports & Land Borders"],
    geopoliticalZone: "National",
    associatedRecordId: "ACH-DEMO-003",
    associatedRecordSlug: "fx-market-unification-single-window",
    associatedRecordTitle: "Foreign Exchange Market Unification & National Single Window System",
    associatedRecordType: "achievement",
    recordId: "ACH-DEMO-003",
    recordSlug: "fx-market-unification-single-window",
    recordType: "achievement",
    routePath: "/timeline/national-single-window-trade-portal-commissioning",
    primarySources: [
      {
        name: "National Single Window Operational Launch Gazette",
        publisher: "Federal Republic of Nigeria Official Gazette",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
  },
  {
    id: "tle-2026-004",
    slug: "q1-2026-nbs-macroeconomic-report-growth-surge",
    title: "NBS Macro Observatory Report: Q1 2026 GDP Growth Reaches 3.89%",
    summary: "Official NBS accounts confirm broad-based economic recovery with headline inflation decelerating to 15.43% and foreign reserves strengthening to $40.2 Billion.",
    details: "Statutory economic report published by the National Bureau of Statistics confirming consecutive quarters of non-oil expansion driven by manufacturing, transport, and digital services.",
    expectedOrMeasuredImpact: "Statistically verified real GDP expansion of 3.89% and external reserves consolidation.",
    eventType: "outcome_report",
    eventTypeLabel: "Outcome Milestone",
    stage: "outcome_report",
    stageLabel: "Verified Impact",
    category: "Macro Economy",
    eventDate: "2026-08-15",
    year: 2026,
    quarter: "Q3",
    datePrecision: "exact_day",
    sectorId: "economy_fiscal_reforms",
    sectorName: "Economy and Fiscal Reforms",
    leadActor: "National Bureau of Statistics (NBS)",
    leadAgency: "National Bureau of Statistics",
    statesCovered: ["National", "All 36 States", "FCT"],
    geopoliticalZone: "National",
    routePath: "/timeline/q1-2026-nbs-macroeconomic-report-growth-surge",
    primarySources: [
      {
        name: "National Bureau of Statistics Q1 2026 GDP Report",
        publisher: "National Bureau of Statistics",
        sourceLevel: "LEVEL_1"
      }
    ],
    verificationStatus: "Verified",
    isDemo: false
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
