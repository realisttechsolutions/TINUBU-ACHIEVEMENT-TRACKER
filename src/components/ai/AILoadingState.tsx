'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Database, Search, Cpu } from 'lucide-react';

interface AILoadingStateProps {
  startTime?: number;
}

const PHASES = [
  {
    label: 'Parsing question intent & parameters',
    detail: 'Classifying constraints across 16 query taxonomy classes',
    icon: Search,
  },
  {
    label: 'Querying PTAT public evidence repository',
    detail: 'Filtering 270 canonical records, claims & financial records',
    icon: Database,
  },
  {
    label: 'Validating primary citations & sources',
    detail: 'Matching Level 1 gazettes, MDA disclosures & official reports',
    icon: ShieldCheck,
  },
  {
    label: 'Synthesizing evidence-grounded answer',
    detail: 'Strict evidence containment via Google Vertex AI',
    icon: Cpu,
  },
];

export const AILoadingState: React.FC<AILoadingStateProps> = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setElapsedSeconds(elapsed);

      if (elapsed < 2) {
        setCurrentPhaseIndex(0);
      } else if (elapsed < 4) {
        setCurrentPhaseIndex(1);
      } else if (elapsed < 7) {
        setCurrentPhaseIndex(2);
      } else {
        setCurrentPhaseIndex(3);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const activePhase = PHASES[currentPhaseIndex];
  const PhaseIcon = activePhase.icon;

  return (
    <div className="w-full my-4 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-inner">
            <PhaseIcon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                PTAT REASONING PIPELINE
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h4 className="font-sans font-bold text-sm sm:text-base text-slate-100">
              {activePhase.label}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-end sm:self-auto">
          <span>Elapsed:</span>
          <span className="text-cyan-400 font-bold">{elapsedSeconds}s</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-sans mb-4">
        {activePhase.detail}
      </p>

      {/* Progress Steps Indicators */}
      <div className="grid grid-cols-4 gap-2">
        {PHASES.map((phase, idx) => {
          const isDone = idx < currentPhaseIndex;
          const isCurrent = idx === currentPhaseIndex;

          return (
            <div key={idx} className="flex flex-col gap-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : isCurrent
                    ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                    : 'bg-slate-800'
                }`}
              />
              <span
                className={`text-[9px] font-mono truncate hidden sm:block ${
                  isCurrent ? 'text-cyan-300 font-semibold' : 'text-slate-400'
                }`}
              >
                Step {idx + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AILoadingState;
