import { PolicyRecord } from "@/types/policy.types";

export const policiesData: PolicyRecord[] = [
  {
    id: "pol-001",
    slug: "access-to-higher-education-act",
    title: "Access to Higher Education Act (Student Loan Law)",
    shortTitle: "Student Loan Act",
    policyType: "legislation",
    status: "fully-implemented",
    publicationStatus: "publishable",
    legalAuthority: "act",
    authorityReference: "Official Gazette No. 104 Vol. 110, Access to Higher Education Act 2023",
    sectorSlug: "social-services",
    leadAgency: "Nigerian Education Loan Fund (NELFUND)",
    responsibleInstitutions: [
      "Federal Ministry of Education",
      "Federal Inland Revenue Service (FIRS)",
      "Central Bank of Nigeria (CBN)"
    ],
    summary: "Statutory framework establishing interest-free tuition and living upkeep loans for eligible Nigerian tertiary students.",
    fullDescription: "Enacted to democratize access to higher education by providing interest-free loans to students pursuing tertiary education in public institutions. Funded via 1% statutory allocation of non-oil tax revenues collected by FIRS.",
    backgroundContext: "Higher education tuition and upkeep costs previously barred low-income students from tertiary enrollment across federal and state institutions.",
    keyObjectives: [
      "Remove financial barriers for low-income tertiary students nationwide",
      "Establish NELFUND digital portal for transparent loan application & processing",
      "Provide 100% tuition coverage plus monthly living upkeep stipends"
    ],
    effectiveDate: "2023-06-12",
    announcementDate: "2023-05-29",
    approvalDate: "2023-06-12",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalScope: "National",
    milestones: [
      {
        date: "2023-06-12",
        title: "Presidential Assent to Student Loan Bill",
        description: "President Bola Tinubu signed the Access to Higher Education Bill into law.",
        stage: "approval"
      },
      {
        date: "2024-04-03",
        title: "Enactment of Repeal and Re-enactment Act 2024",
        description: "Expanded loan eligibility criteria to remove family income ceilings and add vocational skill training coverage.",
        stage: "approval"
      },
      {
        date: "2024-05-24",
        title: "NELFUND Online Portal Deployment",
        description: "Public application portal launched for tertiary students.",
        stage: "implementation"
      },
      {
        date: "2024-08-10",
        title: "First Direct Disbursement of Tuition & Stipends",
        description: "Over ₦20 billion disbursed directly to tertiary institutions and student bank accounts.",
        stage: "operational"
      }
    ],
    relatedAchievementSlugs: ["student-loan-scheme"],
    reportedOutcomes: [
      "Over 200,000 students verified and enrolled across 110 public tertiary institutions",
      "100% digital verification preventing manual intermediary leakages"
    ],
    primarySources: [
      {
        name: "Official Gazette - Access to Higher Education (Repeal and Re-Enactment) Act 2024",
        url: "https://nelfund.gov.ng/",
        documentType: "Statutory Gazette"
      }
    ]
  },
  {
    id: "pol-002",
    slug: "fuel-subsidy-termination-directive",
    title: "Presidential Directive on Premium Motor Spirit (PMS) Subsidy Removal",
    shortTitle: "PMS Subsidy Removal Directive",
    policyType: "executive-action",
    status: "effective",
    publicationStatus: "publishable",
    legalAuthority: "presidential-directive",
    authorityReference: "Presidential Inaugural Address & Petroleum Industry Act (PIA) 2021",
    sectorSlug: "economy",
    leadAgency: "Federal Ministry of Finance & NNPCL",
    responsibleInstitutions: [
      "Central Bank of Nigeria",
      "Nigerian Upstream Petroleum Regulatory Commission (NUPRC)",
      "NMDPRA"
    ],
    summary: "Executive policy terminating unsustainable PMS subsidy payments to free fiscal resources for national infrastructure and social investments.",
    fullDescription: "Ended petrol subsidy payments that consumed over ₦4 trillion annually in unbudgeted fiscal transfers, reallocating savings into state FAAC allocations, infrastructure funds, and target social safety nets.",
    backgroundContext: "PMS subsidies drained over 40% of federal government revenues between 2020 and 2022, causing fiscal deficits and debt servicing spikes.",
    keyObjectives: [
      "Halt monthly fiscal leakages estimated at ₦400 billion",
      "Increase FAAC monthly revenue distributions to 36 States and FCT",
      "Redirect funding to national transport corridors, healthcare, and education"
    ],
    effectiveDate: "2023-05-29",
    announcementDate: "2023-05-29",
    approvalDate: "2023-05-29",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalScope: "National",
    milestones: [
      {
        date: "2023-05-29",
        title: "Presidential Inaugural Declaration",
        description: "Announcement of subsidy termination during inaugural speech.",
        stage: "announcement"
      },
      {
        date: "2023-06-01",
        title: "NNPCL Market Price Adjustment",
        description: "Commercial pricing template issued reflecting market-reflective PMS rates.",
        stage: "implementation"
      },
      {
        date: "2023-07-01",
        title: "FAAC Distribution Increase",
        description: "Monthly statutory allocation to federal, state, and local governments increased by over 70%.",
        stage: "operational"
      }
    ],
    relatedAchievementSlugs: ["fuel-subsidy-removal"],
    reportedOutcomes: [
      "Saved Nigeria over ₦4.2 trillion in fiscal year 2023/2024",
      "Doubled monthly FAAC distributions to state governments for localized infrastructure"
    ],
    primarySources: [
      {
        name: "Central Bank of Nigeria Economic & Monetary Policy Report Q4 2023",
        url: "https://www.cbn.gov.ng/",
        documentType: "Central Bank Audit"
      }
    ]
  },
  {
    id: "pol-003",
    slug: "fx-market-unification-framework",
    title: "CBN Foreign Exchange Unification & Market Alignment Policy",
    shortTitle: "FX Rate Unification Policy",
    policyType: "monetary-financial-reform",
    status: "effective",
    publicationStatus: "publishable",
    legalAuthority: "ministerial-directive",
    authorityReference: "CBN Circular TED/FEM/PUB/FPC/001/008",
    sectorSlug: "economy",
    leadAgency: "Central Bank of Nigeria",
    responsibleInstitutions: [
      "Federal Ministry of Finance",
      "Nigeria Customs Service",
      "Security and Exchange Commission"
    ],
    summary: "Unification of multiple official FX rate windows into a single market-reflective price discovery system.",
    fullDescription: "Abolished segmented exchange rate windows (Official, I&E, Bureau De Change margins) to restore market transparency, eliminate currency arbitrage, and attract foreign portfolio & direct investments.",
    backgroundContext: "Multiple exchange rate windows created severe distortions, discouraged foreign capital inflows, and fostered rent-seeking behavior.",
    keyObjectives: [
      "Eliminate parallel FX market arbitrage windows",
      "Clear verified backlog of mature foreign exchange obligations",
      "Restore foreign investor confidence and boost capital imports"
    ],
    effectiveDate: "2023-06-14",
    announcementDate: "2023-06-14",
    approvalDate: "2023-06-14",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalScope: "National",
    milestones: [
      {
        date: "2023-06-14",
        title: "CBN Circular on FX Unification",
        description: "Abolition of multiple windows and unification into I&E window.",
        stage: "approval"
      },
      {
        date: "2024-03-20",
        title: "Clearance of $7bn FX Backlog",
        description: "CBN completed verification and settlement of all valid pending FX claims.",
        stage: "operational"
      }
    ],
    relatedAchievementSlugs: ["fx-market-unification"],
    reportedOutcomes: [
      "Cleared $7 billion inherited FX forward backlog",
      "Foreign Portfolio Investment (FPI) inflows increased by over 200% in H1 2024"
    ],
    primarySources: [
      {
        name: "CBN Financial Stability Report H1 2024",
        url: "https://www.cbn.gov.ng/",
        documentType: "Central Bank Audit"
      }
    ]
  },
  {
    id: "pol-004",
    slug: "electricity-act-decentralization",
    title: "Electricity Act 2023 (Power Sector Decentralization)",
    shortTitle: "Electricity Act 2023",
    policyType: "legislation",
    status: "partially-implemented",
    publicationStatus: "publishable",
    legalAuthority: "act",
    authorityReference: "Official Gazette Electricity Act 2023",
    sectorSlug: "infrastructure",
    leadAgency: "Federal Ministry of Power & NERC",
    responsibleInstitutions: [
      "State Electricity Regulatory Commissions (SERCs)",
      "Transmission Company of Nigeria (TCN)"
    ],
    summary: "Constitutional reform granting 36 state governments statutory power to generate, transmit, and distribute electricity in intra-state markets.",
    fullDescription: "Demonopolized the national grid framework by enabling sub-national governments and private investors to establish independent intra-state electricity markets, mini-grids, and state power regulatory commissions.",
    backgroundContext: "Centralized single-buyer power grid structure generated persistent bottlenecks and transmission constraints.",
    keyObjectives: [
      "Enable states to license off-grid and embedded power generation",
      "Attract private capital for localized distribution sub-stations",
      "Increase national power generation capacity by 30% over 3 years"
    ],
    effectiveDate: "2023-06-08",
    announcementDate: "2023-06-08",
    approvalDate: "2023-06-08",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalScope: "National",
    milestones: [
      {
        date: "2023-06-08",
        title: "Presidential Assent to Electricity Act",
        description: "Enacted statutory decentralization framework.",
        stage: "approval"
      },
      {
        date: "2024-04-22",
        title: "NERC Regulatory Oversight Transfer",
        description: "Regulatory powers transferred to Enugu, Ondo, and Ekiti State Regulatory Commissions.",
        stage: "implementation"
      }
    ],
    relatedAchievementSlugs: ["700mw-zungeru-hydroelectric-plant"],
    reportedOutcomes: [
      "Over 6 states established independent State Electricity Regulatory Commissions (SERCs)",
      "700MW Zungeru Hydro plant synchronized to national grid"
    ],
    primarySources: [
      {
        name: "NERC Official Order on Regulatory Transfer to States",
        url: "https://nerc.gov.ng/",
        documentType: "Regulatory Order"
      }
    ]
  },
  {
    id: "pol-005",
    slug: "national-minimum-wage-amendment-act",
    title: "National Minimum Wage (Amendment) Act 2024",
    shortTitle: "Minimum Wage Law 2024",
    policyType: "legislation",
    status: "fully-implemented",
    publicationStatus: "publishable",
    legalAuthority: "act",
    authorityReference: "Official Gazette National Minimum Wage (Amendment) Act 2024",
    sectorSlug: "economy",
    leadAgency: "Federal Ministry of Labour and Employment",
    responsibleInstitutions: [
      "Office of the Head of Civil Service of the Federation",
      "National Salaries, Incomes and Wages Commission (NSIWC)"
    ],
    summary: "Statutory increase of the national baseline wage from ₦30,000 to ₦70,000 with a 3-year statutory review cycle.",
    fullDescription: "Tripartite legal agreement negotiated between Federal Government, Organised Labour unions, and Private Sector Employers to cushion structural reform pressures and enhance civil service living wages.",
    backgroundContext: "Inflationary pressures following subsidy removal eroded civil service real purchasing power.",
    keyObjectives: [
      "Raise monthly minimum baseline wage to ₦70,000",
      "Shorten statutory wage review cycle from 5 years to 3 years",
      "Provide consequential salary adjustments across civil service cadres"
    ],
    effectiveDate: "2024-07-29",
    announcementDate: "2024-07-18",
    approvalDate: "2024-07-29",
    statesCovered: ["All 36 States & FCT"],
    geopoliticalScope: "National",
    milestones: [
      {
        date: "2024-07-18",
        title: "Tripartite Agreement Reached",
        description: "Organised Labour and Federal Government agreed on ₦70,000 baseline.",
        stage: "approval"
      },
      {
        date: "2024-07-29",
        title: "Presidential Assent to Amendment Act",
        description: "Law enacted by National Assembly and signed by President.",
        stage: "approval"
      },
      {
        date: "2024-09-26",
        title: "Payroll Disbursement with Consequential Adjustments",
        description: "Federal workers received September 2024 salaries reflecting full wage increase.",
        stage: "operational"
      }
    ],
    relatedAchievementSlugs: ["national-minimum-wage-increase"],
    reportedOutcomes: [
      "100% of federal workers received updated ₦70,000 baseline wage in September 2024 payroll",
      "Over 20 state governments adopted and commenced payment of ₦70,000+ baseline"
    ],
    primarySources: [
      {
        name: "National Salaries, Incomes and Wages Commission Circular on Minimum Wage Implementation",
        url: "https://statehouse.gov.ng/",
        documentType: "Statutory Circular"
      }
    ]
  }
];
