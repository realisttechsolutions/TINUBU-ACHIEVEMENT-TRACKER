import React from "react";
import { AreaChart as ChartIcon, Info } from "lucide-react";
import AreaChart from "../charts/AreaChart";
import DataClassificationBadge from "../common/DataClassificationBadge";
import SourceBadge from "../common/SourceBadge";
import { gdpData, fdiData } from "@/data/statistics";

export const EvidenceDataStory: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gov-canvas dark:bg-gov-navy/20 border-b border-gov-border font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="space-y-1 max-w-2xl border-b border-gov-border/60 pb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-emerald uppercase tracking-wider">
            <ChartIcon className="h-4 w-4 text-gov-gold" />
            <span>Time-Series Trends</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gov-navy dark:text-white tracking-tight">
            What the Latest Indicators Show
          </h2>
          <p className="text-sm text-gov-slate">
            Selected economic and fiscal trends presented with their reporting periods, classifications, sources and limitations.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* GDP Growth Chart Card */}
          <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/60 pb-3">
              <h3 className="text-base font-bold font-display text-gov-navy dark:text-white">
                GDP Growth Trajectory (2023 - 2025)
              </h3>
              <div className="flex items-center gap-1.5">
                <DataClassificationBadge classification="Actual" size="sm" />
                <SourceBadge sourceName="NBS" level={2} />
              </div>
            </div>

            <div className="h-72">
              <AreaChart
                title=""
                data={gdpData}
                dataKey="value"
                color="#081B2E"
                yAxisFormatter={(val) => `${val}%`}
                tooltipFormatter={(val) => `${val}%`}
                description="Quarterly GDP growth trajectory showing recovery after economic reform rollouts."
              />
            </div>

            <div className="p-3 rounded bg-gov-canvas text-xs text-gov-slate flex items-start gap-2 border border-gov-border/40">
              <Info className="h-4 w-4 text-gov-gold shrink-0 mt-0.5" />
              <span>
                <strong>Context:</strong> Positive growth turning from negative Q2 2023 (-0.5%) to +3.2% in Q1 2025 following subsidy removal and foreign exchange normalization.
              </span>
            </div>
          </div>

          {/* FDI Inflows Chart Card */}
          <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/60 pb-3">
              <h3 className="text-base font-bold font-display text-gov-navy dark:text-white">
                Foreign Direct Investment Inflows ($M USD)
              </h3>
              <div className="flex items-center gap-1.5">
                <DataClassificationBadge classification="Independently Reported" size="sm" />
                <SourceBadge sourceName="CBN" level={2} />
              </div>
            </div>

            <div className="h-72">
              <AreaChart
                title=""
                data={fdiData}
                dataKey="value"
                color="#006B3F"
                yAxisFormatter={(val) => `$${val}M`}
                tooltipFormatter={(val) => `$${val}M`}
                description="Quarterly foreign direct capital inflows reflecting investor sentiment."
              />
            </div>

            <div className="p-3 rounded bg-gov-canvas text-xs text-gov-slate flex items-start gap-2 border border-gov-border/40">
              <Info className="h-4 w-4 text-gov-gold shrink-0 mt-0.5" />
              <span>
                <strong>Context:</strong> FDI inflows surged over 200% YoY in Q1 2025, driven by investments in manufacturing, energy, and telecom digital infrastructure.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EvidenceDataStory;
