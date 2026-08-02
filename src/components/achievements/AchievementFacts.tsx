import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Calendar, Award } from "lucide-react";
import { AchievementRecord } from "@/types/achievement";

interface AchievementFactsProps {
  achievement: AchievementRecord;
}

export const AchievementFacts: React.FC<AchievementFactsProps> = ({ achievement }) => {
  return (
    <Card className="border-gov-border dark:bg-gov-navy/30">
      <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-gov-slate uppercase font-bold text-[10px] block">Sector</span>
          <span className="font-bold text-gov-navy dark:text-white flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-gov-gold" />
            {achievement.sector}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-gov-slate uppercase font-bold text-[10px] block">Lead Implementing Agency</span>
          <span className="font-bold text-gov-navy dark:text-white flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-gov-emerald" />
            {achievement.leadMinistryOrAgency}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-gov-slate uppercase font-bold text-[10px] block">Geographic Scope</span>
          <span className="font-bold text-gov-navy dark:text-white flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gov-gold" />
            {achievement.beneficiariesOrScope || "National"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-gov-slate uppercase font-bold text-[10px] block">Reporting Date</span>
          <span className="font-bold text-gov-navy dark:text-white flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gov-emerald" />
            {achievement.dateAdded}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementFacts;
