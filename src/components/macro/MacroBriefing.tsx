import React from 'react';
import {
  FileText,
  Calendar,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Landmark
} from 'lucide-react';

export const MacroBriefing: React.FC = () => {
  return (
    <section
      aria-labelledby="macro-briefing-heading"
      className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 pb-2">
        <span className="p-1.5 rounded-md bg-gov-navy/10 dark:bg-gov-navy/40 text-gov-navy dark:text-gov-gold">
          <FileText className="w-4 h-4 text-gov-gold" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
          STATUTORY INTELLIGENCE BRIEFING
        </span>
      </div>

      <h2 id="macro-briefing-heading" className="text-lg sm:text-xl font-bold text-foreground">
        What Changed? (2026 Macro Analysis)
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-3xl">
        Quarterly synthesis of macroeconomic structural developments grounded in certified releases from the National Bureau of Statistics and Central Bank of Nigeria.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* Briefing 1: Price Dynamics */}
        <div className="p-4 rounded-xl bg-muted/20 border border-border/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Prices & Inflation</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-status-green border border-status-green/30">
                DISINFLATION TREND
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Headline CPI Deceleration
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Headline inflation moderated to 15.43% in July 2026 under the rebased 2024=100 CPI framework, supported by orthodox monetary tightening (MPR at 26.50%) while food inflation stands at 20.31% YoY.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-border/40 text-[10px] text-muted-foreground font-mono">
            NBS July 2026 CPI Bulletin
          </div>
        </div>

        {/* Briefing 2: External Liquidity */}
        <div className="p-4 rounded-xl bg-muted/20 border border-border/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">External Sector</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-status-green border border-status-green/30">
                17-YEAR HIGH
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground">
              External Reserves Exceed $52.6B
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Gross external reserves reached a 17-year high of $52.66 Billion in August 2026, driven by higher autonomous export conversions, clearance of verified FX backlogs, and crude production of 1.505 mbpd.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-border/40 text-[10px] text-muted-foreground font-mono">
            CBN August 2026 Reserves Report
          </div>
        </div>

        {/* Briefing 3: Real Growth */}
        <div className="p-4 rounded-xl bg-muted/20 border border-border/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Real GDP Output</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gov-gold/20 text-gov-navy dark:text-gov-gold border border-gov-gold/30">
                NON-OIL RESILIENCE
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Services & ICT Lead Expansion
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Real GDP recorded +3.89% YoY growth in Q1 2026, underpinned by non-oil output (96.08% of real GDP), robust services expansion (+4.31%), and an agricultural recovery (+3.15%).
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-border/40 text-[10px] text-muted-foreground font-mono">
            NBS Q1 2026 GDP National Accounts
          </div>
        </div>

        {/* Briefing 4: Fiscal Space */}
        <div className="p-4 rounded-xl bg-muted/20 border border-border/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Fiscal Balance</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                RECORD ₦3T DISBURSEMENT
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Federation Revenue Broadening
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Distributable federation revenue expanded to a record ₦3.007 Trillion in July 2026. Sub-national state allocations exceeded ₦1.04 Trillion under revised Nigeria Tax Act 2025 VAT sharing.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-border/40 text-[10px] text-muted-foreground font-mono">
            FAAC July 2026 Allocation Bulletin
          </div>
        </div>
      </div>
    </section>
  );
};

export default MacroBriefing;
