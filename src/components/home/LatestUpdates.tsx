import React from "react";
import { Link } from "@/lib/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { RefreshCw, ArrowRight } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import SourceBadge from "../common/SourceBadge";
import { dataAdapter } from "@/adapters/dataAdapter";
import { formatDate } from "@/utils/formatters";

export const LatestUpdates: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const latestUpdates = dataAdapter.getLatestUpdates(3);

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gov-darkSurface border-b border-gov-border font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="space-y-1 max-w-2xl border-b border-gov-border/60 pb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-emerald uppercase tracking-wider">
            <RefreshCw className="h-4 w-4 text-gov-gold" />
            <span>{t("latestUpdates.eyebrow", { defaultValue: "Recent Publications & Deliverables" })}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gov-navy dark:text-white tracking-tight">
            {t("latestUpdates.title", { defaultValue: "Latest Verified Updates" })}
          </h2>
          <p className="text-sm text-gov-slate">
            {t("latestUpdates.subtitle", { defaultValue: "Recently added or revised information across policies, projects and national indicators." })}
          </p>
        </div>

        {/* Updates Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {latestUpdates.map((item) => {
            const formattedDate = item.updatedAt ? formatDate(item.updatedAt, currentLanguage, "d MMM yyyy") : "";

            return (
              <div
                key={`${item.recordType}-${item.id}`}
                className="bg-gov-canvas dark:bg-gov-navy/20 border border-gov-border rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-gov-border/40 pb-2 text-xs">
                    <span className="font-bold text-gov-navy dark:text-white font-display">
                      {formattedDate ? `Updated ${formattedDate}` : item.updatedAt}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gov-navy/5 dark:bg-white/10 text-gov-navy dark:text-gray-300 uppercase tracking-wide">
                      {item.recordTypeLabel}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-display text-gov-navy dark:text-white leading-snug line-clamp-2">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gov-slate leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-gov-border/40 flex items-center justify-between text-xs">
                  <SourceBadge sourceName={item.leadSource} level={2} />
                  <Link
                    to={item.routePath}
                    className="inline-flex items-center gap-1 font-bold text-gov-navy dark:text-gov-gold hover:text-gov-emerald text-xs transition-colors"
                    aria-label={`Inspect record for ${item.title}`}
                  >
                    <span>{t("hero.inspectRecord", { defaultValue: "Inspect Record" })}</span>
                    <ArrowRight className="h-3 w-3 text-gov-gold" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LatestUpdates;
