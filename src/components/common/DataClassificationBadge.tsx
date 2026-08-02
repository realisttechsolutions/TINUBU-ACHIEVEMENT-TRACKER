import React from "react";
import { CheckCircle, Info, Calculator, TrendingUp, Target, ExternalLink } from "lucide-react";

export type DataClassification =
  | "Actual"
  | "Provisional"
  | "Estimated"
  | "Projected"
  | "Government Target"
  | "Independently Reported";

interface DataClassificationBadgeProps {
  classification: DataClassification;
  size?: "sm" | "md";
  className?: string;
}

const classificationMap: Record<
  DataClassification,
  { label: string; style: string; icon: React.ElementType }
> = {
  Actual: {
    label: "Actual",
    style: "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold",
    icon: CheckCircle,
  },
  Provisional: {
    label: "Provisional",
    style: "bg-sky-50 text-sky-800 border-sky-200",
    icon: Info,
  },
  Estimated: {
    label: "Estimated",
    style: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Calculator,
  },
  Projected: {
    label: "Projected",
    style: "bg-indigo-50 text-indigo-800 border-indigo-200 border-dashed",
    icon: TrendingUp,
  },
  "Government Target": {
    label: "Government Target",
    style: "bg-purple-50 text-purple-800 border-purple-200 border-dashed",
    icon: Target,
  },
  "Independently Reported": {
    label: "Independently Reported",
    style: "bg-teal-50 text-teal-900 border-teal-300 font-medium",
    icon: ExternalLink,
  },
};

export const DataClassificationBadge: React.FC<DataClassificationBadgeProps> = ({
  classification,
  size = "md",
  className = "",
}) => {
  const config = classificationMap[classification] || classificationMap["Actual"];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded border ${config.style} ${sizeClasses[size]} ${className}`}
      title={`Data Classification: ${config.label}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export default DataClassificationBadge;
