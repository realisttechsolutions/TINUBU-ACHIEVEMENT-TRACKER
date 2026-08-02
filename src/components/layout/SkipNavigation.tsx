import React from "react";

export const SkipNavigation: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gov-navy focus:text-gov-gold focus:font-bold focus:text-sm focus:rounded-md focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-gov-gold"
    >
      Skip to main content
    </a>
  );
};

export default SkipNavigation;
