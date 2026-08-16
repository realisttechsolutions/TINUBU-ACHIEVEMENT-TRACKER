import React from "react";
import { Link } from "@/lib/navigation";
import { RefreshCw, ArrowRight } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import SourceBadge from "../common/SourceBadge";
import { latestUpdatesData } from "@/data/home/homepage.config";

export const LatestUpdates: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gov-darkSurface border-b border-gov-border font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="space-y-1 max-w-2xl border-b border-gov-border/60 pb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-emerald uppercase tracking-wider">
            <RefreshCw className="h-4 w-4 text-gov-gold" />
            <span>Editorial Feed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gov-navy dark:text-white tracking-tight">
            Latest Verified Updates
          </h2>
          <p className="text-sm text-gov-slate">
            Recently added or revised information across policies, projects and national indicators.
          </p>
        </div>

        {/* Updates Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {latestUpdatesData.map((item) => (
            <div
              key={item.id}
              className="bg-gov-canvas dark:bg-gov-navy/20 border border-gov-border rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-gov-border/40 pb-2 text-xs">
                  <span className="font-bold text-gov-navy dark:text-white font-display">
                    {item.date}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                <h4 className="text-base font-bold font-display text-gov-navy dark:text-white leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-gov-slate leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-gov-border/40 flex items-center justify-between text-xs">
                <SourceBadge sourceName={item.sourceName} level={2} />
                <Link
                  to="/data-sources"
                  className="inline-flex items-center gap-1 font-bold text-gov-navy hover:text-gov-emerald text-xs"
                >
                  <span>Verification Log</span>
                  <ArrowRight className="h-3 w-3 text-gov-gold" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestUpdates;
