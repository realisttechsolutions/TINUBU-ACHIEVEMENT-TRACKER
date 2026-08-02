import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Search, 
  ChevronRight, 
  Compass, 
  Building, 
  Award,
  Layers,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/hero-section";
import SectionHeader from "@/components/common/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGeopoliticalZones, getAllStates, getStateImpactSummary } from "@/services/geographyService";

const StatesCatalogue: React.FC = () => {
  const zones = getGeopoliticalZones();
  const allStates = getAllStates();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");

  const filteredStates = allStates.filter((state) => {
    const matchesSearch =
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZone === "all" || state.zone.toLowerCase() === selectedZone.toLowerCase();
    return matchesSearch && matchesZone;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Hero */}
        <HeroSection
          title="Nigeria State Performance Catalogue"
          subtitle="Directory of Nigeria's 36 States and the Federal Capital Territory documenting federal policies, regional infrastructure projects, and localized social interventions."
          action={{ text: "View National Impact Map", href: "/impact-map" }}
          backgroundImage="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e"
          highlightStats={[
            { value: "36 + FCT", label: "States & Capital" },
            { value: "6", label: "Geopolitical Zones" },
            { value: "100%", label: "Verified Locations" }
          ]}
        />

        <section className="container mx-auto px-4 py-12">
          {/* Section Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <SectionHeader
              title="State & Regional Directory"
              description="Explore documented achievements, lead agencies, and project scopes by state."
              centered={false}
            />

            {/* Search and Zone Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gov-slate" />
                <input
                  type="text"
                  placeholder="Filter states or capitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-gov-navy/40 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald"
                />
              </div>

              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full sm:w-48 py-2 px-3 text-xs bg-white dark:bg-gov-navy/40 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald text-gov-navy dark:text-white"
              >
                <option value="all">All Geopolitical Zones</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} Zone
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Zones and States Grid */}
          <div className="space-y-12">
            {zones.map((zone) => {
              const zoneStates = filteredStates.filter((s) => s.zone === zone.name);
              if (zoneStates.length === 0) return null;

              return (
                <div key={zone.id} className="space-y-4">
                  {/* Zone Header */}
                  <div className="flex items-center justify-between border-b border-gov-border pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: zone.color }} />
                      <h3 className="text-xl font-bold text-gov-navy dark:text-white">{zone.name} Zone</h3>
                      <span className="text-xs text-gov-slate">({zoneStates.length} States)</span>
                    </div>
                    <span className="text-xs text-gov-slate hidden md:inline">{zone.keyHighlight}</span>
                  </div>

                  {/* State Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {zoneStates.map((state) => {
                      const summary = getStateImpactSummary(state.slug);
                      return (
                        <Card
                          key={state.code}
                          className="hover:shadow-lg transition-all duration-300 border-gov-border hover:border-gov-emerald dark:bg-gov-navy/30 flex flex-col justify-between group"
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex items-center gap-1.5 font-bold text-gov-navy dark:text-white">
                                <MapPin className="h-4 w-4 text-gov-gold shrink-0" />
                                <span className="text-lg">{state.name}</span>
                              </div>
                              <Badge variant="outline" className="text-[10px] font-bold border-gov-border">
                                {state.code}
                              </Badge>
                            </div>

                            <div className="text-xs text-gov-slate mb-4">
                              Capital: <strong className="text-gov-navy dark:text-slate-200">{state.capital}</strong>
                            </div>

                            <p className="text-xs text-gov-slate line-clamp-2 mb-4">
                              {state.description}
                            </p>

                            <div className="bg-gov-canvas dark:bg-gov-navy/50 p-2.5 rounded-lg border border-gov-border/60 text-xs flex justify-between items-center mb-4">
                              <span className="text-gov-slate">Published Records:</span>
                              <span className="font-extrabold text-gov-emerald">
                                {summary?.totalPublishedRecords || 0} Records
                              </span>
                            </div>
                          </CardContent>

                          <div className="p-5 pt-0">
                            <Link
                              to={`/states/${state.slug}`}
                              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-emerald transition-colors"
                            >
                              Explore State Dashboard
                              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StatesCatalogue;
