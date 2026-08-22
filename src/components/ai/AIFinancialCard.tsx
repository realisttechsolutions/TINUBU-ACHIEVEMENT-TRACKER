'use client';

import React from 'react';
import { CircleDollarSign, ArrowUpRight, ShieldAlert } from 'lucide-react';
import type { PTATAIFinancialRecord } from '@/types/ai.types';

interface AIFinancialCardProps {
  financial: PTATAIFinancialRecord;
}

function getFinancialTypeBadge(type: string): { label: string; bg: string } {
  switch (type?.toLowerCase()) {
    case 'budget_allocation':
    case 'allocation':
      return {
        label: 'Statutory Budget Allocation',
        bg: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
      };
    case 'approved_funding':
      return {
        label: 'Approved Funding Envelope (FEC)',
        bg: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40',
      };
    case 'commitment':
      return {
        label: 'Financial Commitment',
        bg: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
      };
    case 'programme_envelope':
      return {
        label: 'Programme Financial Envelope',
        bg: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
      };
    case 'funding_released':
      return {
        label: 'Treasury Funds Released (Warrant)',
        bg: 'bg-teal-950/60 text-teal-300 border-teal-500/40',
      };
    case 'disbursement':
    case 'funding_disbursed':
      return {
        label: 'Actual Funds Disbursed',
        bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
      };
    case 'reported_expenditure':
    case 'expenditure':
      return {
        label: 'Reported Expenditure',
        bg: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
      };
    case 'contract_value':
      return {
        label: 'Commercial Contract Value',
        bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
      };
    case 'private_investment':
      return {
        label: 'Private Capital Inflow / Mobilized',
        bg: 'bg-teal-950/60 text-teal-300 border-teal-500/40',
      };
    case 'revenue_generated':
      return {
        label: 'Government Revenue Generated',
        bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
      };
    default:
      return {
        label: type?.replace(/_/g, ' ') || 'Financial Observation',
        bg: 'bg-slate-800/60 text-slate-300 border-slate-700/40',
      };
  }
}

export const AIFinancialCard: React.FC<AIFinancialCardProps> = ({ financial }) => {
  const badge = getFinancialTypeBadge(financial.financialType);

  return (
    <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-colors">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${badge.bg}`}>
            {financial.financialTypeLabel || badge.label}
          </span>
          {financial.reportingPeriod && (
            <span className="text-[10px] font-mono text-slate-400">
              Period: {financial.reportingPeriod}
            </span>
          )}
        </div>

        {/* Formatted Amount (Naira-First) */}
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tracking-tight">
            {financial.formattedAmount || `₦${Number(financial.amountExact).toLocaleString()}`}
          </span>
          <span className="text-xs font-mono text-slate-400 font-medium">
            {financial.currencyCode || 'NGN'}
          </span>
        </div>
      </div>

      <div className="pt-2 mt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="text-[10px] font-mono text-slate-400 uppercase">
          Empirical Observation
        </span>
        <span className="text-[10px] font-mono text-emerald-400/90">Verified Disclosure</span>
      </div>
    </div>
  );
};

export default AIFinancialCard;
