import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/hero-section";
import SectionHeader from "@/components/common/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimelineFilterOptions } from "@/types/timeline.types";
import { 
  filterTimelineEvents, 
  getTimelineStageSummaries, 
  getAllTimelineEvents 
} from "@/services/timelineService";
import TimelineFilterBar from "@/components/timeline/TimelineFilterBar";
import PolicyTimelineViewer from "@/components/timeline/PolicyTimelineViewer";
import { Clock, ShieldCheck, Info, CheckCircle2, Award } from "lucide-react";

export const TimelinePage: React.FC = () => {
  const [filters, setFilters] = useState<TimelineFilterOptions>({
    stage: "all",
    category: "all",
    year: "all",
    searchQuery: "",
  });

  const stageSummaries = getTimelineStageSummaries();
  const filteredEvents = filterTimelineEvents(filters);
  const totalEvents = getAllTimelineEvents().length;

  const handleResetFilters = () => {
    setFilters({
      stage: "all",
      category: "all",
      year: "all",
      searchQuery: "",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Banner */}
        <HeroSection
          title="Policy & Reform Implementation Timeline"
          subtitle="Chronological stream of presidential decisions, cabinet approvals, statutory appropriations, physical project milestones, and verified economic outcomes."
          action={{ text: "Explore Policy Stream", href: "#timeline-section" }}
          backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
          highlightStats={[
            { value: `${totalEvents}`, label: "Indexed Policy Events" },
            { value: "6", label: "Implementation Stages" },
            { value: "100%", label: "Source Verified" }
          ]}
        />

        <section id="timeline-section" className="container mx-auto px-4 py-12 space-y-12">
          {/* Section 1: Implementation Stage Breakdown Cards */}
          <div className="space-y-4">
            <SectionHeader
              title="6-Stage Policy Implementation Methodology"
              description="Policy announcements are tracked through legislative approval, funding, construction, and operational delivery to prevent proclamation inflation."
              centered={false}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {stageSummaries.map((summary) => (
                <Card
                  key={summary.stage}
                  onClick={() => setFilters({ ...filters, stage: summary.stage })}
                  className={`cursor-pointer transition-all duration-300 border-gov-border hover:border-gov-emerald dark:bg-gov-navy/40 ${
                    filters.stage === summary.stage ? "ring-2 ring-gov-emerald shadow-md" : ""
                  }`}
                >
                  <CardContent className="p-3 text-center space-y-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full inline-block mb-1"
                      style={{ backgroundColor: summary.color }}
                    />
                    <span className="text-[11px] font-bold text-gov-navy dark:text-white block line-clamp-1">
                      {summary.label}
                    </span>
                    <p className="text-xl font-black text-gov-emerald">{summary.count}</p>
                    <span className="text-[9px] text-gov-slate block leading-tight line-clamp-1">
                      {summary.description}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 2: Interactive Filter Controls */}
          <TimelineFilterBar
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
            totalResultsCount={filteredEvents.length}
          />

          {/* Section 3: Chronological Policy Stream */}
          <PolicyTimelineViewer events={filteredEvents} />

          {/* Section 4: Integrity Standard Disclosure */}
          <div className="bg-white dark:bg-gov-navy/30 p-6 md:p-8 rounded-2xl border border-gov-border">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gov-emerald/10 rounded-xl text-gov-emerald shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-3 text-xs md:text-sm text-gov-slate">
                <h3 className="text-base font-bold text-gov-navy dark:text-white">
                  Timeline Qualification & Anti-Inflation Guarantee
                </h3>
                <p>
                  1. <strong className="text-gov-navy dark:text-white">Announcements Are Not Deliveries:</strong> A policy pronouncement (Stage 1) is never classified as a completed achievement until Stage 5 (Operational) or Stage 6 (Impact Audited) is reached and verified with primary gazettes.
                </p>
                <p>
                  2. <strong className="text-gov-navy dark:text-white">Documented Provenance:</strong> Every event in this stream references official gazettes, Central Bank circulars, Federal Ministry press briefings, or World Bank independent audit reports.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TimelinePage;
