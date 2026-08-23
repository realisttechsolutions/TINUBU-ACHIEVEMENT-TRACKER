import React, { useState } from 'react';
import Link from 'next/link';
import {
  GitBranch,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Layers,
  ExternalLink
} from 'lucide-react';
import { ReformTransmissionNode } from '@/types/macro.types';

interface ReformTransmissionMatrixProps {
  nodes: ReformTransmissionNode[];
  onSelectIndicator?: (id: string) => void;
}

export const ReformTransmissionMatrix: React.FC<ReformTransmissionMatrixProps> = ({
  nodes,
  onSelectIndicator
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <section
      aria-labelledby="transmission-matrix-heading"
      className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 pb-2">
        <span className="p-1.5 rounded-md bg-gov-navy/10 dark:bg-gov-navy/40 text-gov-navy dark:text-gov-gold">
          <GitBranch className="w-4 h-4 text-gov-gold" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
          POLICY TRANSMISSION MODEL
        </span>
      </div>

      <h2 id="transmission-matrix-heading" className="text-lg sm:text-xl font-bold text-foreground">
        Reform → Economy Transmission Matrix
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-3xl">
        Tracing how executive policies filter through transmission channels into observed statutory macro indicators.
      </p>

      {/* Interactive Reform Selector Tabs */}
      <div
        role="tablist"
        aria-label="Presidential Reforms"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-5"
      >
        {nodes.map((node) => {
          const isActive = node.id === activeNode.id;
          return (
            <button
              key={node.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedNodeId(node.id)}
              className={`p-3 rounded-lg text-left transition-all border ${
                isActive
                  ? 'bg-gov-navy text-white dark:bg-gov-gold/20 dark:text-gov-gold border-gov-gold/50 shadow-xs'
                  : 'bg-muted/40 text-foreground hover:bg-muted border-border/60'
              }`}
            >
              <span className="text-[10px] font-mono uppercase block text-gov-gold/90 font-semibold">
                {node.inauguratedDate}
              </span>
              <span className="text-xs font-bold block mt-1 line-clamp-2">
                {node.reformTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Transmission Flow Card */}
      <div className="mt-5 p-5 rounded-xl bg-muted/20 border border-border space-y-4">
        {/* Mandate & Authority Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/50 text-xs">
          <div>
            <span className="text-muted-foreground font-mono uppercase text-[10px] block">Statutory Mandate</span>
            <span className="font-semibold text-foreground mt-0.5 block">{activeNode.mandate}</span>
          </div>
          <div className="sm:text-right">
            <span className="text-muted-foreground font-mono uppercase text-[10px] block">Executing Authority</span>
            <span className="font-semibold text-foreground mt-0.5 block">{activeNode.authority}</span>
          </div>
        </div>

        {/* 3-Step Transmission Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          {/* Step 1: Policy Action */}
          <div className="p-4 rounded-lg bg-card border border-border/80 relative">
            <div className="flex items-center space-x-2 text-xs font-semibold text-gov-navy dark:text-gov-gold mb-2">
              <span className="w-5 h-5 rounded-full bg-gov-gold/20 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Policy Mechanism</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeNode.policyMechanism}
            </p>
          </div>

          {/* Step 2: Transmission Channel */}
          <div className="p-4 rounded-lg bg-card border border-border/80 relative">
            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-2">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Transmission Channel</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeNode.transmissionChannel}
            </p>
          </div>

          {/* Step 3: Observed Macro Result */}
          <div className="p-4 rounded-lg bg-card border border-border/80 relative">
            <div className="flex items-center space-x-2 text-xs font-semibold text-status-green mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Statutory Observation</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeNode.statutoryObservation}
            </p>
          </div>
        </div>

        {/* Action Link to PTAT Record */}
        <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground font-mono text-[11px]">Associated Macro Indicators:</span>
            <div className="flex gap-1.5 flex-wrap">
              {activeNode.relatedIndicatorIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectIndicator?.(id)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted hover:bg-gov-gold/20 hover:text-gov-navy dark:hover:text-gov-gold text-foreground transition-colors border border-border/50"
                >
                  {id.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <Link
            href={
              activeNode.ptatRecordType === 'policy'
                ? `/policies/${activeNode.ptatRecordSlug}`
                : activeNode.ptatRecordType === 'programme'
                ? `/programmes/${activeNode.ptatRecordSlug}`
                : `/achievements/${activeNode.ptatRecordSlug}`
            }
            className="inline-flex items-center gap-1.5 font-semibold text-gov-navy dark:text-gov-gold hover:underline"
          >
            <span>Inspect Verified PTAT Record ({activeNode.ptatRecordTitle})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReformTransmissionMatrix;
