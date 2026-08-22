'use client';

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "@/lib/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  ChevronDown, 
  Building2, 
  FileText, 
  Users, 
  Database, 
  Download, 
  ShieldCheck, 
  LayoutDashboard,
  Sparkles
} from "lucide-react";
import { CANONICAL_SECTORS, CANONICAL_PUBLIC_GROUPS } from "@/adapters/canonicalData";

export const DesktopNavigation: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="hidden xl:flex items-center space-x-0.5 2xl:space-x-1 font-sans text-xs 2xl:text-sm font-medium shrink-0"
      aria-label="Main Navigation"
      ref={menuRef}
    >
      {/* 1. Direct Links */}
      <Link
        to="/ai"
        className={`px-2 2xl:px-2.5 py-1.5 2xl:py-2 rounded-md transition-all whitespace-nowrap inline-flex items-center gap-1.5 ${
          isActive("/ai")
            ? "text-cyan-700 dark:text-cyan-300 font-bold bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-500/40 shadow-sm"
            : "text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 hover:bg-cyan-50/60 dark:hover:bg-cyan-950/30"
        }`}
      >
        <Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
        <span className="font-bold">PTAT AI</span>
      </Link>

      <Link
        to="/achievements"
        className={`px-2 2xl:px-3 py-1.5 2xl:py-2 rounded-md transition-colors whitespace-nowrap ${
          isActive("/achievements") 
            ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10" 
            : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
        }`}
      >
        {t("navigation.achievements", { defaultValue: "Achievements" })}
      </Link>


      {/* 2. Sectors Mega Dropdown (5 Groups -> 15 Canonical Sectors) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "sectors" ? null : "sectors")}
          onMouseEnter={() => setOpenMenu("sectors")}
          aria-expanded={openMenu === "sectors"}
          className={`px-2 2xl:px-3 py-1.5 2xl:py-2 rounded-md inline-flex items-center gap-1 2xl:gap-1.5 transition-colors whitespace-nowrap ${
            location.pathname.startsWith("/sectors")
              ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10"
              : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
          }`}
        >
          <span>{t("navigation.sectors", { defaultValue: "Sectors" })}</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openMenu === "sectors" ? "rotate-180 text-gov-gold" : ""}`} />
        </button>

        {openMenu === "sectors" && (
          <div
            onMouseLeave={() => setOpenMenu(null)}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[820px] bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl shadow-2xl p-6 z-50 animate-fade-in"
          >
            <div className="flex items-center justify-between border-b border-gov-border pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gov-navy dark:text-white uppercase tracking-wider">
                  {t("navigation.canonicalResearchSectors", { defaultValue: "15 Canonical Research Sectors" })}
                </h3>
                <p className="text-xs text-gov-slate mt-0.5">
                  {t("navigation.organizedUnderGroups", { defaultValue: "Organized under 5 Public Navigation Groups" })}
                </p>
              </div>
              <Link
                to="/sectors"
                onClick={() => setOpenMenu(null)}
                className="text-xs font-semibold text-gov-emerald hover:underline"
              >
                {t("navigation.viewSectorsDirectory", { defaultValue: "View Sectors Directory →" })}
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {CANONICAL_PUBLIC_GROUPS.map((group) => {
                const groupSectors = CANONICAL_SECTORS.filter(s => s.parentPublicGroup === group.id);
                return (
                  <div key={group.id} className="space-y-2">
                    <div className="text-xs font-bold text-gov-gold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gov-gold" />
                      <span>{group.label}</span>
                    </div>
                    <ul className="space-y-1">
                      {groupSectors.map((sector) => (
                        <li key={sector.id}>
                          <Link
                            to={`/sectors/${sector.slug}`}
                            onClick={() => setOpenMenu(null)}
                            className={`text-xs block px-2 py-1.5 rounded hover:bg-gov-canvas dark:hover:bg-white/10 transition-colors ${
                              location.pathname === `/sectors/${sector.slug}`
                                ? "font-bold text-gov-navy dark:text-white bg-gov-canvas"
                                : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
                            }`}
                          >
                            {sector.publicLabel}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Initiatives Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "initiatives" ? null : "initiatives")}
          onMouseEnter={() => setOpenMenu("initiatives")}
          aria-expanded={openMenu === "initiatives"}
          className={`px-2 2xl:px-3 py-1.5 2xl:py-2 rounded-md inline-flex items-center gap-1 2xl:gap-1.5 transition-colors whitespace-nowrap ${
            location.pathname === "/projects" || location.pathname === "/policies" || location.pathname === "/programmes"
              ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10"
              : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
          }`}
        >
          <span>{t("navigation.initiatives", { defaultValue: "Initiatives" })}</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openMenu === "initiatives" ? "rotate-180 text-gov-gold" : ""}`} />
        </button>

        {openMenu === "initiatives" && (
          <div
            onMouseLeave={() => setOpenMenu(null)}
            className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl shadow-xl p-3 z-50 animate-fade-in"
          >
            <div className="space-y-1">
              <Link
                to="/projects"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gov-canvas dark:hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">
                    {t("navigation.capitalProjects", { defaultValue: "Capital Projects" })}
                  </div>
                  <div className="text-[11px] text-gov-slate">
                    {t("navigation.capitalProjectsDesc", { defaultValue: "Highways, rail, ports & housing" })}
                  </div>
                </div>
              </Link>

              <Link
                to="/policies"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gov-canvas dark:hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">
                    {t("navigation.policiesReforms", { defaultValue: "Policies & Reforms" })}
                  </div>
                  <div className="text-[11px] text-gov-slate">
                    {t("navigation.policiesReformsDesc", { defaultValue: "Gazettes, acts & executive orders" })}
                  </div>
                </div>
              </Link>

              <Link
                to="/programmes"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gov-canvas dark:hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">
                    {t("navigation.socialProgrammes", { defaultValue: "Social Programmes" })}
                  </div>
                  <div className="text-[11px] text-gov-slate">
                    {t("navigation.socialProgrammesDesc", { defaultValue: "Student aid, credit & welfare" })}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 4. Geography & Map */}
      <Link
        to="/impact-map"
        className={`px-2 2xl:px-3 py-1.5 2xl:py-2 rounded-md transition-colors whitespace-nowrap ${
          isActive("/impact-map") 
            ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10" 
            : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
        }`}
      >
        {t("navigation.impactMap", { defaultValue: "Nigeria Map" })}
      </Link>

      {/* 5. Timeline */}
      <Link
        to="/timeline"
        className={`px-2 2xl:px-3 py-1.5 2xl:py-2 rounded-md transition-colors whitespace-nowrap ${
          isActive("/timeline") 
            ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10" 
            : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
        }`}
      >
        {t("navigation.timeline", { defaultValue: "Timeline" })}
      </Link>

      {/* 6. Data & Evidence Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "data" ? null : "data")}
          onMouseEnter={() => setOpenMenu("data")}
          aria-expanded={openMenu === "data"}
          className={`px-2 2xl:px-3 py-1.5 2xl:py-2 rounded-md inline-flex items-center gap-1 2xl:gap-1.5 transition-colors whitespace-nowrap ${
            location.pathname === "/data" || location.pathname === "/data-sources" || location.pathname === "/downloads" || location.pathname === "/dashboard"
              ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10"
              : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
          }`}
        >
          <span>{t("navigation.evidenceAndData", { defaultValue: "Evidence & Data" })}</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openMenu === "data" ? "rotate-180 text-gov-gold" : ""}`} />
        </button>

        {openMenu === "data" && (
          <div
            onMouseLeave={() => setOpenMenu(null)}
            className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl shadow-xl p-3 z-50 animate-fade-in"
          >
            <div className="space-y-1">
              <Link
                to="/data"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gov-canvas dark:hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">
                    {t("navigation.data", { defaultValue: "Data Explorer" })}
                  </div>
                  <div className="text-[11px] text-gov-slate">
                    {t("navigation.dataExplorerDesc", { defaultValue: "Interactive multi-filter queries" })}
                  </div>
                </div>
              </Link>

              <Link
                to="/data-sources"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gov-canvas dark:hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">
                    {t("navigation.dataSources", { defaultValue: "Sources & Hierarchy" })}
                  </div>
                  <div className="text-[11px] text-gov-slate">
                    {t("navigation.dataSourcesDesc", { defaultValue: "6-tier primary evidence registry" })}
                  </div>
                </div>
              </Link>

              <Link
                to="/downloads"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gov-canvas dark:hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  <Download className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">
                    {t("navigation.downloads", { defaultValue: "Download Centre" })}
                  </div>
                  <div className="text-[11px] text-gov-slate">
                    {t("navigation.downloadsDesc", { defaultValue: "CSV, JSON & PDF datasets" })}
                  </div>
                </div>
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gov-canvas dark:hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">
                    {t("navigation.dashboard", { defaultValue: "Macro Dashboard" })}
                  </div>
                  <div className="text-[11px] text-gov-slate">
                    {t("navigation.dashboardDesc", { defaultValue: "Progress analytics & funnels" })}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DesktopNavigation;
