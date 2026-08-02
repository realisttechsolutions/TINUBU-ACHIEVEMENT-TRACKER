import React from "react";
import { Clock } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { AchievementMilestone } from "@/types/achievement";

interface AchievementMilestoneTimelineProps {
  milestones?: AchievementMilestone[];
}

export const AchievementMilestoneTimeline: React.FC<AchievementMilestoneTimelineProps> = ({
  milestones,
}) => {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gov-border/60 pb-3">
        <Clock className="h-4 w-4 text-gov-gold" />
        <h3 className="text-base font-bold font-display text-gov-navy dark:text-white">
          Implementation Milestones & Timeline
        </h3>
      </div>

      <div className="relative border-l-2 border-gov-gold/40 ml-3 space-y-5 pl-6 py-1">
        {milestones.map((m, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Bullet */}
            <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-gov-navy border-2 border-gov-gold group-hover:bg-gov-emerald transition-colors" />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gov-navy dark:text-white font-display">
                  {m.date}
                </span>
                <StatusBadge status={m.status} size="sm" />
              </div>

              <h4 className="text-sm font-bold text-gov-navy dark:text-white">
                {m.title}
              </h4>

              <p className="text-xs text-gov-slate leading-relaxed">
                {m.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementMilestoneTimeline;
