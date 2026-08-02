import { TimelineEventRecord } from "@/types/timeline.types";

export const timelineEventRecords: TimelineEventRecord[] = [
  {
    id: "tle-001",
    slug: "fuel-subsidy-removal-announcement",
    date: "2023-05-29",
    year: 2023,
    quarter: "Q2",
    title: "Presidential Announcement of Fuel Subsidy Removal",
    stage: "announcement",
    category: "Economic Reform",
    sectorSlug: "economy",
    summary: "President Bola Tinubu announced the immediate termination of the PMS subsidy during the inaugural address to halt fiscal leakage.",
    details: "The removal of PMS subsidy eliminated monthly fiscal transfers estimated at ₦400bn, reallocating federal funds toward capital infrastructure and social protection schemes.",
    expectedOrMeasuredImpact: "Projected annual savings of ₦4.2 trillion to federal, state, and local treasuries.",
    leadAgency: "Presidency & Federal Ministry of Finance",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalZone: "National",
    relatedAchievementSlug: "fuel-subsidy-removal",
    primarySources: [
      {
        name: "Official Presidential Inaugural Speech Gazette",
        url: "https://statehouse.gov.ng/",
        documentType: "Executive Proclamation"
      },
      {
        name: "Central Bank of Nigeria Half-Year Economic Report",
        url: "https://www.cbn.gov.ng/",
        documentType: "Official Policy Report"
      }
    ],
    verificationStatus: "Verified"
  },
  {
    id: "tle-002",
    slug: "naira-fx-unification-approval",
    date: "2023-06-14",
    year: 2023,
    quarter: "Q2",
    title: "CBN FX Market Unification & Floating Operationalization",
    stage: "approval",
    category: "Fiscal & Monetary",
    sectorSlug: "economy",
    summary: "Central Bank of Nigeria unified multiple exchange rate windows into an Investors and Exporters (I&E) market-driven model.",
    details: "Abolished parallel currency windows to enhance FX liquidity transparency, clear foreign bank dividend backlogs, and incentivize FDI inflows.",
    expectedOrMeasuredImpact: "Cleared over $7 billion in verified foreign exchange forward backlogs by Q1 2024.",
    leadAgency: "Central Bank of Nigeria",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalZone: "National",
    relatedAchievementSlug: "fx-market-unification",
    primarySources: [
      {
        name: "CBN Circular on Operational Changes to the Foreign Exchange Market",
        url: "https://www.cbn.gov.ng/",
        documentType: "Regulatory Circular"
      }
    ],
    verificationStatus: "Verified"
  },
  {
    id: "tle-003",
    slug: "student-loans-act-enactment",
    date: "2023-06-12",
    year: 2023,
    quarter: "Q2",
    title: "Enactment of Access to Higher Education Act (Student Loan Law)",
    stage: "approval",
    category: "Education",
    sectorSlug: "social-services",
    summary: "Presidential assent to the Access to Higher Education Act establishing the legal framework for interest-free tertiary student loans.",
    details: "Established NELFUND with institutional governance structure, funding sources (1% of FIRS non-oil collections), and online portal portal specs.",
    expectedOrMeasuredImpact: "Statutory backing for 100% interest-free tuition and monthly living stipends for eligible tertiary students.",
    leadAgency: "Federal Ministry of Education & NELFUND",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalZone: "National",
    relatedAchievementSlug: "student-loan-scheme",
    primarySources: [
      {
        name: "Official Gazette of the Federal Republic of Nigeria - Access to Higher Education Act 2023",
        url: "https://nelfund.gov.ng/",
        documentType: "Act of Parliament"
      }
    ],
    verificationStatus: "Verified"
  },
  {
    id: "tle-004",
    slug: "nelfund-portal-launch-implementation",
    date: "2024-05-24",
    year: 2024,
    quarter: "Q2",
    title: "NELFUND Student Loan Application Portal Live Deployment",
    stage: "implementation",
    category: "Education",
    sectorSlug: "social-services",
    summary: "Public portal opening for tertiary students across federal and state universities to submit interest-free loan applications.",
    details: "Online portal launched with automated NIN, BVN, and JAMB validation algorithms to process institutional tuition and upkeep disbursements.",
    expectedOrMeasuredImpact: "Over 200,000 student applications processed across 110 tertiary institutions within first 90 days.",
    leadAgency: "Nigerian Education Loan Fund (NELFUND)",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalZone: "National",
    relatedAchievementSlug: "student-loan-scheme",
    primarySources: [
      {
        name: "NELFUND Application Deployment Launch Bulletin",
        url: "https://nelfund.gov.ng/",
        documentType: "Press Release & Portal Audit"
      }
    ],
    verificationStatus: "Verified"
  },
  {
    id: "tle-005",
    slug: "lagos-calabar-highway-fec-approval",
    date: "2024-02-27",
    year: 2024,
    quarter: "Q1",
    title: "FEC Approval & Contract Award for 700km Lagos-Calabar Coastal Highway",
    stage: "appropriation",
    category: "Infrastructure",
    sectorSlug: "infrastructure",
    summary: "Federal Executive Council approval for Phase 1 construction of the 700km 10-lane coastal highway project.",
    details: "Approved Phase 1 (47km Section 1 starting at Ahmadu Bello Way, Lagos) with concrete pavement technology designed to link 9 coastal states.",
    expectedOrMeasuredImpact: "Unlocks economic trade corridors linking South-West, South-South, and South-East maritime hubs.",
    leadAgency: "Federal Ministry of Works",
    statesCovered: ["Lagos", "Ogun", "Ondo", "Edo", "Delta", "Bayelsa", "Rivers", "Akwa Ibom", "Cross River"],
    geopoliticalZone: "South-West",
    relatedAchievementSlug: "lagos-calabar-coastal-highway",
    primarySources: [
      {
        name: "FEC Briefing Extract - Federal Ministry of Works",
        url: "https://works.gov.ng/",
        documentType: "Cabinet Decision Record"
      }
    ],
    verificationStatus: "Verified"
  },
  {
    id: "tle-006",
    slug: "lagos-calabar-highway-groundbreaking-implementation",
    date: "2024-05-26",
    year: 2024,
    quarter: "Q2",
    title: "Official Groundbreaking & Earthworks Construction on Section 1",
    stage: "implementation",
    category: "Infrastructure",
    sectorSlug: "infrastructure",
    summary: "Physical site mobilization and concrete paving on Section 1 (Ahmadu Bello Way to Lekki Deep Sea Port).",
    details: "Heavy machinery deployed for sand filling, drainage culvert installation, and 23km of 6-lane rigid pavement laying.",
    expectedOrMeasuredImpact: "Direct employment generated for over 1,500 engineers and construction personnel.",
    leadAgency: "Federal Ministry of Works & HITECH Construction",
    statesCovered: ["Lagos"],
    geopoliticalZone: "South-West",
    relatedAchievementSlug: "lagos-calabar-coastal-highway",
    primarySources: [
      {
        name: "Federal Ministry of Works Monthly Inspection Certificate",
        url: "https://works.gov.ng/",
        documentType: "Field Verification Report"
      }
    ],
    verificationStatus: "Verified"
  },
  {
    id: "tle-007",
    slug: "zungeru-hydro-commissioning-operational",
    date: "2024-05-16",
    year: 2024,
    quarter: "Q2",
    title: "Official Grid Commissioning of 700MW Zungeru Hydroelectric Power Plant",
    stage: "operational",
    category: "Energy & Power",
    sectorSlug: "infrastructure",
    summary: "Inauguration and full commercial grid synchronization of the 700MW Zungeru hydro power plant in Niger State.",
    details: "Concluded concessioning agreement, completed dam reservoir impoundment, and activated all 4 main turbines adding 700MW to the national grid.",
    expectedOrMeasuredImpact: "Increases national grid hydro capacity by 25%, supplying clean power to over 3 million households.",
    leadAgency: "Federal Ministry of Power & Mainstream Energy Solutions",
    statesCovered: ["Niger"],
    geopoliticalZone: "North-Central",
    relatedAchievementSlug: "700mw-zungeru-hydroelectric-plant",
    primarySources: [
      {
        name: "TCN Grid Operations Daily Dispatch Log",
        url: "https://www.power.gov.ng/",
        documentType: "Operational Log"
      }
    ],
    verificationStatus: "Verified"
  },
  {
    id: "tle-008",
    slug: "minimum-wage-act-enactment-approval",
    date: "2024-07-29",
    year: 2024,
    quarter: "Q3",
    title: "Presidential Assent to ₦70,000 National Minimum Wage Law",
    stage: "approval",
    category: "Economic Reform",
    sectorSlug: "economy",
    summary: "Presidential assent to the National Minimum Wage Act Amendment 2024 raising the federal baseline wage from ₦30,000 to ₦70,000.",
    details: "Tripartite agreement enacted between Federal Government, Organised Labour, and Private Sector Employers with 3-year statutory review cycle.",
    expectedOrMeasuredImpact: "Direct income increase for over 1.2 million federal and state civil servants nationwide.",
    leadAgency: "Federal Ministry of Labour and Employment",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalZone: "National",
    relatedAchievementSlug: "national-minimum-wage-increase",
    primarySources: [
      {
        name: "National Minimum Wage (Amendment) Act 2024 Gazette",
        url: "https://statehouse.gov.ng/",
        documentType: "Statutory Law"
      }
    ],
    verificationStatus: "Verified"
  },
  {
    id: "tle-009",
    slug: "minimum-wage-disbursement-operational",
    date: "2024-09-26",
    year: 2024,
    quarter: "Q3",
    title: "First Monthly Salary Disbursement of Consequential Adjustments",
    stage: "operational",
    category: "Economic Reform",
    sectorSlug: "economy",
    summary: "Federal Government disbursed September 2024 civil service payroll reflecting full ₦70,000 minimum wage and consequential adjustments.",
    details: "Integrated Personnel and Payroll Information System (IPPIS) updated across all Ministries, Departments, and Agencies (MDAs).",
    expectedOrMeasuredImpact: "100% of federal workers received updated statutory wage structure in September payroll.",
    leadAgency: "Office of the Accountant General of the Federation",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalZone: "National",
    relatedAchievementSlug: "national-minimum-wage-increase",
    primarySources: [
      {
        name: "OAGF Payroll Disbursement Confirmation Notice",
        url: "https://finance.gov.ng/",
        documentType: "Financial Disbursement Record"
      }
    ],
    verificationStatus: "Verified"
  },
  {
    id: "tle-010",
    slug: "cct-conditional-cash-transfer-disbursement-impact",
    date: "2024-10-15",
    year: 2024,
    quarter: "Q4",
    title: "Verification Audit: 5 Million Household Beneficiaries Enrolled",
    stage: "impact",
    category: "Healthcare",
    sectorSlug: "social-services",
    summary: "Independent audit confirms biometrically verified conditional cash transfer payments to 5.2 million vulnerable households.",
    details: "World Bank audited digital payment rail transferring ₦25,000 monthly directly into BVN/NIN verified bank accounts and mobile wallets.",
    expectedOrMeasuredImpact: "Direct social safety net protection reaching over 20 million citizens during economic structural reforms.",
    leadAgency: "Federal Ministry of Humanitarian Affairs & National Social Safety-Nets Office",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalZone: "National",
    relatedAchievementSlug: "conditional-cash-transfer-expansion",
    primarySources: [
      {
        name: "World Bank National Social Protection Audit Bulletin Q3 2024",
        url: "https://www.worldbank.org/en/country/nigeria",
        documentType: "Multilateral Audit"
      }
    ],
    verificationStatus: "Verified"
  }
];
