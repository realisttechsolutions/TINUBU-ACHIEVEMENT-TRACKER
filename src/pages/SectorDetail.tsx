import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  ArrowLeft, 
  ExternalLink, 
  Building, 
  Calendar, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Share2, 
  Clock, 
  Award,
  ChevronRight,
  Info
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MetricCard from "@/components/dashboard/MetricCard";
import AreaChart from "@/components/charts/AreaChart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataClassificationBadge } from "@/components/common/DataClassificationBadge";
import { SourceBadge } from "@/components/common/SourceBadge";
import StatusBadge from "@/components/common/StatusBadge";
import { 
  getSectorBySlug, 
  getSectorAchievements, 
  getRelatedSectors 
} from "@/services/sectorService";

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

const SectorDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const sector = getSectorBySlug(slug || "");
  const achievements = getSectorAchievements(slug || "");
  const relatedSectors = getRelatedSectors(slug || "");

  if (!sector) {
    return (
      <div className="flex flex-col min-h-screen bg-gov-canvas dark:bg-gov-darkSurface">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-16 w-16 text-gov-gold mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gov-navy dark:text-white mb-2">Sector Not Found</h1>
          <p className="text-gov-slate max-w-md mx-auto mb-6">
            The requested sector "{slug}" does not exist or has not been activated in the catalogue.
          </p>
          <Link
            to="/sectors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gov-navy text-white rounded-lg hover:bg-gov-emerald transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Sector Catalogue
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${sector.title} | Tinubu Achievement Tracker`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Sector URL copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Top Breadcrumb Navigation Bar */}
        <div className="bg-gov-navy text-slate-300 py-3 border-b border-gov-gold/20">
          <div className="container mx-auto px-4 flex items-center justify-between text-xs">
            <nav className="flex items-center gap-2">
              <Link to="/" className="hover:text-gov-gold transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 text-slate-500" />
              <Link to="/sectors" className="hover:text-gov-gold transition-colors">Sectors</Link>
              <ChevronRight className="h-3 w-3 text-slate-500" />
              <span className="text-gov-gold font-semibold truncate">{sector.shortTitle}</span>
            </nav>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share Sector
            </button>
          </div>
        </div>

        {/* Sector Hero Header */}
        <section className="relative bg-gov-navy text-white overflow-hidden py-12 md:py-16">
          <div
            className="absolute inset-0 opacity-15 bg-cover bg-center"
            style={{ backgroundImage: `url(${sector.heroImage || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e'})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gov-navy via-gov-navy/95 to-gov-navy/80" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div
                  className="p-2.5 rounded-lg text-white shadow-md"
                  style={{ backgroundColor: sector.colorTheme }}
                >
                  {renderSectorIcon(sector.iconName, "h-6 w-6")}
                </div>

                <Badge
                  className={`text-xs uppercase font-bold px-3 py-1 ${
                    sector.publicationStatus === "active"
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {sector.publicationStatus === "active" ? "Active Sector" : "Active with Qualification"}
                </Badge>

                <Badge variant="outline" className="text-xs border-gov-gold text-gov-gold uppercase tracking-wider">
                  Evidence Profile: {sector.evidenceProfile.replace(/-/g, " ")}
                </Badge>
              </div>

              {/* Sector Title & Summary */}
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                {sector.title}
              </h1>
              <p className="text-base md:text-xl text-slate-200 font-light mb-6 leading-relaxed">
                {sector.summary}
              </p>

              {/* Responsible Lead Ministries */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="font-bold text-gov-gold uppercase tracking-wider mr-2">Lead Institutions:</span>
                {sector.leadMinistries.map((inst, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-white border border-white/10">
                    <Building className="h-3 w-3 text-gov-gold" />
                    {inst.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Qualification Note Alert Banner if present */}
        {sector.qualificationNote && (
          <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-900 py-3.5">
            <div className="container mx-auto px-4 flex items-start gap-3 text-xs md:text-sm text-amber-900 dark:text-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block text-[11px] text-amber-700 dark:text-amber-400">
                  Data Scope & Evidence Qualification
                </span>
                {sector.qualificationNote}
              </div>
            </div>
          </div>
        )}

        {/* Core Content Container */}
        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Section 1: Indicators & Performance Metrics */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gov-navy dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-gov-emerald" />
                  Key Sector Indicators & Metrics
                </h2>
                <p className="text-sm text-gov-slate">
                  Source-attributed indicators classified into actual outcomes, provisional data, or projections.
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sector.indicators.map((ind) => (
                <Card key={ind.id} className="border-gov-border dark:bg-gov-navy/30 hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-gov-slate uppercase tracking-wider">
                        {ind.name}
                      </span>
                      <DataClassificationBadge classification={ind.classification} />
                    </div>

                    <div className="flex items-baseline justify-between my-2">
                      <span className="text-3xl font-black text-gov-navy dark:text-white">
                        {ind.value}
                      </span>
                      {ind.change && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          ind.trend === "up" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                          ind.trend === "down" ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" :
                          "bg-slate-100 text-slate-800"
                        }`}>
                          {ind.change}
                        </span>
                      )}
                    </div>

                    {ind.description && (
                      <p className="text-xs text-gov-slate mb-4 line-clamp-2">
                        {ind.description}
                      </p>
                    )}

                    {/* Chart preview if available */}
                    {ind.chartData && ind.chartData.length > 0 && (
                      <div className="h-32 my-3 -mx-2">
                        <AreaChart
                          title=""
                          data={ind.chartData}
                          dataKey="value"
                          color={sector.colorTheme || "#059669"}
                          height={120}
                        />
                      </div>
                    )}

                    <div className="pt-3 border-t border-gov-border flex items-center justify-between text-[11px] text-gov-slate">
                      <span>Source: {ind.sourceName}</span>
                      <SourceBadge level={ind.sourceLevel} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 2: Associated Achievement Records */}
          {achievements.length > 0 && (
            <section className="bg-gov-canvas/60 dark:bg-gov-navy/20 p-6 md:p-8 rounded-2xl border border-gov-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gov-navy dark:text-white flex items-center gap-2">
                    <Award className="h-6 w-6 text-gov-gold" />
                    Verified Sector Achievements
                  </h2>
                  <p className="text-sm text-gov-slate">
                    Canonical achievement records linked directly to this sector.
                  </p>
                </div>
                <Link
                  to="/achievements"
                  className="text-xs font-semibold text-gov-emerald hover:underline hidden sm:inline-flex items-center gap-1"
                >
                  View All Achievements Catalogue
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((item) => (
                  <Card key={item.id} className="border-gov-border dark:bg-gov-navy/40 hover:shadow-lg transition-all flex flex-col justify-between">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <StatusBadge status={item.status} />
                        <DataClassificationBadge classification={item.classification} />
                      </div>

                      <h3 className="text-lg font-bold text-gov-navy dark:text-white mb-2 line-clamp-2">
                        <Link to={`/achievements/${item.slug}`} className="hover:text-gov-emerald">
                          {item.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-gov-slate mb-4 line-clamp-3">
                        {item.summary}
                      </p>

                      <div className="bg-gov-canvas dark:bg-gov-navy/60 p-3 rounded-lg border border-gov-border/60 text-xs space-y-1 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gov-slate">Impact Scope:</span>
                          <span className="font-semibold text-gov-navy dark:text-slate-200">{item.beneficiariesOrScope}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gov-slate">Lead Agency:</span>
                          <span className="font-semibold text-gov-navy dark:text-slate-200">{item.leadMinistryOrAgency}</span>
                        </div>
                      </div>
                    </CardContent>

                    <div className="p-5 pt-0">
                      <Link
                        to={`/achievements/${item.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-emerald transition-colors"
                      >
                        Inspect Achievement Evidence
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Major Policies & Projects */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Key Policies */}
            <div>
              <h2 className="text-xl font-bold text-gov-navy dark:text-white mb-4 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-gov-emerald" />
                Key Sector Policies & Reforms
              </h2>

              <div className="space-y-4">
                {sector.keyPolicies.map((pol) => (
                  <Card key={pol.id} className="border-gov-border dark:bg-gov-navy/30">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold border-gov-emerald text-gov-emerald">
                          {pol.status}
                        </Badge>
                        <span className="text-xs text-gov-slate">{pol.effectiveDate}</span>
                      </div>
                      <h4 className="text-base font-bold text-gov-navy dark:text-white mb-1">{pol.title}</h4>
                      <p className="text-xs text-gov-slate mb-3">{pol.description}</p>
                      <div className="text-xs bg-gov-canvas dark:bg-gov-navy/50 p-2.5 rounded border border-gov-border/50 text-gov-navy dark:text-slate-200">
                        <strong className="text-gov-emerald">Impact Summary: </strong>
                        {pol.impactSummary}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Major Infrastructure / Projects */}
            <div>
              <h2 className="text-xl font-bold text-gov-navy dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gov-gold" />
                Major Projects & Flagship Interventions
              </h2>

              <div className="space-y-4">
                {sector.majorProjects.map((prj) => (
                  <Card key={prj.id} className="border-gov-border dark:bg-gov-navy/30">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="text-[10px] uppercase font-bold bg-gov-navy text-white">
                          {prj.status}
                        </Badge>
                        <span className="text-xs text-gov-slate">{prj.locationScope}</span>
                      </div>
                      <h4 className="text-base font-bold text-gov-navy dark:text-white mb-1">{prj.title}</h4>
                      <p className="text-xs text-gov-slate mb-3">{prj.description}</p>
                      {prj.budgetOrValue && (
                        <div className="text-xs text-gov-slate font-semibold mb-2">
                          Budget / Value: <span className="text-gov-emerald">{prj.budgetOrValue}</span>
                        </div>
                      )}
                      <div className="text-xs text-gov-slate">
                        Lead Agency: <span className="text-gov-navy dark:text-white font-medium">{prj.leadAgency}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4: Responsible Ministries & Lead Institutions */}
          <section className="bg-white dark:bg-gov-navy/30 p-6 md:p-8 rounded-2xl border border-gov-border">
            <h2 className="text-xl font-bold text-gov-navy dark:text-white mb-6 flex items-center gap-2">
              <Building className="h-5 w-5 text-gov-gold" />
              Responsible Ministries, Agencies & Regulatory Bodies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sector.leadMinistries.map((inst, i) => (
                <div key={i} className="p-4 rounded-xl bg-gov-canvas dark:bg-gov-navy/60 border border-gov-border">
                  <h4 className="font-bold text-sm text-gov-navy dark:text-white mb-1">{inst.name}</h4>
                  <p className="text-xs text-gov-slate mb-3">{inst.role}</p>
                  {inst.officialWebsite && (
                    <a
                      href={inst.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gov-emerald font-semibold hover:underline"
                    >
                      Official Agency Portal
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Sources & Evidence Profile */}
          <section className="bg-gov-canvas/80 dark:bg-gov-navy/20 p-6 md:p-8 rounded-2xl border border-gov-border">
            <h2 className="text-xl font-bold text-gov-navy dark:text-white mb-4 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-gov-navy dark:text-gov-gold" />
              Canonical Evidence & Source Citations
            </h2>
            <p className="text-xs text-gov-slate mb-6">
              All statistical presentations and claims on this page are indexed against official government gazettes, CBN bulletins, and international multilateral reports.
            </p>

            <div className="space-y-3">
              {sector.sources.map((src, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white dark:bg-gov-navy/40 rounded-lg border border-gov-border text-xs gap-2">
                  <div>
                    <div className="font-semibold text-gov-navy dark:text-white">{src.name}</div>
                    {src.documentTitle && <div className="text-gov-slate text-[11px]">{src.documentTitle}</div>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-gov-slate">{src.publicationDate}</span>
                    <SourceBadge level={src.level} />
                    {src.url && (
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-gov-emerald hover:underline flex items-center gap-0.5 font-medium">
                        Verify <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Related Sectors Navigation */}
          {relatedSectors.length > 0 && (
            <section className="pt-8 border-t border-gov-border">
              <h3 className="text-lg font-bold text-gov-navy dark:text-white mb-4">
                Explore Related Sectors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedSectors.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/sectors/${rel.slug}`}
                    className="p-4 rounded-xl border border-gov-border bg-white dark:bg-gov-navy/30 hover:border-gov-emerald transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-gov-navy dark:text-white group-hover:text-gov-emerald">{rel.title}</h4>
                      <p className="text-xs text-gov-slate line-clamp-1">{rel.summary}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gov-slate group-hover:text-gov-emerald shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SectorDetail;
