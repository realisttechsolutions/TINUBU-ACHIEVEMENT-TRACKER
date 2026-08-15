'use client';

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "@/lib/navigation";
import { 
  ChevronDown, 
  Award, 
  Clock, 
  Compass, 
  Building2, 
  FileText, 
  Users, 
  Database, 
  Download, 
  ShieldCheck, 
  TrendingUp, 
  LayoutDashboard,
  Layers,
  MapPin
} from "lucide-react";
import { CANONICAL_SECTORS, CANONICAL_PUBLIC_GROUPS } from "@/adapters/canonicalData";

export const DesktopNavigation: React.FC = () => {
  const location = useLocation();
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
      className="hidden xl:flex items-center space-x-1 font-sans text-sm font-medium"
      aria-label="Main Navigation"
      ref={menuRef}
    >
      {/* 1. Direct Links */}
      <Link
        to="/"
        className={`px-3 py-2 rounded-md transition-colors ${
          isActive("/") 
            ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10" 
            : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
        }`}
      >
        Home
      </Link>

      <Link
        to="/achievements"
        className={`px-3 py-2 rounded-md transition-colors ${
          isActive("/achievements") 
            ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10" 
            : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
        }`}
      >
        Achievements
      </Link>

      {/* 2. Sectors Mega Dropdown (5 Groups -> 15 Canonical Sectors) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "sectors" ? null : "sectors")}
          onMouseEnter={() => setOpenMenu("sectors")}
          aria-expanded={openMenu === "sectors"}
          className={`px-3 py-2 rounded-md inline-flex items-center gap-1.5 transition-colors ${
            location.pathname.startsWith("/sectors")
              ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10"
              : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
          }`}
        >
          <span>Sectors</span>
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
                  15 Canonical Research Sectors
                </h3>
                <p className="text-xs text-gov-slate mt-0.5">
                  Organized under 5 Public Navigation Groups (Contract v1.1.2)
                </p>
              </div>
              <Link
                to="/sectors"
                onClick={() => setOpenMenu(null)}
                className="text-xs font-semibold text-gov-emerald hover:underline"
              >
                View Sectors Directory â†’
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
          className={`px-3 py-2 rounded-md inline-flex items-center gap-1.5 transition-colors ${
            location.pathname === "/projects" || location.pathname === "/policies" || location.pathname === "/programmes"
              ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10"
              : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
          }`}
        >
          <span>Initiatives</span>
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
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">Capital Projects</div>
                  <div className="text-[11px] text-gov-slate">Highways, rail, ports & housing</div>
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
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">Policies & Reforms</div>
                  <div className="text-[11px] text-gov-slate">Gazettes, acts & executive orders</div>
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
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">Social Programmes</div>
                  <div className="text-[11px] text-gov-slate">Student aid, credit & welfare</div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 4. Geography & Map */}
      <Link
        to="/impact-map"
        className={`px-3 py-2 rounded-md transition-colors ${
          isActive("/impact-map") 
            ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10" 
            : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
        }`}
      >
        Nigeria Map
      </Link>

      {/* 5. Timeline */}
      <Link
        to="/timeline"
        className={`px-3 py-2 rounded-md transition-colors ${
          isActive("/timeline") 
            ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10" 
            : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
        }`}
      >
        Timeline
      </Link>

      {/* 6. Data & Evidence Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "data" ? null : "data")}
          onMouseEnter={() => setOpenMenu("data")}
          aria-expanded={openMenu === "data"}
          className={`px-3 py-2 rounded-md inline-flex items-center gap-1.5 transition-colors ${
            location.pathname === "/data" || location.pathname === "/data-sources" || location.pathname === "/downloads" || location.pathname === "/dashboard"
              ? "text-gov-navy dark:text-white font-bold bg-gov-canvas dark:bg-white/10"
              : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
          }`}
        >
          <span>Evidence & Data</span>
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
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">Data Explorer</div>
                  <div className="text-[11px] text-gov-slate">Interactive multi-filter queries</div>
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
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">Sources & Hierarchy</div>
                  <div className="text-[11px] text-gov-slate">6-tier primary evidence registry</div>
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
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">Download Centre</div>
                  <div className="text-[11px] text-gov-slate">CSV, JSON & PDF datasets</div>
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
                  <div className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors">Macro Dashboard</div>
                  <div className="text-[11px] text-gov-slate">Progress analytics & funnels</div>
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
