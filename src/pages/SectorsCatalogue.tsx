import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  HeartPulse, 
  Wheat, 
  GraduationCap, 
  Heart, 
  Zap, 
  Laptop,
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  Database,
  Building,
  ExternalLink,
  Search
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/hero-section";
import SectionHeader from "@/components/common/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataClassificationBadge } from "@/components/common/DataClassificationBadge";
import { SourceBadge } from "@/components/common/SourceBadge";
import { getPublicSectors, getDevelopingSectors } from "@/services/sectorService";
import { SectorRecord } from "@/types/sector";

// Icon mapping helper
const renderSectorIcon = (iconName: string, className: string = "h-6 w-6") => {
  switch (iconName) {
    case "TrendingUp": return <TrendingUp className={className} />;
    case "ShieldCheck": return <ShieldCheck className={className} />;
    case "Building2": return <Building2 className={className} />;
    case "HeartPulse": return <HeartPulse className={className} />;
    case "Wheat": return <Wheat className={className} />;
    case "GraduationCap": return <GraduationCap className={className} />;
    case "Heart": return <Heart className={className} />;
    case "Zap": return <Zap className={className} />;
    case "Laptop": return <Laptop className={className} />;
    default: return <Layers className={className} />;
  }
};

const SectorsCatalogue: React.FC = () => {
  const publicSectors = getPublicSectors();
  const developingSectors = getDevelopingSectors();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPublicSectors = publicSectors.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.leadMinistries.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
      <Navbar />

      <main className="flex-grow">
        <HeroSection
          title="National Sector Performance Catalogue"
          subtitle="Explore canonical, evidence-backed sectoral progress, verified macroeconomic and social indicators, implementation stages, and lead government ministries."
          action={{ text: "Explore Active Sectors", href: "#active-sectors" }}
          backgroundImage="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e"
          highlightStats={[
            { value: `${publicSectors.length}`, label: "Active Sectors" },
            { value: "100%", label: "Source-Attributed" },
            { value: "4", label: "Evidence Levels" }
          ]}
        />

        <section id="active-sectors" className="container mx-auto px-4 py-12">
          {/* Section Title & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <SectionHeader
              title="Published National Sectors"
              description="Sectors backed by official gazettes, NBS statistics, CBN bulletins, and verified institutional sources."
              centered={false}
            />

            {/* Filter Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gov-slate" />
              <input
                type="text"
                placeholder="Filter sectors by name or ministry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-gov-navy/40 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald"
              />
            </div>
          </div>

          {/* Active Sectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredPublicSectors.map((sector) => (
              <Card
                key={sector.slug}
                className="group hover:shadow-xl transition-all duration-300 border-gov-border hover:border-gov-emerald dark:bg-gov-navy/30 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Accent Color */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: sector.colorTheme }}
                  />

                  <CardContent className="p-6">
                    {/* Header: Icon & Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div
                        className="p-3 rounded-xl text-white shadow-sm"
                        style={{ backgroundColor: sector.colorTheme }}
                      >
                        {renderSectorIcon(sector.iconName, "h-6 w-6")}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={sector.publicationStatus === "active" ? "default" : "secondary"}
                          className={`text-[10px] uppercase font-bold tracking-wider ${
                            sector.publicationStatus === "active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {sector.publicationStatus === "active" ? "Active" : "Qualified"}
                        </Badge>
                      </div>
                    </div>

                    {/* Sector Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-gov-emerald transition-colors">
                      <Link to={`/sectors/${sector.slug}`}>{sector.title}</Link>
                    </h3>

                    {/* Sector Summary */}
                    <p className="text-sm text-gov-slate line-clamp-3 mb-6">
                      {sector.summary}
                    </p>

                    {/* Key Indicators Preview */}
                    {sector.indicators.length > 0 && (
                      <div className="space-y-2 mb-6 bg-gov-canvas dark:bg-gov-navy/50 p-3 rounded-lg border border-gov-border/50">
                        <span className="text-[11px] font-bold text-gov-slate uppercase tracking-wider block mb-1">
                          Key Indicator Highlight
                        </span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-gov-navy dark:text-white font-medium">
                            {sector.indicators[0].name}
                          </span>
                          <span className="text-base font-extrabold text-gov-emerald">
                            {sector.indicators[0].value}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-gov-slate pt-1 border-t border-gov-border/40">
                          <span>Source: {sector.indicators[0].sourceName}</span>
                          <DataClassificationBadge classification={sector.indicators[0].classification} />
                        </div>
                      </div>
                    )}

                    {/* Qualification Note Alert if applicable */}
                    {sector.qualificationNote && (
                      <div className="mb-4 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 p-2.5 rounded border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{sector.qualificationNote}</span>
                      </div>
                    )}

                    {/* Lead Ministries List */}
                    <div className="space-y-1.5 mb-6">
                      <span className="text-[11px] font-bold text-gov-slate uppercase tracking-wider block">
                        Lead Responsible Agencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sector.leadMinistries.map((ministry, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-xs bg-gov-canvas dark:bg-gov-navy px-2 py-1 rounded border border-gov-border text-gov-navy dark:text-slate-200"
                          >
                            <Building className="h-3 w-3 mr-1 text-gov-gold" />
                            {ministry.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Footer Action Link */}
                <div className="p-6 pt-0">
                  <Link
                    to={`/sectors/${sector.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gov-navy hover:bg-gov-emerald text-white text-sm font-semibold rounded-lg transition-all duration-300 group-hover:shadow-md"
                  >
                    View Sector Dashboard
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Developing Sectors Architecture Section */}
          {developingSectors.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gov-border">
              <SectionHeader
                title="Developing Sectors & Architecture Roadmap"
                description="Sectors registered in the product model undergoing formal data audit before public activation."
                centered={false}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {developingSectors.map((sector) => (
                  <Card key={sector.slug} className="border border-dashed border-gov-border bg-gov-canvas/50 dark:bg-gov-navy/20 p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gov-slate/10 rounded-lg text-gov-slate">
                        {renderSectorIcon(sector.iconName, "h-6 w-6")}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-gov-navy dark:text-white">{sector.title}</h4>
                          <Badge variant="outline" className="text-xs border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30">
                            Developing Sector
                          </Badge>
                        </div>
                        <p className="text-xs text-gov-slate mt-2">{sector.summary}</p>
                        {sector.qualificationNote && (
                          <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-2 bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded border border-amber-200/50">
                            {sector.qualificationNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SectorsCatalogue;
