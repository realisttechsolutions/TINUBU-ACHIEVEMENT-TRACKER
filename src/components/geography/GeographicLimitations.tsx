import React from "react";
import { AlertCircle } from "lucide-react";

export const GeographicLimitations: React.FC = () => {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 p-6 md:p-8 rounded-2xl border border-amber-200 dark:border-amber-900 text-xs md:text-sm text-amber-900 dark:text-amber-200 space-y-3">
      <div className="flex items-center gap-2 font-bold text-base text-amber-800 dark:text-amber-300">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <h3>Geographic Data Limitations & Non-Ranking Statement</h3>
      </div>
      <p>
        <strong>1. Absence of Records is Not Zero Impact:</strong> The omission of specific state-level project entries does not indicate an absence of federal government investment in that state. It indicates that independent verification for that specific entry remains underway.
      </p>
      <p>
        <strong>2. No Unsupported Performance Scores:</strong> States are presented neutrally by Geopolitical Zone. Map colors indicate geographic zones, NOT governance performance rankings or political scoring.
      </p>
    </div>
  );
};

export default GeographicLimitations;
