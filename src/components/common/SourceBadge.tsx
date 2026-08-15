'use client';

import React from "react";
import { ExternalLink, ShieldCheck, Database, Globe, Newspaper, BookOpen, AlertTriangle } from "lucide-react";
import { SourceHierarchyLevel } from "@/adapters/types";

export type SourceLevel = number | string | SourceHierarchyLevel;

interface SourceBadgeProps {
  sourceName?: string;
  sourceUrl?: string;
  level?: SourceLevel;
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
    style: "bg-emerald-900/90 text-emerald-200 border-emerald-500/40 font-semibold",
    icon: Database,
  },
  LEVEL_3: {
    label: "Level 3: Official MDA Progress Report",
    style: "bg-blue-900/80 text-blue-200 border-blue-500/40",
    icon: Globe,
  },
  LEVEL_4: {
    label: "Level 4: Independent Multilateral Report",
    style: "bg-purple-900/80 text-purple-200 border-purple-500/40",
    icon: BookOpen,
  },
  LEVEL_5: {
    label: "Level 5: Reputable Investigative Media",
    style: "bg-slate-800 text-slate-200 border-slate-600",
    icon: Newspaper,
  },
  "1": {
    label: "Level 1: Official Gazette",
    style: "bg-gov-navy text-gov-gold border-gov-gold/40 font-bold",
    icon: ShieldCheck,
  },
  "2": {
    label: "Level 2: Official Stats",
    style: "bg-emerald-900/90 text-emerald-200 border-emerald-500/40 font-semibold",
    icon: Database,
  },
  "3": {
    label: "Level 3: Ministry Report",
    style: "bg-blue-900/80 text-blue-200 border-blue-500/40",
    icon: Globe,
  },
  "4": {
    label: "Level 4: Multilateral",
    style: "bg-purple-900/80 text-purple-200 border-purple-500/40",
    icon: BookOpen,
  },
  "5": {
    label: "Level 5: Audited Press",
    style: "bg-slate-800 text-slate-200 border-slate-600",
    icon: Newspaper,
  },
};

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  sourceName,
  sourceUrl,
  level = "LEVEL_3",
  verificationDate,
  className = "",
}) => {
  const levelKey = String(level).toUpperCase();
  const config = levelConfigs[levelKey] || levelConfigs[String(level)] || levelConfigs.LEVEL_3;
  const Icon = config.icon;

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors ${config.style} ${className}`}
      title={config.label}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      {sourceName && <span className="font-medium truncate max-w-[200px]">{sourceName}</span>}
      <span className="text-[10px] opacity-75 hidden sm:inline">({String(level).replace('LEVEL_', 'L')})</span>
      {sourceUrl && <ExternalLink className="h-2.5 w-2.5 opacity-60 flex-shrink-0" />}
    </span>
  );

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-85 inline-block focus:outline-none focus:ring-2 focus:ring-gov-gold/50 rounded"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default SourceBadge;