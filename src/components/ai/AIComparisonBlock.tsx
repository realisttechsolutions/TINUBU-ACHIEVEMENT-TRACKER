'use client';

import React from 'react';
import { GitCompare, MapPin, Building2, Layers } from 'lucide-react';
import type { PTATAIRecord } from '@/types/ai.types';
import { AIRecordCard } from './AIRecordCard';

interface AIComparisonBlockProps {
  firstTarget: string;
  secondTarget: string;
  records: PTATAIRecord[];
}

export const AIComparisonBlock: React.FC<AIComparisonBlockProps> = ({
  firstTarget,
  secondTarget,
  records,
}) => {
  const normFirst = firstTarget.toLowerCase();
  const normSecond = secondTarget.toLowerCase();

  // Partition records between First Target and Second Target
  const firstRecords = records.filter((r) => {
    const geoMatch = r.geographies?.some((g) => g.name.toLowerCase().includes(normFirst) || g.code.toLowerCase().includes(normFirst));
    const titleMatch = r.title.toLowerCase().includes(normFirst) || r.summary?.toLowerCase().includes(normFirst);
    const typeMatch = r.recordType.toLowerCase() === normFirst;
    return geoMatch || titleMatch || typeMatch;
  });

  const secondRecords = records.filter((r) => {
    const geoMatch = r.geographies?.some((g) => g.name.toLowerCase().includes(normSecond) || g.code.toLowerCase().includes(normSecond));
    const titleMatch = r.title.toLowerCase().includes(normSecond) || r.summary?.toLowerCase().includes(normSecond);
    const typeMatch = r.recordType.toLowerCase() === normSecond;
    return geoMatch || titleMatch || typeMatch;
  });

  // Extract sectors represented
  const firstSectors = Array.from(new Set(firstRecords.flatMap((r) => r.sectors?.map((s) => s.label) || [])));
  const secondSectors = Array.from(new Set(secondRecords.flatMap((r) => r.sectors?.map((s) => s.label) || [])));

  return (
    <div className="w-full my-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-400">
          <GitCompare className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-sans font-bold text-sm sm:text-base text-slate-100">
            Bilateral Evidence Comparison
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            Symmetrical comparative evaluation of PTAT catalog evidence
          </span>
        </div>
      </div>

      {/* Side-by-side or Stacked Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1: First Target */}
        <div className="flex flex-col rounded-xl bg-slate-950/70 border border-slate-800 p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h5 className="font-display font-bold text-base text-cyan-300 capitalize">
                {firstTarget}
              </h5>
            </div>
            <span className="px-2 py-0.5 rounded font-mono text-xs bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold">
              {firstRecords.length} {firstRecords.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          {/* Sector Coverage */}
          <div className="mb-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Active Sectors ({firstSectors.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {firstSectors.length > 0 ? (
                firstSectors.map((sector, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {sector}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-400 italic">
                  No specific sector tagging
                </span>
              )}
            </div>
          </div>

          {/* Records List */}
          <div className="flex flex-col gap-2 mt-auto">
            {firstRecords.length > 0 ? (
              firstRecords.slice(0, 3).map((record) => (
                <AIRecordCard key={record.id} record={record} />
              ))
            ) : (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 text-center">
                No recorded state-specific records found in PTAT.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Second Target */}
        <div className="flex flex-col rounded-xl bg-slate-950/70 border border-slate-800 p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h5 className="font-display font-bold text-base text-emerald-300 capitalize">
                {secondTarget}
              </h5>
            </div>
            <span className="px-2 py-0.5 rounded font-mono text-xs bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold">
              {secondRecords.length} {secondRecords.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          {/* Sector Coverage */}
          <div className="mb-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Active Sectors ({secondSectors.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {secondSectors.length > 0 ? (
                secondSectors.map((sector, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {sector}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-400 italic">
                  No specific sector tagging
                </span>
              )}
            </div>
          </div>

          {/* Records List */}
          <div className="flex flex-col gap-2 mt-auto">
            {secondRecords.length > 0 ? (
              secondRecords.slice(0, 3).map((record) => (
                <AIRecordCard key={record.id} record={record} />
              ))
            ) : (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 text-center">
                No recorded state-specific records found in PTAT.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIComparisonBlock;
