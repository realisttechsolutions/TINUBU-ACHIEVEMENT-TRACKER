import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Download, Globe, Shield, ExternalLink } from "lucide-react";
import { navigationGroups } from "@/navigation/navigation.config";
import BrandLockup from "./BrandLockup";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import ThemeToggle from "../ui/ThemeToggle";

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key & manage scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in lg:hidden"
    >
      {/* Backdrop overlay trigger */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer Body */}
      <div className="relative w-full max-w-sm bg-white dark:bg-gov-darkSurface h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-gov-border z-10">
        {/* Header section */}
        <div className="p-4 border-b border-gov-border flex items-center justify-between bg-gov-canvas dark:bg-gov-navy/20">
          <BrandLockup compact onClick={onClose} />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-2 rounded-md text-gov-slate hover:text-gov-navy hover:bg-gov-border/40 focus:outline-none focus:ring-2 focus:ring-gov-navy"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="p-5 space-y-6 flex-grow">
          {navigationGroups.map((group) => (
            <div key={group.id} className="space-y-2">
              <h3 className="text-xs font-bold text-gov-slate uppercase tracking-wider px-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-gov-navy text-white font-semibold shadow-xs"
                          : "text-gov-text dark:text-gray-200 hover:bg-gov-canvas dark:hover:bg-gov-navy/30"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-gov-gold" : "text-gov-slate"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Action Button: Reports & Downloads */}
          <div className="pt-2">
            <Button
              className="w-full bg-gov-emerald hover:bg-emerald-800 text-white flex items-center justify-center gap-2 py-2.5"
              asChild
              onClick={onClose}
            >
              <Link to="/downloads">
                <Download className="h-4 w-4 text-gov-gold" />
                <span>Reports & Downloads</span>
              </Link>
            </Button>
          </div>

          {/* Embedded Language Selector */}
          <div className="pt-4 border-t border-gov-border space-y-2">
            <label className="text-xs font-bold text-gov-slate uppercase tracking-wider px-2 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-gov-navy" />
              <span>Language / Harshe</span>
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gov-border bg-gov-canvas text-sm font-medium text-gov-navy focus:outline-none focus:ring-2 focus:ring-gov-navy"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Control */}
          <div className="pt-2 flex items-center justify-between px-2 text-sm text-gov-slate">
            <span className="text-xs font-bold uppercase tracking-wider">Appearance</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Footer Note inside Drawer */}
        <div className="p-4 border-t border-gov-border bg-gov-canvas dark:bg-gov-navy/10 text-xs text-gov-slate space-y-1">
          <p className="font-semibold text-gov-navy dark:text-white">Tinubu Achievement Tracker</p>
          <p className="text-[11px] leading-relaxed">
            Evidence-based national progress platform compiling public & institutional statistics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigationDrawer;
