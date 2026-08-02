import { 
  Home, 
  LayoutDashboard, 
  Award,
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  HeartPulse, 
  Database, 
  Download,
  Layers,
  MapPin,
  Compass,
  Clock,
  LucideIcon
} from "lucide-react";

export interface NavigationItemConfig {
  path: string;
  label: string;
  shortLabel?: string;
  description: string;
  group: "overview" | "sectors" | "evidence";
  keywords: string[];
  icon: LucideIcon;
  inDesktopHeader: boolean;
  inMobileDrawer: boolean;
  inFooter: boolean;
  isPublic: boolean;
}

export interface NavigationGroupConfig {
  id: "overview" | "sectors" | "evidence";
  title: string;
  description: string;
  items: NavigationItemConfig[];
}

export const navigationItems: NavigationItemConfig[] = [
  {
    path: "/",
    label: "Home Overview",
    shortLabel: "Home",
    description: "National progress dashboard overview and highlighted achievement metrics.",
    group: "overview",
    keywords: ["home", "overview", "renewed hope", "tinubu", "tracker", "summary"],
    icon: Home,
    inDesktopHeader: true,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/achievements",
    label: "Achievement Catalogue",
    shortLabel: "Achievements",
    description: "Searchable evidence-backed catalogue of policies, projects, and delivery milestones.",
    group: "overview",
    keywords: ["achievements", "catalogue", "projects", "reforms", "nelfund", "coastal highway", "search"],
    icon: Award,
    inDesktopHeader: true,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/timeline",
    label: "Policy & Implementation Timeline",
    shortLabel: "Timeline",
    description: "Chronological stream connecting policy announcements, FEC approvals, funding, and verified impact.",
    group: "overview",
    keywords: ["timeline", "policy", "reform", "implementation", "fec", "milestones", "gazette"],
    icon: Clock,
    inDesktopHeader: true,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/impact-map",
    label: "National Impact Map",
    shortLabel: "Impact Map",
    description: "Interactive 36-State & FCT geopolitical vector map documenting national and regional projects.",
    group: "overview",
    keywords: ["map", "impact", "states", "geopolitical", "nigeria", "location", "regional"],
    icon: Compass,
    inDesktopHeader: true,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/states",
    label: "State Catalogue",
    shortLabel: "States",
    description: "State-by-state directory of documented federal policies, projects, and active ministries.",
    group: "overview",
    keywords: ["states", "catalogue", "lagos", "kano", "rivers", "abuja", "fct", "zones"],
    icon: MapPin,
    inDesktopHeader: false,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/dashboard",
    label: "Executive Dashboard",
    shortLabel: "Dashboard",
    description: "Comprehensive sector performance metrics, interactive indicators, and World Bank validations.",
    group: "overview",
    keywords: ["dashboard", "executive", "kpi", "performance", "metrics", "gdp"],
    icon: LayoutDashboard,
    inDesktopHeader: true,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/sectors",
    label: "Sector Catalogue",
    shortLabel: "Sectors",
    description: "Unified national sector performance dashboards, indicators, and institutional evidence.",
    group: "sectors",
    keywords: ["sectors", "catalogue", "economy", "security", "infrastructure", "social services", "agriculture", "education", "healthcare"],
    icon: Layers,
    inDesktopHeader: true,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/sectors/economy",
    label: "Economic Reforms",
    shortLabel: "Economy",
    description: "Macroeconomic indicators, fiscal policy, fuel subsidy savings, and market unification.",
    group: "sectors",
    keywords: ["economy", "inflation", "subsidy", "gdp", "exchange rate", "fdi", "fiscal", "cbn"],
    icon: TrendingUp,
    inDesktopHeader: false,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/sectors/security",
    label: "Security Progress",
    shortLabel: "Security",
    description: "National security operations, crime rate reduction, personnel deployments, and regional progress.",
    group: "sectors",
    keywords: ["security", "crime", "defense", "military", "police", "surveillance", "regional"],
    icon: ShieldCheck,
    inDesktopHeader: false,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/sectors/infrastructure",
    label: "Infrastructure Development",
    shortLabel: "Infrastructure",
    description: "Roads, power generation, rail modernization, maritime ports, and digital fiber networks.",
    group: "sectors",
    keywords: ["infrastructure", "roads", "power", "rail", "coastal highway", "digital", "energy"],
    icon: Building2,
    inDesktopHeader: false,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/sectors/social-services",
    label: "Social Services & Protection",
    shortLabel: "Social Services",
    description: "Student loans, cash transfers, primary healthcare expansion, and social safety nets.",
    group: "sectors",
    keywords: ["social", "student loan", "healthcare", "cash transfer", "education", "humanitarian"],
    icon: HeartPulse,
    inDesktopHeader: false,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/data-sources",
    label: "Data & Methodology",
    shortLabel: "Data Sources",
    description: "Transparent source attribution, verification standards, and institutional data partners.",
    group: "evidence",
    keywords: ["data", "sources", "methodology", "nbs", "world bank", "imf", "verification"],
    icon: Database,
    inDesktopHeader: true,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
  {
    path: "/downloads",
    label: "Reports & Downloads",
    shortLabel: "Reports",
    description: "Downloadable PDF achievement reports, statistical datasets, and official publications.",
    group: "evidence",
    keywords: ["downloads", "reports", "pdf", "datasets", "documents", "statistics"],
    icon: Download,
    inDesktopHeader: true,
    inMobileDrawer: true,
    inFooter: true,
    isPublic: true,
  },
];

export const navigationGroups: NavigationGroupConfig[] = [
  {
    id: "overview",
    title: "Overview",
    description: "High-level summary and executive performance monitoring",
    items: navigationItems.filter((item) => item.group === "overview"),
  },
  {
    id: "sectors",
    title: "Sectors",
    description: "Key sectoral initiatives, reforms, and measurable outcomes",
    items: navigationItems.filter((item) => item.group === "sectors"),
  },
  {
    id: "evidence",
    title: "Evidence",
    description: "Verification standards, data sources, and downloadable reports",
    items: navigationItems.filter((item) => item.group === "evidence"),
  },
];
