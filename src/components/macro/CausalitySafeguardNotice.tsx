import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, AlertCircle, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CausalitySafeguardNotice: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      aria-labelledby="safeguard-notice-heading"
      className="bg-gov-canvas dark:bg-card border border-gov-gold/30 rounded-xl p-5 shadow-sm transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-lg bg-gov-navy/10 dark:bg-gov-navy/40 text-gov-navy dark:text-gov-gold shrink-0 mt-0.5">
            <Scale className="w-5 h-5 text-gov-gold" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gov-gold/20 text-gov-navy dark:text-gov-gold">
                METHODOLOGY SAFEGUARD
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                PTAT Research Contract v1.1.2
              </span>
            </div>
            <h2 id="safeguard-notice-heading" className="text-sm md:text-base font-semibold text-foreground mt-1">
              Statutory Provenance & Causality Separation Protocol
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5 max-w-4xl">
              Macroeconomic movements during an administration reflect multidimensional variables (global commodity cycles, monetary policy lags, geopolitical supply chains). Macro indicators presented in this observatory are empirical readings published by statutory bodies (NBS, CBN, DMO, NUPRC) and do not assert unilateral presidential causation.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center self-end md:self-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-gov-navy dark:text-gov-gold hover:bg-gov-navy/10 flex items-center space-x-1"
            aria-expanded={isExpanded}
            aria-controls="safeguard-details"
          >
            <span>{isExpanded ? 'Hide Methodology Notes' : 'View Methodology Protocol'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div
          id="safeguard-details"
          className="mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground space-y-3 animate-in fade-in-50 duration-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-card/60 border border-border/40">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-status-green" />
                1. Institutional Provenance
              </p>
              <p className="mt-1">
                Every metric is linked directly to official bulletins from statutory bodies (NBS, CBN, DMO, NUPRC, FAAC, NERC). No proprietary or synthetic indices are used.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-card/60 border border-border/40">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-gov-gold" />
                2. Explicit Baseline Comparison
              </p>
              <p className="mt-1">
                All long-term comparative metrics use the May 2023 Inauguration Baseline (or nearest preceding quarterly reading) to ensure transparent chronological accountability.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-card/60 border border-border/40">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-sky-600" />
                3. Reform Transmission Logic
              </p>
              <p className="mt-1">
                Policy actions are mapped to intermediate transmission channels before reaching observed macro indicators, explicitly recognizing external factors and structural lags.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CausalitySafeguardNotice;
