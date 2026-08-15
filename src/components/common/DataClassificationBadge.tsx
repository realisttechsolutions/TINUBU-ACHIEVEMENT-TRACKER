import React from "react";
import { CheckCircle2, ShieldCheck, HelpCircle, AlertCircle, FileText, Database, Sparkles } from "lucide-react";
import { DataValueNature, SourceOrigin, VerificationStatus } from "@/adapters/types";

interface DataClassificationBadgeProps {
  type?: 'valueNature' | 'sourceOrigin' | 'verificationStatus' | 'evidenceProfile';
  value: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const DataClassificationBadge: React.FC<DataClassificationBadgeProps> = ({
  type = 'verificationStatus',
  value,
  className = "",
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  if (type === 'valueNature') {
    const isActual = value === 'actual';
    return (
      <span className={`inline-flex items-center rounded border ${isActual ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' : 'bg-amber-50 text-amber-800 border-amber-200'} ${sizeClasses} ${className}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${isActual ? 'bg-emerald-600' : 'bg-amber-500'}`} />
        <span className="capitalize">{value.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  if (type === 'sourceOrigin') {
    return (
      <span className={`inline-flex items-center rounded border bg-blue-50 text-blue-800 border-blue-200 ${sizeClasses} ${className}`}>
        <Database className="h-3 w-3 text-blue-600" />
        <span className="capitalize">{value.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  if (type === 'evidenceProfile') {
    return (
      <span className={`inline-flex items-center rounded border bg-purple-50 text-purple-800 border-purple-200 font-medium ${sizeClasses} ${className}`}>
        <FileText className="h-3 w-3 text-purple-600" />
        <span className="capitalize">{value.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  // Verification Status
  const isConfirmed = value === 'source_confirmed' || value === 'independently_corroborated';
  const isDisputed = value === 'disputed' || value === 'corrected';

  return (
    <span className={`inline-flex items-center rounded border ${
      isConfirmed 
        ? 'bg-gov-navy/10 text-gov-navy border-gov-navy/20 dark:bg-white/10 dark:text-white font-bold'
        : isDisputed
        ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
        : 'bg-amber-50 text-amber-800 border-amber-200'
    } ${sizeClasses} ${className}`}>
      {isConfirmed ? (
        <ShieldCheck className="h-3.5 w-3.5 text-gov-emerald" />
      ) : isDisputed ? (
        <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
      ) : (
        <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
      )}
      <span className="capitalize">{value.replace(/_/g, ' ')}</span>
    </span>
  );
};

export default DataClassificationBadge;
