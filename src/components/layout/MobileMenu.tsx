'use client';


import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, TrendingUp, Shield, BarChart, Building2, HeartPulse, Database, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@/lib/navigation";
import { useState, useEffect } from "react";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close the menu when location changes (user navigates)
    setOpen(false);
  }, [location]);

  // Enhanced menu items with active state detection
  const menuItems = [
    { title: "Home", path: "/", icon: Home },
    { title: "Economic Reforms", path: "/economic-reforms", icon: TrendingUp },
    { title: "Security Progress", path: "/security-progress", icon: Shield },
    { title: "Dashboard", path: "/dashboard", icon: BarChart },
    { title: "Infrastructure", path: "/infrastructure", icon: Building2 },
    { title: "Social Services", path: "/social-services", icon: HeartPulse },
    { title: "Data Sources", path: "/data-sources", icon: Database },
    { title: "Downloads", path: "/downloads", icon: Download },
  ];

  const handleLinkClick = () => {
    setOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden relative">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-white p-0">
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-brand-sovereign-green to-brand-sovereign-dark p-6">
            <Link to="/" onClick={handleLinkClick} className="flex items-center space-x-2">
              <div className="bg-white rounded-md p-1">
                <span className="text-brand-sovereign-green font-display font-bold text-xl px-1">RHT</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Renewed Hope Tracker
              </span>
            </Link>
          </div>

          <nav className="flex flex-col gap-1 p-4 flex-1 overflow-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center text-gray-700 hover:text-brand-sovereign-green transition-colors px-4 py-3 rounded-md hover:bg-brand-sovereign-light group ${active ? "bg-brand-sovereign-light text-brand-sovereign-green font-medium" : ""
                    }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${active ? "text-brand-sovereign-green" : "text-gray-500 group-hover:text-brand-sovereign-green"
                    }`} />
                  <span className="text-base flex-1">{item.title}</span>
                  <ChevronRight className={`h-4 w-4 ${active ? "opacity-100 text-brand-sovereign-green" : "opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-brand-sovereign-green"
                    }`} />
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <div className="space-y-3">
              <Button
                className="w-full bg-brand-sovereign-green hover:bg-brand-sovereign-dark flex items-center justify-center space-x-2"
                asChild
              >
                <Link to="/economic-reforms">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>Economic Reforms</span>
                </Link>
              </Button>

              <Button
                className="w-full bg-brand-sovereign-dark hover:bg-brand-sovereign-green flex items-center justify-center"
                asChild
                variant="outline"
              >
                <Link to="/downloads">
                  <Download className="h-4 w-4 mr-2" />
                  <span>Download Reports</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
