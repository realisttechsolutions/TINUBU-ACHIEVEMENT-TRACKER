'use client';
import React from "react";
import { useParams, Link } from "@/lib/navigation";
import { 
  Scale, 
  ChevronRight, 
  Building2, 
  Award, 
  ExternalLink, 
  Share2, 
  ArrowLeft, 
  Info, 
  FileCheck, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PolicyStatusBadge from "@/components/policies/PolicyStatusBadge";
import InterventionStageBadge from "@/components/timeline/InterventionStageBadge";
import { getPolicyBySlug } from "@/services/policyService";

export const PolicyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const policy = getPolicyBySlug(slug || "");

  if (!policy) {
    return (
      <div className="w-full bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-16 w-16 text-gov-gold mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Policy Record Not Found</h1>
          <p className="text-gov-slate max-w-md mx-auto mb-6">
            The requested policy initiative "{slug}" is not currently registered in the canonical registry.
          </p>
          <Link
            to="/policies"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gov-navy text-white rounded-lg hover:bg-gov-emerald transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Policy Directory
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${policy.title} | President Tinubu Achievement Tracker`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Policy page link copied to clipboard!");
    }
  };

  return (
    <div className="w-full bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
      {/* Breadcrumbs Bar */}


        <div className="bg-gov-navy text-slate-300 py-3 border-b border-gov-gold/20">
          <div className="container mx-auto px-4 flex items-center justify-between text-xs">
            <nav className="flex items-center gap-2">
              <Link to="/" className="hover:text-gov-gold transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 text-slate-500" />
              <Link to="/policies" className="hover:text-gov-gold transition-colors">Policies</Link>
              <ChevronRight className="h-3 w-3 text-slate-500" />
              <span className="text-gov-gold font-semibold truncate">{policy.shortTitle}</span>
            </nav>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share Policy Page
            </button>
          </div>
        </div>

        {/* Policy Hero Header */}
        <section className="bg-gov-navy text-white py-12 md:py-16 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <PolicyStatusBadge status={policy.status} />
                <Badge variant="outline" className="border-white/30 text-white text-xs uppercase font-bold">
                  {policy.policyType}
                </Badge>
                <Badge className="bg-gov-gold text-gov-navy font-extrabold text-xs">
                  {policy.geopoliticalScope}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                {policy.title}
              </h1>

              <p className="text-base md:text-lg text-slate-200 font-light leading-relaxed">
                {policy.summary}
              </p>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-gov-gold" />
                  <span>Authority: <strong className="text-white">{policy.authorityReference || policy.legalAuthority}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-gov-emerald" />
                  <span>Lead Agency: <strong className="text-white">{policy.leadAgency}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gov-gold" />
                  <span>Effective Date: <strong className="text-white">{policy.effectiveDate}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <div className="container mx-auto px-4 py-12 space-y-12 max-w-5xl">
          {/* Section 1: Context & Objectives */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-gov-border dark:bg-gov-navy/40">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-gov-navy dark:text-white flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-gov-emerald" />
                  Policy Background & Purpose
                </h3>
                <p className="text-xs text-gov-slate leading-relaxed">
                  {policy.fullDescription}
                </p>
                <div className="bg-gov-canvas dark:bg-gov-navy/60 p-3 rounded-lg border border-gov-border/60 text-xs">
                  <strong className="text-gov-navy dark:text-white block mb-1">Structural Context:</strong>
                  <span className="text-gov-slate">{policy.backgroundContext}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gov-border dark:bg-gov-navy/40">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-gov-navy dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gov-gold" />
                  Key Statutory Objectives
                </h3>
                <ul className="space-y-2 text-xs text-gov-slate">
                  {policy.keyObjectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gov-emerald mt-1.5 shrink-0" />
                      <span className="text-gov-navy dark:text-slate-200">{obj}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Implementation Milestones Stream */}
          <section className="space-y-6">
            <h3 className="text-2xl font-bold text-gov-navy dark:text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-gov-gold" />
              Policy Implementation Milestones
            </h3>

            <div className="space-y-4">
              {policy.milestones.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white dark:bg-gov-navy/40 border border-gov-border flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gov-gold">{m.date}</span>
                      <InterventionStageBadge stage={m.stage} />
                    </div>
                    <h4 className="font-bold text-base text-gov-navy dark:text-white">{m.title}</h4>
                    <p className="text-xs text-gov-slate">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Verified Outcomes & Achievement Links */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {policy.reportedOutcomes.length > 0 && (
              <Card className="border-gov-border dark:bg-gov-navy/40">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-gov-navy dark:text-white flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-gov-emerald" />
                    Verified Outcomes & Results
                  </h3>
                  <div className="space-y-2 text-xs">
                    {policy.reportedOutcomes.map((out, idx) => (
                      <div key={idx} className="p-3 bg-gov-canvas dark:bg-gov-navy/60 rounded-lg border border-gov-border/60 text-gov-navy dark:text-slate-200">
                        {out}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {policy.primarySources.length > 0 && (
              <Card className="border-gov-border dark:bg-gov-navy/40">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-gov-navy dark:text-white flex items-center gap-2">
                    <Scale className="h-5 w-5 text-gov-gold" />
                    Official Primary Sources & Gazettes
                  </h3>
                  <div className="space-y-2 text-xs">
                    {policy.primarySources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg border border-gov-border bg-gov-canvas dark:bg-gov-navy hover:border-gov-emerald flex items-center justify-between transition-colors group"
                      >
                        <span className="font-semibold text-gov-navy dark:text-white group-hover:text-gov-emerald">{source.name}</span>
                        <ExternalLink className="h-4 w-4 text-gov-slate group-hover:text-gov-emerald shrink-0" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>
  );
};

export default PolicyDetail;
