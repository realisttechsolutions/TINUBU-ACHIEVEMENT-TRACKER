import React from "react";
import { Link } from "@/lib/navigation";
import BrandLockup from "./BrandLockup";
import { ShieldCheck, Info, FileSpreadsheet, Download, Database, Compass, Award, ExternalLink } from "lucide-react";
import { CANONICAL_PUBLIC_GROUPS } from "@/adapters/canonicalData";

export const GlobalFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gov-navy text-white border-t border-gov-gold/30 font-sans" role="contentinfo">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand & Mandate (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLockup />
            <p className="text-xs text-gray-300 leading-relaxed pt-2">
              An evidence-driven national progress platform documenting, explaining, and visualising the verified achievements, capital infrastructure projects, structural reforms, and measurable public outcomes of President Bola Ahmed Tinubu's administration (29 May 2023 — August 2026).
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-gov-gold/40 text-xs text-gov-gold font-bold">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gov-emerald" />
              <span>Governing Standard: Research Contract v1.1.2</span>
            </div>
          </div>

          {/* Column 2: Core Explorers (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gov-gold">
              Explore Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/achievements" className="text-gray-300 hover:text-white transition-colors">
                  Achievements Explorer
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">
                  Capital Projects
                </Link>
              </li>
              <li>
                <Link to="/policies" className="text-gray-300 hover:text-white transition-colors">
                  Policies & Reforms
                </Link>
              </li>
              <li>
                <Link to="/programmes" className="text-gray-300 hover:text-white transition-colors">
                  Social Programmes
                </Link>
              </li>
              <li>
                <Link to="/impact-map" className="text-gray-300 hover:text-white transition-colors">
                  Nigeria Impact Map
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="text-gray-300 hover:text-white transition-colors">
                  Administration Timeline
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: 5 Sector Umbrella Groups (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gov-gold">
              5 Public Sector Groups
            </h3>
            <ul className="space-y-2 text-xs">
              {CANONICAL_PUBLIC_GROUPS.map((group) => (
                <li key={group.id}>
                  <Link
                    to={`/sectors`}
                    className="text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{group.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link to="/sectors" className="text-gov-emerald font-bold hover:underline">
                  View All 15 Canonical Sectors →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Evidence & Open Data (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gov-gold">
              Evidence & Open Data
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/data" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>Interactive Data Explorer</span>
                </Link>
              </li>
              <li>
                <Link to="/data-sources" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-gov-gold" />
                  <span>6-Tier Source Hierarchy</span>
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5 text-purple-400" />
                  <span>Dataset Download Centre</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-blue-400" />
                  <span>Macro Analytics Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Institutional Trust Disclaimer */}
        <div className="p-4 rounded-xl bg-gov-darkSurface border border-gov-gold/20 flex items-start gap-3 text-xs text-gray-300">
          <Info className="h-4 w-4 text-gov-gold shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Editorial & Truth Standard:</strong> The Tinubu Achievement Tracker operates an achievements-focused editorial mandate governed by 18 immutable truth safeguards. Presentation is positive and confident, but claims never exceed underlying verifiable primary evidence. Financial metrics declare exact value types and are never improperly aggregated across incompatible categories.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Standards */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gov-slate">
          <div>
            © {currentYear} Tinubu Achievement Tracker (TAT) • Renewed Hope Progress Intelligence
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <Link to="/data-sources" className="hover:text-white transition-colors">
              Methodology & Sources
            </Link>
            <span>•</span>
            <Link to="/downloads" className="hover:text-white transition-colors">
              Public Datasets
            </Link>
            <span>•</span>
            <span>Version 2.0 (2026 Edition)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
