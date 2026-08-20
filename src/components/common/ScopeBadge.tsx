import React from "react";
import { Globe, MapPin, Layers, Navigation, Building2, Compass } from "lucide-react";
import { ScopeDisplayInfo, GeographicScopeType } from "@/adapters/types";
import { deriveGeographicScope } from "@/utils/geographyScope";
import { cn } from "@/lib/utils";

interface ScopeBadgeProps {
  scopeInfo?: ScopeDisplayInfo | null;
  scope?: GeographicScopeType | string;
  label?: string;
  title?: string;
  summary?: string;
  statesCovered?: string[];
  selectedState?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ScopeBadge: React.FC<ScopeBadgeProps> = ({
  scopeInfo,
  scope: rawScope,
  label: customLabel,
  title,
  summary,
  statesCovered,
  selectedState,
  className,
  size = "sm",
}) => {
  // If scopeInfo is directly provided, use its configuration
  let scope: GeographicScopeType = "nationwide";
  let displayLabel = customLabel || "Nationwide";

  if (scopeInfo) {
    scope = scopeInfo.scope;
    displayLabel = customLabel || scopeInfo.label;
  } else if (title || summary || (statesCovered && statesCovered.length > 0)) {
    const derived = deriveGeographicScope({ title, summary, statesCovered }, selectedState);
    scope = derived.scope;
    displayLabel = customLabel || derived.label;
  } else if (rawScope) {
    scope = rawScope as GeographicScopeType;
    if (!customLabel) {
      if (scope === "nationwide") displayLabel = "Nationwide";
      else if (scope === "fct_specific") displayLabel = "FCT (Abuja)-Specific";
      else if (scope === "project_corridor") displayLabel = "Project Corridor";
      else if (scope === "multi_state") displayLabel = "Multi-State";
      else if (scope === "regional_zonal") displayLabel = "Regional";
      else if (scope === "state_specific") displayLabel = selectedState ? `${selectedState}-Specific` : "State-Specific";
    }
  }

  // Icons & Visual Style mapping per scope type
  let Icon = Globe;
  let styleClasses = "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200 border-slate-300 dark:border-slate-700";

  switch (scope) {
    case "state_specific":
      Icon = MapPin;
      styleClasses = "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-semibold";
      break;
    case "fct_specific":
      Icon = Building2;
      styleClasses = "bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-semibold";
      break;
    case "project_corridor":
      Icon = Navigation;
      styleClasses = "bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      break;
    case "multi_state":
      Icon = Layers;
      styleClasses = "bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800";
      break;
    case "regional_zonal":
      Icon = Compass;
      styleClasses = "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800";
      break;
    case "nationwide":
    default:
      Icon = Globe;
      styleClasses = "bg-gov-canvas dark:bg-white/5 text-gov-slate dark:text-gray-300 border-gov-border";
      break;
  }

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border shadow-xs transition-colors shrink-0",
        styleClasses,
        sizeClasses[size],
        className
      )}
      title={`Geographic Scope: ${displayLabel}`}
    >
      <Icon className={cn(iconSizes[size], "shrink-0")} aria-hidden="true" />
      <span className="truncate">{displayLabel}</span>
    </span>
  );
};

export default ScopeBadge;
