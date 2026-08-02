
// appData.ts - Centralized data storage for the application

// Types for Data Structure
export interface MetricData {
  value: string | number;
  label: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  category: string;
  impact?: string;
  source?: {
    name: string;
    url: string;
  };
}

export interface DataSource {
  name: string;
  type: "government" | "news" | "academic" | "other";
  url: string;
  description: string;
  verificationStatus?: "verified" | "pending" | "unverified";
  lastUpdated?: string;
}

export interface SocialProgram {
  title: string;
  icon: string;
  description: string;
  beneficiaries: string;
  budget: string;
  progress: number;
  keyPrograms: string[];
}

export interface Testimonial {
  name: string;
  location: string;
  program: string;
  quote: string;
  impact: string;
}

// Security Data
export const securityMetrics = [
  {
    title: "Crime Rate Reduction",
    value: "-15%",
    description: "Overall crime rate reduction since June 2023",
    icon: "TrendingDown",
    color: "text-green-600"
  },
  {
    title: "Security Personnel",
    value: "42,500",
    description: "New security personnel deployed nationwide",
    icon: "Users",
    color: "text-brand-blue"
  },
  {
    title: "Coverage Areas",
    value: "744",
    description: "Local government areas with enhanced security",
    icon: "MapPin",
    color: "text-brand-purple"
  }
];

export const crimeRateData = [
  { name: "Q2 2023", value: 0 },
  { name: "Q3 2023", value: -5.2 },
  { name: "Q4 2023", value: -8.7 },
  { name: "Q1 2024", value: -12.3 },
  { name: "Q2 2024", value: -15 }
];

export const securityPersonnelData = [
  { name: "Police", value: 18500 },
  { name: "Military", value: 12000 },
  { name: "Civil Defense", value: 7800 },
  { name: "Intelligence", value: 4200 }
];

export const regionalSecurityData = [
  { name: "North-Central", value: 68 },
  { name: "North-East", value: 62 },
  { name: "North-West", value: 57 },
  { name: "South-East", value: 73 },
  { name: "South-South", value: 65 },
  { name: "South-West", value: 78 }
];

export const securityTimelineEvents: TimelineEvent[] = [
  {
    date: "June 2023",
    title: "National Security Strategy Launch",
    description: "Comprehensive security framework focusing on intelligence-led operations and community engagement across all geopolitical zones.",
    category: "Policy",
    impact: "Created unified approach across all security agencies and established clear metrics for tracking progress.",
    source: {
      name: "Office of the National Security Adviser",
      url: "https://onsa.gov.ng"
    }
  },
  {
    date: "August 2023",
    title: "Special Operations Forces Expansion",
    description: "Training and deployment of specialized forces to address specific security challenges in high-risk areas.",
    category: "Operations",
    impact: "Enhanced rapid response capabilities and increased presence in previously vulnerable communities.",
    source: {
      name: "Ministry of Defence",
      url: "https://defence.gov.ng"
    }
  },
  {
    date: "November 2023",
    title: "Community Security Partnership Program",
    description: "Initiative to strengthen collaboration between security forces and local communities through joint intelligence gathering and trust-building exercises.",
    category: "Community Engagement",
    impact: "Increased intelligence tips from civilians by 45% and improved early warning systems.",
    source: {
      name: "Nigeria Police Force",
      url: "https://npf.gov.ng"
    }
  },
  {
    date: "February 2024",
    title: "Advanced Surveillance Technology Deployment",
    description: "Implementation of AI-powered surveillance systems and drones in strategic locations and borders.",
    category: "Technology",
    impact: "Improved border security with 30% increase in interdiction of illegal crossings and contraband.",
    source: {
      name: "Nigerian Customs Service",
      url: "https://customs.gov.ng"
    }
  },
  {
    date: "April 2024",
    title: "Security Infrastructure Modernization",
    description: "Upgrading of command centers, communications equipment, and mobility assets for security agencies.",
    category: "Infrastructure",
    impact: "Reduced response time to security incidents by an average of 18 minutes nationwide.",
    source: {
      name: "Ministry of Interior",
      url: "https://interior.gov.ng"
    }
  }
];

// Social Services Data
export const socialServicesStats = [
  {
    value: "5.4M",
    label: "Households Reached",
    change: "+28%",
    trend: "up" as const,
  },
  {
    value: "91,250",
    label: "Student Loan Beneficiaries",
    change: "+100%",
    trend: "up" as const,
  },
  {
    value: "52%",
    label: "Healthcare Coverage",
    change: "+14%",
    trend: "up" as const,
  }
];

export const programEnrollmentData = [
  { name: "Q2 2023", value: 3.2 },
  { name: "Q3 2023", value: 3.8 },
  { name: "Q4 2023", value: 4.5 },
  { name: "Q1 2024", value: 5.1 },
  { name: "Q2 2024", value: 5.4 }
];

export const healthcareAccessData = [
  { name: "2022 Q4", value: 38 },
  { name: "2023 Q1", value: 40 },
  { name: "2023 Q2", value: 42 },
  { name: "2023 Q3", value: 45 },
  { name: "2023 Q4", value: 48 },
  { name: "2024 Q1", value: 50 },
  { name: "2024 Q2", value: 52 }
];

export const socialProgramsData: SocialProgram[] = [
  {
    title: "National Health Insurance",
    icon: "HeartPulse",
    description: "Expanded access to healthcare services through subsidized insurance for vulnerable populations.",
    beneficiaries: "12.5M",
    budget: "₦285B",
    progress: 67,
    keyPrograms: [
      "Basic Health Care Provision Fund",
      "Vulnerable Group Fund",
      "Rural Medical Outreach"
    ]
  },
  {
    title: "Education Access Initiative",
    icon: "GraduationCap",
    description: "Support for students from low-income backgrounds to access quality education at all levels.",
    beneficiaries: "3.8M",
    budget: "₦192B",
    progress: 75,
    keyPrograms: [
      "Student Loan Scheme",
      "School Feeding Program",
      "Teacher Training Enhancement"
    ]
  },
  {
    title: "Affordable Housing Program",
    icon: "Home",
    description: "Construction of low-cost housing units and mortgage accessibility for middle and low-income earners.",
    beneficiaries: "245K",
    budget: "₦320B",
    progress: 42,
    keyPrograms: [
      "National Housing Fund Revitalization",
      "Rural Housing Development",
      "Rent-to-Own Scheme"
    ]
  },
  {
    title: "Social Safety Net",
    icon: "Users",
    description: "Conditional cash transfers and economic empowerment programs for the poorest and most vulnerable.",
    beneficiaries: "5.4M",
    budget: "₦365B",
    progress: 83,
    keyPrograms: [
      "Conditional Cash Transfer Program",
      "Cash Grant for Vulnerable Groups",
      "COVID-19 Economic Recovery Support"
    ]
  },
  {
    title: "Youth Employment Scheme",
    icon: "TrendingUp",
    description: "Skills acquisition, entrepreneurship development, and job placement for Nigerian youth.",
    beneficiaries: "1.2M",
    budget: "₦175B",
    progress: 58,
    keyPrograms: [
      "N-Power Program Expansion",
      "Innovation Hubs Development",
      "Youth Entrepreneurship Support"
    ]
  },
  {
    title: "Child Protection Framework",
    icon: "ShieldCheck",
    description: "Comprehensive framework to ensure the rights, welfare, and protection of Nigerian children.",
    beneficiaries: "8.6M",
    budget: "₦127B",
    progress: 62,
    keyPrograms: [
      "Out-of-School Children Initiative",
      "Child Rights Implementation",
      "Child Health and Nutrition Support"
    ]
  }
];

export const testimonials: Testimonial[] = [
  {
    name: "Amina Ibrahim",
    location: "Kano State",
    program: "Cash Transfer",
    quote: "The monthly stipend has helped me start a small business selling food items. Now I can feed my children and even pay their school fees.",
    impact: "Started a sustainable small business and supports her family's education needs."
  },
  {
    name: "Emmanuel Okafor",
    location: "Enugu State",
    program: "Student Loan Scheme",
    quote: "Without this loan, I would have dropped out after my first year. Now I'll be the first graduate in my family.",
    impact: "Continuing university education in Computer Science, maintaining top academic standing."
  },
  {
    name: "Blessing Adeyemi",
    location: "Lagos State",
    program: "Healthcare Access",
    quote: "The community health center saved my daughter's life when she had severe malaria. Before it was built, we had to travel 4 hours to reach a hospital.",
    impact: "Received timely healthcare intervention for her family, reducing treatment delays."
  }
];

export const socialTimelineEvents: TimelineEvent[] = [
  {
    date: "June 2023",
    title: "Student Loan Act Signing",
    description: "President Tinubu signed the Access to Higher Education Act, establishing a legal framework for interest-free loans to Nigerian students in tertiary institutions.",
    category: "Education",
    impact: "Created sustainable financing for higher education access, targeting over 100,000 students annually.",
    source: {
      name: "Federal Ministry of Education",
      url: "https://education.gov.ng"
    }
  },
  {
    date: "August 2023",
    title: "National Healthcare Access Expansion",
    description: "Launch of the expanded National Health Insurance Authority coverage to include informal sector workers and vulnerable populations.",
    category: "Healthcare",
    impact: "Increased healthcare coverage by 14% within six months, bringing essential services to previously underserved communities.",
    source: {
      name: "National Health Insurance Authority",
      url: "https://nhia.gov.ng"
    }
  },
  {
    date: "October 2023",
    title: "Conditional Cash Transfer Restructuring",
    description: "Restructuring of the National Cash Transfer Program to improve targeting, ensure transparency, and increase coverage to 5.4 million households.",
    category: "Social Safety Net",
    impact: "Reduced extreme poverty among beneficiaries by 27% and improved food security metrics across target communities.",
    source: {
      name: "Ministry of Humanitarian Affairs",
      url: "https://humanitarian.gov.ng"
    }
  },
  {
    date: "January 2024",
    title: "Housing Intervention Fund Launch",
    description: "Establishment of a ₦250 billion fund to support affordable housing development across the six geopolitical zones.",
    category: "Housing",
    impact: "Construction of 50,000 housing units commenced, with priority allocation to low-income earners and first-time homeowners.",
    source: {
      name: "Federal Ministry of Housing",
      url: "https://housing.gov.ng"
    }
  },
  {
    date: "March 2024",
    title: "Child Protection Policy Implementation",
    description: "Nationwide roll-out of the Comprehensive Child Protection Policy, which addresses children's rights, welfare, and protection from abuse.",
    category: "Protection",
    impact: "Established 774 child protection committees at local government levels and improved response to child rights violations.",
    source: {
      name: "Ministry of Women Affairs",
      url: "https://womenaffairs.gov.ng"
    }
  }
];

// Data Sources
export const governmentSources: DataSource[] = [
  {
    name: "Central Bank of Nigeria",
    type: "government",
    url: "https://www.cbn.gov.ng/",
    description: "Official data on monetary policy, exchange rates, and financial statistics.",
    verificationStatus: "verified",
    lastUpdated: "April 12, 2024"
  },
  {
    name: "National Bureau of Statistics",
    type: "government",
    url: "https://nigerianstat.gov.ng/",
    description: "Official statistics on GDP, inflation, employment, and other economic indicators.",
    verificationStatus: "verified",
    lastUpdated: "April 5, 2024"
  },
  {
    name: "Federal Ministry of Finance",
    type: "government",
    url: "https://www.finance.gov.ng/",
    description: "Budget implementation reports, fiscal policy documents, and economic outlook reports.",
    verificationStatus: "verified",
    lastUpdated: "March 28, 2024"
  },
  {
    name: "Nigeria Investment Promotion Commission",
    type: "government",
    url: "https://www.nipc.gov.ng/",
    description: "Data on foreign direct investment and business environment indicators.",
    verificationStatus: "verified",
    lastUpdated: "March 15, 2024"
  },
  {
    name: "Debt Management Office",
    type: "government",
    url: "https://www.dmo.gov.ng/",
    description: "Information on Nigeria's debt profile, issuances, and debt sustainability analysis.",
    verificationStatus: "verified",
    lastUpdated: "April 2, 2024"
  }
];

export const newsSources: DataSource[] = [
  {
    name: "Reuters Africa",
    type: "news",
    url: "https://www.reuters.com/world/africa/",
    description: "International news coverage of Nigerian economic developments and policy analysis.",
    verificationStatus: "verified",
    lastUpdated: "April 15, 2024"
  },
  {
    name: "Bloomberg Markets",
    type: "news",
    url: "https://www.bloomberg.com/markets",
    description: "Financial market analysis and coverage of Nigerian economic policies.",
    verificationStatus: "verified",
    lastUpdated: "April 14, 2024"
  },
  {
    name: "The Economist",
    type: "news",
    url: "https://www.economist.com/",
    description: "In-depth analysis of Nigerian economic trends and policy outcomes.",
    verificationStatus: "verified",
    lastUpdated: "April 10, 2024"
  },
  {
    name: "Financial Times",
    type: "news",
    url: "https://www.ft.com/",
    description: "Coverage of Nigerian markets, business environment, and economic reforms.",
    verificationStatus: "verified",
    lastUpdated: "April 12, 2024"
  },
  {
    name: "BusinessDay Nigeria",
    type: "news",
    url: "https://businessday.ng/",
    description: "Local business and economic news coverage with policy analysis.",
    verificationStatus: "verified",
    lastUpdated: "April 16, 2024"
  }
];

export const academicSources: DataSource[] = [
  {
    name: "IMF Country Reports",
    type: "academic",
    url: "https://www.imf.org/en/Countries/NGA",
    description: "Economic assessments, Article IV consultations, and policy recommendations for Nigeria.",
    verificationStatus: "verified",
    lastUpdated: "March 20, 2024"
  },
  {
    name: "World Bank Nigeria Economic Reports",
    type: "academic",
    url: "https://www.worldbank.org/en/country/nigeria",
    description: "Economic updates, development indicators, and policy analysis for Nigeria.",
    verificationStatus: "verified",
    lastUpdated: "March 25, 2024"
  },
  {
    name: "African Development Bank - Nigeria",
    type: "academic",
    url: "https://www.afdb.org/en/countries/west-africa/nigeria",
    description: "Analysis of Nigeria's economic performance and development projects.",
    verificationStatus: "verified",
    lastUpdated: "April 5, 2024"
  },
  {
    name: "Centre for the Study of the Economies of Africa",
    type: "academic",
    url: "https://cseaafrica.org/",
    description: "Research papers and policy briefs on Nigerian economic policies and outcomes.",
    verificationStatus: "verified",
    lastUpdated: "March 30, 2024"
  },
  {
    name: "Nigerian Economic Summit Group",
    type: "academic",
    url: "https://nesgroup.org/",
    description: "Economic research, policy dialogues, and advocacy documents on Nigeria's economy.",
    verificationStatus: "verified",
    lastUpdated: "April 8, 2024"
  }
];
