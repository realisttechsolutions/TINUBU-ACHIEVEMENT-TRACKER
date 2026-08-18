'use client';
import React from "react";
import HeroSection from "@/components/ui/hero-section";
import SectionHeader from "@/components/common/SectionHeader";
import NigeriaImpactMap from "@/components/geography/NigeriaImpactMap";
import { getGeopoliticalZones, getAllStates } from "@/services/geographyService";
import { Compass, ShieldCheck, MapPin, Info, ArrowRight } from "lucide-react";
import { Link } from "@/lib/navigation";

const ImpactMapPage: React.FC = () => {
  const zones = getGeopoliticalZones();
  const allStates = getAllStates();

  return (
    <div className="w-full bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
      {/* Page Hero */}
      <HeroSection

          title="National Geographic Impact Map"
          subtitle="Explore federal achievements, multi-state transport corridors, physical infrastructure projects, and social interventions across Nigeria's 36 states and the Federal Capital Territory."
          action={{ text: "Explore Interactive Map", href: "#map-section" }}
          backgroundImage="https://images.unsplash.com/photo-1516937941344-00b4e0337589"
          highlightStats={[
            { value: "36 + FCT", label: "States & Capital" },
            { value: "6", label: "Geopolitical Zones" },
            { value: "100%", label: "Verified Data Bounds" }
          ]}
        />

        {/* Core Map Section */}
        <section id="map-section" className="container mx-auto px-4 py-12">
          <SectionHeader
            title="Interactive Geographic Intelligence Layer"
            description="Filter documented achievements by state or geopolitical zone. Select any state polygon or toggle to the accessible table view."
            centered={false}
          />

          <div className="mt-8">
            <NigeriaImpactMap />
          </div>

          {/* Geographic Integrity Principles Banner */}
          <div className="mt-16 bg-white dark:bg-gov-navy/30 p-6 md:p-8 rounded-2xl border border-gov-border">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gov-gold/10 rounded-xl text-gov-gold shrink-0">
                <Info className="h-6 w-6" />
              </div>
              <div className="space-y-3 text-xs md:text-sm text-gov-slate">
                <h3 className="text-base font-bold text-gov-navy dark:text-white">
                  Geographic Evidence & Integrity Principles
                </h3>
                <p>
                  1. <strong className="text-gov-navy dark:text-white">Absence is Not Zero:</strong> A state with no published records in this tracker does not indicate zero federal activity; it signifies that records for that state are currently undergoing verification for future release.
                </p>
                <p>
                  2. <strong className="text-gov-navy dark:text-white">Count is Not Performance:</strong> The number of published records connected to a state is a measure of indexed evidence, not a state-level governance performance ranking.
                </p>
                <p>
                  3. <strong className="text-gov-navy dark:text-white">Scope Distinction:</strong> National programs (such as NELFUND Student Loans or Conditional Cash Transfers) benefit all 36 states & FCT, while physical projects (such as the Lagos-Calabar Highway) map to specific geographical corridors.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default ImpactMapPage;
