import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Info,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { MacroObservation, TimeMode, MacroFreshnessState } from '@/types/macro.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MacroMetricCardProps {
  indicator: MacroObservation;
  timeMode: TimeMode;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const MacroMetricCard: React.FC<MacroMetricCardProps> = ({
  indicator,
  timeMode,
  isSelected = false,
  onSelect
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delta calculation based on timeMode
  let deltaValue = 0;
  let isPositive = false;
  let isZero = false;
  let formattedDelta = '';
  let badgeColor = '';
  let deltaLabel = '';

  if (timeMode === 'baseline') {
    deltaValue = Number((indicator.value - indicator.administration_baseline_value).toFixed(2));
    isPositive = deltaValue > 0;
    isZero = deltaValue === 0;
    formattedDelta = `${isPositive ? '+' : ''}${deltaValue.toLocaleString()} ${indicator.unit === '%' || indicator.unit === '% YoY' || indicator.unit === '% per annum' ? '% pts' : indicator.unit}`;
    deltaLabel = `vs May 2023 Baseline (${indicator.formatted_baseline_value})`;

    if (indicator.interpretation_rule === 'higher_favorable') {
      badgeColor = isPositive
        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-status-green border border-status-green/30'
        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-500/30';
    } else if (indicator.interpretation_rule === 'lower_favorable') {
      badgeColor = isPositive
        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-500/30'
        : 'bg-emerald-50 dark:bg-emerald-950/50 text-status-green border border-status-green/30';
    } else {
      badgeColor = 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-500/30';
    }
  } else {
    // Latest reading vs preceding period
    const periodDelta = Number((indicator.value - indicator.previous_value).toFixed(2));
    const isPeriodPositive = periodDelta > 0;
    isPositive = isPeriodPositive;
    isZero = periodDelta === 0;
    formattedDelta = `${isPeriodPositive ? '+' : ''}${periodDelta.toLocaleString()} ${indicator.unit === '%' || indicator.unit === '% YoY' || indicator.unit === '% per annum' ? '% pts' : indicator.unit}`;
    deltaLabel = `vs ${indicator.previous_period} (${indicator.formatted_previous_value})`;

    if (indicator.interpretation_rule === 'higher_favorable') {
      badgeColor = isPeriodPositive
        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-status-green border border-status-green/30'
        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-500/30';
    } else if (indicator.interpretation_rule === 'lower_favorable') {
      badgeColor = isPeriodPositive
        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-500/30'
        : 'bg-emerald-50 dark:bg-emerald-950/50 text-status-green border border-status-green/30';
    } else {
      badgeColor = 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-500/30';
    }
  }

  const getFreshnessBadge = (status: MacroFreshnessState) => {
    switch (status) {
      case 'CURRENT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-status-green bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-status-green/20">
            <CheckCircle2 className="w-2.5 h-2.5" />
            CURRENT
          </span>
        );
      case 'RECENT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
            <Clock className="w-2.5 h-2.5" />
            RECENT
          </span>
        );
      case 'STALE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-500/20">
            <AlertTriangle className="w-2.5 h-2.5" />
            STALE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
            UNAVAILABLE
          </span>
        );
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.();
          }
        }}
        className={`group relative text-left bg-card hover:bg-muted/30 border rounded-xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-gov-gold/50 ${
          isSelected
            ? 'border-gov-gold ring-2 ring-gov-gold/30 shadow-md'
            : 'border-border/80 hover:border-gov-gold/50'
        }`}
      >
        {/* Top Header: Source badge & Freshness & Provenance Dialog button */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {indicator.source_institution.split('(')[1]?.replace(')', '') || indicator.source_institution}
            </span>
            {getFreshnessBadge(indicator.freshness_status)}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="h-6 w-6 text-muted-foreground hover:text-gov-gold hover:bg-gov-gold/10 -mr-1"
            title="View Statutory Provenance & Methodology"
            aria-label={`View provenance for ${indicator.indicator_name}`}
          >
            <Info className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Indicator Title */}
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
          {indicator.indicator_name}
        </h3>

        {/* Primary Metric Reading */}
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground">
            {indicator.formatted_value}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground/80 shrink-0">
            {indicator.observation_period}
          </span>
        </div>

        {/* Comparative Movement Pill */}
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
          <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
            {isZero ? (
              <Minus className="w-3 h-3" />
            ) : isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className="font-mono text-[11px]">{formattedDelta}</span>
          </div>
          <span className="text-[10px] text-muted-foreground truncate max-w-[150px]" title={deltaLabel}>
            {deltaLabel}
          </span>
        </div>
      </div>

      {/* Institutional Provenance Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-card text-foreground border-border">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gov-gold/20 text-gov-navy dark:text-gov-gold">
                STATUTORY PROVENANCE RECORD
              </span>
              {getFreshnessBadge(indicator.freshness_status)}
            </div>
            <DialogTitle className="text-lg font-bold text-foreground mt-1">
              {indicator.indicator_name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Official reporting publication released by {indicator.source_institution}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs mt-2">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
              <div>
                <p className="text-[10px] uppercase font-mono text-muted-foreground">Observation Period</p>
                <p className="font-semibold text-foreground mt-0.5">{indicator.observation_period}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono text-muted-foreground">Certified Value</p>
                <p className="font-semibold text-foreground mt-0.5 font-mono text-sm">{indicator.formatted_value}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono text-muted-foreground">May 2023 Baseline</p>
                <p className="font-semibold text-foreground mt-0.5">{indicator.formatted_baseline_value} ({indicator.baseline_period})</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono text-muted-foreground">Reporting Cadence</p>
                <p className="font-semibold text-foreground mt-0.5 capitalize">{indicator.frequency.replace('_', ' ')}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">Official Document Citation</p>
              <div className="p-2.5 rounded bg-muted/30 border border-border/40 font-mono text-[11px] text-foreground/90">
                {indicator.source_title}
              </div>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">Methodological Definition</p>
              <p className="text-muted-foreground leading-relaxed">
                {indicator.methodology_note}
              </p>
            </div>

            {indicator.series_break_note && (
              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300">
                <p className="font-semibold text-[11px] flex items-center gap-1">
                  <Info className="w-3 h-3" /> Note on Series Methodology:
                </p>
                <p className="mt-0.5 text-[11px]">{indicator.series_break_note}</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-border/50">
              <span className="text-[10px] text-muted-foreground font-mono">
                Retrieved: {new Date(indicator.retrieved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <a
                href={indicator.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-gov-navy text-white hover:bg-gov-navy/90 dark:bg-gov-gold dark:text-gov-navy dark:hover:bg-gov-gold/90 transition-colors"
              >
                <span>Visit Statutory Source Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MacroMetricCard;
