import React from "react";
import { Link } from "@/lib/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { Database, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dataAdapter } from "@/adapters/dataAdapter";

export const ReportsResearchCTA: React.FC = () => {
  const { t } = useTranslation();
  const datasets = dataAdapter.getDatasets().slice(0, 3);

  const handleDownloadDemoCsv = (dsTitle: string) => {
    const records = dataAdapter.getAchievements().slice(0, 5);
    dataAdapter.exportToCsv(
      records.map(r => ({
        record_id: r.id,
        title: r.title,
        sector: r.sectorName,
        status: r.statusLabel,
        lead_mda: r.leadMda,
        date: r.date,
        summary: r.summary
      })),
      `${dsTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_dataset`
    );
  };

  return (
    <section className="py-16 bg-white dark:bg-gov-darkSurface">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gov-navy text-white p-8 sm:p-12 border-2 border-gov-gold/40 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gov-emerald/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Heading & Query Builder Link */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                <Database className="h-3.5 w-3.5 text-gov-emerald" />
                <span>{t("reportsCta.eyebrow", { defaultValue: "Comprehensive Evidence Archive" })}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display leading-tight text-white">
                {t("reportsCta.title", { defaultValue: "Reports, Datasets & Public Research Downloads" })}
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
                {t("reportsCta.subtitle", { defaultValue: "Download audited spreadsheets, official gazette copies, and national progress summaries in CSV and JSON formats." })}
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gov-emerald hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 h-12 rounded-xl shadow-lg gap-2"
                  asChild
                >
                  <Link to="/data">
                    <Database className="h-4 w-4 text-gov-gold" />
                    <span>{t("hero.dataExplorer", { defaultValue: "Launch Data Explorer" })}</span>
                  </Link>
                </Button>

                <Button
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs sm:text-sm px-6 h-12 rounded-xl gap-2 shadow-sm transition-all inline-flex items-center justify-center focus:ring-2 focus:ring-gov-gold"
                  asChild
                >
                  <Link to="/downloads">
                    <Download className="h-4 w-4 text-gov-gold" />
                    <span>{t("reportsCta.downloadButton", { defaultValue: "Go to Download Centre" })}</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Dataset Download Cards */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-gov-gold uppercase tracking-wider px-1">
                {t("downloads.datasets", { defaultValue: "Statistical Datasets" })}
              </div>

              <div className="space-y-2.5">
                {datasets.map((ds) => (
                  <div
                    key={ds.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-gov-gold/40 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {ds.title}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {ds.recordCount} {t("common.achievement", { defaultValue: "Records" })} • {ds.periodCovered}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadDemoCsv(ds.title)}
                      className="px-3 py-1.5 rounded-lg bg-gov-emerald hover:bg-emerald-800 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                      title="Download Dataset (CSV)"
                    >
                      <Download className="h-3.5 w-3.5 text-gov-gold" />
                      <span>CSV</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportsResearchCTA;
