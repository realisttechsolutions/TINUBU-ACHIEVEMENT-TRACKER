
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { InfoIcon, TrendingUp, TrendingDown, Minus, Building2 } from "lucide-react";
import StatusBadge, { AchievementStatus } from "../common/StatusBadge";
import DataClassificationBadge, { DataClassification } from "../common/DataClassificationBadge";
import SourceBadge, { SourceLevel } from "../common/SourceBadge";

export interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
  additionalInfo?: {
    text: string;
    source?: string;
  };
  color?: "blue" | "purple" | "gold" | "green" | "red";
  
  // Constitution evidence parameters
  status?: AchievementStatus;
  classification?: DataClassification;
  sourceName?: string;
  sourceUrl?: string;
  sourceLevel?: SourceLevel;
  reportingPeriod?: string;
  verificationDate?: string;
  ministry?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  description,
  trend,
  trendValue,
  icon,
  className,
  additionalInfo,
  color = "blue",
  status,
  classification,
  sourceName,
  sourceUrl,
  sourceLevel = 1,
  reportingPeriod,
  verificationDate,
  ministry,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-700 font-semibold";
      case "down":
        return "text-rose-700 font-semibold";
      default:
        return "text-gov-slate font-medium";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 shrink-0 text-emerald-700" />;
      case "down":
        return <TrendingDown className="h-4 w-4 shrink-0 text-rose-700" />;
      default:
        return <Minus className="h-4 w-4 shrink-0 text-gov-slate" />;
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case "green":
        return "border-l-4 border-l-gov-emerald";
      case "gold":
        return "border-l-4 border-l-gov-gold";
      case "red":
        return "border-l-4 border-l-rose-600";
      default:
        return "border-l-4 border-l-gov-navy";
    }
  };

  const effectiveSourceName = sourceName || additionalInfo?.source;
  const effectiveSourceUrl = sourceUrl || additionalInfo?.source;

  return (
    <Card className={cn("overflow-hidden bg-white border border-gov-border shadow-sm hover:shadow-md transition-all duration-200", getBorderColor(), className)}>
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        {/* Top bar: Classification & Status */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-gov-border/60 pb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {classification && (
              <DataClassificationBadge classification={classification} size="sm" />
            )}
            {status && (
              <StatusBadge status={status} size="sm" />
            )}
          </div>
          {reportingPeriod && (
            <span className="text-[11px] text-gov-slate font-medium bg-gov-canvas px-2 py-0.5 rounded border border-gov-border">
              {reportingPeriod}
            </span>
          )}
        </div>

        {/* Core Metric Title & Info */}
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-xs font-semibold text-gov-slate uppercase tracking-wider leading-snug">
              {title}
            </h4>
            {icon && (
              <div className="p-2 rounded-md bg-gov-canvas text-gov-navy shrink-0">
                {icon}
              </div>
            )}
          </div>

          {/* Large Stat Value */}
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl md:text-3xl font-extrabold text-gov-navy font-display tabular-nums tracking-tight">
              {value}
            </span>
            {unit && <span className="text-sm font-semibold text-gov-slate">{unit}</span>}
          </div>

          {description && (
            <p className="text-xs text-gray-600 font-normal leading-relaxed pt-0.5">
              {description}
            </p>
          )}
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center gap-1.5 pt-1 text-xs">
            {getTrendIcon()}
            <span className={getTrendColor()}>{trendValue}</span>
          </div>
        )}

        {/* Context / Hover details */}
        {additionalInfo?.text && (
          <div className="pt-2 border-t border-gov-border/40 text-xs text-gov-slate">
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="flex items-center text-xs text-gov-navy font-medium hover:underline gap-1">
                  <InfoIcon className="h-3.5 w-3.5 text-gov-gold shrink-0" />
                  <span>Context & Notes</span>
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4 border border-gov-border shadow-lg">
                <p className="text-xs text-gov-text leading-relaxed">{additionalInfo.text}</p>
                {additionalInfo.source && (
                  <a
                    href={additionalInfo.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gov-navy font-semibold hover:underline mt-2 inline-block"
                  >
                    View Source Record →
                  </a>
                )}
              </HoverCardContent>
            </HoverCard>
          </div>
        )}

        {/* Footer: Ministry & Source Attribution */}
        <div className="pt-2 border-t border-gov-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          {ministry && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gov-slate">
              <Building2 className="h-3 w-3 text-gov-navy shrink-0" />
              <span className="truncate max-w-[140px]">{ministry}</span>
            </span>
          )}

          {effectiveSourceName && (
            <SourceBadge
              sourceName={effectiveSourceName}
              sourceUrl={effectiveSourceUrl}
              level={sourceLevel}
              verificationDate={verificationDate}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;

