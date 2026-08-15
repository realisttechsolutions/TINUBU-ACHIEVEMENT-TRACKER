import React from "react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Database, Compass, Award, TrendingUp, Sparkles } from "lucide-react";
import { dataAdapter } from "@/adapters/dataAdapter";

export const HomeHero: React.FC = () => {
  const macroCounters = dataAdapter.getMacroCounters();

  return (
    <section className="relative bg-gov-navy text-white overflow-hidden py-12 md:py-20 border-b border-gov-gold/30">
      {/* Subtle Spatial Lighting & Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gov-emerald/25 via-gov-navy to-gov-darkSurface opacity-95 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gov-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Exploration CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Historic Window Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-gov-emerald" />
              <span>Official Progress Record â€¢ 29 May 2023 â€” August 2026</span>
            </div>

            {/* Main Headline (H1) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display leading-[1.1] tracking-tight text-white">
              National Achievements & Evidence Intelligence
            </h1>

            {/* Subheadline Copy */}
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-2xl font-normal">
              An open, evidence-driven public platform documenting verified policy reforms, physical infrastructure projects, and measurable outcomes of President Bola Ahmed Tinubu's administration.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                size="lg"
                className="bg-gov-emerald hover:bg-emerald-800 text-white font-bold text-sm px-7 py-3 h-12 shadow-lg transition-all gap-2 gold-ring-focus rounded-xl"
                asChild
              >
                <Link to="/achievements">
                  <span>Explore Achievements</span>
                  <ArrowRight className="h-4 w-4 text-gov-gold" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-gov-border/60 hover:bg-white/10 text-white font-semibold text-sm px-6 py-3 h-12 gap-2 rounded-xl"
                asChild
              >
                <Link to="/impact-map">
                  <Compass className="h-4 w-4 text-gov-emerald" />
                  <span>Nigeria Impact Map</span>
                </Link>
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/5 text-sm font-semibold h-12 gap-2"
                asChild
              >
                <Link to="/data">
                  <Database className="h-4 w-4 text-gov-gold" />
                  <span>Data Explorer</span>
                </Link>
              </Button>
            </div>

            {/* High-Level Non-Overwhelming Key Counters */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="text-lg sm:text-2xl font-black font-display text-white tabular-nums">
                  {macroCounters.canonicalSectors}
                </div>
                <div className="text-gov-slate dark:text-gray-300 font-medium">
                  Canonical Research Sectors
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-lg sm:text-2xl font-black font-display text-gov-gold tabular-nums">
                  36 + FCT
                </div>
                <div className="text-gov-slate dark:text-gray-300 font-medium">
                  Sub-National Coverage
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-lg sm:text-2xl font-black font-display text-gov-emerald tabular-nums">
                  100%
                </div>
                <div className="text-gov-slate dark:text-gray-300 font-medium">
                  Cited Primary Evidence
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual National Impact Card Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-gov-gold/30 shadow-2xl bg-gov-darkSurface p-6 space-y-6">
              {/* National Header Banner */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-gov-emerald animate-pulse" />
                  <span className="text-xs font-bold text-gov-gold uppercase tracking-wider">
                    Renewed Hope Mandate
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-400">
                  May 2023 â€” Aug 2026
                </span>
              </div>

              {/* Spotlight Achievements Preview */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-gov-gold/40 transition-colors">
                  <div className="flex items-center justify-between text-[11px] text-gov-emerald font-bold mb-1">
                    <span>Education & Human Capital</span>
                    <span className="text-gov-gold">Verified</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    NELFUND Tertiary Student Loan & Upkeep Scheme
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                    350,000+ students funded with direct institutional tuition payments and stipends.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-gov-gold/40 transition-colors">
                  <div className="flex items-center justify-between text-[11px] text-blue-400 font-bold mb-1">
                    <span>Infrastructure & Works</span>
                    <span className="text-gov-gold">In Execution</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    700km Lagos-Calabar Coastal Superhighway
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                    Section 1 concrete reinforced highway connecting Victoria Island to deep sea port.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-gov-gold/40 transition-colors">
                  <div className="flex items-center justify-between text-[11px] text-purple-400 font-bold mb-1">
                    <span>Power & Energy Devolution</span>
                    <span className="text-gov-gold">Statute In Force</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Electricity Act 2023 Sub-National Devolution
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                    10+ State Regulatory Commissions established for independent power markets.
                  </p>
                </div>
              </div>

              {/* Direct Link to Explorer */}
              <Link
                to="/achievements"
                className="block text-center w-full py-2.5 rounded-xl bg-gov-canvas/10 hover:bg-gov-canvas/20 text-xs font-bold text-gov-gold transition-colors"
              >
                Browse All Documented Achievements â†’
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
