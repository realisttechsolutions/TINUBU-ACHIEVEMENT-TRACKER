import React from "react";
import { Link } from "@/lib/navigation";
import { ChevronRight, Share2 } from "lucide-react";

interface StateBreadcrumbsProps {
  stateShortName: string;
}

export const StateBreadcrumbs: React.FC<StateBreadcrumbsProps> = ({ stateShortName }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${stateShortName} State Dashboard | President Tinubu Achievement Tracker`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("State dashboard link copied to clipboard!");
    }
  };

  return (
    <div className="bg-gov-navy text-slate-300 py-3 border-b border-gov-gold/20">
      <div className="container mx-auto px-4 flex items-center justify-between text-xs">
        <nav className="flex items-center gap-2">
          <Link to="/" className="hover:text-gov-gold transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-slate-500" />
          <Link to="/states" className="hover:text-gov-gold transition-colors">States</Link>
          <ChevronRight className="h-3 w-3 text-slate-500" />
          <span className="text-gov-gold font-semibold truncate">{stateShortName}</span>
        </nav>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share State Page
        </button>
      </div>
    </div>
  );
};

export default StateBreadcrumbs;
