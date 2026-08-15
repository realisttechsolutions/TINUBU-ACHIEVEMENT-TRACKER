import React from "react";
import { ExternalLink, ShieldCheck, Database, Globe, Newspaper, BookOpen, AlertTriangle } from "lucide-react";
import { SourceHierarchyLevel } from "@/adapters/types";

interface SourceBadgeProps {
  sourceName?: string;
  sourceUrl?: string;
  level?: SourceHierarchyLevel | number | string;
  verificationDate?: string;
  className?: string;
}

const levelConfigs: Record<string, { label: string; style: string; icon: React.ElementType }> = {
  LEVEL_1: {
    label: "Level 1: Primary Official Gazette / Statute",
    style: "bg-gov-navy text-gov-gold border-gov-gold/40 font-bold",
    icon: ShieldCheck,
  },
  LEVEL_2: {
    label: "Level 2: National Statistical Data (NBS / CBN)",
    style: "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold",
    icon: Database,
  },
  LEVEL_3: {
    label: "Level 3: Multilateral & Independent Institutional Audit",
    style: "bg-purple-50 text-purple-900 border-purple-200 font-semibold",
    icon: Globe,
  },
  LEVEL_4: {
    label: "Level 4: Mainstream Investigative Media",
    style: "bg-blue-50 text-blue-900 border-blue-200",
    icon: Newspaper,
  },
  LEVEL_5: {
    label: "Level 5: Official Statements & Contextual Briefings",
    style: "bg-slate-50 text-slate-800 border-slate-200",
    icon: BookOpen,
  },
  LEVEL_6: {
    label: "Level 6: Discovery Lead (Internal)",
    style: "bg-amber-50 text-amber-800 border-dashed border-amber-300",
    icon: AlertTriangle,
  },
  // Numeric aliases
  "1": { label: "Level 1: Primary Legal / Statutory Record", style: "bg-gov-navy text-gov-gold border-gov-gold/40 font-bold", icon: ShieldCheck },
  "2": { label: "Level 2: National Statistics", style: "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold", icon: Database },
  "3": { label: "Level 3: Multilateral Audit", style: "bg-purple-50 text-purple-900 border-purple-200 font-semibold", icon: Globe },
  "4": { label: "Level 4: Verified Media", style: "bg-blue-50 text-blue-900 border-blue-200", icon: Newspaper },
  "5": { label: "Level 5: Official Statement", style: "bg-slate-50 text-slate-800 border-slate-200", icon: BookOpen },
  "6": { label: "Level 6: Discovery Lead", style: "bg-amber-50 text-amber-800 border-dashed border-amber-300", icon: AlertTriangle }
};

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  sourceName,
  sourceUrl,
  level = "LEVEL_1",
  verificationDate,
  className = "",
}) => {
  const normalizedLevel = String(level);
  const config = levelConfigs[normalizedLevel] || levelConfigs.LEVEL_1;
  const Icon = config.icon;

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border ${config.style} ${className}`}
      title={`${config.label}${sourceName ? ` — ${sourceName}` : ""}${verificationDate ? ` (Verified: ${verificationDate})` : ""}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 text-current" aria-hidden="true" />
      <span className="font-medium truncate max-w-[200px]">
        {sourceName || config.label.split(':')[0]}
      </span>
      {sourceUrl && <ExternalLink className="h-3 w-3 opacity-60 ml-0.5 shrink-0" />}
    </span>
  );

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-opacity hover:opacity-85 focus:outline-none focus:ring-1 focus:ring-gov-navy rounded"
        aria-label={`Open external primary source: ${sourceName || 'Evidence Source'}`}
      >
        {content}
      </a>
    );
  }

  return content;
};

export default SourceBadge;
