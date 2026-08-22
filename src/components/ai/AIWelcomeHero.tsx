'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const AIWelcomeHero: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-3 mb-3 sm:mb-4 animate-in fade-in duration-200">
      {/* 1. Subtle PTAT AI Identity Mark */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-2 shadow-sm backdrop-blur-sm">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>PTAT AI • Evidence Intelligence</span>
      </div>

      {/* 2. Dominant, Restrained AI Greeting */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight leading-tight max-w-xl mb-1.5">
        What would you like to know?
      </h1>

      {/* 3. Subtle Supporting Context Language */}
      <p className="text-xs sm:text-sm text-slate-400 max-w-md font-sans leading-relaxed font-normal">
        Grounded in PTAT public evidence.
      </p>
    </div>
  );
};

export default AIWelcomeHero;
