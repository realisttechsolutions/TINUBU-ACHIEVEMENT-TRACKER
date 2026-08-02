import React from "react";
import { InterventionStage } from "@/types/timeline.types";
import { Badge } from "@/components/ui/badge";

interface InterventionStageBadgeProps {
  stage: InterventionStage;
  showStepNumber?: boolean;
}

export const InterventionStageBadge: React.FC<InterventionStageBadgeProps> = ({
  stage,
  showStepNumber = true,
}) => {
  switch (stage) {
    case "announcement":
      return (
        <Badge className="bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 font-semibold text-[11px] gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
          {showStepNumber && "Stage 1: "}Announcement
        </Badge>
      );
    case "approval":
      return (
        <Badge className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 font-semibold text-[11px] gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-600"></span>
          {showStepNumber && "Stage 2: "}FEC / Legal Assent
        </Badge>
      );
    case "appropriation":
      return (
        <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 font-semibold text-[11px] gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
          {showStepNumber && "Stage 3: "}Fund Appropriation
        </Badge>
      );
    case "implementation":
      return (
        <Badge className="bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 font-semibold text-[11px] gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-600 animate-pulse"></span>
          {showStepNumber && "Stage 4: "}Work Ongoing
        </Badge>
      );
    case "operational":
      return (
        <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 font-bold text-[11px] gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
          {showStepNumber && "Stage 5: "}Operational / Live
        </Badge>
      );
    case "impact":
      return (
        <Badge className="bg-gov-gold/20 text-gov-navy dark:text-gov-gold border-gov-gold font-extrabold text-[11px] gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-gov-gold"></span>
          {showStepNumber && "Stage 6: "}Impact Audited
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          Policy Event
        </Badge>
      );
  }
};

export default InterventionStageBadge;
