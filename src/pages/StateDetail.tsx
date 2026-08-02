import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  MapPin, 
  ChevronRight, 
  Building, 
  Award, 
  ExternalLink, 
  Share2, 
  ArrowLeft, 
  Info, 
  FileCheck, 
  ShieldCheck, 
  Building2,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/common/StatusBadge";
import { DataClassificationBadge } from "@/components/common/DataClassificationBadge";
import { 
  getStateBySlug, 
  getStateAchievements, 
  getStateImpactSummary, 
  getAllStates 
} from "@/services/geographyService";

const StateDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const state = getStateBySlug(slug || "");
  const achievements = getStateAchievements(slug || "");
  const summary = getStateImpactSummary(slug || "");
  const allStates = getAllStates();

  if (!state || !summary) {
    return (
      <div className="flex flex-col min-h-screen bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-16 w-16 text-gov-gold mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">State Not Found</h1>
          <p className="text-gov-slate max-w-md mx-auto mb-6">
            The requested state "{slug}" does not exist in the canonical registry.
          </p>
          <Link
            to="/states"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gov-navy text-white rounded-lg hover:bg-gov-emerald transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to State Directory
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedStates = allStates
    .filter((s) => s.zone === state.zone && s.slug !== state.slug)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${state.name} Dashboard | Tinubu Achievement Tracker`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("State dashboard URL copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb Bar */}
        <div className="bg-gov-navy text-slate-300 py-3 border-b border-gov-gold/20">
          <div className="container mx-auto px-4 flex items-center justify-between text-xs">
            <nav className="flex items-center gap-2">
              <Link to="/" className="hover:text-gov-gold transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 text-slate-500" />
              <Link to="/states" className="hover:text-gov-gold transition-colors">States</Link>
              <ChevronRight className="h-3 w-3 text-slate-500" />
              <span className="text-gov-gold font-semibold truncate">{state.shortName}</span>
            </nav>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share State Page
            </button>
          </div>
        </div>

        {/* State Hero Header */}
        <section className="bg-gov-navy text-white py-12 md:py-16 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-gov-gold text-gov-navy font-extrabold uppercase text-xs">
                  {state.zone} Zone
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white text-xs">
                  ISO: {state.code}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                {state.name}
              </h1>

              <p className="text-base md:text-lg text-slate-200 font-light leading-relaxed">
                {state.description}
              </p>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div>
                  Capital City: <strong className="text-white">{state.capital}</strong>
                </div>
                <div>
                  Documented Records: <strong className="text-gov-gold">{summary.totalPublishedRecords} Interventions</strong>
                </div>
                {state.officialPortal && (
                  <a
                    href={state.officialPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gov-gold font-semibold hover:underline"
                  >
                    Official State Portal
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Core Dashboard Content */}
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Section 1: Intervention Scope Breakdown */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-gov-border dark:bg-gov-navy/30">
              <CardContent className="p-5 space-y-2">
                <span className="text-xs font-bold text-gov-slate uppercase tracking-wider">
                  State-Specific Projects
                </span>
                <p className="text-3xl font-extrabold text-gov-emerald">
                  {summary.stateSpecificRecordsCount}
                </p>
                <p className="text-xs text-gov-slate">
                  Targeted infrastructure & state-level interventions
                </p>
              </CardContent>
            </Card>

            <Card className="border-gov-border dark:bg-gov-navy/30">
              <CardContent className="p-5 space-y-2">
                <span className="text-xs font-bold text-gov-slate uppercase tracking-wider">
                  Multi-State & Coastal Corridors
                </span>
                <p className="text-3xl font-extrabold text-gov-gold">
                  {summary.multiStateRecordsCount}
                </p>
                <p className="text-xs text-gov-slate">
                  Highways, hydro dams, and regional trade networks
                </p>
              </CardContent>
            </Card>

            <Card className="border-gov-border dark:bg-gov-navy/30">
              <CardContent className="p-5 space-y-2">
                <span className="text-xs font-bold text-gov-slate uppercase tracking-wider">
                  National Schemes Active
                </span>
                <p className="text-3xl font-extrabold text-gov-navy dark:text-white">
                  {summary.nationalRecordsCount}
                </p>
                <p className="text-xs text-gov-slate">
                  NELFUND student loans, CCT & healthcare funds
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Documented Achievements for State */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gov-navy dark:text-white flex items-center gap-2">
                  <Award className="h-6 w-6 text-gov-gold" />
                  Documented Achievements & Interventions in {state.shortName}
                </h2>
                <p className="text-xs text-gov-slate">
                  Verified policies, physical infrastructure, and social programs touching {state.name}.
                </p>
              </div>
            </div>

            {achievements.length > 0 ? (
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
                          <span className="text-gov-slate">Geographic Scope:</span>
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
            ) : (
              <Card className="p-8 text-center border-gov-border dark:bg-gov-navy/30 text-gov-slate">
                <Info className="h-10 w-10 mx-auto text-gov-gold mb-3 opacity-60" />
                <h4 className="text-base font-bold text-gov-navy dark:text-white mb-1">
                  Records Under Verification for {state.name}
                </h4>
                <p className="text-xs max-w-md mx-auto">
                  National programs (NELFUND student loans, CCT, BHCPF) cover {state.name}. Specific state project entries are currently undergoing formal data audit before public publication.
                </p>
              </Card>
            )}
          </section>

          {/* Section 3: Active Federal & State Agencies */}
          <section className="bg-white dark:bg-gov-navy/30 p-6 md:p-8 rounded-2xl border border-gov-border">
            <h3 className="text-lg font-bold text-gov-navy dark:text-white mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-gov-gold" />
              Active Implementing Ministries & Agencies in {state.shortName}
            </h3>

            <div className="flex flex-wrap gap-2">
              {summary.leadMinistries.map((ministry, idx) => (
                <span
                  key={idx}
                  className="bg-gov-canvas dark:bg-gov-navy px-3 py-1.5 rounded-lg border border-gov-border text-xs font-semibold text-gov-navy dark:text-white flex items-center gap-1.5"
                >
                  <Building2 className="h-3.5 w-3.5 text-gov-emerald" />
                  {ministry}
                </span>
              ))}
            </div>
          </section>

          {/* Section 4: Related States in Zone */}
          {relatedStates.length > 0 && (
            <section className="pt-8 border-t border-gov-border">
              <h3 className="text-lg font-bold text-gov-navy dark:text-white mb-4">
                Other States in {state.zone} Zone
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedStates.map((rel) => (
                  <Link
                    key={rel.code}
                    to={`/states/${rel.slug}`}
                    className="p-4 rounded-xl border border-gov-border bg-white dark:bg-gov-navy/30 hover:border-gov-emerald transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-gov-navy dark:text-white group-hover:text-gov-emerald">{rel.name}</h4>
                      <p className="text-xs text-gov-slate">Capital: {rel.capital}</p>
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

export default StateDetail;
