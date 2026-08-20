import React from "react";
import { Link } from "@/lib/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { TrendingUp, GraduationCap, Building2, Landmark, ArrowRight, ShieldCheck } from "lucide-react";

export const NationalProgressOverview: React.FC = () => {
  const { t } = useTranslation();

  const cards = [
    {
      id: "metric-1",
      title: t("progressOverview.revenueTitle", { defaultValue: "Non-Oil Federal Revenue" }),
      value: t("progressOverview.revenueValue", { defaultValue: "₦19.8 Trillion" }),
      subtext: t("progressOverview.revenueSubtext", { defaultValue: "Automated tax compliance & historic statutory collection record" }),
      sector: t("navigation.economicReforms", { defaultValue: "Economy & Fiscal Reforms" }),
      leadMda: t("progressOverview.revenueMda", { defaultValue: "Federal Inland Revenue Service" }),
      icon: TrendingUp,
      badgeColor: "emerald",
      url: "/sectors/economy-fiscal-reforms"
    },
    {
      id: "metric-2",
      title: t("progressOverview.loanTitle", { defaultValue: "Student Loan Disbursements" }),
      value: t("progressOverview.loanValue", { defaultValue: "350,000+ Students" }),
      subtext: t("progressOverview.loanSubtext", { defaultValue: "Tuition and upkeep funded directly across 120+ tertiary institutions" }),
      sector: t("navigation.socialServices", { defaultValue: "Education & Human Capital" }),
      leadMda: t("progressOverview.loanMda", { defaultValue: "NELFUND" }),
      icon: GraduationCap,
      badgeColor: "gold",
      url: "/achievements/nelfund-student-loan-disbursement"
    },
    {
      id: "metric-3",
      title: t("progressOverview.highwayTitle", { defaultValue: "Active Highway Corridors" }),
      value: t("progressOverview.highwayValue", { defaultValue: "2,400+ Kilometers" }),
      subtext: t("progressOverview.highwaySubtext", { defaultValue: "Lagos-Calabar, Sokoto-Badagry, and regional arterial dualization" }),
      sector: t("navigation.infrastructure", { defaultValue: "Infrastructure & Transport" }),
      leadMda: t("progressOverview.highwayMda", { defaultValue: "Federal Ministry of Works" }),
      icon: Building2,
      badgeColor: "blue",
      url: "/projects"
    },
    {
      id: "metric-4",
      title: t("progressOverview.lgaTitle", { defaultValue: "LGA Direct Autonomy" }),
      value: t("progressOverview.lgaValue", { defaultValue: "774 Councils" }),
      subtext: t("progressOverview.lgaSubtext", { defaultValue: "Direct statutory federation allocations enforced by Supreme Court ruling" }),
      sector: t("navigation.governance", { defaultValue: "Governance & Public Service" }),
      leadMda: t("progressOverview.lgaMda", { defaultValue: "Federal Ministry of Justice" }),
      icon: Landmark,
      badgeColor: "purple",
      url: "/achievements/local-government-financial-autonomy"
    }
  ];

  return (
    <section className="py-14 bg-white dark:bg-gov-darkSurface border-b border-gov-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-gold uppercase tracking-wider mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-gov-emerald" />
              <span>{t("progressOverview.eyebrow", { defaultValue: "Measurable Administration Milestones" })}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-navy dark:text-white font-display">
              {t("progressOverview.title", { defaultValue: "National Progress at a Glance" })}
            </h2>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-gov-emerald hover:underline"
          >
            <span>{t("progressOverview.viewDashboard", { defaultValue: "View Full Macro Analytics Dashboard →" })}</span>
            <ArrowRight className="h-3.5 w-3.5 text-gov-gold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.url}
                className="p-6 rounded-2xl bg-gov-canvas dark:bg-white/5 border border-gov-border hover:border-gov-gold/40 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-gov-navy border border-gov-border/60 text-gov-navy dark:text-gov-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gov-slate">
                      {card.leadMda}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-gov-slate">
                      {card.title}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-display text-gov-navy dark:text-white tabular-nums tracking-tight group-hover:text-gov-emerald transition-colors">
                      {card.value}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gov-border/60 text-xs text-gov-slate leading-relaxed">
                  <p>{card.subtext}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NationalProgressOverview;
