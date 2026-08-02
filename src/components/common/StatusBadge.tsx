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
  HelpCircle,
  LucideIcon
} from "lucide-react";

export type AchievementStatus =
  | "Announced"
  | "Approved"
  | "Funded"
  | "Procurement Stage"
  | "Implementation Ongoing"
  | "Partially Delivered"
  | "Completed"
  | "Operational"
  | "Outcome Recorded"
  | "Independently Confirmed"
  | "Archived"
  | "Under Review";

interface StatusBadgeProps {
  status: AchievementStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: LucideIcon;
}

const statusMap: Record<AchievementStatus, StatusConfig> = {
  Announced: {
    label: "Announced",
    bgColor: "bg-amber-50 text-amber-800 border-amber-200",
    textColor: "text-amber-800",
    borderColor: "border-amber-200",
    icon: Megaphone,
  },
  Approved: {
    label: "Approved",
    bgColor: "bg-blue-50 text-blue-800 border-blue-200",
    textColor: "text-blue-800",
    borderColor: "border-blue-200",
    icon: FileCheck,
  },
  Funded: {
    label: "Funded",
    bgColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    textColor: "text-emerald-800",
    borderColor: "border-emerald-200",
    icon: DollarSign,
  },
  "Procurement Stage": {
    label: "Procurement Stage",
    bgColor: "bg-slate-50 text-slate-700 border-slate-200",
    textColor: "text-slate-700",
    borderColor: "border-slate-200",
    icon: ShoppingBag,
  },
  "Implementation Ongoing": {
    label: "Implementation Ongoing",
    bgColor: "bg-sky-50 text-sky-800 border-sky-200",
    textColor: "text-sky-800",
    borderColor: "border-sky-200",
    icon: Clock,
  },
  "Partially Delivered": {
    label: "Partially Delivered",
    bgColor: "bg-amber-50 text-amber-900 border-amber-300",
    textColor: "text-amber-900",
    borderColor: "border-amber-300",
    icon: Activity,
  },
  Completed: {
    label: "Completed",
    bgColor: "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold",
    textColor: "text-emerald-900",
    borderColor: "border-emerald-300",
    icon: CheckCircle2,
  },
  Operational: {
    label: "Operational",
    bgColor: "bg-emerald-700 text-white border-emerald-800 font-semibold",
    textColor: "text-white",
    borderColor: "border-emerald-800",
    icon: Activity,
  },
  "Outcome Recorded": {
    label: "Outcome Recorded",
    bgColor: "bg-indigo-50 text-indigo-900 border-indigo-200",
    textColor: "text-indigo-900",
    borderColor: "border-indigo-200",
    icon: Award,
  },
  "Independently Confirmed": {
    label: "Independently Confirmed",
    bgColor: "bg-emerald-50 text-emerald-950 border-emerald-400 font-semibold",
    textColor: "text-emerald-950",
    borderColor: "border-emerald-400",
    icon: ShieldCheck,
  },
  Archived: {
    label: "Archived",
    bgColor: "bg-slate-100 text-slate-600 border-slate-200",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
    icon: Archive,
  },
  "Under Review": {
    label: "Under Review",
    bgColor: "bg-orange-50 text-orange-800 border-orange-200",
    textColor: "text-orange-800",
    borderColor: "border-orange-200",
    icon: HelpCircle,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  className = "",
}) => {
  const config = statusMap[status] || statusMap["Under Review"];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-medium gap-1.5",
    lg: "px-3 py-1.5 text-sm font-medium gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${config.bgColor} ${sizeClasses[size]} ${className}`}
      title={`Status: ${config.label}`}
    >
      <Icon className={`${iconSizes[size]} shrink-0`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
