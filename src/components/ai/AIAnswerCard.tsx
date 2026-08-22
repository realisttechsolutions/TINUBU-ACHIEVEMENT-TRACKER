'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Building2,
  CircleDollarSign,
  Users,
  Globe,
  ShieldCheck,
  FileText,
  Sparkles,
} from 'lucide-react';
import type { PTATGroundedAnswer } from '@/types/ai.types';
import { AIRecordCard } from './AIRecordCard';
import { AIFinancialCard } from './AIFinancialCard';
import { AIBeneficiaryCard } from './AIBeneficiaryCard';
import { AIComparisonBlock } from './AIComparisonBlock';

interface AIAnswerCardProps {
  answer: PTATGroundedAnswer;
  onOpenEvidencePanel?: (citationIndex?: number) => void;
  isStreaming?: boolean;
}

export const AIAnswerCard: React.FC<AIAnswerCardProps> = ({
  answer,
  onOpenEvidencePanel,
  isStreaming = false,
}) => {
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [showStructuredDetails, setShowStructuredDetails] = useState(false);

  const citations = answer.citations || [];
  const webSources = answer.webSources || [];
  const recordLinks = answer.recordLinks || [];
  const financials = answer.financialSummary || [];
  const beneficiaries = answer.beneficiarySummary || [];
  const sourceMode = answer.sourceMode || 'PTAT_ONLY';

  const totalSourcesCount = citations.length + webSources.length;

  // Determine subtle badge label
  let sourceBadgeLabel = 'PTAT Verified';
  let sourceBadgeIcon = ShieldCheck;
  if (sourceMode === 'WEB_GROUNDED') {
    sourceBadgeLabel = 'Web Grounded';
    sourceBadgeIcon = Globe;
  } else if (sourceMode === 'PTAT_PLUS_WEB') {
    sourceBadgeLabel = 'PTAT + Web';
    sourceBadgeIcon = Sparkles;
  } else if (sourceMode === 'GENERAL') {
    sourceBadgeLabel = 'AI Assistant';
    sourceBadgeIcon = Sparkles;
  }

  const BadgeIcon = sourceBadgeIcon;

  // Render markdown text naturally (paragraphs, headers, bold, bullet points)
  const renderProse = (text: string) => {
    if (!text) return null;

    // Clean inline bracket clutter like [1, 2] or [1] into subtle superscript tags
    const paragraphs = text.split(/\n\n+/);

    return paragraphs.map((para, pIdx) => {
      const isBulletList = para.trim().startsWith('- ') || para.trim().startsWith('* ') || /^\d+\.\s/.test(para.trim());

      if (isBulletList) {
        const items = para.split(/\n/).filter((line) => line.trim().length > 0);
        return (
          <ul key={pIdx} className="space-y-1.5 my-1.5 list-disc list-outside pl-4.5 text-slate-200 text-xs sm:text-[13.5px] md:text-[14px]">
            {items.map((item, iIdx) => {
              const cleaned = item.replace(/^[-*]\s+|\d+\.\s+/, '');
              return (
                <li key={iIdx} className="leading-relaxed">
                  {renderInlineFormatting(cleaned)}
                </li>
              );
            })}
          </ul>
        );
      }

      return (
        <p key={pIdx} className="leading-relaxed text-slate-200 my-1.5 text-xs sm:text-[13.5px] md:text-[14px]">
          {renderInlineFormatting(para)}
        </p>
      );
    });
  };

  const renderInlineFormatting = (text: string) => {
    // Replace markdown bold **text** and bracket citations [1]
    const parts = text.split(/(\*\*[^*]+\*\*|\[\d+(?:,\s*\d+)*\])/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }

      const citMatch = part.match(/^\[(\d+(?:,\s*\d+)*)\]$/);
      if (citMatch) {
        const num = citMatch[1];
        return (
          <sup
            key={idx}
            className="text-[10px] font-mono text-cyan-400 font-medium px-0.5 ml-0.5 cursor-pointer hover:underline"
            onClick={() => onOpenEvidencePanel?.(parseInt(num, 10))}
            title={`Citation [${num}]`}
          >
            [{num}]
          </sup>
        );
      }

      return part;
    });
  };

  return (
    <div className="w-full my-1.5 text-left font-sans animate-in fade-in duration-200">
      {/* 1. Main Natural AI Answer Prose (Transparent / Low-Chrome) */}
      <div className="text-xs sm:text-[13.5px] md:text-[14px] text-slate-200 font-sans leading-relaxed space-y-1.5">
        {renderProse(answer.answerText || answer.answer || '')}
        {isStreaming && (
          <span className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 animate-pulse align-middle rounded-sm" />
        )}
      </div>

      {/* 2. Comparison Block (if applicable) */}
      {answer.intent === 'COMPARISON_QUERY' && (
        <div className="mt-4">
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
        </div>
      )}

      {/* 3. Subtle Sources Disclosure & Trust Strip */}
      {!isStreaming && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
                <BadgeIcon className="w-3 h-3 text-cyan-400" />
                <span>{sourceBadgeLabel}</span>
              </span>

              {totalSourcesCount > 0 && (
                <button
                  type="button"
                  onClick={() => setSourcesExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-[11px] font-medium text-cyan-300 transition-colors"
                  aria-expanded={sourcesExpanded}
                >
                  <span>Sources · {totalSourcesCount}</span>
                  {sourcesExpanded ? (
                    <ChevronUp className="w-3 h-3 ml-0.5" />
                  ) : (
                    <ChevronDown className="w-3 h-3 ml-0.5" />
                  )}
                </button>
              )}

              {(financials.length > 0 || beneficiaries.length > 0 || recordLinks.length > 0) && (
                <button
                  type="button"
                  onClick={() => setShowStructuredDetails((prev) => !prev)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 underline decoration-slate-600 transition-colors"
                >
                  {showStructuredDetails ? 'Hide structured data' : 'View structured data'}
                </button>
              )}
            </div>

            {citations.length > 0 && onOpenEvidencePanel && (
              <button
                type="button"
                onClick={() => onOpenEvidencePanel()}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
              >
                Evidence Drawer →
              </button>
            )}
          </div>

          {/* 4. Progressive Expandable Sources List */}
          {sourcesExpanded && totalSourcesCount > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs animate-in slide-in-from-top-1 duration-150">
              <h5 className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider font-mono">
                Sourced Public Evidence
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Verified PTAT Citations */}
                {citations.map((c, i) => (
                  <div
                    key={`cit-${i}`}
                    className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between gap-1.5"
                  >
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                        <span>PTAT Verified · {c.publisher || 'Official Record'}</span>
                      </div>
                      <p className="text-slate-200 font-medium line-clamp-2 mt-0.5">
                        {c.sourceTitle || 'Official Government Document'}
                      </p>
                    </div>

                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline font-mono truncate"
                      >
                        <span className="truncate">{c.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                  </div>
                ))}

                {/* Google Search Web Sources */}
                {webSources.map((w, i) => (
                  <div
                    key={`web-${i}`}
                    className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between gap-1.5"
                  >
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                        <Globe className="w-3 h-3 shrink-0" />
                        <span>Public Web Source · {w.domain}</span>
                      </div>
                      <p className="text-slate-200 font-medium line-clamp-2 mt-0.5">{w.title}</p>
                    </div>

                    {w.url && (
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 underline font-mono truncate"
                      >
                        <span className="truncate">{w.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Optional Structured Financial / Beneficiary / Records Breakdown */}
          {showStructuredDetails && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-150">
              {financials.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                    <CircleDollarSign className="w-3.5 h-3.5" />
                    <span>Financial Disclosures (Naira-First)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {financials.map((fin, i) => (
                      <AIFinancialCard key={i} financial={fin} />
                    ))}
                  </div>
                </div>
              )}

              {beneficiaries.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5" />
                    <span>Beneficiary Allocations & Stages</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {beneficiaries.map((ben, i) => (
                      <AIBeneficiaryCard key={i} beneficiary={ben} />
                    ))}
                  </div>
                </div>
              )}

              {recordLinks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Related Catalogue Records ({recordLinks.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {recordLinks.map((rec, i) => (
                      <AIRecordCard key={i} record={rec} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAnswerCard;
