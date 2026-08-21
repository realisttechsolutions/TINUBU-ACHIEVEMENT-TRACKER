import { PublicDataSnapshot } from "@/adapters/runtimeData";
import {
  CANONICAL_SECTORS,
  DEMO_ACHIEVEMENTS,
  DEMO_PROJECTS,
  DEMO_POLICIES,
  DEMO_PROGRAMMES,
  DEMO_TIMELINE_EVENTS,
  DEMO_NIGERIA_STATES,
  DEMO_DATASETS,
} from "@/adapters/canonicalData";

// Convert demo fixtures into test-isolated non-demo models exclusively for unit tests
export const testPublicSnapshot: PublicDataSnapshot = {
  source: "cloud-sql",
  loadedAt: "2026-08-15T00:00:00.000Z",
  achievements: DEMO_ACHIEVEMENTS.map((a, i) => ({
    ...a,
    id: `ACH-${String(i + 1).padStart(3, "0")}`,
    isDemo: false,
  })),
  sectors: CANONICAL_SECTORS.map((s) => ({
    ...s,
    isDemo: false,
  })),
  projects: DEMO_PROJECTS.map((p, i) => ({
    ...p,
    id: `PRJ-${String(i + 1).padStart(3, "0")}`,
    isDemo: false,
  })),
  policies: DEMO_POLICIES.map((p, i) => ({
    ...p,
    id: `POL-${String(i + 1).padStart(3, "0")}`,
    isDemo: false,
  })),
  programmes: DEMO_PROGRAMMES.map((p, i) => ({
    ...p,
    id: `PRG-${String(i + 1).padStart(3, "0")}`,
    isDemo: false,
  })),
  timelineEvents: DEMO_TIMELINE_EVENTS.map((t, i) => ({
    ...t,
    id: `TLE-${String(i + 1).padStart(3, "0")}`,
    isDemo: false,
  })),
  states: DEMO_NIGERIA_STATES.map((s) => ({
    ...s,
    isDemo: false,
  })),
  datasets: DEMO_DATASETS.map((d, i) => ({
    ...d,
    id: `DS-${String(i + 1).padStart(3, "0")}`,
    isDemo: false,
  })),
  publicDownload: [],
  macroCounters: {
    timeframe: "2023 — 2026",
    verifiedAchievements: DEMO_ACHIEVEMENTS.length,
    canonicalSectors: CANONICAL_SECTORS.length,
    capitalProjectsActive: DEMO_PROJECTS.length,
    subNationalStatesTracked: DEMO_NIGERIA_STATES.length,
    studentBeneficiariesFormatted: "350,000+",
    externalReservesFormatted: "Strengthened Buffer",
    highwayKilometersFormatted: "2,400+ km",
    lastAuditSync: "2026-08-15",
  },
};
