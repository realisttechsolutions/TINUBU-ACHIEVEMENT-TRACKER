import React from "react";
import { ExternalLink, ShieldCheck, Database, Globe, Newspaper, BookOpen } from "lucide-react";

export type SourceLevel = 1 | 2 | 3 | 4 | 5;

interface SourceBadgeProps {
  sourceName: string;
  sourceUrl?: string;
  level?: SourceLevel;
  verificationDate?: string;
  className?: string;
}

const levelConfigs: Record<
  SourceLevel,
  { label: string; style: string; icon: React.ElementType }
> = {
  1: {
    label: "Level 1: Official Record",
    style: "bg-emerald-50 text-emerald-900 border-emerald-300",
    icon: ShieldCheck,
  },
  2: {
    label: "Level 2: National Statistics",
    style: "bg-blue-50 text-blue-900 border-blue-200",
    icon: Database,
  },
  3: {
    label: "Level 3: International Body",
    style: "bg-sky-50 text-sky-900 border-sky-200",
    icon: Globe,
  },
  4: {
    label: "Level 4: Verified Media",
    style: "bg-slate-50 text-slate-800 border-slate-200",
    icon: Newspaper,
  },
  5: {
    label: "Level 5: Research & Specialist",
    style: "bg-purple-50 text-purple-900 border-purple-200",
    icon: BookOpen,
  },
};

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  sourceName,
  sourceUrl,
  level = 1,
  verificationDate,
  className = "",
}) => {
  const config = levelConfigs[level];
  const Icon = config.icon;

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border ${config.style} ${className}`}
      title={`${config.label} — ${sourceName}${verificationDate ? ` (Verified: ${verificationDate})` : ""}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 text-current" aria-hidden="true" />
      <span className="font-medium truncate max-w-[180px]">{sourceName}</span>
      {sourceUrl && <ExternalLink className="h-3 w-3 shrink-0 opacity-70 ml-0.5" />}
    </span>
  );

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex hover:opacity-90 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default SourceBadge;
