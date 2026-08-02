import React from "react";
import { PolicyType } from "@/types/policy.types";
import { Badge } from "@/components/ui/badge";

interface PolicyTypeBadgeProps {
  type: PolicyType;
}

export const PolicyTypeBadge: React.FC<PolicyTypeBadgeProps> = ({ type }) => {
  switch (type) {
    case "legislation":
      return (
        <Badge variant="outline" className="text-[10px] font-extrabold uppercase border-purple-300 text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40">
          Statutory Act / Legislation
        </Badge>
      );
    case "executive-action":
      return (
        <Badge variant="outline" className="text-[10px] font-extrabold uppercase border-blue-300 text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40">
          Executive Order / Directive
        </Badge>
      );
    case "fiscal-reform":
      return (
        <Badge variant="outline" className="text-[10px] font-extrabold uppercase border-amber-300 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40">
          Fiscal & Revenue Reform
        </Badge>
      );
    case "monetary-financial-reform":
      return (
        <Badge variant="outline" className="text-[10px] font-extrabold uppercase border-emerald-300 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40">
          Monetary & FX Policy
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-[10px] font-bold uppercase border-gov-border">
          {type}
        </Badge>
      );
  }
};

export default PolicyTypeBadge;
