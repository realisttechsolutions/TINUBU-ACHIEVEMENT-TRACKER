'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  FileText,
  Building2,
  CircleDollarSign,
  Users,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { PTATGroundedAnswer, PTATAIRecord } from '@/types/ai.types';
import { AIRecordCard } from './AIRecordCard';
import { AIFinancialCard } from './AIFinancialCard';
import { AIBeneficiaryCard } from './AIBeneficiaryCard';
import { AIComparisonBlock } from './AIComparisonBlock';

interface AIAnswerCardProps {
  answer: PTATGroundedAnswer;
  onOpenEvidencePanel: (citationIndex?: number) => void;
}

export const AIAnswerCard: React.FC<AIAnswerCardProps> = ({
  answer,
  onOpenEvidencePanel,
}) => {
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);

  const isInsufficient = answer.answerability === 'INSUFFICIENT_EVIDENCE';
  const citations = answer.citations || [];
  const recordLinks = answer.recordLinks || [];
  const financials = answer.financialSummary || [];
  const beneficiaries = answer.beneficiarySummary || [];

  // Parse inline citations in text ([1], [2], etc.) and render clickable chips
  const renderFormattedAnswer = (text: string) => {
    if (!text) return null;

    // Split text by bracket citations: e.g. [1], [2], [1, 2]
    const parts = text.split(/(\[\d+(?:,\s*\d+)*\])/g);

    return parts.map((part, idx) => {
      const match = part.match(/^\[(\d+(?:,\s*\d+)*)\]$/);
      if (match) {
        const citationNums = match[1].split(',').map((n) => parseInt(n.trim(), 10));

        return (
          <span key={idx} className="inline-flex items-center gap-1 mx-1 align-baseline">
            {citationNums.map((num) => {
              const citation = citations[num - 1];
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onOpenEvidencePanel(num)}
                  onMouseEnter={() => setActiveTooltipIndex(num)}
                  onMouseLeave={() => setActiveTooltipIndex(null)}
                  className="relative inline-flex items-center justify-center px-1.5 py-0.2 rounded-md bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono text-[11px] font-bold shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  aria-label={`Citation [${num}]: ${citation?.sourceTitle || 'View Evidence Source'}`}
                >
                  [{num}]
                  {/* Hover Mini Popover */}
                  {activeTooltipIndex === num && citation && (
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-64 p-2 rounded-lg bg-slate-950 border border-cyan-500/40 text-[11px] font-sans font-normal text-slate-200 shadow-2xl z-30 pointer-events-none text-left leading-tight">
                      <span className="block font-bold text-cyan-300 font-mono text-[10px] uppercase mb-0.5">
                        Source [{num}]: {citation.publisher || 'Official Document'}
                      </span>
                      {citation.sourceTitle}
                    </span>
                  )}
                </button>
              );
            })}
          </span>
        );
      }

      // Format markdown paragraphs & bullet points cleanly
      return (
        <span key={idx} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="w-full my-4 rounded-2xl bg-slate-900/80 dark:bg-slate-950/90 border border-slate-800 shadow-xl backdrop-blur-xl p-5 sm:p-7 text-left space-y-5 animate-in fade-in duration-200">
      {/* 1. Trust & Provenance Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Grounded in PTAT Public Evidence
          </span>
        </div>

        {citations.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>
              {citations.length} Verified {citations.length === 1 ? 'Citation' : 'Citations'}
            </span>
          </div>
        )}
      </div>

      {/* 2. Structured Answer Synthesis / Insufficient State */}
      {isInsufficient ? (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-slate-200 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-sans font-bold text-sm text-amber-300 mb-1">
                Insufficient Evidence in Public Catalog
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {answer.answer ||
                  answer.answerText ||
                  'PTAT does not currently contain verified public records matching this request. The platform only synthesizes responses strictly anchored to verified federal achievements, projects, statutory policies, and empirical financial observations.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed space-y-3">
          {renderFormattedAnswer(answer.answer || answer.answerText || '')}
        </div>
      )}

      {/* 3. Comparison View (if applicable) */}
      {answer.intent === 'COMPARISON_QUERY' && (
        <AIComparisonBlock
          firstTarget={
            answer.comparisonSummary?.firstSubject ||
            answer.constraints?.comparisonTargets?.first ||
            'Subject A'
          }
          secondTarget={
            answer.comparisonSummary?.secondSubject ||
            answer.constraints?.comparisonTargets?.second ||
            'Subject B'
          }
          records={recordLinks as any}
        />
      )}

      {/* 4. Financial Highlights (if applicable) */}
      {financials.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
            <CircleDollarSign className="w-3.5 h-3.5" />
            <span>Verified Financial Disclosures (Naira-First)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {financials.map((fin, i) => (
              <AIFinancialCard key={i} financial={fin} />
            ))}
          </div>
        </div>
      )}

      {/* 5. Beneficiary Highlights (if applicable) */}
      {beneficiaries.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Documented Beneficiaries & Maturity Stages</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {beneficiaries.map((ben, i) => (
              <AIBeneficiaryCard key={i} beneficiary={ben} />
            ))}
          </div>
        </div>
      )}

      {/* 6. Linked PTAT Records */}
      {recordLinks.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Referenced PTAT Catalog Records ({recordLinks.length})</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recordLinks.map((rec, i) => (
              <AIRecordCard key={i} record={rec} />
            ))}
          </div>
        </div>
      )}

      {/* 7. Bottom Evidence Rail Trigger */}
      {citations.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-[11px] text-cyan-400">
              {citations.length} Verified {citations.length === 1 ? 'Citation' : 'Citations'}
            </span>
            <span>•</span>
            <span className="text-[11px]">Primary official sources allowlisted</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenEvidencePanel()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-cyan-300 hover:text-cyan-200 transition-colors shadow-sm"
          >
            <span>Inspect Evidence Rail</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAnswerCard;
