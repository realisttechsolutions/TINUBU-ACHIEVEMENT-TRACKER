'use client';

import React from "react";
import { useLocation } from "@/lib/navigation";
import SkipNavigation from "./SkipNavigation";
import GlobalHeader from "./GlobalHeader";
import GlobalContextBar from "./GlobalContextBar";
import GlobalFooter from "./GlobalFooter";
import PageMain from "./PageMain";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { pathname } = useLocation();
  const isAIPage = pathname === '/ai';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-gov-navy selection:text-gov-gold">
      <SkipNavigation />
      <GlobalHeader />
      <GlobalContextBar />
      <PageMain className={isAIPage ? "flex-1 flex flex-col overflow-hidden" : ""}>
        {children}
      </PageMain>
      {!isAIPage && <GlobalFooter />}
      <LanguageSwitcher />
    </div>
  );
};

export default AppShell;
