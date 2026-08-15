export type AchievementStatus = string;
import React from "react";
import { 
  Megaphone, 
  FileCheck, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Award, 
  ShieldCheck, 
  Archive, 
  AlertCircle,
  HelpCircle,
  LucideIcon
} from "lucide-react";

export interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface StatusConfig {
  label: string;
  className: string;
  icon: LucideIcon;
}

const statusConfigs: Record<string, StatusConfig> = {
  // Canonical snake_case codes
  proposed: { label: "Proposed", className: "bg-blue-50 text-blue-700 border-blue-200", icon: HelpCircle },
  announced: { label: "Announced", className: "bg-amber-50 text-amber-800 border-amber-200", icon: Megaphone },
  approved: { label: "Approved", className: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: FileCheck },
  enacted: { label: "Enacted into Law", className: "bg-indigo-100 text-indigo-900 border-indigo-300 font-semibold", icon: FileCheck },
  effective: { label: "In Force", className: "bg-indigo-50 text-indigo-800 border-indigo-200", icon: FileCheck },
  funded: { label: "Budget Allocated", className: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: DollarSign },
  funding_released: { label: "Funding Released", className: "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold", icon: DollarSign },
  procurement: { label: "In Procurement", className: "bg-slate-50 text-slate-700 border-slate-200", icon: ShoppingBag },
  implementation_planning: { label: "Planning Phase", className: "bg-amber-50 text-amber-800 border-amber-200", icon: Clock },
  implementation_ongoing: { label: "Ongoing Execution", className: "bg-sky-50 text-sky-800 border-sky-200", icon: Clock },
  partially_delivered: { label: "Partially Delivered", className: "bg-lime-50 text-lime-800 border-lime-200", icon: Activity },
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold", icon: CheckCircle2 },
  operational: { label: "Operational", className: "bg-gov-navy text-gov-gold border-gov-gold/40 font-bold", icon: Activity },
  outcome_reported: { label: "Outcome Reported", className: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: Award },
  independently_assessed: { label: "Independently Assessed", className: "bg-purple-50 text-purple-800 border-purple-200 font-semibold", icon: ShieldCheck },
  suspended: { label: "Suspended", className: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
  superseded: { label: "Superseded", className: "bg-gray-100 text-gray-700 border-gray-300", icon: Archive },
  repealed: { label: "Repealed", className: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
  under_review: { label: "Under Review", className: "bg-amber-50 text-amber-800 border-amber-200", icon: HelpCircle },
  archived: { label: "Archived", className: "bg-gray-100 text-gray-700 border-gray-300", icon: Archive },
  withdrawn: { label: "Withdrawn", className: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },

  // Human readable title mappings
  "Operational": { label: "Operational", className: "bg-gov-navy text-gov-gold border-gov-gold/40 font-bold", icon: Activity },
  "Completed": { label: "Completed", className: "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold", icon: CheckCircle2 },
  "Implementation Ongoing": { label: "Ongoing Execution", className: "bg-sky-50 text-sky-800 border-sky-200", icon: Clock },
  "Approved": { label: "Approved", className: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: FileCheck },
  "Announced": { label: "Announced", className: "bg-amber-50 text-amber-800 border-amber-200", icon: Megaphone }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  className = "",
}) => {
  const normalizedKey = status ? status.toLowerCase().replace(/\s+/g, '_') : 'under_review';
  const config = statusConfigs[status] || statusConfigs[normalizedKey] || {
    label: status || "Under Review",
    className: "bg-gray-100 text-gray-700 border-gray-300",
    icon: HelpCircle
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4"
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.className} ${sizeClasses[size]} ${className}`}
      title={`Implementation Status: ${config.label}`}
    >
      <Icon className={`${iconSizes[size]} shrink-0`} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
