import type {
  AchievementViewModel,
  DatasetResourceViewModel,
  PolicyViewModel,
  ProgrammeViewModel,
  ProjectViewModel,
  SectorViewModel,
  StateProfileViewModel,
  TimelineEventViewModel,
} from './types';

export interface PublicMacroCounters {
  timeframe: string;
  verifiedAchievements: number;
  canonicalSectors: number;
  capitalProjectsActive: number;
  subNationalStatesTracked: number;
  studentBeneficiariesFormatted: string;
  externalReservesFormatted: string;
  highwayKilometersFormatted: string;
  lastAuditSync: string;
}

/** Serializable data passed from the server boundary into the existing client adapter. */
export interface PublicDataSnapshot {
  source: 'cloud-sql';
  loadedAt: string;
  achievements: AchievementViewModel[];
  sectors: SectorViewModel[];
  projects: ProjectViewModel[];
  policies: PolicyViewModel[];
  programmes: ProgrammeViewModel[];
  timelineEvents: TimelineEventViewModel[];
  states: StateProfileViewModel[];
  datasets: DatasetResourceViewModel[];
  publicDownload: Record<string, string | null>[];
  macroCounters: PublicMacroCounters;
}
