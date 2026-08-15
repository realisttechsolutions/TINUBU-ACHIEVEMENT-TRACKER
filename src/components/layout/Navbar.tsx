'use client';


import React, { useState, useEffect } from "react";
import { Link, useLocation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Search, Bell, ChevronDown, Download } from "lucide-react";
import MobileMenu from "./MobileMenu";
import SkipLink from "../accessibility/SkipLink";
import ThemeToggle from "../ui/ThemeToggle";
import ShareButton from "../ui/ShareButton";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { path: "/economic-reforms", label: t('navigation.economicReforms') },
    { path: "/security-progress", label: t('navigation.securityProgress') },
    { path: "/dashboard", label: t('navigation.dashboard') },
    { path: "/infrastructure", label: t('navigation.infrastructure') },
    { path: "/social-services", label: t('navigation.socialServices') },
    { path: "/data-sources", label: t('navigation.dataSources') },
    { path: "/downloads", label: t('navigation.downloads') }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <SkipLink />
      <header className={cn(
        "border-b sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      )} role="banner">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <MobileMenu />
              <Link
                to="/"
                className="flex items-center space-x-2.5 ml-2 md:ml-0 group transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="bg-gov-navy text-white font-display font-extrabold text-sm px-2 py-1 rounded shadow-sm border border-gov-gold/40 group-hover:border-gov-gold transition-colors">
                  <span className="text-gov-gold">TAT</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-base md:text-lg text-gov-navy leading-tight group-hover:text-gov-emerald transition-colors">
                    Tinubu Achievement Tracker
                  </span>
                  <span className="text-[10px] text-gov-slate uppercase tracking-wider font-medium hidden lg:block">
                    Renewed Hope Progress Platform
                  </span>
                </div>
              </Link>
            </div>

            <nav className="hidden md:block" role="navigation" aria-label="Main navigation">
              <NavigationMenu>
                <NavigationMenuList>
                  {navLinks.map((link) => (
                    <NavigationMenuItem key={link.path}>
                      <Link
                        to={link.path}
                        className={cn(
                          "px-3 py-2 inline-flex rounded-md text-gray-700 font-medium transition-all relative group",
                          isActive(link.path)
                            ? "text-brand-sovereign-green"
                            : "hover:text-brand-sovereign-green"
                        )}
                      >
                        {link.label}
                        <span className={cn(
                          "absolute bottom-0 left-0 w-full h-0.5 bg-brand-sovereign-gold transform origin-left transition-transform duration-300",
                          isActive(link.path)
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        )}></span>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            <div className="flex items-center gap-2">
              <div className={cn(
                "transition-all duration-300 overflow-hidden",
                searchOpen ? "w-48 md:w-64" : "w-0"
              )}>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-8 px-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-sovereign-green"
                />
              </div>
              <Button
                variant={searchOpen ? "default" : "ghost"}
                size="icon"
                className={cn("mr-1", searchOpen ? "bg-brand-sovereign-green hover:bg-brand-sovereign-dark" : "")}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="mr-1 relative hidden sm:flex hover:text-brand-sovereign-green"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-label="New notifications"></span>
              </Button>
              <ThemeToggle />
              <ShareButton className="hidden sm:flex" />
              <Button
                className="hidden sm:flex bg-brand-sovereign-green hover:bg-brand-sovereign-dark transition-colors duration-300 shadow hover:shadow-md"
                asChild
                size={isMobile ? "sm" : "default"}
              >
                <Link to="/downloads">
                  <Download className="h-4 w-4 mr-2" />
                  <span>Downloads</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
