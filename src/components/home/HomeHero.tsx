import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, BarChart2 } from "lucide-react";
import { heroData } from "@/data/home/homepage.config";

export const HomeHero: React.FC = () => {
  return (
    <section className="relative bg-gov-navy text-white overflow-hidden py-12 md:py-20 border-b border-gov-gold/30">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gov-emerald/20 via-gov-navy to-gov-darkSurface opacity-90 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text Content & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{heroData.eyebrow}</span>
            </div>

            {/* Main Headline (H1) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-white">
              {heroData.headline}
            </h1>

            {/* Subheadline Copy */}
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-2xl font-normal">
              {heroData.subheadline}
            </p>

            {/* Primary & Secondary Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                size="lg"
                className="bg-gov-emerald hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 h-12 shadow-lg transition-colors gap-2"
                asChild
              >
                <Link to={heroData.primaryAction.href}>
                  <span>{heroData.primaryAction.text}</span>
                  <ArrowRight className="h-4 w-4 text-gov-gold" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-gov-border/60 hover:bg-white/10 text-white font-semibold text-sm px-6 py-3 h-12 gap-2"
                asChild
              >
                <Link to={heroData.secondaryAction.href}>
                  <BarChart2 className="h-4 w-4 text-gov-gold" />
                  <span>{heroData.secondaryAction.text}</span>
                </Link>
              </Button>
            </div>

            {/* Trust Line Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-gov-slate dark:text-gray-300">
              <span className="h-2 w-2 rounded-full bg-gov-emerald shrink-0" />
              <span>{heroData.trustNote}</span>
            </div>
          </div>

          {/* Right Column: Presidential Editorial Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-gov-gold/30 shadow-2xl bg-gov-darkSurface">
              <img
                src={heroData.image}
                alt={heroData.imageAlt}
                className="w-full h-[360px] sm:h-[420px] lg:h-[460px] object-cover object-top"
                loading="eager"
                width={600}
                height={460}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gov-navy via-transparent to-transparent opacity-80" />

              {/* In-Image Caption Lockup */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-gov-navy/90 backdrop-blur-md border border-gov-gold/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gold">
                  Official Progress Record
                </span>
                <p className="text-xs font-semibold text-white">
                  President Bola Ahmed Tinubu's Renewed Hope Agenda (2023 - 2027)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
