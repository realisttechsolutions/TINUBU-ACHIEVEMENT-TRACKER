import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { navigationGroups } from "@/navigation/navigation.config";

export const DesktopNavigation: React.FC = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Esc key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isGroupActive = (groupId: string) => {
    const group = navigationGroups.find((g) => g.id === groupId);
    return group?.items.some((item) => item.path === location.pathname);
  };

  const isPathActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="hidden lg:flex items-center space-x-1 font-sans text-sm font-medium"
      aria-label="Main Navigation"
      ref={dropdownRef}
    >
      {navigationGroups.map((group) => {
        const isOpen = openDropdown === group.id;
        const groupActive = isGroupActive(group.id);

        return (
          <div key={group.id} className="relative group/nav">
            <button
              type="button"
              onClick={() => setOpenDropdown(isOpen ? null : group.id)}
              onMouseEnter={() => setOpenDropdown(group.id)}
              aria-expanded={isOpen}
              aria-haspopup="true"
              aria-controls={`nav-dropdown-${group.id}`}
              className={`px-3 py-2 rounded-md inline-flex items-center gap-1.5 transition-colors text-sm font-medium relative ${
                groupActive
                  ? "text-gov-navy dark:text-white font-semibold"
                  : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
              }`}
            >
              <span>{group.title}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 opacity-70 ${
                  isOpen ? "rotate-180 text-gov-gold" : ""
                }`}
              />

              {/* Active Indicator Underline */}
              {groupActive && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gov-emerald rounded-full" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div
                id={`nav-dropdown-${group.id}`}
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-gov-darkSurface border border-gov-border rounded-lg shadow-xl py-2 z-50 animate-fade-in"
              >
                <div className="px-4 py-2 border-b border-gov-border/60 mb-1">
                  <p className="text-xs font-bold text-gov-navy dark:text-white uppercase tracking-wider">
                    {group.title}
                  </p>
                  <p className="text-[11px] text-gov-slate mt-0.5">{group.description}</p>
                </div>

                <div className="space-y-0.5 px-1.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isPathActive(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setOpenDropdown(null)}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-start gap-3 p-2.5 rounded-md transition-colors ${
                          active
                            ? "bg-gov-canvas dark:bg-gov-navy/40 text-gov-navy dark:text-white font-semibold"
                            : "hover:bg-gov-canvas/70 dark:hover:bg-gov-navy/20 text-gov-slate hover:text-gov-navy dark:hover:text-white"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded shrink-0 ${
                            active
                              ? "bg-gov-navy text-gov-gold"
                              : "bg-gov-border/40 text-gov-navy"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold leading-snug truncate">
                            {item.label}
                          </span>
                          <span className="text-[11px] text-gov-slate font-normal line-clamp-1">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default DesktopNavigation;
