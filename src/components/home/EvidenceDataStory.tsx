import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Database, FileText, Globe, CheckCircle2, ArrowRight, BookOpen, AlertTriangle } from "lucide-react";

export const EvidenceDataStory: React.FC = () => {
  const levels = [
    {
      level: "Level 1",
      title: "Primary Legal & Administrative Records",
      description: "Acts of National Assembly, Official Federal Gazettes, signed Executive Orders, and Federal Executive Council (FEC) resolutions.",
      icon: ShieldCheck,
      color: "navy"
    },
    {
      level: "Level 2",
      title: "Official Statistical & Administrative Data",
      description: "National Bureau of Statistics (NBS) bulletins, Central Bank of Nigeria (CBN) reports, and Debt Management Office (DMO) data.",
      icon: Database,
      color: "emerald"
    },
    {
      level: "Level 3",
      title: "Multilateral & Independent Audits",
      description: "World Bank, IMF, AfDB evaluation reports, NEITI statutory audits, and peer-reviewed institutional studies.",
      icon: Globe,
      color: "purple"
    },
    {
      level: "Level 4",
      title: "Credible Mainstream & Specialist Media",
      description: "Investigative daily reports, on-site verified journalistic investigations, and trade publications.",
      icon: FileText,
      color: "blue"
    }
  ];

  return (
    <section className="py-16 bg-gov-canvas dark:bg-gov-darkSurface/50 border-b border-gov-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-gold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-gov-emerald" />
              <span>Evidentiary Governance & Verification Standards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gov-navy dark:text-white">
              The 6-Tier Evidence Architecture
            </h2>
            <p className="text-sm text-gov-slate leading-relaxed">
              Every achievement record links directly to verifiable primary documents. Positive presentation is paired with 18 immutable truth safeguards.
            </p>
          </div>

          <Link
            to="/data-sources"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gov-emerald hover:text-emerald-700 transition-colors shrink-0"
          >
            <span>Learn About Verification Standards</span>
            <ArrowRight className="h-4 w-4 text-gov-gold" />
          </Link>
        </div>

        {/* 4-Tier Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {levels.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.level}
                className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm hover:shadow-lg hover:border-gov-gold/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2.5 py-1 rounded-md">
                    {item.level}
                  </span>
                  <Icon className="h-5 w-5 text-gov-navy dark:text-gov-gold" />
                </div>

                <h3 className="text-base font-bold font-display text-gov-navy dark:text-white leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-gov-slate leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Truth Rules Callout Box */}
        <div className="p-6 rounded-2xl bg-gov-navy text-white border border-gov-gold/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-gov-gold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-gov-emerald" />
              <span>Core Truth Invariant</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold font-display text-white">
              "Positive selection must never weaken factual accuracy."
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Announcements never equal approvals; approvals never equal cash releases; cash releases never equal completed outcomes. Material caveats, sample boundaries, and contradiction logs are permanently preserved.
            </p>
          </div>

          <Link
            to="/data-sources"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors shrink-0 border border-white/20"
          >
            Read Methodology →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EvidenceDataStory;
