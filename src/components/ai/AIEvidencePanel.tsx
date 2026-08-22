'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Building2,
  CircleDollarSign,
  Users,
  ExternalLink,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type {
  PTATGroundedAnswer,
  PTATAISource,
  PTATAIRecord,
  PTATAIFinancialRecord,
  PTATAIBeneficiaryRecord,
} from '@/types/ai.types';
import { AIRecordCard } from './AIRecordCard';
import { AIFinancialCard } from './AIFinancialCard';
import { AIBeneficiaryCard } from './AIBeneficiaryCard';

interface AIEvidencePanelProps {
  answer: PTATGroundedAnswer | null;
  isOpen: boolean;
  onClose: () => void;
  selectedCitationIndex?: number | null;
  onClearSelectedCitation?: () => void;
}

type EvidenceTab = 'sources' | 'records' | 'financials' | 'beneficiaries';

function getSourceLevelBadge(level: string) {
  switch (level) {
    case 'LEVEL_1':
      return {
        label: 'Level 1: Official Primary Gazette / MDA',
        bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
      };
    case 'LEVEL_2':
      return {
        label: 'Level 2: Multilateral / Official Partner',
        bg: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40',
      };
    case 'LEVEL_3':
      return {
        label: 'Level 3: Verified National Press',
        bg: 'bg-blue-950/70 text-blue-300 border-blue-500/40',
      };
    default:
      return {
        label: 'Public Source',
        bg: 'bg-slate-800 text-slate-300 border-slate-700',
      };
  }
}

export const AIEvidencePanel: React.FC<AIEvidencePanelProps> = ({
  answer,
  isOpen,
  onClose,
  selectedCitationIndex,
  onClearSelectedCitation,
}) => {
  const [activeTab, setActiveTab] = useState<EvidenceTab>('sources');

  useEffect(() => {
    if (selectedCitationIndex !== null && selectedCitationIndex !== undefined) {
      setActiveTab('sources');
    }
  }, [selectedCitationIndex]);

  if (!isOpen || !answer) return null;

  const citations = answer.citations || [];
  const recordLinks = answer.recordLinks || [];
  const hasFinancials = Boolean(answer.financialSummary && (answer.financialSummary as any).length > 0);
  const hasBeneficiaries = Boolean(answer.beneficiarySummary && (answer.beneficiarySummary as any).length > 0);

  return (
    <aside
      aria-label="PTAT Evidence Panel"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[480px] bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right"
    >
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-slate-100">
              Evidence & Grounding Rail
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Authoritative validation dataset
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close evidence panel"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-900/30 px-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => {
            setActiveTab('sources');
            if (onClearSelectedCitation) onClearSelectedCitation();
          }}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'sources'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Sources ({citations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('records')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'records'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Records ({recordLinks.length})</span>
        </button>

        {hasFinancials && (
          <button
            type="button"
            onClick={() => setActiveTab('financials')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'financials'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CircleDollarSign className="w-3.5 h-3.5" />
            <span>Financials</span>
          </button>
        )}

        {hasBeneficiaries && (
          <button
            type="button"
            onClick={() => setActiveTab('beneficiaries')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'beneficiaries'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Beneficiaries</span>
          </button>
        )}
      </div>

      {/* 3. Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* TAB 1: SOURCES */}
        {activeTab === 'sources' && (
          <div className="space-y-3">
            {citations.length > 0 &&
              citations.map((citation, index) => {
                const isSelected = selectedCitationIndex === index + 1;
                const badge = getSourceLevelBadge(citation.sourceLevel || 'LEVEL_1');

                return (
                  <div
                    key={`cit-${index}`}
                    className={`p-3.5 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/40">
                        {index + 1}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <h4 className="font-sans font-semibold text-xs text-slate-100 mb-1 leading-snug">
                      {citation.sourceTitle}
                    </h4>

                    {citation.quoteOrSummary && (
                      <p className="text-[11px] text-slate-400 italic mb-2 leading-relaxed bg-slate-950/50 p-2 rounded border border-slate-800/80">
                        "{citation.quoteOrSummary}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span>Publisher: {citation.publisher || 'Federal Government of Nigeria'}</span>
                      {citation.url && (
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          <span>Open Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Web Grounded Sources */}
            {answer.webSources && answer.webSources.length > 0 &&
              answer.webSources.map((web, idx) => (
                <div
                  key={`web-${idx}`}
                  className="p-3.5 rounded-xl border bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                      Web Source
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{web.domain}</span>
                  </div>

                  <h4 className="font-sans font-semibold text-xs text-slate-100 mb-1 leading-snug">
                    {web.title}
                  </h4>

                  {web.url && (
                    <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                      <a
                        href={web.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium truncate"
                      >
                        <span className="truncate">{web.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              ))}

            {citations.length === 0 && (!answer.webSources || answer.webSources.length === 0) && (
              <div className="text-center py-10 text-xs text-slate-400">
                No citations or external web sources referenced for this response.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECORDS */}
        {activeTab === 'records' && (
          <div className="space-y-3">
            {recordLinks.length > 0 ? (
              recordLinks.map((link, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700 mb-1 inline-block">
                      {link.recordType?.replace(/_/g, ' ') || 'Record'}
                    </span>
                    <h5 className="font-sans font-semibold text-xs text-slate-100 truncate">
                      {link.title}
                    </h5>
                  </div>

                  <a
                    href={link.route}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium shrink-0 transition-colors"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">
                No linked records available.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FINANCIALS */}
        {activeTab === 'financials' && (
          <div className="space-y-3">
            {hasFinancials ? (
              (answer.financialSummary as any).map((fin: PTATAIFinancialRecord, i: number) => (
                <AIFinancialCard key={i} financial={fin} />
              ))
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">
                No financial observations recorded for this topic.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BENEFICIARIES */}
        {activeTab === 'beneficiaries' && (
          <div className="space-y-3">
            {hasBeneficiaries ? (
              (answer.beneficiarySummary as any).map(
                (ben: PTATAIBeneficiaryRecord, i: number) => (
                  <AIBeneficiaryCard key={i} beneficiary={ben} />
                )
              )
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">
                No beneficiary records recorded for this topic.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Footer info */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-center">
        <span className="text-[10px] font-mono text-slate-400">
          PTAT EMPIRICAL EVIDENCE REPOSITORY • ZERO PHANTOM CITATIONS
        </span>
      </div>
    </aside>
  );
};

export default AIEvidencePanel;
