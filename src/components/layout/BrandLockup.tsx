import React from "react";
import { Link } from "@/lib/navigation";

interface BrandLockupProps {
  compact?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({
  compact = false,
  className = "",
  onClick,
}) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`inline-flex min-w-0 items-center gap-2.5 group transition-opacity duration-200 hover:opacity-95 ${className}`}
      aria-label="Tinubu Achievement Tracker - Return to homepage"
    >
      {/* Emblem Badge */}
      <div className="bg-gov-navy text-white font-display font-extrabold text-xs md:text-sm px-2.5 py-1 rounded shadow-sm border border-gov-gold/40 shrink-0">
        <span className="text-gov-gold tracking-wider">TAT</span>
      </div>

      {/* Typographic Lockup */}
      <div className="flex flex-col min-w-0 justify-center">
        <span className="font-display font-extrabold text-sm sm:text-base md:text-lg text-gov-navy dark:text-white leading-tight tracking-tight truncate">
          Tinubu Achievement Tracker
        </span>
        {!compact && (
          <span className="text-[10px] sm:text-[11px] text-gov-slate uppercase tracking-wider font-semibold truncate hidden sm:block">
            Tracking the Renewed Hope Agenda
          </span>
        )}
      </div>
    </Link>
  );
};

export default BrandLockup;
