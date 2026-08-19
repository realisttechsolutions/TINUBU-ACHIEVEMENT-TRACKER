'use client';


import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { gsap, kenBurnsEffect, parallaxEffect } from "@/lib/animations";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  action?: {
    text: string;
    href: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  className?: string;
  highlightStats?: {
    value: string;
    label: string;
  }[];
  animatedSlogans?: string[];
}

const HeroSection = ({
  title,
  subtitle,
  action,
  secondaryAction,
  backgroundImage,
  className,
  highlightStats,
  animatedSlogans = ["Renewed Hope Agenda", "Building a Greater Nigeria", "Transforming Our Future"],
}: HeroSectionProps) => {
  const [currentSloganIndex, setCurrentSloganIndex] = React.useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Enhanced effect for continuous slogan animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSloganIndex(prevIndex => (prevIndex + 1) % animatedSlogans.length);
    }, 3000); // Change slogan every 3 seconds

    return () => clearInterval(interval);
  }, [animatedSlogans.length]);

  // Ken Burns effect for background image
  useEffect(() => {
    if (bgImageRef.current && backgroundImage) {
      kenBurnsEffect(bgImageRef.current);
    }
  }, [backgroundImage]);

  // Parallax effect for hero content
  useEffect(() => {
    if (contentRef.current) {
      parallaxEffect(contentRef.current, 0.2);
    }
  }, []);

  // Entrance animations
  useEffect(() => {
    if (heroRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        heroRef.current.querySelectorAll('.hero-animate'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        }
      );
    }
  }, []);

  return (
    <div
      ref={heroRef}
      className={cn(
        "relative flex flex-col items-center justify-center min-h-[70vh] px-4 py-20 sm:py-28 text-center overflow-hidden",
        !backgroundImage && "bg-gradient-to-b from-[#001711] via-[#00241B] to-[#00140F] text-white border-b border-gov-gold/20",
        className
      )}
    >
      {/* Ken Burns animated background */}
      {backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            ref={bgImageRef}
            className="absolute inset-[-10%] w-[120%] h-[120%]"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
        </div>
      )}

      {/* Presidential Vector Grid Background (active when no photo or as subtle overlay) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Subtle radial ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gov-emerald/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[200px] bg-gov-gold/10 rounded-full blur-3xl" />

        {/* Vector Coordinate Grid */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern id="presidential-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(197, 160, 89, 0.25)" strokeWidth="0.75" />
              <circle cx="60" cy="0" r="1.5" fill="rgba(197, 160, 89, 0.4)" />
              <circle cx="0" cy="60" r="1.5" fill="rgba(197, 160, 89, 0.4)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#presidential-grid)" />
        </svg>
      </div>

      <div ref={contentRef} className="relative max-w-4xl mx-auto z-10">
        {/* Animated slogan banner */}
        {animatedSlogans && animatedSlogans.length > 0 && (
          <div className="mb-6 overflow-hidden h-12 sm:h-14 hero-animate">
            <div className="relative">
              {animatedSlogans.map((slogan, index) => (
                <div
                  key={slogan}
                  className={cn(
                    "absolute w-full transition-all duration-700 flex items-center justify-center gap-2",
                    currentSloganIndex === index
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform translate-y-8"
                  )}
                >
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-gov-gold animate-pulse" />
                  <span className="font-display text-lg sm:text-xl md:text-2xl font-semibold tracking-wider text-gov-gold">
                    {slogan}
                  </span>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-gov-gold animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main headline */}
        <div className="overflow-hidden">
          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight text-white drop-shadow-md"
          >
            <span className="bg-gradient-to-r from-white via-slate-100 to-white/90 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="overflow-hidden">
          <p
            className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed text-slate-200/90 font-sans"
          >
            {subtitle}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          {action && (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-gov-gold to-amber-600 hover:from-amber-500 hover:to-gov-gold text-gov-navy font-bold px-6 py-5 sm:py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-none"
            >
              <a href={action.href} className="flex items-center gap-2">
                <span>{action.text}</span>
                <ArrowRight className="h-4 w-4 text-gov-navy" />
              </a>
            </Button>
          )}
          {secondaryAction && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-5 sm:py-6 backdrop-blur-md hover:scale-[1.02] transition-all duration-200 shadow-sm"
            >
              <a href={secondaryAction.href} className="flex items-center gap-2">
                <span>{secondaryAction.text}</span>
                <ArrowRight className="h-4 w-4 text-gov-gold" />
              </a>
            </Button>
          )}
        </div>

        {/* Stats cards */}
        {highlightStats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto">
            {highlightStats.map((stat, index) => (
              <div
                key={index}
                className="px-4 py-4 sm:py-5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center hover:bg-white/[0.09] transition-all duration-200 group"
              >
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-gov-gold group-hover:scale-105 transition-transform">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm mt-1 font-medium text-slate-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
