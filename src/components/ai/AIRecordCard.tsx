'use client';

import React from 'react';
import { Link } from '@/lib/navigation';
import { ExternalLink, Building2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { PTATAIRecord, PTATAIRecordLink } from '@/types/ai.types';

interface AIRecordCardProps {
  record: PTATAIRecord | PTATAIRecordLink;
}

function formatRecordType(type: string): string {
  switch (type) {
    case 'physical_project':
      return 'Physical Project';
    case 'programme':
      return 'National Programme';
    case 'policy':
      return 'Statutory Policy';
    case 'economic_reform':
      return 'Economic Reform';
    case 'institutional_reform':
      return 'Institutional Reform';
    default:
      return type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Public Record';
  }
}

function getStatusBadge(status?: string) {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'achieved':
      return {
        label: 'Completed',
        bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
        icon: CheckCircle2,
      };
    case 'ongoing':
    case 'in_progress':
      return {
        label: 'Ongoing',
        bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
        icon: Clock,
      };
    default:
      return {
        label: 'Verified',
        bg: 'bg-slate-800 text-slate-300 border-slate-700',
        icon: AlertCircle,
      };
  }
}

export const AIRecordCard: React.FC<AIRecordCardProps> = ({ record }) => {
  const status =
    ('implementationStatus' in record && record.implementationStatus) ||
    'completed';
  const statusBadge = getStatusBadge(status);
  const StatusIcon = statusBadge.icon;

  const targetRoute =
    record.route ||
    (record.slug ? `/records/${record.slug}` : `/records/${record.externalId}`);

  const primarySector =
    record.sectors && record.sectors.length > 0
      ? typeof record.sectors[0] === 'string'
        ? record.sectors[0]
        : record.sectors[0]?.label || 'Cross-Sectoral'
      : 'Cross-Sectoral';

  const primaryGeo =
    ('geographies' in record && record.geographies?.[0]?.name) ||
    ('primaryState' in record && record.primaryState) ||
    'National Scope';

  return (
    <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all duration-150 group">
      <div>
        {/* Header: Type & Status */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            {formatRecordType(record.recordType)}
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${statusBadge.bg}`}
          >
            <StatusIcon className="w-2.5 h-2.5" />
            <span>{statusBadge.label}</span>
          </span>
        </div>

        {/* Title */}
        <h4 className="font-sans font-semibold text-xs sm:text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1.5 leading-snug">
          {record.title}
        </h4>

        {/* Summary */}
        {'summary' in record && record.summary && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {record.summary}
          </p>
        )}
      </div>

      {/* Footer: Metadata & Link */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <span className="truncate">{primarySector}</span>
          <span>•</span>
          <span className="text-slate-400 font-mono text-[10px]">{primaryGeo}</span>
        </div>

        <Link
          to={targetRoute}
          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium whitespace-nowrap shrink-0 group-hover:underline text-[11px]"
        >
          <span>Open Record</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default AIRecordCard;
