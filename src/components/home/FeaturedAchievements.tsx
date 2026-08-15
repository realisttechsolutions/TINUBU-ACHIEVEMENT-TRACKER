import React from "react";
import { Link } from "@/lib/navigation";
import { Award, ArrowRight, Sparkles } from "lucide-react";
import AchievementCard from "@/components/achievements/AchievementCard";
import { dataAdapter } from "@/adapters/dataAdapter";

export const FeaturedAchievements: React.FC = () => {
  const featured = dataAdapter.getFeaturedAchievements().slice(0, 3);

  return (
    <section className="py-16 bg-white dark:bg-gov-darkSurface border-b border-gov-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-gold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-gov-emerald" />
              <span>Priority National Milestones</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gov-navy dark:text-white font-display">
              Featured Verified Achievements
            </h2>
            <p className="text-sm text-gov-slate leading-relaxed">
              Major policy reforms, strategic transport superhighways, and transformative student financing initiatives with verified primary legal and administrative citations.
            </p>
          </div>

          <Link
            to="/achievements"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gov-emerald hover:text-emerald-700 transition-colors shrink-0"
          >
            <span>Browse Full Catalogue</span>
            <ArrowRight className="h-4 w-4 text-gov-gold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item) => (
            <AchievementCard key={item.id} item={item} viewMode="grid" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAchievements;
