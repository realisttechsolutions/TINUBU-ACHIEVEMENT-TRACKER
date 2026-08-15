import React from "react";
import { Link } from "@/lib/navigation";
import { ChevronRight, Scale, Building2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PolicyRecord } from "@/types/policy.types";
import PolicyStatusBadge from "./PolicyStatusBadge";
import PolicyTypeBadge from "./PolicyTypeBadge";

interface PolicyCardProps {
  policy: PolicyRecord;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-gov-border hover:border-gov-emerald dark:bg-gov-navy/30 flex flex-col justify-between group">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <PolicyStatusBadge status={policy.status} />
          <PolicyTypeBadge type={policy.policyType} />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gov-navy dark:text-white line-clamp-2 group-hover:text-gov-emerald transition-colors">
            <Link to={`/policies/${policy.slug}`}>
              {policy.title}
            </Link>
          </h3>
          {policy.authorityReference && (
            <p className="text-[11px] text-gov-gold font-semibold flex items-center gap-1">
              <Scale className="h-3 w-3 shrink-0" />
              <span className="truncate">{policy.authorityReference}</span>
            </p>
          )}
        </div>

        <p className="text-xs text-gov-slate line-clamp-3">
          {policy.summary}
        </p>

        <div className="bg-gov-canvas dark:bg-gov-navy/50 p-3 rounded-lg border border-gov-border/60 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gov-slate">Lead Agency:</span>
            <span className="font-semibold text-gov-navy dark:text-slate-200 truncate max-w-[160px]">{policy.leadAgency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gov-slate">Effective Date:</span>
            <span className="font-semibold text-gov-navy dark:text-slate-200">{policy.effectiveDate}</span>
          </div>
        </div>
      </CardContent>

      <div className="p-6 pt-0">
        <Link
          to={`/policies/${policy.slug}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-emerald transition-colors"
        >
          View Policy Implementation Page
          <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};

export default PolicyCard;
