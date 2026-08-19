'use client';

import React from "react";
import { Compass, MapPin, Layers, Table, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GeographicHero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[500px] md:min-h-[540px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#001711] via-[#00241B] to-[#00140F] text-white px-4 py-14 md:py-20 border-b border-gov-gold/20">
      {/* 1. Precision Vector Topographical & Geospatial Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Subtle radial ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gov-emerald/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-gov-gold/10 rounded-full blur-3xl" />

        {/* Isometric / Coordinate Grid SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern id="geo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(197, 160, 89, 0.25)" strokeWidth="0.75" />
              <circle cx="60" cy="0" r="1.5" fill="rgba(197, 160, 89, 0.4)" />
              <circle cx="0" cy="60" r="1.5" fill="rgba(197, 160, 89, 0.4)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo-grid)" />
        </svg>

        {/* Topographical Vector Elevation Curves */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
        >
          <path
            d="M-100,200 C300,100 600,350 1000,180 C1250,80 1400,220 1600,150"
            fill="none"
            stroke="#C5A059"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M-50,320 C250,220 700,480 1100,290 C1350,180 1500,360 1650,280"
            fill="none"
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <path
            d="M-80,440 C350,380 800,550 1200,400 C1380,320 1520,490 1680,420"
            fill="none"
            stroke="#C5A059"
            strokeWidth="0.8"
            strokeOpacity="0.3"
          />
        </svg>

        {/* Geographic Coordinates Watermark */}
        <div className="hidden lg:flex absolute bottom-6 left-8 text-[11px] font-mono text-gov-gold/40 tracking-widest uppercase items-center gap-4">
          <span>LAT 04°16′N – 13°53′N</span>
          <span>•</span>
          <span>LON 02°40′E – 14°41′E</span>
          <span>•</span>
          <span>DATUM: WGS 84 / EPSG:4326</span>
        </div>

        <div className="hidden lg:flex absolute bottom-6 right-8 text-[11px] font-mono text-gov-gold/40 tracking-widest uppercase items-center gap-2">
          <Layers className="w-3.5 h-3.5" />
          <span>36 STATES + FEDERAL CAPITAL TERRITORY</span>
        </div>
      </div>

      {/* 2. Hero Content Container */}
      <div className="relative max-w-5xl mx-auto z-10 flex flex-col items-center text-center">
        {/* Presidential Geographic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gov-gold/10 border border-gov-gold/40 text-gov-gold text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6 shadow-sm backdrop-blur-md">
          <Compass className="w-4 h-4 text-gov-gold" />
          <span>Federal Republic of Nigeria • Geospatial Impact Layer</span>
        </div>

        {/* Main Title */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5 drop-shadow-md text-white">
          National Geographic Impact Map
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-slate-200/90 max-w-3xl mx-auto leading-relaxed mb-8 font-sans">
          Authoritative spatial intelligence index tracking verified federal capital investments, cross-state economic corridors, localized infrastructure projects, and social interventions across Nigeria&apos;s 36 states and the Federal Capital Territory.
        </p>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-gov-gold to-amber-600 hover:from-amber-500 hover:to-gov-gold text-gov-navy font-bold px-6 py-5 sm:py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-none"
          >
            <a href="#map-section" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gov-navy shrink-0" />
              <span>Explore Interactive Map</span>
              <ArrowDown className="w-4 h-4 text-gov-navy shrink-0" />
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-5 sm:py-6 backdrop-blur-md hover:scale-[1.02] transition-all duration-200 shadow-sm"
          >
            <a href="#state-directory" className="flex items-center gap-2">
              <Table className="w-4 h-4 text-gov-gold shrink-0" />
              <span>State Directory List</span>
            </a>
          </Button>
        </div>

        {/* Highlight Stats Row (Glassmorphic Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl">
          <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center hover:bg-white/[0.09] transition-colors">
            <p className="text-2xl sm:text-3xl font-extrabold font-display text-gov-gold">36 + FCT</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">States &amp; Capital</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center hover:bg-white/[0.09] transition-colors">
            <p className="text-2xl sm:text-3xl font-extrabold font-display text-white">6 Zones</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Geopolitical Scope</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center hover:bg-white/[0.09] transition-colors">
            <p className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400">37 Units</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Mapped Boundaries</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center hover:bg-white/[0.09] transition-colors">
            <p className="text-2xl sm:text-3xl font-extrabold font-display text-gov-gold">₦ Naira</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">First Presentation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeographicHero;
