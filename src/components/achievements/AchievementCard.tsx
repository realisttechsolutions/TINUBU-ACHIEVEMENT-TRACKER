import React from "react";
import { Link } from "@/lib/navigation";
import { ArrowRight, MapPin, Building2, Calendar, ShieldCheck, CheckCircle2, DollarSign, Users } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import DataClassificationBadge from "../common/DataClassificationBadge";
import SourceBadge from "../common/SourceBadge";
import DemoWatermark from "../common/DemoWatermark";
import { AchievementViewModel } from "@/adapters/types";

interface AchievementCardProps {
  item: AchievementViewModel | any;
  viewMode?: "grid" | "list";
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  item,
  viewMode = "grid",
}) => {
  const isList = viewMode === "list";
  const slug = item.slug || item.id;
  const status = item.status || "operational";
  const sectorName = item.sectorName || item.sector || "National Priority";
  const leadMda = item.leadMda || item.leadMinistryOrAgency || "Federal Government of Nigeria";
  const date = item.date || item.verificationDate || "2024";
  const formattedFin = item.financialMetrics?.[0]?.formattedAmount;
  const formattedBen = item.beneficiaryMetrics?.[0]?.formattedCount;

  if (isList) {
    return (
      <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gov-gold/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group">
        <div className="space-y-2.5 flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status} size="sm" />
            <DataClassificationBadge type="verificationStatus" value={item.verificationStatus || "source_confirmed"} size="sm" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2.5 py-0.5 rounded-full">
              {sectorName}
            </span>
            {item.isDemo && <DemoWatermark compact />}
          </div>

          <Link to={`/achievements/${slug}`}>
            <h3 className="text-base sm:text-lg font-bold font-display text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors line-clamp-1">
              {item.title}
            </h3>
          </Link>

          <p className="text-xs text-gov-slate line-clamp-2 leading-relaxed">
            {item.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gov-slate pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-gov-navy dark:text-gov-gold shrink-0" />
              <span className="truncate max-w-[200px]">{leadMda}</span>
            </span>
            {item.statesCovered && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gov-emerald shrink-0" />
                <span>{item.statesCovered.slice(0, 2).join(', ')}{item.statesCovered.length > 2 ? ` +${item.statesCovered.length - 2}` : ''}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gov-slate shrink-0" />
              <span>{date}</span>
            </span>
          </div>
        </div>

        {/* Right Action / Metrics Column */}
        <div className="shrink-0 flex flex-col items-start md:items-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gov-border/60">
          {(formattedFin || formattedBen) && (
            <div className="flex items-center gap-2 text-xs font-bold">
              {formattedFin && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {formattedFin}
                </span>
              )}
              {formattedBen && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
                  {formattedBen}
                </span>
              )}
            </div>
          )}

          <Link
            to={`/achievements/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors"
          >
            <span>View Verified Record</span>
            <ArrowRight className="h-3.5 w-3.5 text-gov-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  // Grid View Card
  return (
    <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-2xl shadow-sm hover:shadow-xl hover:border-gov-gold/50 transition-all p-5 flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-gov-border/60 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge status={status} size="sm" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2 py-0.5 rounded-md">
              {sectorName.split(' ')[0]}
            </span>
          </div>
          {item.isDemo && <DemoWatermark compact />}
        </div>

        {/* Title */}
        <Link to={`/achievements/${slug}`}>
          <h3 className="text-base font-bold font-display text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>
        </Link>

        {/* Summary */}
        <p className="text-xs text-gov-slate leading-relaxed line-clamp-3">
          {item.summary}
        </p>

        {/* Quantified Metrics Pill (if available) */}
        {(formattedFin || formattedBen) && (
          <div className="p-2.5 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 flex items-center justify-between text-xs font-semibold">
            {formattedFin && (
              <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300">
                <DollarSign className="h-3.5 w-3.5 text-gov-emerald" />
                <span>{formattedFin}</span>
              </span>
            )}
            {formattedBen && (
              <span className="flex items-center gap-1 text-blue-800 dark:text-blue-300">
                <Users className="h-3.5 w-3.5 text-blue-600" />
                <span>{formattedBen}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Link */}
      <div className="pt-3 border-t border-gov-border/60 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-gov-slate">
          <span className="truncate max-w-[170px]" title={leadMda}>
            {leadMda}
          </span>
          <span className="tabular-nums font-mono">{date}</span>
        </div>

        <Link
          to={`/achievements/${slug}`}
          className="flex items-center justify-between text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors pt-1"
        >
          <span>Inspect Evidence Record</span>
          <ArrowRight className="h-3.5 w-3.5 text-gov-gold group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default AchievementCard;
