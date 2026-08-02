import React from "react";
import { Link } from "react-router-dom";
import BrandLockup from "./BrandLockup";
import { navigationGroups } from "@/navigation/navigation.config";
import { ShieldCheck, Info } from "lucide-react";

export const GlobalFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gov-navy text-white border-t border-gov-gold/20 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-4">
            <BrandLockup />
            <p className="text-xs text-gov-slate dark:text-gray-300 leading-relaxed pt-2">
              An evidence-driven national progress platform documenting, explaining, and visualising the achievements, policies, reforms, and measurable outcomes of President Bola Ahmed Tinubu's administration.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-gov-gold font-semibold">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Renewed Hope Progress Platform</span>
            </div>
          </div>

          {/* Column 2: Explore Navigation */}
          <div className="space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gov-gold">
              Explore Platform
            </h3>
            <ul className="space-y-2 text-xs">
              {navigationGroups
                .find((g) => g.id === "overview")
                ?.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Column 3: Sector Breakdown */}
          <div className="space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gov-gold">
              Sectors & Reforms
            </h3>
            <ul className="space-y-2 text-xs">
              {navigationGroups
                .find((g) => g.id === "sectors")
                ?.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Column 4: Evidence & Verification */}
          <div className="space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gov-gold">
              Evidence & Trust
            </h3>
            <ul className="space-y-2 text-xs">
              {navigationGroups
                .find((g) => g.id === "evidence")
                ?.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Section 23 Trust Statement */}
        <div className="p-4 rounded-lg bg-gov-darkSurface border border-gov-border/40 flex items-start gap-3 text-xs text-gray-300">
          <Info className="h-4 w-4 text-gov-gold shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Institutional Disclaimer:</strong> Information is compiled from cited public and official institutional records (including NBS, CBN, Ministry gazettes, and international reporting bodies). Referencing an institution or data source does not imply formal partnership or commercial endorsement.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Standards */}
        <div className="pt-8 border-t border-gov-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gov-slate">
          <p>© {currentYear} Tinubu Achievement Tracker. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/data-sources" className="hover:text-white transition-colors">
              Data Methodology
            </Link>
            <Link to="/downloads" className="hover:text-white transition-colors">
              Public Reports
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
