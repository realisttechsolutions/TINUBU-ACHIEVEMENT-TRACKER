'use client';

import React from "react";
import { CheckCircle2, ShieldCheck, HelpCircle, AlertCircle, FileText, Database, Sparkles } from "lucide-react";
import { DataValueNature, SourceOrigin, VerificationStatus } from "@/adapters/types";

export type DataClassification = string;

interface DataClassificationBadgeProps {
  type?: 'valueNature' | 'sourceOrigin' | 'verificationStatus' | 'evidenceProfile';
  value?: string;
  classification?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const DataClassificationBadge: React.FC<DataClassificationBadgeProps> = ({
  type = 'verificationStatus',
  value,
  classification,
  className = "",
  size = 'md'
}) => {
  const resolvedValue = value || classification || 'VERIFIED';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  if (type === 'valueNature') {
    return (
      <span className={`inline-flex items-center rounded-full font-medium border bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 ${sizeClasses} ${className}`}>
        <Sparkles className="w-3 h-3" />
        <span>{resolvedValue}</span>
      </span>
    );
  }

  if (type === 'sourceOrigin') {
    return (
      <span className={`inline-flex items-center rounded-full font-medium border bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 ${sizeClasses} ${className}`}>
        <Database className="w-3 h-3" />
        <span>{resolvedValue}</span>
      </span>
    );
  }

  if (type === 'evidenceProfile') {
    return (
      <span className={`inline-flex items-center rounded-full font-medium border bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 ${sizeClasses} ${className}`}>
        <FileText className="w-3 h-3" />
        <span>{resolvedValue}</span>
      </span>
    );
  }

  // Verification status default
  const isVerified = String(resolvedValue).toUpperCase().includes('VERIF') || String(resolvedValue).toUpperCase().includes('PRIMARY');
  const isPending = String(resolvedValue).toUpperCase().includes('PEND') || String(resolvedValue).toUpperCase().includes('QUALIF');

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${
      isVerified
        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
        : isPending
        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
        : 'bg-muted text-muted-foreground border-border'
    } ${sizeClasses} ${className}`}>
      {isVerified ? (
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
      ) : isPending ? (
        <AlertCircle className="w-3 h-3 text-amber-600" />
      ) : (
        <HelpCircle className="w-3 h-3" />
      )}
      <span>{resolvedValue}</span>
    </span>
  );
};

export default DataClassificationBadge;