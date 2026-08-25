import React from "react";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`inline-flex min-w-0 items-center group transition-opacity duration-200 hover:opacity-95 flex-1 sm:flex-initial ${className}`}
      aria-label="President Tinubu Achievement Tracker - Return to homepage"
    >
      {/* Full Horizontal Header Logo for Desktop & Tablet */}
      <div className={`${compact ? 'hidden' : 'hidden sm:block'} relative w-[210px] md:w-[250px] lg:w-[280px] xl:w-[310px] h-[44px] md:h-[52px]`}>
        <Image
          src="/brand/ptat-header-logo.png"
          alt="President Tinubu Achievement Tracker"
          fill
          priority
          sizes="(max-width: 640px) 210px, (max-width: 1024px) 250px, 310px"
          className="object-contain object-left"
        />
      </div>

      {/* Compact Site Icon for Narrow Mobile Viewports (<640px or compact) */}
      <div className={`${compact ? 'flex' : 'flex sm:hidden'} items-center gap-2 min-w-0`}>
        <div className="relative w-8 h-8 shrink-0 rounded-lg overflow-hidden border border-emerald-500/40 shadow-sm">
          <Image
            src="/brand/ptat-icon-master.png"
            alt="PTAT"
            width={32}
            height={32}
            priority
            className="object-contain w-full h-full"
          />
        </div>
        <div className="flex flex-col min-w-0 justify-center">
          <span className="font-display font-extrabold text-xs text-gov-navy dark:text-white leading-tight tracking-tight line-clamp-1">
            PTAT
          </span>
          <span className="text-[9px] text-gov-slate uppercase tracking-wider font-semibold line-clamp-1">
            {t("brand.title", { defaultValue: "President Tinubu Achievement Tracker" })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BrandLockup;

