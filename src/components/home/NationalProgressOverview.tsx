import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MetricCard from "../dashboard/MetricCard";
import { headlineMetrics } from "@/data/home/homepage.config";

export const NationalProgressOverview: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gov-darkSurface border-b border-gov-border font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gov-border/60 pb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-emerald uppercase tracking-wider">
              <BarChart3 className="h-4 w-4 text-gov-gold" />
              <span>Verified Headline Indicators</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gov-navy dark:text-white tracking-tight">
              National Progress at a Glance
            </h2>
            <p className="text-sm text-gov-slate">
              A concise view of selected indicators and interventions across the administration’s priority sectors.
            </p>
          </div>

          <Button
            variant="outline"
            className="border-gov-border text-gov-navy hover:bg-gov-canvas gap-2 shrink-0 self-start md:self-auto"
            asChild
          >
            <Link to="/dashboard">
              <span>View Executive Dashboard</span>
              <ArrowRight className="h-4 w-4 text-gov-emerald" />
            </Link>
          </Button>
        </div>

        {/* 4-Column Headline Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {headlineMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              description={metric.description}
              trend={metric.trend}
              trendValue={metric.trendValue}
              classification={metric.classification}
              status={metric.status}
              sourceName={metric.sourceName}
              sourceUrl={metric.sourceUrl}
              sourceLevel={metric.sourceLevel}
              reportingPeriod={metric.reportingPeriod}
              verificationDate={metric.verificationDate}
              ministry={metric.ministry}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NationalProgressOverview;
