import { AchievementStatus } from "@/components/common/StatusBadge";
import { DataClassification } from "@/components/common/DataClassificationBadge";
import { SourceLevel } from "@/components/common/SourceBadge";

export interface HeroConfig {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryAction: { text: string; href: string };
  secondaryAction: { text: string; href: string };
  trustNote: string;
  image: string;
  imageAlt: string;
}

export interface MetricItemConfig {
  id: string;
  title: string;
  value: string;
  unit?: string;
  description: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  classification: DataClassification;
  status: AchievementStatus;
  sourceName: string;
  sourceUrl?: string;
  sourceLevel: SourceLevel;
  reportingPeriod: string;
  verificationDate: string;
  ministry: string;
}

export interface AchievementItemConfig {
  id: string;
  title: string;
  sector: string;
  summary: string;
  impactResult: string;
  scope: string;
  status: AchievementStatus;
  classification: DataClassification;
  sourceName: string;
  sourceUrl?: string;
  sourceLevel: SourceLevel;
  reportingPeriod: string;
  image: string;
  href: string;
  isLead?: boolean;
}

export interface SectorItemConfig {
  id: string;
  title: string;
  description: string;
  headlineIndicator: string;
  indicatorValue: string;
  status: AchievementStatus;
  path: string;
  iconName: string;
}

export interface ZoneImpactConfig {
  zone: string;
  name: string;
  statesCovered: string[];
  keyHighlight: string;
  indicator: string;
}

export interface TimelineEventConfig {
  id: string;
  date: string;
  title: string;
  sector: string;
  description: string;
  status: AchievementStatus;
  sourceName: string;
  sourceUrl?: string;
}

export interface UpdateItemConfig {
  id: string;
  date: string;
  title: string;
  sector: string;
  summary: string;
  status: AchievementStatus;
  sourceName: string;
  sourceUrl?: string;
}

export const heroData: HeroConfig = {
  eyebrow: "Tracking the Renewed Hope Agenda",
  headline: "Nigeria’s Progress, Documented.",
  subheadline: "Explore policies, projects, reforms and measurable outcomes under President Bola Ahmed Tinubu’s administration—organised by sector, location, implementation status and supporting evidence.",
  primaryAction: { text: "Explore Achievements", href: "/achievements" },
  secondaryAction: { text: "View Executive Dashboard", href: "/dashboard" },
  trustNote: "Evidence-linked. Sector-based. Updated as new information is verified.",
  image: "/lovable-uploads/0cce3ec5-b800-424c-9c93-8ca7249b5ba2.png",
  imageAlt: "President Bola Ahmed Tinubu administration progress overview",
};

export const headlineMetrics: MetricItemConfig[] = [
  {
    id: "subsidy-savings",
    title: "Annual Fuel Subsidy Savings",
    value: "₦5.2T+",
    unit: "NGN",
    description: "Annual fiscal expenditure saved and redirected to infrastructure and social protection.",
    trend: "up",
    trendValue: "Redirected to capital spending",
    classification: "Actual",
    status: "Completed",
    sourceName: "Federal Ministry of Finance",
    sourceUrl: "https://finance.gov.ng",
    sourceLevel: 1,
    reportingPeriod: "FY 2024",
    verificationDate: "Apr 2025",
    ministry: "Ministry of Finance",
  },
  {
    id: "gdp-growth",
    title: "GDP Growth Rate",
    value: "3.2%",
    unit: "YoY",
    description: "Quarterly real GDP growth trajectory following exchange rate and fiscal reforms.",
    trend: "up",
    trendValue: "+2.3% from Q2 2023 baseline",
    classification: "Actual",
    status: "Outcome Recorded",
    sourceName: "National Bureau of Statistics (NBS)",
    sourceUrl: "https://nigerianstat.gov.ng",
    sourceLevel: 2,
    reportingPeriod: "Q1 2025",
    verificationDate: "Apr 2025",
    ministry: "Ministry of Budget & Planning",
  },
  {
    id: "student-loans",
    title: "Student Loan Beneficiaries",
    value: "124,850",
    unit: "Students",
    description: "Higher education tuition and upkeep support disbursed under the NELFUND loan scheme.",
    trend: "up",
    trendValue: "+100% since Q3 2023 launch",
    classification: "Actual",
    status: "Operational",
    sourceName: "NELFUND / Ministry of Education",
    sourceUrl: "https://nelfund.gov.ng",
    sourceLevel: 1,
    reportingPeriod: "Q1 2025",
    verificationDate: "Mar 2025",
    ministry: "Federal Ministry of Education",
  },
  {
    id: "fdi-inflows",
    title: "Foreign Direct Investment Inflows",
    value: "$2.15B",
    unit: "USD",
    description: "Quarterly foreign direct investment capital inflow into manufacturing and energy.",
    trend: "up",
    trendValue: "205% increase YoY",
    classification: "Independently Reported",
    status: "Outcome Recorded",
    sourceName: "Central Bank of Nigeria (CBN)",
    sourceUrl: "https://cbn.gov.ng",
    sourceLevel: 2,
    reportingPeriod: "Q1 2025",
    verificationDate: "Apr 2025",
    ministry: "Ministry of Industry & Trade",
  },
];

export const featuredAchievements: AchievementItemConfig[] = [
  {
    id: "lagos-calabar-coastal-highway",
    title: "700km Lagos-Calabar Coastal Highway",
    sector: "Infrastructure",
    summary: "Groundbreaking 10-lane coastal highway connecting major economic hubs across 9 coastal states.",
    impactResult: "Phase 1 construction underway with over 47km paved.",
    scope: "National / 9 Coastal States",
    status: "Implementation Ongoing",
    classification: "Actual",
    sourceName: "Federal Ministry of Works",
    sourceUrl: "https://works.gov.ng",
    sourceLevel: 1,
    reportingPeriod: "2024 - 2025",
    image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589",
    href: "/achievements/lagos-calabar-coastal-highway",
    isLead: true,
  },
  {
    id: "nelfund-student-loans",
    title: "National Student Loan Fund Scheme (NELFUND)",
    sector: "Social Services",
    summary: "Interest-free loans disbursed directly to students in federal and state tertiary institutions.",
    impactResult: "124,850 student beneficiaries funded across 36 states.",
    scope: "National / Tertiary Education",
    status: "Operational",
    classification: "Actual",
    sourceName: "NELFUND Board",
    sourceUrl: "https://nelfund.gov.ng",
    sourceLevel: 1,
    reportingPeriod: "FY 2024",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    href: "/achievements/nelfund-student-loans",
  },
  {
    id: "fx-market-unification",
    title: "Exchange Rate & FX Window Unification",
    sector: "Economic Reforms",
    summary: "Consolidation of multiple foreign exchange rate windows into a transparent market-determined system.",
    impactResult: "Arbitrage eliminated and FX reserves boosted to $36.2B.",
    scope: "Macroeconomic / Financial",
    status: "Outcome Recorded",
    classification: "Actual",
    sourceName: "Central Bank of Nigeria",
    sourceUrl: "https://cbn.gov.ng",
    sourceLevel: 2,
    reportingPeriod: "Q1 2025",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
    href: "/achievements/fx-market-unification",
  },
];

export const sectorSummaries: SectorItemConfig[] = [
  {
    id: "economy",
    title: "Economic Reforms",
    description: "Subsidy removal savings, FX window unification, tax system modernizations, and investment inflows.",
    headlineIndicator: "GDP Growth Rate",
    indicatorValue: "3.2%",
    status: "Outcome Recorded",
    path: "/economic-reforms",
    iconName: "TrendingUp",
  },
  {
    id: "security",
    title: "Security Progress",
    description: "Special force operations, highway patrol deployments, 15% reduction in nationwide crime rate.",
    headlineIndicator: "Crime Reduction",
    indicatorValue: "-15%",
    status: "Operational",
    path: "/security-progress",
    iconName: "ShieldCheck",
  },
  {
    id: "infrastructure",
    title: "Infrastructure Development",
    description: "Lagos-Calabar Coastal Highway, power generation capacity expansion, and digital fiber networks.",
    headlineIndicator: "Roads Construction",
    indicatorValue: "2,450 km",
    status: "Implementation Ongoing",
    path: "/infrastructure",
    iconName: "Building2",
  },
  {
    id: "social-services",
    title: "Social Services & Protection",
    description: "NELFUND student loans, cash transfers to 5.4M vulnerable households, primary healthcare centers.",
    headlineIndicator: "Cash Transfers",
    indicatorValue: "5.4M Households",
    status: "Operational",
    path: "/social-services",
    iconName: "HeartPulse",
  },
];

export const regionalZoneData: ZoneImpactConfig[] = [
  {
    zone: "North-Central",
    name: "North-Central Zone",
    statesCovered: ["Benue", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau", "FCT"],
    keyHighlight: "Zungeru 700MW Hydroelectric Plant Operational",
    indicator: "68% Security Score",
  },
  {
    zone: "North-East",
    name: "North-East Zone",
    statesCovered: ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"],
    keyHighlight: "Stabilization Ops & 18,500 IDP Resettlements",
    indicator: "62% Security Score",
  },
  {
    zone: "North-West",
    name: "North-West Zone",
    statesCovered: ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Zamfara"],
    keyHighlight: "Abuja-Kaduna-Kano Expressway Rehabilitation",
    indicator: "57% Security Score",
  },
  {
    zone: "South-East",
    name: "South-East Zone",
    statesCovered: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"],
    keyHighlight: "Enugu-Port Harcourt Expressway & Second Niger Bridge",
    indicator: "73% Security Score",
  },
  {
    zone: "South-South",
    name: "South-South Zone",
    statesCovered: ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"],
    keyHighlight: "Lekki-Calabar Coastal Highway Segment 1 & Port Expansion",
    indicator: "65% Security Score",
  },
  {
    zone: "South-West",
    name: "South-West Zone",
    statesCovered: ["Ekiti", "Lagos", "Ogun", "Ondo", "Osun", "Oyo"],
    keyHighlight: "Lagos-Ibadan Rail Expansion & Digital Tech Hubs",
    indicator: "78% Security Score",
  },
];

export const timelineEventsData: TimelineEventConfig[] = [
  {
    id: "event-1",
    date: "May 29, 2023",
    title: "Fuel Subsidy Elimination Proclamation",
    sector: "Economy",
    description: "Official termination of unsustainable fuel subsidy regime saving ₦4T+ annually.",
    status: "Completed",
    sourceName: "Presidency / Federal Gazette",
  },
  {
    id: "event-2",
    date: "June 14, 2023",
    title: "FX Market Window Unification",
    sector: "Economy",
    description: "Central Bank of Nigeria unifies multiple exchange rate windows into a willing-buyer, willing-seller framework.",
    status: "Completed",
    sourceName: "Central Bank of Nigeria",
  },
  {
    id: "event-3",
    date: "June 2023",
    title: "Student Loan Act Signed",
    sector: "Education",
    description: "Executive assent to Access to Higher Education Act establishing NELFUND interest-free loans.",
    status: "Operational",
    sourceName: "Federal Ministry of Education",
  },
  {
    id: "event-4",
    date: "March 2024",
    title: "Lagos-Calabar Coastal Highway Flag-Off",
    sector: "Infrastructure",
    description: "Commencement of 700km coastal highway project connecting 9 maritime states.",
    status: "Implementation Ongoing",
    sourceName: "Federal Ministry of Works",
  },
];

export const latestUpdatesData: UpdateItemConfig[] = [
  {
    id: "update-1",
    date: "April 2025",
    title: "Q1 2025 GDP Growth Reaches 3.2%",
    sector: "Economy",
    summary: "National Bureau of Statistics releases Q1 2025 report showing accelerated growth in non-oil sectors.",
    status: "Independently Confirmed",
    sourceName: "National Bureau of Statistics",
  },
  {
    id: "update-2",
    date: "March 2025",
    title: "NELFUND Disburses Loans to 124,850 Students",
    sector: "Social Services",
    summary: "Over ₦15B in tuition and upkeep support successfully remitted to tertiary institutions.",
    status: "Operational",
    sourceName: "NELFUND Management",
  },
  {
    id: "update-3",
    date: "February 2025",
    title: "Foreign Exchange Reserves Reach $36.2 Billion",
    sector: "Economy",
    summary: "CBN reports 15% increase in gross foreign reserves over 12 months.",
    status: "Outcome Recorded",
    sourceName: "Central Bank of Nigeria",
  },
];
