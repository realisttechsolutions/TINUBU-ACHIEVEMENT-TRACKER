import React from "react";
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
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-gov-navy selection:text-gov-gold">
      <SkipNavigation />
      <GlobalHeader />
      <GlobalContextBar />
      <PageMain>{children}</PageMain>
      <GlobalFooter />
      <LanguageSwitcher />
    </div>
  );
};

export default AppShell;
