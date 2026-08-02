import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { regionalZoneData } from "@/data/home/homepage.config";

export const NationalImpactPreview: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gov-canvas dark:bg-gov-navy/20 border-b border-gov-border font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gov-border/60 pb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-emerald uppercase tracking-wider">
              <Compass className="h-4 w-4 text-gov-gold" />
              <span>Geopolitical Zone Distribution</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gov-navy dark:text-white tracking-tight">
              Impact Across Nigeria
            </h2>
            <p className="text-sm text-gov-slate">
              Explore how federal policies, infrastructure projects and social interventions connect across all six geopolitical zones.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <Button
              variant="outline"
              className="border-gov-border text-gov-navy hover:bg-white gap-2"
              asChild
            >
              <Link to="/states">
                <span>State Directory</span>
              </Link>
            </Button>
            <Button
              className="bg-gov-navy text-white hover:bg-gov-emerald gap-2"
              asChild
            >
              <Link to="/impact-map">
                <span>Explore Interactive Impact Map</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 6 Geopolitical Zones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionalZoneData.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-gov-border/60 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-gov-navy dark:text-white text-base font-display">
                  <MapPin className="h-4 w-4 text-gov-gold shrink-0" />
                  <span>{item.name}</span>
                </div>
                <span className="text-[11px] font-semibold text-gov-emerald bg-gov-canvas px-2 py-0.5 rounded">
                  {item.indicator}
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-gov-navy dark:text-white">
                  Key Deliverable:
                </p>
                <p className="text-xs text-gov-slate leading-relaxed bg-gov-canvas dark:bg-gov-navy/20 p-2.5 rounded border border-gov-border/40">
                  {item.keyHighlight}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1 text-[10px] text-gov-slate">
                <span className="font-bold text-gov-navy dark:text-gray-300">States:</span>
                {item.statesCovered.map((state, sIdx) => (
                  <span key={sIdx} className="bg-gray-100 dark:bg-gov-navy px-1.5 py-0.5 rounded">
                    {state}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NationalImpactPreview;
