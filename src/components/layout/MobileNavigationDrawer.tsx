'use client';

import React, { useState } from "react";
import { Link, useLocation } from "@/lib/navigation";
import { 
  X, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Award, 
  Building2, 
  FileText, 
  Users, 
  Compass, 
  Clock, 
  Database, 
  Download, 
  ShieldCheck, 
  LayoutDashboard,
  Layers,
  MapPin
} from "lucide-react";
import BrandLockup from "./BrandLockup";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { CANONICAL_PUBLIC_GROUPS, CANONICAL_SECTORS } from "@/adapters/canonicalData";

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
}) => {
  const location = useLocation();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  if (!isOpen) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative ml-0 mr-auto w-full max-w-sm h-full bg-white dark:bg-gov-darkSurface shadow-2xl flex flex-col z-10 animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gov-border flex items-center justify-between bg-gov-navy text-white">
          <BrandLockup compact onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Search Bar */}
        <div className="p-3 border-b border-gov-border bg-gov-canvas dark:bg-white/5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch?.();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white dark:bg-gov-navy border border-gov-border text-xs text-gov-slate shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gov-gold" />
              <span>Search achievements, sectors, states...</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-gov-canvas text-[10px] font-mono border">âŒ˜K</kbd>
          </button>
        </div>

        {/* Navigation Body */}
        <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {/* Main Core Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider px-2 mb-1">
              Core Platform
            </div>
            
            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive("/") ? "bg-gov-navy text-white" : "text-gov-navy dark:text-white hover:bg-gov-canvas"
              }`}
            >
              <span>Home Overview</span>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>

            <Link
              to="/achievements"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive("/achievements") ? "bg-gov-navy text-white" : "text-gov-navy dark:text-white hover:bg-gov-canvas"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-gov-gold" />
                <span>Achievements Explorer</span>
              </span>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>

            <Link
              to="/impact-map"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive("/impact-map") ? "bg-gov-navy text-white" : "text-gov-navy dark:text-white hover:bg-gov-canvas"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Compass className="h-4 w-4 text-gov-emerald" />
                <span>Nigeria Impact Map</span>
              </span>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>

            <Link
              to="/timeline"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive("/timeline") ? "bg-gov-navy text-white" : "text-gov-navy dark:text-white hover:bg-gov-canvas"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-gov-gold" />
                <span>Administration Timeline</span>
              </span>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>
          </div>

          {/* Initiatives Group */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider px-2 mb-1">
              Documented Initiatives
            </div>

            <Link
              to="/projects"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/projects") ? "bg-gov-navy text-white" : "text-gov-slate hover:text-gov-navy hover:bg-gov-canvas"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span>Capital Infrastructure Projects</span>
              </span>
            </Link>

            <Link
              to="/policies"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/policies") ? "bg-gov-navy text-white" : "text-gov-slate hover:text-gov-navy hover:bg-gov-canvas"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span>Policies & Structural Reforms</span>
              </span>
            </Link>

            <Link
              to="/programmes"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/programmes") ? "bg-gov-navy text-white" : "text-gov-slate hover:text-gov-navy hover:bg-gov-canvas"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-emerald-600" />
                <span>Social Intervention Programmes</span>
              </span>
            </Link>
          </div>

          {/* Sectors Directory Accordion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-bold text-gov-slate uppercase tracking-wider">
                15 Canonical Sectors
              </span>
              <Link
                to="/sectors"
                onClick={onClose}
                className="text-xs font-semibold text-gov-emerald hover:underline"
              >
                All Sectors
              </Link>
            </div>

            <div className="space-y-1.5">
              {CANONICAL_PUBLIC_GROUPS.map((group) => {
                const isExpanded = expandedGroup === group.id;
                const groupSectors = CANONICAL_SECTORS.filter(s => s.parentPublicGroup === group.id);

                return (
                  <div key={group.id} className="border border-gov-border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                      className="w-full flex items-center justify-between p-2.5 bg-gov-canvas dark:bg-white/5 text-xs font-bold text-gov-navy dark:text-white"
                    >
                      <span>{group.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180 text-gov-gold" : ""}`} />
                    </button>

                    {isExpanded && (
                      <div className="p-2 space-y-1 bg-white dark:bg-gov-darkSurface">
                        {groupSectors.map((sector) => (
                          <Link
                            key={sector.id}
                            to={`/sectors/${sector.slug}`}
                            onClick={onClose}
                            className="block px-2.5 py-1.5 text-xs text-gov-slate hover:text-gov-navy dark:hover:text-white hover:bg-gov-canvas rounded"
                          >
                            {sector.publicLabel}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence & Data Resources */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider px-2 mb-1">
              Evidence & Public Data
            </div>

            <Link
              to="/data"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gov-slate hover:text-gov-navy hover:bg-gov-canvas"
            >
              <Database className="h-4 w-4 text-emerald-600" />
              <span>Interactive Data Explorer</span>
            </Link>

            <Link
              to="/data-sources"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gov-slate hover:text-gov-navy hover:bg-gov-canvas"
            >
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span>Sources & Evidence Standards</span>
            </Link>

            <Link
              to="/downloads"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gov-slate hover:text-gov-navy hover:bg-gov-canvas"
            >
              <Download className="h-4 w-4 text-purple-600" />
              <span>Download Centre (CSV / JSON)</span>
            </Link>

            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gov-slate hover:text-gov-navy hover:bg-gov-canvas"
            >
              <LayoutDashboard className="h-4 w-4 text-blue-600" />
              <span>Macro Analytics Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Footer in Drawer */}
        <div className="p-4 border-t border-gov-border bg-gov-canvas dark:bg-gov-darkSurface flex items-center justify-between">
          <div className="text-[11px] text-gov-slate">
            <span>Mandate: 2023 â€” 2026</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default MobileNavigationDrawer;
