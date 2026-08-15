import React from "react";
import { Link } from "@/lib/navigation";
import { ChevronRight, Share2 } from "lucide-react";

interface AchievementBreadcrumbsProps {
  title: string;
}

export const AchievementBreadcrumbs: React.FC<AchievementBreadcrumbsProps> = ({ title }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} | Tinubu Achievement Tracker`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Achievement link copied to clipboard!");
    }
  };

  return (
    <div className="bg-gov-navy text-slate-300 py-3 border-b border-gov-gold/20">
      <div className="container mx-auto px-4 flex items-center justify-between text-xs">
        <nav className="flex items-center gap-2">
          <Link to="/" className="hover:text-gov-gold transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-slate-500" />
          <Link to="/achievements" className="hover:text-gov-gold transition-colors">Achievements</Link>
          <ChevronRight className="h-3 w-3 text-slate-500" />
          <span className="text-gov-gold font-semibold truncate max-w-[200px] md:max-w-xs">{title}</span>
        </nav>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share Achievement
        </button>
      </div>
    </div>
  );
};

export default AchievementBreadcrumbs;
