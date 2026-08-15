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
        "relative flex flex-col items-center justify-center min-h-[80vh] px-4 py-24 sm:py-32 text-center overflow-hidden",
        !backgroundImage && "bg-gradient-to-br from-brand-blue/5 via-brand-purple/10 to-brand-gold/5",
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
      )}
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-brand-gold/20 blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-brand-purple/20 blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-brand-blue/20 blur-3xl animate-pulse" style={{ animationDuration: '20s' }}></div>

        <div className="absolute top-1/4 left-1/2 w-24 h-24 bg-gradient-to-br from-brand-purple/30 to-pink-500/30 rounded-full blur-xl animate-bounce" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-gradient-to-br from-brand-gold/30 to-amber-500/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '10s' }}></div>

        <div className="absolute top-1/3 right-1/4 w-48 h-1 bg-gradient-to-r from-brand-blue/0 via-brand-blue/40 to-brand-blue/0 rotate-45 animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute bottom-1/3 left-1/5 w-48 h-1 bg-gradient-to-r from-brand-purple/0 via-brand-purple/40 to-brand-purple/0 -rotate-45 animate-pulse" style={{ animationDuration: '7s' }}></div>

        {/* Animated particles with enhanced mobile responsiveness */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[10%] h-2 w-2 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
          <div className="absolute top-[20%] left-[80%] h-3 w-3 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1.5s' }}></div>
          <div className="absolute top-[70%] left-[30%] h-2 w-2 bg-white/40 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}></div>
          <div className="absolute top-[40%] left-[60%] h-1 w-1 bg-white/50 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
          <div className="absolute top-[85%] left-[75%] h-2 w-2 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '4.5s', animationDelay: '2s' }}></div>

          {/* Additional animated elements for more dynamic feel */}
          <div className="absolute top-[15%] left-[45%] w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-[65%] left-[25%] w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse" style={{ animationDuration: '5s' }}></div>
          <div className="absolute top-[35%] left-[85%] w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>
        </div>
      </div>

      <div ref={contentRef} className="relative max-w-4xl mx-auto z-10">
        {/* Animated slogan banner with improved mobile display */}
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
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-brand-gold animate-pulse" />
                <span className={cn(
                  "font-display text-lg sm:text-xl md:text-2xl font-semibold tracking-wider",
                  backgroundImage ? "text-brand-gold" : "text-brand-purple"
                )}>
                  {slogan}
                </span>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-brand-gold animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Main headline with enhanced animation and responsive sizing */}
        <div className="overflow-hidden">
          <h1
            className={cn(
              "font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight animate-fade-in",
              backgroundImage ? "text-white drop-shadow-lg" : "text-brand-dark-blue"
            )}
            style={{ animationDuration: '0.8s', animationDelay: '0.2s' }}
          >
            <span className={cn(
              "bg-clip-text text-transparent",
              backgroundImage
                ? "bg-gradient-to-r from-white to-white/90 drop-shadow-lg"
                : "bg-gradient-to-r from-brand-dark-blue to-brand-blue"
            )}>
              {title}
            </span>
          </h1>
        </div>

        {/* Subtitle with enhanced animation and mobile optimization */}
        <div className="overflow-hidden">
          <p
            className={cn(
              "text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in",
              backgroundImage ? "text-gray-200" : "text-gray-700"
            )}
            style={{ animationDuration: '0.8s', animationDelay: '0.4s' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Action buttons with enhanced animation and mobile optimization */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {action && (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold hover:scale-105 transition-all duration-300 text-white px-4 sm:px-6 py-5 sm:py-6 font-semibold text-base sm:text-lg group shadow-lg hover:shadow-xl border-none"
            >
              <a href={action.href} className="relative overflow-hidden group">
                <span className="relative z-10 flex items-center">
                  {action.text}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </a>
            </Button>
          )}
          {secondaryAction && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className={cn(
                "px-4 sm:px-6 py-5 sm:py-6 font-semibold text-base sm:text-lg border-2 hover:scale-105 transition-all duration-300 group relative overflow-hidden shadow-md hover:shadow-lg",
                backgroundImage ? "border-white text-white" : "border-brand-blue text-brand-blue"
              )}
            >
              <a href={secondaryAction.href} className="relative overflow-hidden group">
                <span className="relative z-10 flex items-center">
                  {secondaryAction.text}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                </span>
                <span className={cn(
                  "absolute inset-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300",
                  backgroundImage ? "bg-white/20" : "bg-brand-blue/10"
                )}></span>
              </a>
            </Button>
          )}
        </div>

        {/* Stats cards with enhanced animations, interactions, and mobile optimization */}
        {highlightStats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto" style={{ animationDelay: '0.8s' }}>
            {highlightStats.map((stat, index) => (
              <div
                key={index}
                className={cn(
                  "px-3 sm:px-4 py-3 sm:py-5 rounded-xl backdrop-blur-sm transition-all duration-500 hover:scale-105 sm:hover:scale-110 hover:-rotate-1 animate-fade-in group",
                  backgroundImage
                    ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                    : "bg-white/50 hover:bg-white/80 shadow-lg border border-brand-blue/10"
                )}
                style={{ animationDelay: `${0.8 + index * 0.2}s` }}
              >
                <p className="text-2xl sm:text-3xl font-bold font-display group-hover:scale-110 transition-transform group-hover:text-brand-gold">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm mt-1 font-medium group-hover:text-brand-gold transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style>
        {`
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(241, 242, 243, 0.5);
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #7E69AB, #2E3192);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #6E59A5, #1E2182);
          }
        `}
      </style>
    </div>
  );
};

export default HeroSection;
