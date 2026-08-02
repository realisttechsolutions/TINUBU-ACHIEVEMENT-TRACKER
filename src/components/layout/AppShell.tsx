import React from "react";
import SkipNavigation from "./SkipNavigation";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";
import PageMain from "./PageMain";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-gov-navy selection:text-gov-gold">
      <SkipNavigation />
      <GlobalHeader />
      <PageMain>{children}</PageMain>
      <GlobalFooter />
    </div>
  );
};

export default AppShell;
