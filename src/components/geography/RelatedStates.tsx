import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { StateRecord } from "@/types/geography.types";

interface RelatedStatesProps {
  relatedStates: StateRecord[];
  zoneName: string;
}

export const RelatedStates: React.FC<RelatedStatesProps> = ({ relatedStates, zoneName }) => {
  if (relatedStates.length === 0) return null;

  return (
    <section className="pt-8 border-t border-gov-border">
      <h3 className="text-lg font-bold text-gov-navy dark:text-white mb-4">
        Other States in {zoneName} Zone
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {relatedStates.map((rel) => (
          <Link
            key={rel.code}
            to={`/states/${rel.slug}`}
            className="p-4 rounded-xl border border-gov-border bg-white dark:bg-gov-navy/30 hover:border-gov-emerald transition-colors flex items-center justify-between group"
          >
            <div>
              <h4 className="font-bold text-sm text-gov-navy dark:text-white group-hover:text-gov-emerald">{rel.name}</h4>
              <p className="text-xs text-gov-slate">Capital: {rel.capital}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gov-slate group-hover:text-gov-emerald shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedStates;
