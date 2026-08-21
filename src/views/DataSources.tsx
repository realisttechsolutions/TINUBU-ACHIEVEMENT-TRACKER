'use client';
import React from "react";
import PageHead from "@/components/SEO/PageHead";
import SourceBadge from "@/components/common/SourceBadge";
import { 
  ShieldCheck, 
  Database, 
  Globe, 
  FileText, 
  Newspaper, 
  BookOpen, 
  CheckCircle2, 
  Download, 
  AlertTriangle, 
  ExternalLink,
  Scale,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { dataAdapter } from "@/adapters/dataAdapter";

export const DataSources: React.FC = () => {
  const levels = [
    {
      level: "LEVEL_1",
      badgeText: "Level 1: Statutory & Administrative Instruments",
      description: "Acts of National Assembly, Official Federal Republic of Nigeria Gazettes, Presidential Executive Orders, Federal Executive Council (FEC) resolutions, and Supreme Court rulings.",
      examples: ["Official Gazettes (Vol. 111)", "Student Loans Act 2024", "Electricity Act 2023", "FEC Contract Resolutions", "Supreme Court SC/CV/343/2024"]
    },
    {
      level: "LEVEL_2",
      badgeText: "Level 2: Official Statistical Data (NBS & CBN)",
      description: "National Bureau of Statistics (NBS) quarterly GDP, trade and CPI bulletins, Central Bank of Nigeria (CBN) statistical bulletins, and Debt Management Office (DMO) debt stock releases.",
      examples: ["NBS Foreign Trade in Goods Statistics", "CBN Monthly Economic Reports", "DMO Public Debt Bulletins", "NELFUND Administrative Disbursement Portals"]
    },
    {
      level: "LEVEL_3",
      badgeText: "Level 3: Multilateral & Independent Audits",
      description: "World Bank, IMF Article IV mission statements, African Development Bank (AfDB) program appraisals, NEITI statutory oil & gas audits, and Auditor-General reports.",
      examples: ["IMF Nigeria Article IV Staff Reports", "World Bank Nigeria Development Update", "NEITI Financial Audit Reports"]
    },
    {
      level: "LEVEL_4",
      badgeText: "Level 4: Mainstream & Investigative Media",
      description: "On-site verified reporting from established national dailies, international wire services (Reuters, Bloomberg), and verified investigative desks.",
      examples: ["Premium Times Investigations", "BusinessDay Intelligence", "Daily Trust Field Reports", "The Guardian Nigeria"]
    },
    {
      level: "LEVEL_5",
      badgeText: "Level 5: Official Statements & Contextual Briefings",
      description: "State House Press Releases, Ministerial press conferences, and official agency communiques providing operational context and milestone updates.",
      examples: ["State House Press Office Briefings", "Ministry of Information Communiques", "Federal Ministry of Works Project Updates"]
    }
  ];

  const primaryPublishers = [
    { name: "Federal Republic of Nigeria Official Gazette", category: "Statutory Law", scope: "Acts, Gazettes, Orders" },
    { name: "National Bureau of Statistics (NBS)", category: "National Statistics", scope: "GDP, Inflation, Trade, Labor" },
    { name: "Central Bank of Nigeria (CBN)", category: "Monetary Authority", scope: "FX, Reserves, Monetary Policy" },
    { name: "Debt Management Office (DMO)", category: "Public Debt", scope: "Sovereign Debt, Bonds, Service Ratios" },
    { name: "National Student Financial Aid Scheme (NELFUND)", category: "Education Aid", scope: "Student Loans, Institutional Tuition" },
    { name: "Federal Ministry of Works", category: "Infrastructure", scope: "Highway Corridors, Bridge Engineering" },
    { name: "Supreme Court of Nigeria", category: "Judiciary", scope: "Constitutional Rulings, LGA Autonomy" },
    { name: "International Monetary Fund (IMF)", category: "Multilateral", scope: "Macroeconomic Audits & Evaluations" }
  ];

  const handleExportSources = () => {
    dataAdapter.exportToCsv(
      primaryPublishers.map(p => ({
        publisher_name: p.name,
        category: p.category,
        data_scope: p.scope,
        governing_contract: "Contract v1.1.2",
        status: "Active Verified Institutional Source"
      })),
      "tinubu_tracker_primary_sources_directory"
    );
  };

  return (
    <>
      <PageHead
        title="Sources Hierarchy & Methodology | President Tinubu Achievement Tracker"
        description="Transparent 6-tier primary evidence hierarchy, 18 truth safeguards, and cited institutional publisher directory governing the President Tinubu Achievement Tracker (2023 - 2026)."
        keywords="Nigeria data sources, research methodology, 6-level source hierarchy, NBS, CBN, Official Gazette, fact checking Nigeria"
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white rounded-3xl p-6 sm:p-10 border border-gov-gold/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>Evidentiary Governance Standard • Contract v1.1.2</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  Sources Hierarchy & Verification Methodology
                </h1>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                  Our research architecture separates positive presentation from uncompromising truth standards. Every factual claim is mapped to primary institutional documents.
                </p>
              </div>

              <Button
                onClick={handleExportSources}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-sm shrink-0"
              >
                <FileSpreadsheet className="h-4 w-4 text-gov-gold" />
                <span>Export Sources Index (CSV)</span>
              </Button>
            </div>
          </div>

          {/* 6-Level Hierarchy Stack */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-gov-navy dark:text-white">
                The 6-Level Evidentiary Classification System
              </h2>
              <span className="text-xs text-gov-slate">Hierarchy Rules v1.1.2</span>
            </div>

            <div className="space-y-4">
              {levels.map((item) => (
                <div
                  key={item.level}
                  className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/60 pb-3">
                    <SourceBadge level={item.level} />
                    <span className="text-xs font-bold font-mono text-gov-slate uppercase">
                      Tier {item.level.replace('LEVEL_', '')}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gov-slate leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-gov-navy dark:text-white">Representative Examples:</span>
                    {item.examples.map((ex, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-gov-canvas dark:bg-white/5 border border-gov-border text-gov-slate text-[11px]">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 18 Truth Safeguards Invariants Grid */}
          <div className="p-6 sm:p-10 rounded-3xl bg-gov-navy text-white border border-gov-gold/30 shadow-xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gov-gold uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-gov-emerald" />
                <span>18 Immutable Truth Safeguards</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white">
                Uncompromising Rules of Public Evidence
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-gray-300">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white text-sm">1. Positive Selection Mandate</div>
                <p>We document genuine achievements, but presentation must never weaken factual precision.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white text-sm">2. Implementation Distinctions</div>
                <p>Announced ≠ Approved; Approved ≠ Funded; Funded ≠ Spent; Spent ≠ Completed Outcome.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white text-sm">3. Financial Non-Aggregation</div>
                <p>Incompatible financial values (budgets vs disbursements vs expenses) are never summed.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white text-sm">4. Mandatory Date Precision</div>
                <p>Every milestone specifies exact day, month, quarter, or explicit historical range.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white text-sm">5. Contradiction Preservation</div>
                <p>Where credible sources report divergent numbers, both are published with reconciliation notes.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white text-sm">6. Multi-Source Corroboration</div>
                <p>Published records undergo rigorous institutional corroboration before public presentation.</p>
              </div>
            </div>
          </div>

          {/* Primary Publishers Directory */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-4">
            <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white">
              Primary Institutional Publishers Directory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {primaryPublishers.map((pub, i) => (
                <div key={i} className="p-4 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border space-y-1">
                  <div className="font-bold text-gov-navy dark:text-white text-xs">
                    {pub.name}
                  </div>
                  <div className="text-[11px] text-gov-emerald font-semibold">
                    {pub.category}
                  </div>
                  <div className="text-[11px] text-gov-slate">
                    Scope: {pub.scope}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataSources;
