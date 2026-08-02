import React from "react";
import { cn } from "@/lib/utils";

interface SkipLinkProps {
  targetId?: string;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = "main-content",
  className,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        // Visually hidden by default, visible on focus
        "fixed top-0 left-0 z-[9999]",
        "transform -translate-y-full focus:translate-y-0",
        "transition-transform duration-300",
        // Styling when visible
        "bg-brand-blue text-white px-6 py-3",
        "font-semibold text-sm",
        "focus:outline-none focus:ring-4 focus:ring-brand-gold",
        "shadow-lg",
        className
      )}
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;