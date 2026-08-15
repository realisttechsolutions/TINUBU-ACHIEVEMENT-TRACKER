import React from "react";
import { Info, Sparkles } from "lucide-react";

interface DemoWatermarkProps {
  compact?: boolean;
  className?: string;
}

export const DemoWatermark: React.FC<DemoWatermarkProps> = ({
  compact = false,
  className = ""
}) => {
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 ${className}`}>
        <Sparkles className="h-3 w-3 text-amber-500" />
        <span>DEMO / SYNTHETIC</span>
      </span>
    );
  }

  return (
    <div className={`p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center gap-2.5 text-xs ${className}`}>
      <Info className="h-4 w-4 text-amber-600 shrink-0" />
      <span>
        <strong>Prototype Verification Watermark:</strong> This record is a contract-compliant synthetic demonstration fixture prior to Research Mission 02 production ingestion.
      </span>
    </div>
  );
};

export default DemoWatermark;
