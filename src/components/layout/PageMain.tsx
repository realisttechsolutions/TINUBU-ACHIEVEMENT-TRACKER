import React from "react";

interface PageMainProps {
  children: React.ReactNode;
  className?: string;
}

export const PageMain: React.FC<PageMainProps> = ({ children, className = "" }) => {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      role="main"
      className={`flex-grow focus:outline-none ${className}`}
    >
      {children}
    </main>
  );
};

export default PageMain;
