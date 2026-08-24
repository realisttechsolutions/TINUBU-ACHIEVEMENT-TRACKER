import React from 'react';
import {
  Landmark,
  Coins,
  ShieldCheck,
  TrendingUp,
  Info,
  ExternalLink
} from 'lucide-react';
import { FiscalDebtComposition, FAACDistributionData } from '@/types/macro.types';

interface FiscalExternalObservatoryProps {
  debtData: FiscalDebtComposition;
  faacData: FAACDistributionData;
}

export const FiscalExternalObservatory: React.FC<FiscalExternalObservatoryProps> = ({
  debtData,
  faacData
}) => {
  return (
    <section
      aria-labelledby="fiscal-external-heading"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Sovereign Debt Structure & Currency Translation Mechanics */}
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-2">
              <span className="p-1.5 rounded-md bg-gov-navy/10 dark:bg-gov-navy/40 text-gov-navy dark:text-gov-gold">
                <Landmark className="w-4 h-4 text-gov-gold" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                DEBT MANAGEMENT OFFICE (DMO)
              </span>
            </div>

            <h3 id="fiscal-external-heading" className="text-base sm:text-lg font-bold text-foreground">
              Public Debt Portfolio Composition ({debtData.period})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Breakdown of total sovereign liabilities between domestic and external obligations.
            </p>

            {/* Total Debt Headline */}
            <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border/60 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-muted-foreground">Total Sovereign Debt Stock</span>
                <p className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-0.5">
                  ₦{debtData.totalDebtNaira.toFixed(2)} Trillion
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-muted-foreground">USD Equivalent</span>
                <p className="text-sm sm:text-base font-bold font-mono text-muted-foreground mt-0.5">
                  ${debtData.totalDebtUSD.toFixed(2)} Billion
                </p>
              </div>
            </div>

            {/* Domestic vs External Ratio Bars */}
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-foreground">
                    Domestic Debt (₦{debtData.domesticDebtNaira.toFixed(2)}T / ${debtData.domesticDebtUSD.toFixed(2)}B)
                  </span>
                  <span className="font-mono font-bold text-gov-gold">{debtData.domesticSharePercent}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gov-gold h-full rounded-full transition-all"
                    style={{ width: `${debtData.domesticSharePercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-foreground">
                    External Debt (₦{debtData.externalDebtNaira.toFixed(2)}T / ${debtData.externalDebtUSD.toFixed(2)}B)
                  </span>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{debtData.externalSharePercent}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 dark:bg-sky-400 h-full rounded-full transition-all"
                    style={{ width: `${debtData.externalSharePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Currency Revaluation Technical Note */}
            <div className="mt-4 p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-900 dark:text-sky-200 text-xs">
              <p className="font-semibold flex items-center gap-1 text-[11px]">
                <Info className="w-3.5 h-3.5 shrink-0" />
                Technical Note: Exchange Rate Translation Dynamics
              </p>
              <p className="mt-1 text-[11px] leading-relaxed">
                {debtData.fxTranslationNote}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <span>Published by {debtData.source}</span>
            <a
              href={debtData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gov-navy dark:text-gov-gold hover:underline flex items-center gap-1"
            >
              <span>DMO Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 2: FAAC Federation Distributable Revenue (Post-Subsidy) */}
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-2">
              <span className="p-1.5 rounded-md bg-gov-navy/10 dark:bg-gov-navy/40 text-gov-navy dark:text-gov-gold">
                <Coins className="w-4 h-4 text-gov-gold" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                FAAC / REVENUE MOBILIZATION
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Federation Account Distributions ({faacData.period})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Net revenue allocated across the three tiers of government post-subsidy removal.
            </p>

            {/* FAAC Total Headline */}
            <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border/60 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-muted-foreground">Distributable Revenue</span>
                <p className="text-xl sm:text-2xl font-bold font-mono text-status-green mt-0.5">
                  ₦{faacData.distributableAmount.toFixed(3)} Trillion
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-muted-foreground">May 2023 Baseline</span>
                <p className="text-sm sm:text-base font-bold font-mono text-muted-foreground mt-0.5">
                  ₦0.786 Trillion
                </p>
              </div>
            </div>

            {/* 3-Tier Allocation Breakdown */}
            <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-lg bg-card border border-border/80">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Federal Govt</span>
                <span className="text-sm sm:text-base font-bold font-mono text-foreground mt-0.5 block">
                  ₦{(faacData.federalShare * 1000).toFixed(0)}B
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  {((faacData.federalShare / faacData.distributableAmount) * 100).toFixed(1)}% Share
                </span>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border/80">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">State Govts</span>
                <span className="text-sm sm:text-base font-bold font-mono text-gov-gold mt-0.5 block">
                  ₦{(faacData.stateShare * 1000).toFixed(0)}B
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  {((faacData.stateShare / faacData.distributableAmount) * 100).toFixed(1)}% Share
                </span>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border/80">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Local Govts</span>
                <span className="text-sm sm:text-base font-bold font-mono text-foreground mt-0.5 block">
                  ₦{(faacData.lgaShare * 1000).toFixed(0)}B
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  {((faacData.lgaShare / faacData.distributableAmount) * 100).toFixed(1)}% Share
                </span>
              </div>
            </div>

            {/* Sub-National Fiscal Capacity Note */}
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              {faacData.statutoryNote}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <span>Federation Account Committee</span>
            <a
              href={faacData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gov-navy dark:text-gov-gold hover:underline flex items-center gap-1"
            >
              <span>OAGF Distribution Ledger</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiscalExternalObservatory;
