import { 
  TimelineEventRecord, 
  InterventionStage, 
  TimelineCategory, 
  TimelineStageSummary, 
  TimelineFilterOptions 
} from "@/types/timeline.types";
import { timelineEventRecords } from "@/data/timeline/timeline.data";

export const getAllTimelineEvents = (): TimelineEventRecord[] => {
  return [...timelineEventRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getTimelineEventBySlug = (slug: string): TimelineEventRecord | undefined => {
  return timelineEventRecords.find((e) => e.slug.toLowerCase() === slug.toLowerCase());
};

export const getEventsByStage = (stage: InterventionStage): TimelineEventRecord[] => {
  return getAllTimelineEvents().filter((e) => e.stage === stage);
};

export const getEventsBySector = (sectorSlug: string): TimelineEventRecord[] => {
  return getAllTimelineEvents().filter((e) => e.sectorSlug.toLowerCase() === sectorSlug.toLowerCase());
};

export const filterTimelineEvents = (options: TimelineFilterOptions): TimelineEventRecord[] => {
  const { stage, category, year, searchQuery } = options;

  return getAllTimelineEvents().filter((event) => {
    // Stage Filter
    if (stage && stage !== "all" && event.stage !== stage) {
      return false;
    }

    // Category Filter
    if (category && category !== "all" && event.category !== category) {
      return false;
    }

    // Year Filter
    if (year && year !== ("all" as any) && event.year !== Number(year)) {
      return false;
    }

    // Search Query Filter
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      const matchesTitle = event.title.toLowerCase().includes(q);
      const matchesSummary = event.summary.toLowerCase().includes(q);
      const matchesAgency = event.leadAgency.toLowerCase().includes(q);
      const matchesCategory = event.category.toLowerCase().includes(q);

      if (!matchesTitle && !matchesSummary && !matchesAgency && !matchesCategory) {
        return false;
      }
    }

    return true;
  });
};

export const getTimelineStageSummaries = (): TimelineStageSummary[] => {
  const allEvents = getAllTimelineEvents();

  const stagesDef: { stage: InterventionStage; label: string; color: string; description: string }[] = [
    {
      stage: "announcement",
      label: "1. Announcement",
      color: "#3B82F6", // Blue
      description: "Presidential speech, executive policy directive or public pronouncement."
    },
    {
      stage: "approval",
      label: "2. FEC / Legislative Approval",
      color: "#8B5CF6", // Purple
      description: "Cabinet approval, signed Executive Order, or gazetted Act of Parliament."
    },
    {
      stage: "appropriation",
      label: "3. Appropriation / Funding",
      color: "#F59E0B", // Amber
      description: "Statutory budget line appropriation, PPP concession contract or fund release."
    },
    {
      stage: "implementation",
      label: "4. Physical Work / Ongoing",
      color: "#0284C7", // Sky
      description: "Active physical construction, civil works mobilization or portal deployment."
    },
    {
      stage: "operational",
      label: "5. Operational / Service Live",
      color: "#10B981", // Emerald
      description: "Grid synchronization, direct beneficiary disbursement or project commissioning."
    },
    {
      stage: "impact",
      label: "6. Impact Measured",
      color: "#047857", // Deep Emerald
      description: "Independent audit verification of economic output or citizen reach."
    }
  ];

  return stagesDef.map((def) => {
    const count = allEvents.filter((e) => e.stage === def.stage).length;
    return {
      ...def,
      count
    };
  });
};
