import React from "react";
import { Link } from "@/lib/navigation";
import { ArrowRight, MapPin, Building2 } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import DataClassificationBadge from "../common/DataClassificationBadge";
import SourceBadge from "../common/SourceBadge";
import { AchievementItemConfig } from "@/data/home/homepage.config";

interface FeaturedAchievementCardProps {
  item: AchievementItemConfig;
}

export const FeaturedAchievementCard: React.FC<FeaturedAchievementCardProps> = ({ item }) => {
  if (item.isLead) {
    return (
      <div className="lg:col-span-2 bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row group hover:border-gov-gold/50 transition-all duration-200">
        {/* Image Column */}
        <div className="md:w-1/2 relative min-h-[260px] overflow-hidden bg-gov-navy">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gov-navy/80 via-transparent to-transparent md:hidden" />
        </div>

        {/* Content Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/60 pb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <StatusBadge status={item.status} size="sm" />
                <DataClassificationBadge classification={item.classification} size="sm" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2 py-0.5 rounded">
                {item.sector}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold font-display text-gov-navy dark:text-white leading-snug group-hover:text-gov-emerald transition-colors">
              {item.title}
            </h3>

            <p className="text-xs sm:text-sm text-gov-slate leading-relaxed">
              {item.summary}
            </p>

            <div className="p-3 rounded-lg bg-gov-canvas dark:bg-gov-navy/20 border border-gov-border/60 text-xs font-semibold text-gov-navy dark:text-white">
              <span className="text-gov-emerald font-bold">Key Result: </span>
              {item.impactResult}
            </div>
          </div>

          <div className="pt-3 border-t border-gov-border/60 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gov-slate">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gov-navy shrink-0" />
                <span>{item.scope}</span>
              </span>
              <SourceBadge
                sourceName={item.sourceName}
                sourceUrl={item.sourceUrl}
                level={item.sourceLevel}
              />
            </div>

            <Link
              to={item.href}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-navy hover:text-gov-emerald transition-colors"
            >
              <span>Explore Achievement Record</span>
              <ArrowRight className="h-3.5 w-3.5 text-gov-gold" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between space-y-4 group hover:border-gov-gold/40">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-gov-border/60 pb-2">
          <StatusBadge status={item.status} size="sm" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gov-slate bg-gov-canvas px-2 py-0.5 rounded">
            {item.sector}
          </span>
        </div>

        <h4 className="text-base font-bold font-display text-gov-navy dark:text-white leading-snug group-hover:text-gov-emerald transition-colors">
          {item.title}
        </h4>

        <p className="text-xs text-gov-slate leading-relaxed">
          {item.summary}
        </p>

        <div className="p-2.5 rounded bg-gov-canvas text-xs font-medium text-gov-navy">
          <span className="font-bold text-gov-emerald">Result: </span>
          {item.impactResult}
        </div>
      </div>

      <div className="pt-3 border-t border-gov-border/60 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[11px] text-gov-slate font-medium">{item.scope}</span>
          <SourceBadge sourceName={item.sourceName} level={item.sourceLevel} />
        </div>

        <Link
          to={item.href}
          className="inline-flex items-center gap-1 text-xs font-bold text-gov-navy hover:text-gov-emerald transition-colors pt-1"
        >
          <span>View Details</span>
          <ArrowRight className="h-3 w-3 text-gov-gold" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedAchievementCard;
