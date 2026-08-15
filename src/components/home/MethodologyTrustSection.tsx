import React from "react";
import { Link } from "@/lib/navigation";
import { ShieldCheck, FileCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MethodologyTrustSection: React.FC = () => {
  const trustPoints = [
    {
      number: "1",
      title: "Sources Remain Visible",
      description: "Important figures and claims link to their supporting official records or published statistics.",
    },
    {
      number: "2",
      title: "Status is Clearly Classified",
      description: "Announcements, ongoing implementation, physical delivery, and measured outcomes are never confused.",
    },
    {
      number: "3",
      title: "Dates and Periods Matter",
      description: "All statistics are presented alongside the exact reporting period or date they represent.",
    },
    {
      number: "4",
      title: "Corrections are Documented",
      description: "Revisions and data updates remain traceable as official records are released.",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gov-canvas dark:bg-gov-navy/20 border-b border-gov-border font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gov-border/60 pb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-emerald uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-gov-gold" />
              <span>Evidence Framework</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gov-navy dark:text-white tracking-tight">
              Built Around Evidence
            </h2>
            <p className="text-sm text-gov-slate">
              The tracker organises information from official records, national data institutions, international reports and credible supporting publications.
            </p>
          </div>

          <Button
            variant="outline"
            className="border-gov-border text-gov-navy hover:bg-white gap-2 shrink-0 self-start md:self-auto"
            asChild
          >
            <Link to="/data-sources">
              <span>Explore Data & Methodology</span>
              <ArrowRight className="h-4 w-4 text-gov-emerald" />
            </Link>
          </Button>
        </div>

        {/* Trust Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point) => (
            <div
              key={point.number}
              className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-5 shadow-xs space-y-2"
            >
              <div className="h-8 w-8 rounded-full bg-gov-navy text-gov-gold font-bold font-display text-sm flex items-center justify-center">
                {point.number}
              </div>
              <h3 className="text-sm font-bold font-display text-gov-navy dark:text-white pt-1">
                {point.title}
              </h3>
              <p className="text-xs text-gov-slate leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer Note */}
        <div className="p-4 rounded-lg bg-white dark:bg-gov-darkSurface border border-gov-border/80 text-xs text-gov-slate flex items-center justify-between gap-4">
          <span className="leading-relaxed">
            <strong className="text-gov-navy dark:text-white">Note:</strong> Referencing an institution or statistical dataset does not imply formal commercial partnership or endorsement.
          </span>
          <Link to="/data-sources" className="font-bold text-gov-navy hover:underline shrink-0">
            Methodology Standards â†’
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MethodologyTrustSection;
