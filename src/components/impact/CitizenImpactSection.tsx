import React from "react";
import { Users, HelpCircle, CheckCircle2, AlertCircle, Sparkles, BookOpen } from "lucide-react";
import { CitizenImpactViewModel, ImpactNature } from "@/adapters/types";
import { cn } from "@/lib/utils";

interface CitizenImpactSectionProps {
  impact?: CitizenImpactViewModel | null;
  className?: string;
}

const impactNatureLabels: Record<ImpactNature, { label: string; badgeClass: string }> = {
  observed_outcome: {
    label: "Observed Citizen Outcome",
    badgeClass: "bg-gov-emerald/10 text-gov-emerald border-gov-emerald/30",
  },
  intended_benefit: {
    label: "Intended Policy Benefit",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
  expected_effect: {
    label: "Expected Economic Impact",
    badgeClass: "bg-gov-gold/10 text-amber-800 dark:text-amber-300 border-gov-gold/30",
  },
  implementation_dependent: {
    label: "Implementation-Dependent Effect",
    badgeClass: "bg-gov-slate/10 text-gov-slate border-gov-slate/30",
  },
};

export const CitizenImpactSection: React.FC<CitizenImpactSectionProps> = ({
  impact,
  className,
}) => {
  // Hard Rule: If no structured impact content exists, render null (no empty placeholders)
  if (!impact || !impact.summary?.trim()) {
    return null;
  }

  const natureConfig = impact.impactNature ? impactNatureLabels[impact.impactNature] : null;

  return (
    <section
      className={cn(
        "rounded-3xl border-2 border-gov-emerald/30 bg-gradient-to-br from-white to-gov-canvas dark:from-gov-darkSurface dark:to-gov-darkSurface/90 p-6 sm:p-8 shadow-sm space-y-6",
        className
      )}
      aria-labelledby="citizen-impact-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gov-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gov-emerald/10 text-gov-emerald">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gov-emerald">
              Citizen Impact Foundation
            </p>
            <h2
              id="citizen-impact-heading"
              className="text-xl sm:text-2xl font-extrabold font-display text-gov-navy dark:text-white leading-tight"
            >
              What This Means for Nigerians
            </h2>
          </div>
        </div>

        {natureConfig && (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-center shrink-0",
              natureConfig.badgeClass
            )}
          >
            <Sparkles className="h-3 w-3" />
            {natureConfig.label}
          </span>
        )}
      </div>

      {/* Core Plain-English Summary */}
      <div className="rounded-2xl border border-gov-emerald/20 bg-gov-emerald/5 p-4 sm:p-5">
        <p className="text-sm sm:text-base font-medium leading-relaxed text-gov-navy dark:text-gray-100">
          {impact.summary}
        </p>
      </div>

      {/* Structured Subsections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Why It Matters */}
        {impact.significance && (
          <div className="rounded-2xl border border-gov-border bg-white dark:bg-white/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gov-gold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Why It Matters</span>
            </div>
            <p className="text-xs sm:text-sm text-gov-slate dark:text-gray-300 leading-relaxed">
              {impact.significance}
            </p>
          </div>
        )}

        {/* 2. Who It Affects / Beneficiaries */}
        {impact.beneficiaryGroups && impact.beneficiaryGroups.length > 0 && (
          <div className="rounded-2xl border border-gov-border bg-white dark:bg-white/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gov-emerald">
              <Users className="h-4 w-4" />
              <span>Who It Affects / Target Beneficiaries</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {impact.beneficiaryGroups.map((group, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-gov-canvas dark:bg-gov-darkSurface border border-gov-border text-xs font-semibold text-gov-navy dark:text-gray-200"
                >
                  {group}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. Practical Example */}
        {impact.practicalExample && (
          <div className="rounded-2xl border border-gov-border bg-white dark:bg-white/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <BookOpen className="h-4 w-4" />
              <span>Everyday Practical Example</span>
            </div>
            <p className="text-xs sm:text-sm text-gov-slate dark:text-gray-300 leading-relaxed">
              {impact.practicalExample}
            </p>
          </div>
        )}

        {/* 4. Important Context */}
        {impact.importantContext && (
          <div className="rounded-2xl border border-gov-border bg-white dark:bg-white/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <span>Important Policy Context</span>
            </div>
            <p className="text-xs sm:text-sm text-gov-slate dark:text-gray-300 leading-relaxed">
              {impact.importantContext}
            </p>
          </div>
        )}
      </div>

      {/* Clear Distinction from Evidence Baseline */}
      <div className="pt-2 text-[11px] text-gov-slate flex items-center gap-1.5 border-t border-gov-border/50">
        <HelpCircle className="h-3.5 w-3.5 text-gov-gold shrink-0" />
        <span>
          This section provides plain-English context for citizens. Canonical primary sources, verified claims, and official agency locators are documented in the Evidence section below.
        </span>
      </div>
    </section>
  );
};

export default CitizenImpactSection;
