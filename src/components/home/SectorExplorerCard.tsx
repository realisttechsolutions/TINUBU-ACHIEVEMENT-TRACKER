import React from "react";
import { Link } from "@/lib/navigation";
import { ArrowRight, TrendingUp, ShieldCheck, Building2, HeartPulse } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { SectorItemConfig } from "@/data/home/homepage.config";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  ShieldCheck,
  Building2,
  HeartPulse,
};

interface SectorExplorerCardProps {
  sector: SectorItemConfig;
}

export const SectorExplorerCard: React.FC<SectorExplorerCardProps> = ({ sector }) => {
  const Icon = iconMap[sector.iconName] || TrendingUp;

  return (
    <Link
      to={sector.path}
      className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-6 shadow-xs hover:shadow-md hover:border-gov-gold/50 transition-all duration-200 flex flex-col justify-between space-y-4 group"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-gov-border/60 pb-3">
          <div className="p-2.5 rounded-lg bg-gov-navy text-gov-gold group-hover:bg-gov-emerald group-hover:text-white transition-colors shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <StatusBadge status={sector.status} size="sm" />
        </div>

        <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">
          {sector.title}
        </h3>

        <p className="text-xs text-gov-slate leading-relaxed">
          {sector.description}
        </p>
      </div>

      <div className="pt-3 border-t border-gov-border/60 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-gov-slate uppercase font-bold block">Key Indicator</span>
          <span className="font-extrabold text-gov-navy dark:text-white text-sm font-display tabular-nums">
            {sector.indicatorValue}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 font-bold text-gov-navy group-hover:text-gov-emerald transition-colors">
          <span>Explore Sector</span>
          <ArrowRight className="h-3.5 w-3.5 text-gov-gold group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
};

export default SectorExplorerCard;
