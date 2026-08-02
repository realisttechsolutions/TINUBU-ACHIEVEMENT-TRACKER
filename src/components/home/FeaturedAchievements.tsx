import React from "react";
import { Link } from "react-router-dom";
import { Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeaturedAchievementCard from "./FeaturedAchievementCard";
import { featuredAchievements } from "@/data/home/homepage.config";

export const FeaturedAchievements: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gov-canvas dark:bg-gov-navy/20 border-b border-gov-border font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gov-border/60 pb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-emerald uppercase tracking-wider">
              <Award className="h-4 w-4 text-gov-gold" />
              <span>National Delivery Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gov-navy dark:text-white tracking-tight">
              Featured Achievements
            </h2>
            <p className="text-sm text-gov-slate">
              Policies and projects presented with their implementation status, national relevance and supporting evidence.
            </p>
          </div>

          <Button
            variant="outline"
            className="border-gov-border text-gov-navy hover:bg-white gap-2 shrink-0 self-start md:self-auto"
            asChild
          >
            <Link to="/achievements">
              <span>Explore Achievement Catalogue</span>
              <ArrowRight className="h-4 w-4 text-gov-emerald" />
            </Link>
          </Button>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredAchievements.map((item) => (
            <FeaturedAchievementCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAchievements;
