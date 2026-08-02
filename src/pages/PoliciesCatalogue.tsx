import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Search, 
  ChevronRight, 
  Building2, 
  Award, 
  Calendar,
  Layers,
  Scale,
  ShieldCheck
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/hero-section";
import SectionHeader from "@/components/common/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PolicyFilterOptions, PolicyType, PolicyStatus } from "@/types/policy.types";
import { filterPolicies, getAllPolicies } from "@/services/policyService";
import PolicyStatusBadge from "@/components/policies/PolicyStatusBadge";

export const PoliciesCatalogue: React.FC = () => {
  const [filters, setFilters] = useState<PolicyFilterOptions>({
    type: "all",
    status: "all",
    sector: "all",
    searchQuery: "",
  });

  const allPolicies = getAllPolicies();
  const filteredPolicies = filterPolicies(filters);

  const policyTypes: { value: PolicyType | "all"; label: string }[] = [
    { value: "all", label: "All Policy Types" },
    { value: "legislation", label: "Statutory Legislation / Acts" },
    { value: "executive-action", label: "Executive Actions & Directives" },
    { value: "fiscal-reform", label: "Fiscal & Tax Reforms" },
    { value: "monetary-financial-reform", label: "Monetary & FX Policy" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Hero */}
        <HeroSection
          title="Policy & Reform Intelligence Directory"
          subtitle="Searchable legal gazette directory of executive orders, statutory acts of parliament, fiscal reforms, and administrative directives driving Nigeria's transformation."
          action={{ text: "Explore National Policy Stream", href: "/timeline" }}
          backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
          highlightStats={[
            { value: `${allPolicies.length}`, label: "Indexed Major Policies" },
            { value: "100%", label: "Gazette Verified" },
            { value: "36 + FCT", label: "National Coverage" }
          ]}
        />

        <section className="container mx-auto px-4 py-12 space-y-8">
          {/* Section Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeader
              title="Canonical Policy Registry"
              description="Filter documented policies by legal authority type, sector, or implementation status."
              centered={false}
            />

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gov-slate" />
                <input
                  type="text"
                  placeholder="Search title, law, or agency..."
                  value={filters.searchQuery || ""}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-gov-navy/40 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald"
                />
              </div>

              {/* Type Filter */}
              <select
                value={filters.type || "all"}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                className="w-full sm:w-48 py-2 px-3 text-xs bg-white dark:bg-gov-navy/40 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald text-gov-navy dark:text-white"
              >
                {policyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Policy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <Card
                key={policy.id}
                className="hover:shadow-lg transition-all duration-300 border-gov-border hover:border-gov-emerald dark:bg-gov-navy/30 flex flex-col justify-between group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <PolicyStatusBadge status={policy.status} />
                    <Badge variant="outline" className="text-[10px] font-bold uppercase border-gov-border">
                      {policy.policyType}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gov-navy dark:text-white line-clamp-2 group-hover:text-gov-emerald transition-colors">
                      <Link to={`/policies/${policy.slug}`}>
                        {policy.title}
                      </Link>
                    </h3>
                    {policy.authorityReference && (
                      <p className="text-[11px] text-gov-gold font-semibold flex items-center gap-1">
                        <Scale className="h-3 w-3 shrink-0" />
                        <span className="truncate">{policy.authorityReference}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gov-slate line-clamp-3">
                    {policy.summary}
                  </p>

                  <div className="bg-gov-canvas dark:bg-gov-navy/50 p-3 rounded-lg border border-gov-border/60 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gov-slate">Lead Agency:</span>
                      <span className="font-semibold text-gov-navy dark:text-slate-200 truncate max-w-[160px]">{policy.leadAgency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gov-slate">Effective Date:</span>
                      <span className="font-semibold text-gov-navy dark:text-slate-200">{policy.effectiveDate}</span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-6 pt-0">
                  <Link
                    to={`/policies/${policy.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-emerald transition-colors"
                  >
                    View Policy Implementation Page
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PoliciesCatalogue;
