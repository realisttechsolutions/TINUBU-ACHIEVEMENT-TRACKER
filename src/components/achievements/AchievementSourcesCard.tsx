import React from "react";
import { FileCheck, ExternalLink, ShieldCheck } from "lucide-react";
import SourceBadge from "../common/SourceBadge";
import { AchievementSource } from "@/types/achievement";

interface AchievementSourcesCardProps {
  sources: AchievementSource[];
  verificationDate: string;
}

export const AchievementSourcesCard: React.FC<AchievementSourcesCardProps> = ({
  sources,
  verificationDate,
}) => {
  return (
    <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-6 shadow-xs space-y-4 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/60 pb-3">
        <div className="flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-gov-gold" />
          <h3 className="text-base font-bold font-display text-gov-navy dark:text-white">
            Supporting Evidence & Citation Repository
          </h3>
        </div>
        <span className="text-xs text-gov-slate font-medium">
          Published as of: <strong className="text-gov-navy dark:text-white">{verificationDate}</strong>
        </span>
      </div>

      <div className="space-y-3">
        {sources.map((source, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-gov-canvas dark:bg-gov-navy/20 border border-gov-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gov-navy dark:text-white">
                  {source.name}
                </span>
                <SourceBadge sourceName={source.name} level={source.level} />
              </div>

              {source.documentTitle && (
                <p className="text-xs text-gov-slate italic">
                  "{source.documentTitle}"
                </p>
              )}

              <p className="text-[11px] text-gov-slate font-medium">
                Published: {source.publicationDate}
              </p>
            </div>

            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white dark:bg-gov-navy border border-gov-border text-xs font-bold text-gov-navy hover:text-gov-emerald shrink-0"
              >
                <span>Inspect Source Record</span>
                <ExternalLink className="h-3.5 w-3.5 text-gov-gold" />
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-gov-navy/5 dark:bg-gov-navy/40 border border-gov-gold/30 text-[11px] text-gov-slate flex items-start gap-2">
        <ShieldCheck className="h-4 w-4 text-gov-gold shrink-0 mt-0.5" />
        <span>
          <strong>Evidence Rule:</strong> All claims link directly to Level 1–5 institutional records. Referencing a government gazette or agency report does not imply formal commercial endorsement.
        </span>
      </div>
    </div>
  );
};

export default AchievementSourcesCard;
