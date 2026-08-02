import React from "react";
import { Link } from "react-router-dom";
import { Download, BarChart2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ReportsResearchCTA: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gov-navy text-white font-sans border-b border-gov-gold/30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-gov-navy via-gov-darkSurface to-gov-navy border border-gov-gold/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-gov-gold">
              Resource Center & Documentation
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight">
              Explore the Evidence in Detail
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              Access full sector reports, official source documentation, downloadable statistical datasets, and executive performance charts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gov-emerald hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 h-12 shadow-lg transition-colors gap-2"
              asChild
            >
              <Link to="/downloads">
                <Download className="h-4 w-4 text-gov-gold" />
                <span>Browse Reports & Downloads</span>
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-gov-border/60 hover:bg-white/10 text-white font-semibold text-sm px-6 py-3 h-12 gap-2"
              asChild
            >
              <Link to="/dashboard">
                <BarChart2 className="h-4 w-4 text-gov-gold" />
                <span>View Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportsResearchCTA;
