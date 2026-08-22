'use client';

import React from 'react';
import { Users, CheckCircle, Info } from 'lucide-react';
import type { PTATAIBeneficiaryRecord } from '@/types/ai.types';

interface AIBeneficiaryCardProps {
  beneficiary: PTATAIBeneficiaryRecord;
}

function getMaturityStageBadge(stage: string): { label: string; bg: string; note: string } {
  switch (stage?.toLowerCase()) {
    case 'trained':
      return {
        label: 'Trained (Capacity Building)',
        bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
        note: 'Completed training; does not indicate final employment.',
      };
    case 'supported':
    case 'direct_recipients':
      return {
        label: 'Directly Supported',
        bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
        note: 'Direct recipient of statutory intervention or grant.',
      };
    case 'registered':
    case 'enrolled':
      return {
        label: 'Registered / Enrolled',
        bg: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
        note: 'Onboarded into verified national registry.',
      };
    case 'disbursed':
      return {
        label: 'Disbursement Beneficiary',
        bg: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
        note: 'Received direct financial disbursement.',
      };
    default:
      return {
        label: stage?.replace(/_/g, ' ') || 'Beneficiary Metric',
        bg: 'bg-slate-800/60 text-slate-300 border-slate-700/40',
        note: 'Documented beneficiary observation.',
      };
  }
}

export const AIBeneficiaryCard: React.FC<AIBeneficiaryCardProps> = ({ beneficiary }) => {
  const badge = getMaturityStageBadge(beneficiary.beneficiaryStage);

  return (
    <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-colors">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${badge.bg}`}>
            {badge.label}
          </span>
          {beneficiary.cumulative && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
              Cumulative
            </span>
          )}
        </div>

        {/* Count Value & Unit */}
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 tracking-tight">
            {beneficiary.formattedCount || beneficiary.countValue.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-slate-300 capitalize font-medium">
            {beneficiary.unit || 'Individuals'}
          </span>
        </div>

        {/* Semantic Clarification Note */}
        <p className="text-[11px] text-slate-400 leading-snug mt-1">
          {badge.note}
        </p>
      </div>

      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="capitalize">{beneficiary.beneficiaryType?.replace(/_/g, ' ')}</span>
        <span>Stage: {beneficiary.beneficiaryStage}</span>
      </div>
    </div>
  );
};

export default AIBeneficiaryCard;
