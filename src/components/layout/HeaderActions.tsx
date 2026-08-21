'use client';
import React from "react";
import { Search, Download, Globe } from "lucide-react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeToggle from "../ui/ThemeToggle";

interface HeaderActionsProps {
  onOpenSearch: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ onOpenSearch }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {/* Global Search Trigger */}
      <button
        type="button"
        onClick={onOpenSearch}
        aria-label={t("accessibility.openSearch", { defaultValue: "Open search dialog" })}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md border border-gov-border bg-gov-canvas hover:bg-gov-border/30 text-gov-slate hover:text-gov-navy text-xs font-medium transition-colors"
      >
        <Search className="h-4 w-4 text-gov-navy" />
        <span className="hidden md:inline">{t("common.search", { defaultValue: "Search..." })}</span>
        <kbd className="hidden lg:inline-block text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-gov-border text-gov-slate">
          ⌘K
        </kbd>
      </button>

      {/* Desktop Language Selector */}
      <div className="hidden 2xl:flex items-center relative">
        <Globe className="h-4 w-4 text-gov-navy absolute left-2 pointer-events-none" />
        <select
          aria-label={t("accessibility.selectLanguage", { defaultValue: "Select platform language" })}
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          className="h-8 pl-7 pr-2 rounded-md border border-gov-border bg-gov-canvas text-xs font-semibold text-gov-navy focus:outline-none focus:ring-1 focus:ring-gov-navy cursor-pointer appearance-none"
        >
          {availableLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>

      {/* Theme Control */}
      <ThemeToggle />

      {/* Primary Header Action: Reports & Downloads */}
      <Button
        className="hidden 2xl:inline-flex bg-gov-emerald hover:bg-emerald-800 text-white font-medium text-xs px-3.5 py-1.5 h-8 gap-1.5 shadow-xs transition-colors"
        asChild
      >
        <Link to="/downloads">
          <Download className="h-3.5 w-3.5 text-gov-gold shrink-0" />
          <span>{t("navigation.reports", { defaultValue: "Reports" })}</span>
        </Link>
      </Button>
    </div>
  );
};

export default HeaderActions;
