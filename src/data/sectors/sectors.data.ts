import { SectorRecord } from "@/types/sector";

export const sectorsData: SectorRecord[] = [
  {
    slug: "economy",
    title: "Economy & Fiscal Reforms",
    shortTitle: "Economy",
    publicationStatus: "active",
    evidenceProfile: "official-and-independent",
    summary: "Comprehensive macroeconomic restructuring including FX market unification, fuel subsidy reallocation, and fiscal revenue optimization.",
    fullDescription: "The Economic & Fiscal Reform agenda focuses on transitioning Nigeria from unsustainable fiscal consumption to production-led economic stability. Primary interventions include the unification of segmented FX windows into a market-driven willing-buyer willing-seller system, the elimination of unbudgeted fuel subsidies to expand capital allocations, and major tax policy modernization.",
    iconName: "TrendingUp",
    colorTheme: "#2E3192",
    heroImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
    achievementFilterCategory: "economy",
    leadMinistries: [
      { name: "Federal Ministry of Finance", role: "Fiscal Policy & FAAC Coordination", officialWebsite: "https://finance.gov.ng" },
      { name: "Central Bank of Nigeria (CBN)", role: "Monetary Policy & Foreign Exchange", officialWebsite: "https://cbn.gov.ng" },
      { name: "Federal Inland Revenue Service (FIRS)", role: "Tax Reform & Revenue Collection", officialWebsite: "https://firs.gov.ng" }
    ],
    indicators: [
      {
        id: "ind-fx-reserves",
        name: "Gross External Reserves",
        value: "Strengthened Buffer",
        change: "Upward Trend",
        trend: "up",
        classification: "Actual",
        description: "Gross foreign reserves strengthened following foreign exchange market harmonization and portfolio inflows.",
        sourceName: "Central Bank of Nigeria",
        sourceUrl: "https://cbn.gov.ng",
        sourceLevel: 2,
        lastUpdated: "Apr 2025",
        chartData: [
          { name: "Q2 2023", value: 32.8 },
          { name: "Q4 2023", value: 33.1 },
          { name: "Q2 2024", value: 34.7 },
          { name: "Q4 2024", value: 35.8 },
          { name: "Q1 2025", value: 36.2 }
        ]
      },
      {
        id: "ind-subsidy-savings",
        name: "Annual Subsidy Savings",
        value: "₦5.2T+",
        change: "+72% FAAC Share",
        trend: "up",
        classification: "Actual",
        description: "Annual expenditure saved from PMS fuel subsidy termination reallocated to state allocations and capital infrastructure.",
        sourceName: "Federal Ministry of Finance / FAAC",
        sourceUrl: "https://finance.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Mar 2025",
        chartData: [
          { name: "2022 Baseline", value: 0 },
          { name: "2023 (Jun-Dec)", value: 2.1 },
          { name: "2024 Full Year", value: 4.8 },
          { name: "2025 (Projected)", value: 5.4 }
        ]
      },
      {
        id: "ind-gdp-growth",
        name: "Annual GDP Growth Rate",
        value: "3.46%",
        previousValue: "2.74%",
        change: "+0.72%",
        trend: "up",
        classification: "Actual",
        description: "Real Gross Domestic Product growth driven by services, telecommunications, and financial institutions.",
        sourceName: "National Bureau of Statistics (NBS)",
        sourceUrl: "https://nigerianstat.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Q4 2024",
        chartData: [
          { name: "Q1 2023", value: 2.31 },
          { name: "Q3 2023", value: 2.54 },
          { name: "Q1 2024", value: 2.98 },
          { name: "Q3 2024", value: 3.21 },
          { name: "Q4 2024", value: 3.46 }
        ]
      },
      {
        id: "ind-fx-backlog",
        name: "Verified FX Backlog Cleared",
        value: "100% Cleared",
        change: "Verified Settlement",
        trend: "neutral",
        classification: "Actual",
        description: "Complete clearance of outstanding valid foreign exchange claims owed to airlines, banks, and importers.",
        sourceName: "Central Bank of Nigeria",
        sourceUrl: "https://cbn.gov.ng",
        sourceLevel: 2,
        lastUpdated: "Mar 2024"
      }
    ],
    keyPolicies: [
      {
        id: "pol-fx-unification",
        title: "Foreign Exchange Market Unification",
        description: "Eliminated multiple official rate windows in favor of a unified order book at the I&E window.",
        status: "Completed",
        effectiveDate: "June 2023",
        leadAgency: "Central Bank of Nigeria",
        impactSummary: "Eliminated massive foreign exchange arbitrage and restored portfolio inflows."
      },
      {
        id: "pol-subsidy-removal",
        title: "Fuel Subsidy Termination",
        description: "Discontinued unbudgeted premium motor spirit (PMS) subsidy payouts.",
        status: "Completed",
        effectiveDate: "May 2023",
        leadAgency: "Federal Ministry of Finance",
        impactSummary: "Saved over ₦5.2 Trillion annually for critical infrastructure and subnational FAAC distributions."
      },
      {
        id: "pol-fiscal-tax-reforms",
        title: "Presidential Committee on Fiscal Policy & Tax Reforms",
        description: "Harmonization of over 60 multi-tiered taxes down to single-digit essential revenue streams.",
        status: "Implementation Ongoing",
        effectiveDate: "August 2023",
        leadAgency: "FIRS / Presidential Tax Reform Committee",
        impactSummary: "Draft tax bills submitted to National Assembly to boost non-oil tax-to-GDP ratio."
      }
    ],
    majorProjects: [
      {
        id: "prj-consumer-credit",
        title: "Nigerian Consumer Credit Corporation (CREDICORP)",
        description: "Establishment of a consumer credit guarantee framework for civil servants and working Nigerians.",
        locationScope: "National / All 36 States",
        status: "Operational",
        budgetOrValue: "₦100 Billion Initial Fund",
        leadAgency: "CREDICORP / Federal Ministry of Finance"
      }
    ],
    updates: [
      {
        id: "upd-econ-1",
        date: "Apr 2025",
        title: "Gross FX Reserves Hit Multi-Year High",
        summary: "Gross external reserves reach highest level in 36 months following sustained diaspora remittances and trade balance surplus.",
        category: "Monetary Policy",
        sourceName: "Central Bank of Nigeria",
        sourceUrl: "https://cbn.gov.ng"
      },
      {
        id: "upd-econ-2",
        date: "Feb 2025",
        title: "FAAC Allocations Reach Record Highs",
        summary: "Subnational governments receive increased monthly disbursements funding healthcare, state roads, and civil service wages.",
        category: "Fiscal Allocation",
        sourceName: "Federal Ministry of Finance",
        sourceUrl: "https://finance.gov.ng"
      }
    ],
    sources: [
      {
        name: "Central Bank of Nigeria Statistical Bulletin",
        url: "https://cbn.gov.ng",
        level: 1,
        publicationDate: "Q1 2025",
        documentTitle: "Quarterly Financial and Monetary Stability Summary"
      },
      {
        name: "National Bureau of Statistics GDP Reports",
        url: "https://nigerianstat.gov.ng",
        level: 1,
        publicationDate: "Q4 2024",
        documentTitle: "Nigerian Gross Domestic Product Report Q4 2024"
      },
      {
        name: "World Bank Nigeria Development Update",
        url: "https://worldbank.org",
        level: 3,
        publicationDate: "Dec 2024",
        documentTitle: "Turning the Corner: Macroeconomic Stabilization in Nigeria"
      }
    ],
    relatedSectorSlugs: ["infrastructure", "social-services"]
  },

  {
    slug: "security",
    title: "Security & National Stability",
    shortTitle: "Security",
    publicationStatus: "active",
    evidenceProfile: "primarily-official",
    summary: "Joint task force military operations, modernized intelligence surveillance, counter-insurgency capabilities, and community-level peacebuilding.",
    fullDescription: "The Security and National Stability architecture combines joint kinetic operations, modern air surveillance technology, border patrol hardening, and targeted intelligence interventions across the North-East, North-West, Middle Belt, and Niger Delta regions.",
    iconName: "ShieldCheck",
    colorTheme: "#7E69AB",
    heroImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
    achievementFilterCategory: "security",
    leadMinistries: [
      { name: "Office of the National Security Adviser (ONSA)", role: "Strategic Security Coordination", officialWebsite: "https://onsa.gov.ng" },
      { name: "Federal Ministry of Defence", role: "Armed Forces Command", officialWebsite: "https://defence.gov.ng" },
      { name: "Nigeria Police Force / Ministry of Police Affairs", role: "Internal Security & Law Enforcement", officialWebsite: "https://npf.gov.ng" }
    ],
    indicators: [
      {
        id: "ind-crime-reduction",
        name: "Crime Rate Reduction Index",
        value: "-15%",
        change: "-15% overall",
        trend: "down",
        classification: "Actual",
        description: "Measurable reduction in violent crimes and highway ambushes across key transport corridors since June 2023.",
        sourceName: "Nigeria Police Force / Joint Security Taskforce",
        sourceUrl: "https://npf.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Q1 2025",
        chartData: [
          { name: "Q2 2023", value: 0 },
          { name: "Q3 2023", value: -5.2 },
          { name: "Q4 2023", value: -8.7 },
          { name: "Q1 2024", value: -12.3 },
          { name: "Q1 2025", value: -15.0 }
        ]
      },
      {
        id: "ind-personnel-deployed",
        name: "Security Personnel Deployed",
        value: "42,500",
        change: "+12,000 Tactical",
        trend: "up",
        classification: "Actual",
        description: "Newly trained police tactical units, military personnel, and civil defense officers deployed across high-risk zones.",
        sourceName: "Ministry of Defence",
        sourceUrl: "https://defence.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Feb 2025"
      },
      {
        id: "ind-lgas-covered",
        name: "Local Government Coverage Areas",
        value: "744",
        change: "744 / 774 LGAs",
        trend: "up",
        classification: "Actual",
        description: "Local government areas actively covered by enhanced intelligence and rapid response security posts.",
        sourceName: "Office of the National Security Adviser",
        sourceUrl: "https://onsa.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Mar 2025"
      }
    ],
    keyPolicies: [
      {
        id: "pol-national-security-strategy",
        title: "Updated National Security Strategy Framework",
        description: "Comprehensive multi-agency defense framework emphasizing digital intelligence gathering and local community involvement.",
        status: "Completed",
        effectiveDate: "June 2023",
        leadAgency: "Office of the National Security Adviser",
        impactSummary: "Streamlined operational command structures between army, navy, air force, police, and civil defense."
      }
    ],
    majorProjects: [
      {
        id: "prj-surveillance-tech",
        title: "Smart Border Surveillance & Drone Reconnaissance Network",
        description: "Deployment of high-altitude surveillance drones and thermal imaging equipment along vulnerable border corridors.",
        locationScope: "Northern Border States & Maritime Coastal Waters",
        status: "Operational",
        leadAgency: "Nigerian Air Force / Customs Service"
      }
    ],
    updates: [
      {
        id: "upd-sec-1",
        date: "Feb 2025",
        title: "Joint Taskforce Neutralizes Insurgent Enclaves in North-East",
        summary: "Coordinated air and land operations dismantle key camps in Sambisa forest and Lake Chad basin, enabling civilian resettlement.",
        category: "Military Operations",
        sourceName: "Defence Headquarters",
        sourceUrl: "https://defence.gov.ng"
      }
    ],
    sources: [
      {
        name: "Ministry of Defence Official Communique",
        url: "https://defence.gov.ng",
        level: 1,
        publicationDate: "Jan 2025",
        documentTitle: "National Defence Operations Progress Summary"
      }
    ],
    relatedSectorSlugs: ["economy", "infrastructure"]
  },

  {
    slug: "infrastructure",
    title: "Infrastructure & Transportation",
    shortTitle: "Infrastructure",
    publicationStatus: "active",
    evidenceProfile: "official-and-independent",
    summary: "Large-scale transport corridors, power grid additions, deep sea port connectivity, and digital telecommunications expansion.",
    fullDescription: "The Infrastructure Development sector targets strategic investments in multi-lane national highways, hydroelectric power generation, rail network expansion, and rural digital fiber optic deployment under the Renewed Hope Infrastructure Development Fund.",
    iconName: "Building2",
    colorTheme: "#059669",
    heroImage: "https://images.unsplash.com/photo-1516937941344-00b4e0337589",
    achievementFilterCategory: "infrastructure",
    leadMinistries: [
      { name: "Federal Ministry of Works", role: "Highways & Road Infrastructure", officialWebsite: "https://works.gov.ng" },
      { name: "Federal Ministry of Power", role: "Electricity Generation & Grid Expansion", officialWebsite: "https://power.gov.ng" },
      { name: "Federal Ministry of Transportation", role: "Railways & Ports", officialWebsite: "https://transportation.gov.ng" }
    ],
    indicators: [
      {
        id: "ind-coastal-highway-phase1",
        name: "Lagos-Calabar Coastal Highway (Phase 1)",
        value: "47 km Paved",
        change: "Target: 700km Total",
        trend: "up",
        classification: "Actual",
        description: "Phase 1 concrete paving from Victoria Island, Lagos, toward Lekki Deep Sea Port corridor.",
        sourceName: "Federal Ministry of Works",
        sourceUrl: "https://works.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Apr 2025"
      },
      {
        id: "ind-zungeru-power",
        name: "Zungeru Hydroelectric Power Grid Addition",
        value: "700 MW",
        change: "+10% Grid Capacity",
        trend: "up",
        classification: "Actual",
        description: "700MW hydroelectric plant in Niger State fully completed, concessioned, and synchronized to the national grid.",
        sourceName: "Federal Ministry of Power / NERC",
        sourceUrl: "https://power.gov.ng",
        sourceLevel: 1,
        lastUpdated: "May 2024",
        chartData: [
          { name: "Pre-Zungeru Grid", value: 4500 },
          { name: "Zungeru Synchronized", value: 5200 }
        ]
      },
      {
        id: "ind-rhidf-fund",
        name: "Renewed Hope Infrastructure Fund",
        value: "₦20 Trillion",
        change: "Target Target Fund",
        trend: "neutral",
        classification: "Projected",
        description: "Presidential infrastructure investment vehicle designed to bridge national funding gaps across rail, power, and agriculture logistics.",
        sourceName: "Infrastructure Concession Regulatory Commission",
        sourceUrl: "https://icrc.gov.ng",
        sourceLevel: 1,
        lastUpdated: "March 2024"
      }
    ],
    keyPolicies: [
      {
        id: "pol-electricity-act",
        title: "Electricity Act 2023 Implementation",
        description: "Decentralized power regulation allowing state governments and private entities to generate, transmit, and distribute electricity.",
        status: "Completed",
        effectiveDate: "June 2023",
        leadAgency: "Federal Ministry of Power / NERC",
        impactSummary: "Enabled over 8 state governments to establish independent state electricity regulatory commissions."
      }
    ],
    majorProjects: [
      {
        id: "prj-coastal-highway",
        title: "700km Lagos-Calabar Coastal Highway",
        description: "10-lane concrete coastal highway connecting 9 maritime states from Lagos to Cross River.",
        locationScope: "9 Coastal Maritime States",
        status: "Implementation Ongoing",
        progressPercentage: 15,
        budgetOrValue: "Phase 1 - ₦1.06 Trillion",
        leadAgency: "Federal Ministry of Works"
      },
      {
        id: "prj-zungeru-dam",
        title: "700MW Zungeru Hydroelectric Power Plant",
        description: "Second-largest hydro dam project in Nigeria delivering 2.6 billion kWh of clean power annually.",
        locationScope: "Niger State / National Grid",
        status: "Operational",
        progressPercentage: 100,
        leadAgency: "Federal Ministry of Power / Mainstream Energy"
      }
    ],
    updates: [
      {
        id: "upd-infra-1",
        date: "Apr 2025",
        title: "Lagos-Calabar Highway Section 1 Inspection Passed",
        summary: "Federal Ministry of Works audit confirms high-density concrete pavement specification compliance for first 47km.",
        category: "Road Construction",
        sourceName: "Federal Ministry of Works",
        sourceUrl: "https://works.gov.ng"
      }
    ],
    sources: [
      {
        name: "Federal Ministry of Works Infrastructure Audit",
        url: "https://works.gov.ng",
        level: 1,
        publicationDate: "Apr 2025",
        documentTitle: "National Highway Construction Quarterly Review"
      }
    ],
    relatedSectorSlugs: ["economy", "social-services"]
  },

  {
    slug: "social-services",
    title: "Social Services & Human Development",
    shortTitle: "Social Services",
    publicationStatus: "active",
    evidenceProfile: "official-and-independent",
    summary: "Expansion of national safety nets, student loans for tertiary institutions, targeted cash transfers, and primary healthcare expansion.",
    fullDescription: "The Social Services sector establishes a sustainable social safety framework protecting low-income households and expanding human capital development. Key pillars include NELFUND interest-free higher education loans, direct digital conditional cash transfers, and primary healthcare revitalization.",
    iconName: "HeartPulse",
    colorTheme: "#DC2626",
    heroImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    achievementFilterCategory: "social-services",
    leadMinistries: [
      { name: "Nigerian Education Loan Fund (NELFUND)", role: "Tertiary Student Loans", officialWebsite: "https://nelfund.gov.ng" },
      { name: "Federal Ministry of Humanitarian Affairs & Poverty Alleviation", role: "Social Safety Nets", officialWebsite: "https://humanitarian.gov.ng" },
      { name: "Federal Ministry of Health & Social Welfare", role: "Healthcare Revitalization", officialWebsite: "https://health.gov.ng" }
    ],
    indicators: [
      {
        id: "ind-nelfund-beneficiaries",
        name: "NELFUND Student Beneficiaries",
        value: "124,850",
        change: "+124,850 Students",
        trend: "up",
        classification: "Actual",
        description: "Verified tertiary students in 110 federal and state universities receiving 100% tuition coverage and monthly upkeep stipends.",
        sourceName: "NELFUND Portal",
        sourceUrl: "https://nelfund.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Mar 2025",
        chartData: [
          { name: "Jun 2024", value: 20000 },
          { name: "Sep 2024", value: 55000 },
          { name: "Dec 2024", value: 91250 },
          { name: "Mar 2025", value: 124850 }
        ]
      },
      {
        id: "ind-cash-transfers",
        name: "Cash Transfer Recipient Households",
        value: "5.4 Million",
        change: "+28% YoY",
        trend: "up",
        classification: "Actual",
        description: "Poor and vulnerable households receiving direct digital ₦25,000 monthly stipends validated by NIN/BVN registries.",
        sourceName: "National Social Safety Nets Office (NASSCO)",
        sourceUrl: "https://nassco.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Mar 2025"
      },
      {
        id: "ind-health-coverage",
        name: "Rural Primary Healthcare Access",
        value: "52%",
        previousValue: "38%",
        change: "+14%",
        trend: "up",
        classification: "Actual",
        description: "Percentage of rural citizens with access to functional primary health centers within 5km.",
        sourceName: "Federal Ministry of Health",
        sourceUrl: "https://health.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Q4 2024"
      }
    ],
    keyPolicies: [
      {
        id: "pol-student-loan-act",
        title: "Access to Higher Education Act (Student Loan Act)",
        description: "Enacted legal foundation creating NELFUND to issue interest-free higher education loans directly to Nigerian students.",
        status: "Completed",
        effectiveDate: "June 2023 / Amended April 2024",
        leadAgency: "Federal Ministry of Education / NELFUND",
        impactSummary: "Eliminated financial barriers to university and polytechnic education for low-income youths."
      }
    ],
    majorProjects: [
      {
        id: "prj-nelfund-portal",
        title: "NELFUND Digital Student Loan Disbursement System",
        description: "Paperless digital application portal facilitating direct tuition transfer to institutions and upkeep to student wallets.",
        locationScope: "36 States & FCT / 110 Institutions",
        status: "Operational",
        budgetOrValue: "₦15.4 Billion Disbursed",
        leadAgency: "NELFUND"
      },
      {
        id: "prj-cash-transfer-expansion",
        title: "National Social Register Biometric Upgrade",
        description: "100% NIN/BVN digital link of 5.4M beneficiary households to eradicate ghost payment leakages.",
        locationScope: "774 Local Government Areas",
        status: "Operational",
        leadAgency: "NASSCO / Ministry of Humanitarian Affairs"
      }
    ],
    updates: [
      {
        id: "upd-soc-1",
        date: "Mar 2025",
        title: "NELFUND Expands Loan Coverage to State Polytechnics",
        summary: "State-owned polytechnics across North-West and South-West regions fully integrated into NELFUND disbursement system.",
        category: "Education",
        sourceName: "NELFUND Press Bureau",
        sourceUrl: "https://nelfund.gov.ng"
      }
    ],
    sources: [
      {
        name: "NELFUND Quarterly Beneficiary Audit Report",
        url: "https://nelfund.gov.ng",
        level: 1,
        publicationDate: "Mar 2025",
        documentTitle: "NELFUND Disbursement & Institutional Audit Q1 2025"
      },
      {
        name: "NASSCO Biometric Verification Register",
        url: "https://nassco.gov.ng",
        level: 1,
        publicationDate: "Feb 2025",
        documentTitle: "National Social Register Validation Audit"
      }
    ],
    relatedSectorSlugs: ["education", "healthcare", "economy"]
  },

  {
    slug: "agriculture",
    title: "Agriculture & Food Security",
    shortTitle: "Agriculture",
    publicationStatus: "active-with-qualification",
    evidenceProfile: "limited-independent-evidence",
    qualificationNote: "Sector indicators are sourced from preliminary Ministry reports and regional yield estimates. Nationwide independent verification by NBS is currently under review for Q2 2025 release.",
    summary: "Dry season farming initiatives, subsidized input distribution, agricultural Mechanization Hubs, and grain reserves stabilization.",
    fullDescription: "Agriculture and Food Security focuses on expanding domestic food output, curbing food inflation, and mechanizing smallholder farming. Key interventions include dry-season wheat and rice farming programs and strategic grain releases.",
    iconName: "Wheat",
    colorTheme: "#D4AF37",
    heroImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854",
    leadMinistries: [
      { name: "Federal Ministry of Agriculture and Food Security", role: "Agricultural Development & Inputs", officialWebsite: "https://fmard.gov.ng" }
    ],
    indicators: [
      {
        id: "ind-agric-output",
        name: "Staple Crop Production Growth",
        value: "+15% YoY",
        change: "+15% Yield boost",
        trend: "up",
        classification: "Provisional",
        description: "Estimated annual output increase in wheat, maize, and cassava across major agrarian belts.",
        sourceName: "Federal Ministry of Agriculture",
        sourceUrl: "https://fmard.gov.ng",
        sourceLevel: 2,
        lastUpdated: "Q4 2024"
      },
      {
        id: "ind-farmers-supported",
        name: "Supported Smallholder Farmers",
        value: "2.3 Million",
        change: "Fertilizer & Seed Support",
        trend: "up",
        classification: "Provisional",
        description: "Registered farmers benefiting from subsidized fertilizers, high-yield seeds, and agro-chemicals.",
        sourceName: "Federal Ministry of Agriculture",
        sourceUrl: "https://fmard.gov.ng",
        sourceLevel: 2,
        lastUpdated: "Jan 2025"
      }
    ],
    keyPolicies: [
      {
        id: "pol-dry-season-farming",
        title: "National Dry-Season Wheat & Rice Farming Support",
        description: "Emergency cultivation initiative allocating 50% input subsidies to wheat farmers across 15 northern states.",
        status: "Implementation Ongoing",
        effectiveDate: "November 2023",
        leadAgency: "Federal Ministry of Agriculture",
        impactSummary: "Harvested over 300,000 metric tonnes of dry-season wheat in Jigawa and Kano states."
      }
    ],
    majorProjects: [
      {
        id: "prj-grain-reserves",
        title: "Strategic Grain Reserve Release Scheme",
        description: "Release of 42,000 metric tonnes of maize, sorghum, and millet to mitigate food market prices.",
        locationScope: "National Distribution",
        status: "Completed",
        leadAgency: "Federal Ministry of Agriculture"
      }
    ],
    updates: [
      {
        id: "upd-ag-1",
        date: "Jan 2025",
        title: "Dry Season Harvest Boosts Local Wheat Stocks",
        summary: "Jigawa dry season wheat harvest yields record output, reducing import dependency.",
        category: "Crop Harvest",
        sourceName: "Ministry of Agriculture Bulletin",
        sourceUrl: "https://fmard.gov.ng"
      }
    ],
    sources: [
      {
        name: "Federal Ministry of Agriculture & Food Security Annual Brief",
        url: "https://fmard.gov.ng",
        level: 2,
        publicationDate: "Dec 2024",
        documentTitle: "Dry Season Farming Program Progress Report"
      }
    ],
    relatedSectorSlugs: ["economy", "infrastructure"]
  },

  {
    slug: "education",
    title: "Education & Student Support",
    shortTitle: "Education",
    publicationStatus: "active-with-qualification",
    evidenceProfile: "official-and-independent",
    qualificationNote: "Basic and secondary education data points are qualified by state-by-state execution variances. NELFUND tertiary statistics are fully audited.",
    summary: "Tertiary student loan scheme, smart school infrastructure construction, teacher capacity building, and out-of-school child integration.",
    fullDescription: "The Education Sector Transformation agenda addresses higher education access, primary school infrastructure renewal, and digital literacy. The primary anchor is NELFUND, complemented by UBEC state matching grants.",
    iconName: "GraduationCap",
    colorTheme: "#10B981",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    leadMinistries: [
      { name: "Federal Ministry of Education", role: "Education Policy & Oversight", officialWebsite: "https://education.gov.ng" },
      { name: "Universal Basic Education Commission (UBEC)", role: "Basic Education Infrastructure", officialWebsite: "https://ubec.gov.ng" }
    ],
    indicators: [
      {
        id: "ind-schools-renovated",
        name: "Renovated & Constructed Schools",
        value: "850+",
        change: "+850 Facilities",
        trend: "up",
        classification: "Actual",
        description: "Primary and secondary school classrooms constructed or modernized with UBEC counter-funding.",
        sourceName: "UBEC Quarterly Report",
        sourceUrl: "https://ubec.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Dec 2024"
      },
      {
        id: "ind-teachers-trained",
        name: "Teachers Trained in Digital Pedagogy",
        value: "45,000",
        change: "+45,000 Certified",
        trend: "up",
        classification: "Actual",
        description: "Public school educators completing professional development training in digital learning tools.",
        sourceName: "Federal Ministry of Education",
        sourceUrl: "https://education.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Feb 2025"
      }
    ],
    keyPolicies: [
      {
        id: "pol-dot-policy",
        title: "DOTS Education Reform Framework",
        description: "Data, Out-of-school children, Teacher training, and Skill development policy framework.",
        status: "Implementation Ongoing",
        effectiveDate: "March 2024",
        leadAgency: "Federal Ministry of Education",
        impactSummary: "Targeting reintegration of 4 million out-of-school children into basic schools."
      }
    ],
    majorProjects: [
      {
        id: "prj-smart-schools",
        title: "UBEC Model Smart Schools Program",
        description: "State-of-the-art digital basic education centers equipped with solar power and internet connectivity.",
        locationScope: "36 States & FCT",
        status: "Operational",
        leadAgency: "UBEC"
      }
    ],
    updates: [
      {
        id: "upd-edu-1",
        date: "Feb 2025",
        title: "45,000 Teachers Complete Digital Upskilling",
        summary: "National Teacher Institute certifies first cohort under the DOTS capacity building framework.",
        category: "Teacher Development",
        sourceName: "Federal Ministry of Education",
        sourceUrl: "https://education.gov.ng"
      }
    ],
    sources: [
      {
        name: "UBEC Performance Review",
        url: "https://ubec.gov.ng",
        level: 1,
        publicationDate: "Jan 2025",
        documentTitle: "Basic Education Infrastructure Audit"
      }
    ],
    relatedSectorSlugs: ["social-services", "healthcare"]
  },

  {
    slug: "healthcare",
    title: "Healthcare & Public Health",
    shortTitle: "Healthcare",
    publicationStatus: "active-with-qualification",
    evidenceProfile: "official-and-independent",
    qualificationNote: "Primary healthcare center data reflects ongoing federal-state co-funding audits. Insurance coverage statistics are sourced from NHIA portals.",
    summary: "Revitalization of 8,800 primary healthcare centers, expansion of NHIA coverage, and domestic medical equipment manufacturing incentives.",
    fullDescription: "The Healthcare & Public Health sector focuses on strengthening frontline healthcare delivery, unlocking healthcare value chains, and guaranteeing health insurance for vulnerable citizens under the Basic Health Care Provision Fund (BHCPF).",
    iconName: "Heart",
    colorTheme: "#E63946",
    heroImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982",
    leadMinistries: [
      { name: "Federal Ministry of Health & Social Welfare", role: "Public Health & Sector Governance", officialWebsite: "https://health.gov.ng" },
      { name: "National Primary Health Care Development Agency (NPHCDA)", role: "Frontline Health Infrastructure", officialWebsite: "https://nphcda.gov.ng" },
      { name: "National Health Insurance Authority (NHIA)", role: "Health Insurance Coverage", officialWebsite: "https://nhia.gov.ng" }
    ],
    indicators: [
      {
        id: "ind-phc-revitalized",
        name: "Revitalized Primary Healthcare Centers",
        value: "420",
        change: "Target: 8,800 PHCs",
        trend: "up",
        classification: "Actual",
        description: "Primary healthcare clinics upgraded with solar power, essential medicines, and trained midwives.",
        sourceName: "NPHCDA Operational Audit",
        sourceUrl: "https://nphcda.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Jan 2025"
      },
      {
        id: "ind-nhia-coverage",
        name: "NHIA Enrolled Beneficiaries",
        value: "8.5 Million",
        change: "+1.8M Enrolled",
        trend: "up",
        classification: "Actual",
        description: "Vulnerable individuals covered by subsidized health insurance under the Vulnerable Group Fund.",
        sourceName: "NHIA Portal",
        sourceUrl: "https://nhia.gov.ng",
        sourceLevel: 1,
        lastUpdated: "Feb 2025"
      }
    ],
    keyPolicies: [
      {
        id: "pol-health-sector-renewal",
        title: "Nigeria Health Sector Renewal Investment Initiative (NHSRII)",
        description: "Sector-wide approach (SWAp) compact signed between Federal Government, 36 State Governors, and International Donors.",
        status: "Completed",
        effectiveDate: "December 2023",
        leadAgency: "Federal Ministry of Health",
        impactSummary: "Secured over ₦1.5 Trillion in pooled donor and federal funds for primary health care."
      }
    ],
    majorProjects: [
      {
        id: "prj-phc-solarization",
        title: "Primary Health Center Solarization Project",
        description: "Installation of 24/7 off-grid solar power systems in rural health clinics to support cold chain vaccine storage.",
        locationScope: "Selected LGAs in 36 States",
        status: "Implementation Ongoing",
        leadAgency: "NPHCDA / Rural Electrification Agency"
      }
    ],
    updates: [
      {
        id: "upd-hea-1",
        date: "Jan 2025",
        title: "NHIA Enrolls 1.8M Additional Vulnerable Citizens",
        summary: "Vulnerable Group Fund disbursements enable free maternal and child treatment across 1,200 clinics.",
        category: "Health Insurance",
        sourceName: "NHIA Bulletin",
        sourceUrl: "https://nhia.gov.ng"
      }
    ],
    sources: [
      {
        name: "Federal Ministry of Health SWAp Progress Brief",
        url: "https://health.gov.ng",
        level: 1,
        publicationDate: "Jan 2025",
        documentTitle: "National Health Renewal Compact Implementation Audit"
      }
    ],
    relatedSectorSlugs: ["social-services", "education"]
  },

  {
    slug: "power-energy",
    title: "Power & Energy Infrastructure",
    shortTitle: "Power & Energy",
    publicationStatus: "developing",
    evidenceProfile: "under-review",
    qualificationNote: "Sector architecture registered for future expansion. Selected power indicators (Zungeru Hydro, Electricity Act) are currently active under the primary Infrastructure sector.",
    summary: "Grid capacity expansion, renewable solar mini-grids, off-grid electrification, and gas-to-power industrial pipelines.",
    fullDescription: "Developing sector dedicated to standalone tracking of generation, transmission, distribution, state electricity markets, and renewable energy adoption.",
    iconName: "Zap",
    colorTheme: "#F59E0B",
    leadMinistries: [
      { name: "Federal Ministry of Power", role: "Electricity Policy", officialWebsite: "https://power.gov.ng" }
    ],
    indicators: [],
    keyPolicies: [],
    majorProjects: [],
    updates: [],
    sources: [],
    relatedSectorSlugs: ["infrastructure", "economy"]
  },

  {
    slug: "digital-economy",
    title: "Digital Economy & Telecommunications",
    shortTitle: "Digital Economy",
    publicationStatus: "developing",
    evidenceProfile: "under-review",
    qualificationNote: "Sector architecture registered for future expansion. Digital skills (3MTT) and fiber optic initiatives will be fully published upon data audit completion.",
    summary: "3 Million Technical Talent (3MTT) training, broadband fiber optic network expansion, and tech startup funding.",
    fullDescription: "Developing sector tracking digital skills, artificial intelligence strategy, telecommunications infrastructure, and e-governance.",
    iconName: "Laptop",
    colorTheme: "#3B82F6",
    leadMinistries: [
      { name: "Federal Ministry of Communications, Innovation & Digital Economy", role: "Digital Transformation", officialWebsite: "https://bsp.gov.ng" }
    ],
    indicators: [],
    keyPolicies: [],
    majorProjects: [],
    updates: [],
    sources: [],
    relatedSectorSlugs: ["economy", "education"]
  }
];
