'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ArrowRight,
  ShieldCheck,
  Database,
  Compass,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

import { dataAdapter } from "@/adapters/dataAdapter";
import { gsap, MOTION_TOKENS, prefersReducedMotion } from "@/lib/animations";

// Truthful, platform-oriented rotating supporting statement keys
const SUPPORTING_STATEMENT_KEYS = [
  "hero.statement1",
  "hero.statement2",
  "hero.statement3",
  "hero.statement4",
  "hero.statement5"
];

const DEFAULT_SUPPORTING_STATEMENTS = [
  "See verifiable primary evidence behind national progress.",
  "Follow policy reforms from gazette announcement to measurable impact.",
  "Explore capital projects, social programmes, and statutory acts across Nigeria.",
  "Explore source-linked records across projects, policies and programmes.",
  "A national progress record. Searchable. Traceable. Evidence-backed."
];

// Helper function to build a data-driven, verified spotlight pool from published records (Section 6)
interface SpotlightItem {
  id: string;
  sector: string;
  badgeColor: string;
  statusText: string;
  title: string;
  summary: string;
  slug: string;
  keyStat: string;
  keyStatLabel: string;
}

function getEligibleSpotlightAchievements(): SpotlightItem[] {
  const allAchievements = dataAdapter.getAchievements();
  const eligible = allAchievements.filter(
    (a) => a.title && a.summary && a.statusLabel
  );

  if (eligible.length === 0) {
    return [];
  }

  return eligible.map((a) => {
    let badgeColor = "text-emerald-400 bg-emerald-950/60 border-emerald-500/40";
    if (a.publicNavigationGroup === "infrastructure") {
      badgeColor = "text-blue-400 bg-blue-950/60 border-blue-500/40";
    } else if (a.publicNavigationGroup === "economy") {
      badgeColor = "text-amber-400 bg-amber-950/60 border-amber-500/40";
    } else if (a.publicNavigationGroup === "security") {
      badgeColor = "text-red-400 bg-red-950/60 border-red-500/40";
    } else if (a.publicNavigationGroup === "governance") {
      badgeColor = "text-purple-400 bg-purple-950/60 border-purple-500/40";
    }

    let keyStat = "Active";
    let keyStatLabel = "Delivery Status";

    if (a.beneficiaryMetrics && a.beneficiaryMetrics.length > 0) {
      keyStat = a.beneficiaryMetrics[0].formattedCount;
      keyStatLabel = a.beneficiaryMetrics[0].stageLabel || a.beneficiaryMetrics[0].beneficiaryType || "Beneficiaries";
    } else if (a.financialMetrics && a.financialMetrics.length > 0) {
      keyStat = a.financialMetrics[0].formattedAmount;
      keyStatLabel = a.financialMetrics[0].financialTypeLabel || "Funding Scope";
    } else if (a.statesCovered && a.statesCovered.length > 1) {
      keyStat = `${a.statesCovered.length} States`;
      keyStatLabel = "Geographic Scope";
    } else if (a.progressPercentage) {
      keyStat = `${a.progressPercentage}%`;
      keyStatLabel = "Delivery Milestone";
    }

    return {
      id: a.id,
      sector: a.sectorName || a.publicNavigationGroupLabel || "National Reform",
      badgeColor,
      statusText: a.statusLabel || "Published Record",
      title: a.title,
      summary: a.summary,
      slug: a.slug,
      keyStat,
      keyStatLabel,
    };
  });
}

export const HomeHero: React.FC = () => {
  const { t } = useTranslation();
  const macroCounters = dataAdapter.getMacroCounters();
  const spotlightAchievements = getEligibleSpotlightAchievements();

  // State for rotating supporting statement
  const [statementIndex, setStatementIndex] = useState(0);
  // State for right-side achievement spotlight
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  // Pause state on hover / focus
  const [isPaused, setIsPaused] = useState(false);

  // DOM Refs for GSAP Entrance & Transitions
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const spotlightContainerRef = useRef<HTMLDivElement>(null);
  const spotlightCardRef = useRef<HTMLDivElement>(null);

  // Advance supporting statement every 6s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setStatementIndex((prev) => (prev + 1) % SUPPORTING_STATEMENT_KEYS.length);
    }, MOTION_TOKENS.ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Animate statement crossfade on change
  useEffect(() => {
    if (!statementRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      statementRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: MOTION_TOKENS.STANDARD, ease: "power2.out" }
    );
  }, [statementIndex]);

  // Advance spotlight in a continuous forever loop with timer reset capability
  const spotlightTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetSpotlightTimer = useCallback(() => {
    if (spotlightTimerRef.current) {
      clearInterval(spotlightTimerRef.current);
    }
    if (!isPaused && spotlightAchievements.length > 1) {
      spotlightTimerRef.current = setInterval(() => {
        setSpotlightIndex((prev) => (prev + 1) % spotlightAchievements.length);
      }, MOTION_TOKENS.SPOTLIGHT_INTERVAL);
    }
  }, [isPaused, spotlightAchievements.length]);

  useEffect(() => {
    resetSpotlightTimer();
    return () => {
      if (spotlightTimerRef.current) clearInterval(spotlightTimerRef.current);
    };
  }, [resetSpotlightTimer]);

  // Animate spotlight card inner content gracefully on change (executive dissolve)
  useEffect(() => {
    if (!spotlightCardRef.current) return;
    if (prefersReducedMotion()) {
      gsap.set(spotlightCardRef.current, { opacity: 1, y: 0, filter: "none" });
      return;
    }
    gsap.fromTo(
      spotlightCardRef.current,
      { opacity: 0, y: 8, filter: "blur(2px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: MOTION_TOKENS.SPOTLIGHT_TRANSITION, ease: "power2.out" }
    );
  }, [spotlightIndex]);

  // Visibility change listener (pause when user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // One-time staged hero entrance on mount
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(badgeRef.current, { opacity: 0, y: 15, duration: 0.4 })
        .from(headlineRef.current, { opacity: 0, y: 20, duration: 0.5 }, "-=0.2")
        .from(subheadlineRef.current, { opacity: 0, y: 15, duration: 0.4 }, "-=0.3")
        .from(statementRef.current, { opacity: 0, y: 10, duration: 0.3 }, "-=0.2")
        .from(ctaGroupRef.current, { opacity: 0, y: 15, duration: 0.4 }, "-=0.2")
        .from(metricsRef.current, { opacity: 0, y: 15, duration: 0.4 }, "-=0.2")
        .from(spotlightContainerRef.current, { opacity: 0, x: 25, duration: 0.6 }, "-=0.5");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleNextSpotlight = useCallback(() => {
    if (spotlightAchievements.length <= 1) return;
    setSpotlightIndex((prev) => (prev + 1) % spotlightAchievements.length);
    resetSpotlightTimer();
  }, [spotlightAchievements.length, resetSpotlightTimer]);

  const handlePrevSpotlight = useCallback(() => {
    if (spotlightAchievements.length <= 1) return;
    setSpotlightIndex((prev) => (prev - 1 + spotlightAchievements.length) % spotlightAchievements.length);
    resetSpotlightTimer();
  }, [spotlightAchievements.length, resetSpotlightTimer]);

  const defaultSpotlight: SpotlightItem = {
    id: "overview",
    sector: "National Progress",
    badgeColor: "text-gov-gold bg-gov-navy border-gov-gold/40",
    statusText: "Official Registry",
    title: "National Progress & Empirical Evidence Registry",
    summary: "Official repository of statutory policies, capital infrastructure projects, and socioeconomic reforms across all 36 States + FCT.",
    slug: "achievements",
    keyStat: "36 + FCT",
    keyStatLabel: "National Scope",
  };

  const currentSpotlight = spotlightAchievements[spotlightIndex] || defaultSpotlight;

  return (
    <section
      ref={heroRef}
      className="relative bg-gov-navy text-white overflow-hidden py-10 sm:py-14 md:py-20 border-b border-gov-gold/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Subtle Spatial Lighting & Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gov-emerald/25 via-gov-navy to-gov-darkSurface opacity-95 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gov-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline, Rotating Line & Exploration CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Historic Window Eyebrow Pill */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
            >
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gov-emerald shrink-0" />
              <span>{t("hero.eyebrow", { defaultValue: "Official Progress Record • 29 May 2023 — August 2026" })}</span>
            </div>

            {/* Main Headline */}
            <h1
              ref={headlineRef}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black font-display leading-[1.15] sm:leading-[1.1] tracking-tight text-white"
            >
              {t("hero.title", { defaultValue: "National Achievements & Evidence Intelligence" })}
            </h1>

            {/* Subheadline Copy */}
            <p
              ref={subheadlineRef}
              className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed max-w-2xl font-normal"
            >
              {t("hero.subtitle", { defaultValue: "An open, evidence-driven public platform documenting verified policy reforms, physical infrastructure projects, and measurable outcomes of President Bola Ahmed Tinubu's administration." })}
            </p>

            {/* Rotating Supporting Intelligence Line */}
            <div className="h-7 sm:h-8 flex items-center">
              <div
                ref={statementRef}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gov-gold bg-gov-gold/10 px-3 py-1 rounded-lg border border-gov-gold/20 backdrop-blur-xs"
                aria-live="off"
              >
                <Sparkles className="h-3.5 w-3.5 text-gov-gold shrink-0 animate-pulse" />
                <span className="truncate">
                  {t(SUPPORTING_STATEMENT_KEYS[statementIndex], { defaultValue: DEFAULT_SUPPORTING_STATEMENTS[statementIndex] })}
                </span>
              </div>
            </div>

            {/* Primary, Secondary & Tertiary Action CTAs */}
            <div
              ref={ctaGroupRef}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              {/* Primary CTA */}
              <Button
                size="lg"
                className="bg-gov-emerald hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 h-12 shadow-lg transition-all gap-2 gold-ring-focus rounded-xl shrink-0"
                asChild
              >
                <Link to="/achievements">
                  <span>{t("hero.exploreAchievements", { defaultValue: "Explore Achievements" })}</span>
                  <ArrowRight className="h-4 w-4 text-gov-gold" />
                </Link>
              </Button>

              {/* PTAT AI CTA */}
              <Button
                size="lg"
                className="bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/50 text-cyan-300 font-bold text-xs sm:text-sm px-5 py-3 h-12 gap-2 rounded-xl backdrop-blur-sm transition-all focus:ring-2 focus:ring-cyan-400 shrink-0 shadow-md hover:shadow-cyan-500/20"
                asChild
              >
                <Link to="/ai">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>{t("hero.askAI", { defaultValue: "Ask PTAT AI" })}</span>
                </Link>
              </Button>

              {/* Secondary CTA */}
              <Button
                size="lg"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs sm:text-sm px-5 py-3 h-12 gap-2 rounded-xl backdrop-blur-sm transition-all focus:ring-2 focus:ring-gov-gold shrink-0"
                asChild
              >
                <Link to="/impact-map">
                  <Compass className="h-4 w-4 text-gov-gold" />
                  <span className="text-white font-semibold">{t("hero.impactMap", { defaultValue: "Impact Map" })}</span>
                </Link>
              </Button>

              {/* Tertiary CTA */}
              <Button
                size="lg"
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-semibold h-12 gap-2 rounded-xl"
                asChild
              >
                <Link to="/data">
                  <Database className="h-4 w-4 text-gov-emerald" />
                  <span>{t("hero.dataExplorer", { defaultValue: "Data Explorer" })}</span>
                </Link>
              </Button>
            </div>

            {/* High-Level Non-Overwhelming Key Counters */}
            <div
              ref={metricsRef}
              className="pt-6 border-t border-white/15 grid grid-cols-3 gap-2 sm:gap-4 text-xs"
            >
              <div className="space-y-0.5 p-2 rounded-lg bg-white/5 sm:bg-transparent">
                <div className="text-lg sm:text-2xl font-black font-display text-white tabular-nums">
                  {macroCounters.canonicalSectors}
                </div>
                <div className="text-gray-300 font-medium text-[11px] sm:text-xs">
                  {t("hero.canonicalSectors", { defaultValue: "Canonical Sectors" })}
                </div>
              </div>

              <div className="space-y-0.5 p-2 rounded-lg bg-white/5 sm:bg-transparent">
                <div className="text-lg sm:text-2xl font-black font-display text-gov-gold tabular-nums">
                  36 + FCT
                </div>
                <div className="text-gray-300 font-medium text-[11px] sm:text-xs">
                  {t("hero.subNationalScope", { defaultValue: "Sub-National Scope" })}
                </div>
              </div>

              <div className="space-y-0.5 p-2 rounded-lg bg-white/5 sm:bg-transparent">
                <div className="text-lg sm:text-2xl font-black font-display text-gov-emerald tabular-nums">
                  Primary
                </div>
                <div className="text-gray-300 font-medium text-[11px] sm:text-xs">
                  {t("hero.sourceCitations", { defaultValue: "Source Citations" })}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Controlled Premium Achievement Spotlight */}
          <div
            ref={spotlightContainerRef}
            className="lg:col-span-5 relative w-full min-w-0 max-w-full"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-gov-gold/30 shadow-2xl bg-gov-darkSurface p-5 sm:p-6 space-y-5">
              {/* National Header Banner & Interactive Controls */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-gov-emerald animate-pulse" />
                  <span className="text-xs font-bold text-gov-gold uppercase tracking-wider">
                    {t("hero.spotlightTitle", { defaultValue: "Spotlight Intelligence" })}
                  </span>
                </div>

                {/* Manual Navigation Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevSpotlight}
                    aria-label="Previous achievement spotlight"
                    className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-[11px] font-mono text-gray-400 px-1">
                    {spotlightAchievements.length > 0 ? `${spotlightIndex + 1}/${spotlightAchievements.length}` : "1/1"}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextSpotlight}
                    aria-label="Next achievement spotlight"
                    className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Active Dynamic Spotlight Card with Fixed Layout Bounds to Prevent Cumulative Layout Shift */}
              <div
                ref={spotlightCardRef}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gov-gold/40 transition-colors space-y-2.5 min-h-[195px] flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gov-emerald truncate">
                      {currentSpotlight.sector}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentSpotlight.badgeColor} shrink-0`}>
                      {currentSpotlight.statusText}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 min-h-[2.5rem]">
                    {currentSpotlight.title}
                  </h4>

                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 min-h-[3.375rem]">
                    {currentSpotlight.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs mt-auto">
                  <span className="text-gray-400">{t("hero.impactMetric", { defaultValue: "Impact Metric:" })}</span>
                  <span className="font-bold text-gov-gold">
                    {currentSpotlight.keyStat} <span className="text-[11px] font-normal text-gray-300">({currentSpotlight.keyStatLabel})</span>
                  </span>
                </div>
              </div>

              {/* Direct Action Link to Selected Achievement */}
              <Link
                to={`/achievements/${currentSpotlight.slug}`}
                className="block text-center w-full py-2.5 rounded-xl bg-gov-canvas/10 hover:bg-gov-canvas/20 text-xs font-bold text-gov-gold hover:text-white transition-colors border border-gov-gold/20"
                aria-label={`Inspect audited evidence record for ${currentSpotlight.title}`}
              >
                {t("hero.inspectAuditedRecord", { defaultValue: "Inspect Audited Evidence Record →" })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
