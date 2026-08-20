import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { FileText, Calendar, CheckSquare, RefreshCw } from "lucide-react";

export const HomeTrustRail: React.FC = () => {
  const { t } = useTranslation();

  const trustItems = [
    {
      icon: FileText,
      title: t("trustRail.sourcesCited", { defaultValue: "Sources Cited" }),
      description: t("trustRail.sourcesCitedDesc", { defaultValue: "Official legislation, gazettes, NBS, CBN & international bodies." }),
    },
    {
      icon: Calendar,
      title: t("trustRail.reportingPeriods", { defaultValue: "Reporting Periods Stated" }),
      description: t("trustRail.reportingPeriodsDesc", { defaultValue: "Figures clearly anchored to specific fiscal periods and dates." }),
    },
    {
      icon: CheckSquare,
      title: t("trustRail.statusClassified", { defaultValue: "Status Classified" }),
      description: t("trustRail.statusClassifiedDesc", { defaultValue: "Announcements distinguished from ongoing implementation and delivery." }),
    },
    {
      icon: RefreshCw,
      title: t("trustRail.updatesDocumented", { defaultValue: "Updates Documented" }),
      description: t("trustRail.updatesDocumentedDesc", { defaultValue: "Continuous verification as official reports and data are released." }),
    },
  ];

  return (
    <section className="bg-gov-canvas border-b border-gov-border py-4 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gov-darkSurface border border-gov-border/60 shadow-xs"
              >
                <div className="p-2 rounded bg-gov-navy text-gov-gold shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-gov-navy dark:text-white leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gov-slate leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeTrustRail;
