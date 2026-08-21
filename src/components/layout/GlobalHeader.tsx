'use client';

import React, { useState } from "react";
import { Menu } from "lucide-react";
import BrandLockup from "./BrandLockup";
import DesktopNavigation from "./DesktopNavigation";
import HeaderActions from "./HeaderActions";
import MobileNavigationDrawer from "./MobileNavigationDrawer";
import GlobalSearch from "./GlobalSearch";

export const GlobalHeader: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gov-darkSurface/95 backdrop-blur-md border-b border-gov-border h-16 md:h-20 transition-all duration-200">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2 xl:gap-3 2xl:gap-6">
        {/* Left: Brand Identity */}
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 xl:gap-3 flex-1 sm:flex-initial">
          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open mobile navigation menu"
            className="p-1.5 sm:p-2 rounded-md text-gov-navy dark:text-white hover:bg-gov-canvas xl:hidden focus:outline-none focus:ring-2 focus:ring-gov-navy shrink-0"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <BrandLockup />
        </div>


        {/* Center: Desktop Navigation */}
        <DesktopNavigation />

        {/* Right: Actions */}
        <HeaderActions onOpenSearch={() => setSearchOpen(true)} />
      </div>

      {/* Mobile Drawer Overlay */}
      <MobileNavigationDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Global Search Dialog Overlay */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default GlobalHeader;
