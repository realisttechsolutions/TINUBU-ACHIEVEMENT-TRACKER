import React from "react";
import { PolicyStatus } from "@/types/policy.types";
import { Badge } from "@/components/ui/badge";

interface PolicyStatusBadgeProps {
  status: PolicyStatus | string;
}

export const PolicyStatusBadge: React.FC<PolicyStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "announced":
    case "proposed":
      return (
        <Badge className="bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 font-semibold text-[11px]">
          Announced
        </Badge>
      );
    case "approved":
    case "enacted":
      return (
        <Badge className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 font-semibold text-[11px]">
          Enacted / Legal Assent
        </Badge>
      );
    case "implementation-ongoing":
    case "partially-implemented":
      return (
        <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 font-semibold text-[11px]">
          Implementation Ongoing
        </Badge>
      );
    case "effective":
    case "fully-implemented":
    case "operational":
      return (
        <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 font-bold text-[11px]">
          Effective & Operational
        </Badge>
      );
    case "outcome-reported":
    case "independently-assessed":
      return (
        <Badge className="bg-gov-gold/20 text-gov-navy dark:text-gov-gold border-gov-gold font-extrabold text-[11px]">
          Impact Audited
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          Policy Active
        </Badge>
      );
  }
};

export default PolicyStatusBadge;