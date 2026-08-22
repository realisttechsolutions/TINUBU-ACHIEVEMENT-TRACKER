'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const AIWelcomeHero: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-4 mb-6 sm:mb-8 animate-in fade-in duration-300">
      {/* 1. Subtle PTAT AI Identity Mark */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-4 shadow-sm backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>PTAT AI • Evidence Intelligence</span>
      </div>

      {/* 2. Dominant, Restrained AI Greeting */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-tight max-w-2xl mb-3">
        What would you like to know?
      </h1>

      {/* 3. Subtle Supporting Context Language */}
      <p className="text-sm sm:text-base text-slate-400 max-w-lg font-sans leading-relaxed font-normal">
        Ask anything about achievements, infrastructure projects, statutory policies, and verified public evidence.
      </p>
    </div>
  );
};

export default AIWelcomeHero;
