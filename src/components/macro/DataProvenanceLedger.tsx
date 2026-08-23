import React from 'react';
import {
  ShieldCheck,
  Building2,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  Globe
} from 'lucide-react';
import { ProvenanceSourceRecord } from '@/types/macro.types';

interface DataProvenanceLedgerProps {
  sources: ProvenanceSourceRecord[];
}

export const DataProvenanceLedger: React.FC<DataProvenanceLedgerProps> = ({ sources }) => {
  return (
    <section
      aria-labelledby="provenance-ledger-heading"
      className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 pb-2">
        <span className="p-1.5 rounded-md bg-gov-navy/10 dark:bg-gov-navy/40 text-gov-navy dark:text-gov-gold">
          <ShieldCheck className="w-4 h-4 text-status-green" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
          STATUTORY AUTHORITY AUDIT LEDGER
        </span>
      </div>

      <h2 id="provenance-ledger-heading" className="text-lg sm:text-xl font-bold text-foreground">
        Data Freshness & Provenance Ledger
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-3xl">
        Every macroeconomic metric in this observatory is retrieved from legally mandated Nigerian statutory authorities under open government statistical protocols.
      </p>

      {/* Grid of Statutory Authorities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {sources.map((source) => (
          <div
            key={source.institutionCode}
            className="p-4 rounded-xl bg-muted/20 border border-border/80 flex flex-col justify-between hover:border-gov-gold/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/50">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-gov-navy text-gov-gold dark:bg-gov-gold/20 dark:text-gov-gold">
                    {source.institutionCode}
                  </span>
                  <span className="text-xs font-bold text-foreground truncate">
                    {source.institutionName}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-status-green bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  CONFIRMED
                </span>
              </div>

              {/* Legal Mandate */}
              <div className="mt-3">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  Statutory Mandate
                </span>
                <p className="text-xs text-foreground/90 font-medium mt-0.5">
                  {source.legalMandate}
                </p>
              </div>

              {/* Monitored Datasets */}
              <div className="mt-3">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                  Monitored Macro Datasets
                </span>
                <div className="flex flex-wrap gap-1">
                  {source.monitoredDatasets.map((dataset, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-card border border-border/60 text-muted-foreground"
                    >
                      {dataset}
                    </span>
                  ))}
                </div>
              </div>

              {/* Latest Bulletin */}
              <div className="mt-3">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  Latest Official Bulletin
                </span>
                <p className="text-xs font-mono text-foreground mt-0.5">
                  {source.latestReleaseBulletin}
                </p>
              </div>
            </div>

            {/* Link to Source */}
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
              <span className="text-[10px] text-muted-foreground font-mono">
                Cycle: {source.publicationCycle}
              </span>
              <a
                href={source.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gov-navy dark:text-gov-gold hover:underline flex items-center gap-1"
              >
                <span>Access Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DataProvenanceLedger;
