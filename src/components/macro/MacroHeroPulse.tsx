import React from 'react';
import {
  Activity,
  Clock,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { MacroObservation, TimeMode } from '@/types/macro.types';
import MacroMetricCard from './MacroMetricCard';

interface MacroHeroPulseProps {
  indicators: MacroObservation[];
  timeMode: TimeMode;
  onTimeModeChange: (mode: TimeMode) => void;
  selectedIndicatorId?: string;
  onSelectIndicator?: (id: string) => void;
}

export const MacroHeroPulse: React.FC<MacroHeroPulseProps> = ({
  indicators,
  timeMode,
  onTimeModeChange,
  selectedIndicatorId,
  onSelectIndicator
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gov-canvas via-background to-background pt-8 pb-10 border-b border-border">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gov-gold/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute top-40 left-0 w-72 h-72 bg-gov-navy/5 dark:bg-gov-navy/20 rounded-full blur-3xl pointer-events-none -ml-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Badge & Meta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gov-navy text-gov-gold dark:bg-gov-gold/20 dark:text-gov-gold border border-gov-gold/30">
                <Activity className="w-3.5 h-3.5 animate-pulse text-gov-gold" />
                OFFICIAL OBSERVATORY
              </span>
              <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-status-green" />
                Statutory Data Feeds (NBS / CBN / DMO / NUPRC)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-serif">
              National Macro Intelligence Observatory
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-3xl">
              Certified empirical observations tracking economic output, price dynamics, monetary adjustments, and fiscal balances under the Federal Republic of Nigeria.
            </p>
          </div>

          {/* Time Mode Segmented Control */}
          <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 sm:self-center">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Comparative View:</span>
            </div>

            <div
              role="radiogroup"
              aria-label="Observatory Time Mode"
              className="inline-flex p-1 rounded-xl bg-muted/80 border border-border"
            >
              <button
                type="button"
                role="radio"
                aria-checked={timeMode === 'latest'}
                onClick={() => onTimeModeChange('latest')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  timeMode === 'latest'
                    ? 'bg-card text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Latest Official Reading
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={timeMode === 'baseline'}
                onClick={() => onTimeModeChange('baseline')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  timeMode === 'baseline'
                    ? 'bg-gov-navy text-gov-gold dark:bg-gov-gold dark:text-gov-navy shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Since May 2023 Baseline Mode
              </button>
            </div>
          </div>
        </div>

        {/* 8 Primary Macro Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-2">
          {indicators.map((indicator) => (
            <MacroMetricCard
              key={indicator.indicator_id}
              indicator={indicator}
              timeMode={timeMode}
              isSelected={selectedIndicatorId === indicator.indicator_id}
              onSelect={() => onSelectIndicator?.(indicator.indicator_id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MacroHeroPulse;
