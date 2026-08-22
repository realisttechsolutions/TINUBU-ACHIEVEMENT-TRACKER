'use client';

import React from 'react';

interface EvidenceConstellationProps {
  compact?: boolean;
  className?: string;
}

export const EvidenceConstellation: React.FC<EvidenceConstellationProps> = ({
  compact = false,
  className = '',
}) => {
  const sizeClass = compact ? 'w-40 h-40' : 'w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96';

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      {/* 1. Deep Atmospheric Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-emerald-500/15 to-amber-500/20 rounded-full blur-3xl opacity-70 animate-pulse duration-[6000ms]" />

      {/* 2. Outer Orbital Ring */}
      <div className="absolute inset-4 rounded-full border border-cyan-500/20 border-dashed animate-[spin_40s_linear_infinite]" />

      {/* 3. Middle Metric Orbit */}
      <div className="absolute inset-10 rounded-full border border-emerald-500/25 border-dotted animate-[spin_25s_linear_infinite_reverse]" />

      {/* 4. Inner Intelligence Ring */}
      <div className="absolute inset-16 rounded-full border border-amber-400/30 animate-[spin_15s_linear_infinite]" />

      {/* 5. Center Core Orb with High-Tech Glow */}
      <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-slate-900 via-gov-navy to-slate-950 border border-cyan-400/40 shadow-[0_0_40px_rgba(6,182,212,0.35)] flex items-center justify-center backdrop-blur-md overflow-hidden">
        {/* Core light sweep */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-400/10 to-transparent animate-[pulse_4s_ease-in-out_infinite]" />

        {/* PTAT Emblem Vector */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shadow-inner">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <span className="mt-1 text-[10px] font-mono tracking-widest text-cyan-300 font-bold uppercase">
            PTAT AI
          </span>
        </div>
      </div>

      {/* 6. Orbital Evidence Nodes */}
      {/* Node A: Records */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-lg backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>270 RECORDS</span>
      </div>

      {/* Node B: Claims */}
      <div className="absolute bottom-6 right-6 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 shadow-lg backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>EVIDENCE CLAIMS</span>
      </div>

      {/* Node C: Sources */}
      <div className="absolute bottom-6 left-6 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-amber-500/40 text-[10px] font-mono text-amber-300 shadow-lg backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>PRIMARY SOURCES</span>
      </div>

      {/* SVG Connecting Constellation Lines */}
      <svg className="absolute inset-0 w-full h-full text-cyan-500/20" viewBox="0 0 400 400" fill="none">
        <path d="M200 40 L340 320 L60 320 Z" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
        <circle cx="200" cy="40" r="3" fill="#06b6d4" />
        <circle cx="340" cy="320" r="3" fill="#10b981" />
        <circle cx="60" cy="320" r="3" fill="#f59e0b" />
      </svg>
    </div>
  );
};

export default EvidenceConstellation;
