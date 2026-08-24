/**
 * Tinubu Achievement Tracker — Frontend V2 Data Adapter Service
 * Clean decoupled layer connecting UI components to Contract v1.1.2 view models.
 */

import {
  AchievementViewModel,
  SectorViewModel,
  ProjectViewModel,
  PolicyViewModel,
  ProgrammeViewModel,
  TimelineEventViewModel,
  StateProfileViewModel,
  DatasetResourceViewModel,
  GlobalSearchResultItem,
  PublicNavigationGroupId,
  LatestUpdateItem
} from "./types";

import {
  CANONICAL_PUBLIC_GROUPS,
  CANONICAL_SECTORS,
  DEMO_ACHIEVEMENTS,
  DEMO_PROJECTS,
  DEMO_POLICIES,
  DEMO_PROGRAMMES,
  DEMO_TIMELINE_EVENTS,
  DEMO_NIGERIA_STATES,
  DEMO_DATASETS
} from "./canonicalData";
import type { PublicDataSnapshot } from './runtimeData';

import { deriveGeographicScope, getGeographicRelevanceRank } from "@/utils/geographyScope";
import { getCitizenImpactForRecord } from "@/data/impact/citizenImpactData";

let runtimeData: PublicDataSnapshot | null = null;

export function hydrateDataAdapter(snapshot: PublicDataSnapshot | null) {
  runtimeData = snapshot;
}

const isPublicRecord = <T extends { isDemo?: boolean; id?: string }>(record: T): boolean => {
  if (record.isDemo === true) return false;
  if (typeof record.id === 'string' && /^(ACH|PRJ|POL|PRG|TLE|DS)-DEMO-/i.test(record.id)) return false;
  return true;
};

const achievements = () => (runtimeData?.achievements ?? []).filter(isPublicRecord);
const sectors = () => runtimeData?.sectors ?? CANONICAL_SECTORS;
const projects = () => (runtimeData?.projects ?? []).filter(isPublicRecord);
const policies = () => (runtimeData?.policies ?? []).filter(isPublicRecord);
const programmes = () => (runtimeData?.programmes ?? []).filter(isPublicRecord);
const timelineEvents = () => (runtimeData?.timelineEvents ?? []).filter(isPublicRecord);
const states = () => runtimeData?.states ?? DEMO_NIGERIA_STATES;
const datasets = () => (runtimeData?.datasets ?? []).filter(isPublicRecord);

export interface AchievementFilterOptions {
  searchQuery?: string;
  publicGroup?: PublicNavigationGroupId | 'all';
  sectorId?: string | 'all';
  recordType?: string | 'all';
  status?: string | 'all';
  verificationStatus?: string | 'all';
  evidenceProfile?: string | 'all';
  state?: string | 'all';
  scopeType?: string | 'all';
  year?: string | 'all';
  sortBy?: 'newest' | 'oldest' | 'title' | 'status' | 'geographic';
}

export interface TimelineFilterOptions {
  year?: string | 'all';
  sectorId?: string | 'all';
  eventType?: string | 'all';
  searchQuery?: string;
}

export const dataAdapter = {
  // Public Groups & Sectors
  getPublicGroups() {
    return CANONICAL_PUBLIC_GROUPS;
  },

  getSectors(groupId?: PublicNavigationGroupId | 'all'): SectorViewModel[] {
    if (!groupId || groupId === 'all') return sectors();
    return sectors().filter(s => s.parentPublicGroup === groupId);
  },

  getSectorBySlug(slug: string): SectorViewModel | undefined {
    if (!slug) return undefined;
    const lower = slug.toLowerCase();
    const clean = lower.replace(/[-_]/g, '');
    return sectors().find(s => {
      const sId = s.id.toLowerCase();
      const sSlug = s.slug.toLowerCase();
      const sClean = sId.replace(/[-_]/g, '');
      return (
        sSlug === lower ||
        sId === lower ||
        s.sectorId.toLowerCase() === lower ||
        sClean === clean ||
        sId.startsWith(lower) ||
        sSlug.startsWith(lower) ||
        lower.startsWith(sClean) ||
        lower.startsWith(sId.split('_')[0])
      );
    });
  },

  // Achievements
  getAchievements(filters?: AchievementFilterOptions): AchievementViewModel[] {
    const rawList = achievements();
    const selectedState = filters?.state && filters.state !== 'all' ? filters.state : undefined;

    let results = rawList.map(a => {
      const scopeInfo = deriveGeographicScope(a, selectedState);
      const citizenImpact = a.citizenImpact || getCitizenImpactForRecord(a.slug || a.id);
      return {
        ...a,
        scopeInfo,
        citizenImpact,
      };
    });

    if (filters) {
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase().trim();
        results = results.filter(
          a =>
            a.title.toLowerCase().includes(query) ||
            a.summary.toLowerCase().includes(query) ||
            a.sectorName.toLowerCase().includes(query) ||
            a.leadMda.toLowerCase().includes(query) ||
            a.statesCovered.some(s => s.toLowerCase().includes(query))
        );
      }

      if (filters.publicGroup && filters.publicGroup !== 'all') {
        results = results.filter(a => a.publicNavigationGroup === filters.publicGroup);
      }

      if (filters.sectorId && filters.sectorId !== 'all') {
        results = results.filter(a => a.sectorId === filters.sectorId || a.sectorName.toLowerCase().includes(filters.sectorId.toLowerCase()));
      }

      if (filters.recordType && filters.recordType !== 'all') {
        results = results.filter(a => a.recordType === filters.recordType);
      }

      if (filters.status && filters.status !== 'all') {
        results = results.filter(a => a.status === filters.status);
      }

      if (filters.verificationStatus && filters.verificationStatus !== 'all') {
        results = results.filter(a => a.verificationStatus === filters.verificationStatus);
      }

      if (filters.evidenceProfile && filters.evidenceProfile !== 'all') {
        results = results.filter(a => a.evidenceProfile === filters.evidenceProfile);
      }

      if (filters.state && filters.state !== 'all') {
        const targetStateLower = filters.state.toLowerCase();
        results = results.filter(a => {
          const directMatch = a.statesCovered.some(s => s.toLowerCase().includes(targetStateLower));
          const textMatch = a.title.toLowerCase().includes(targetStateLower) || a.summary.toLowerCase().includes(targetStateLower);
          const nationalMatch = a.statesCovered.some(s => s.toLowerCase() === 'national' || s.toLowerCase().includes('36 states') || s.toLowerCase().includes('nationwide'));
          return directMatch || textMatch || nationalMatch;
        });

        // Sort by geographic relevance rank when filtering by state (unless an explicit sort is set)
        if (!filters.sortBy || filters.sortBy === 'geographic') {
          results.sort((a, b) => {
            const rankA = a.scopeInfo ? getGeographicRelevanceRank(a.scopeInfo) : 4;
            const rankB = b.scopeInfo ? getGeographicRelevanceRank(b.scopeInfo) : 4;
            if (rankA !== rankB) return rankA - rankB;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
        }
      }

      if (filters.scopeType && filters.scopeType !== 'all') {
        results = results.filter(a => {
          if (filters.scopeType === 'state_specific') return a.scopeInfo?.isStateSpecific;
          if (filters.scopeType === 'multi_state') return a.scopeInfo?.isMultiState || a.scopeInfo?.isCorridor;
          if (filters.scopeType === 'nationwide') return a.scopeInfo?.isNationwide;
          return a.scopeInfo?.scope === filters.scopeType;
        });
      }

      if (filters.year && filters.year !== 'all') {
        results = results.filter(a => a.date.startsWith(filters.year!));
      }

      if (filters.sortBy && filters.sortBy !== 'geographic') {
        if (filters.sortBy === 'newest') {
          results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (filters.sortBy === 'oldest') {
          results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (filters.sortBy === 'title') {
          results.sort((a, b) => a.title.localeCompare(b.title));
        } else if (filters.sortBy === 'status') {
          results.sort((a, b) => a.status.localeCompare(b.status));
        }
      }
    }

    return results;
  },

  getStateRecordBreakdown(stateName: string) {
    const allStateAchievements = this.getAchievements({ state: stateName });
    let stateSpecificCount = 0;
    let multiStateCount = 0;
    let corridorCount = 0;
    let nationwideCount = 0;
    let regionalCount = 0;

    const stateSpecificRecords: AchievementViewModel[] = [];
    const multiStateRecords: AchievementViewModel[] = [];
    const nationwideRecords: AchievementViewModel[] = [];

    allStateAchievements.forEach(a => {
      const scope = a.scopeInfo?.scope || 'nationwide';
      if (scope === 'state_specific' || scope === 'fct_specific') {
        stateSpecificCount++;
        stateSpecificRecords.push(a);
      } else if (scope === 'project_corridor') {
        corridorCount++;
        multiStateRecords.push(a);
      } else if (scope === 'multi_state') {
        multiStateCount++;
        multiStateRecords.push(a);
      } else if (scope === 'regional_zonal') {
        regionalCount++;
        multiStateRecords.push(a);
      } else {
        nationwideCount++;
        nationwideRecords.push(a);
      }
    });

    return {
      totalRelevant: allStateAchievements.length,
      stateSpecificCount,
      multiStateCount,
      corridorCount,
      nationwideCount,
      regionalCount,
      stateSpecificRecords,
      multiStateRecords,
      nationwideRecords,
    };
  },

  getAchievementBySlug(slug: string): AchievementViewModel | undefined {
    const ach = achievements().find(a => a.slug === slug || a.id === slug);
    if (!ach) return undefined;
    const scopeInfo = deriveGeographicScope(ach);
    const citizenImpact = ach.citizenImpact || getCitizenImpactForRecord(ach.slug || ach.id);
    return {
      ...ach,
      scopeInfo,
      citizenImpact,
    };
  },

  getFeaturedAchievements(): AchievementViewModel[] {
    return achievements().filter(a => a.featured);
  },

  // Projects
  getProjects(sectorId?: string): ProjectViewModel[] {
    if (!sectorId || sectorId === 'all') return projects();
    return projects().filter(p => p.sectorId === sectorId);
  },

  getProjectBySlug(slug: string): ProjectViewModel | undefined {
    return projects().find(p => p.slug === slug || p.id === slug);
  },

  // Policies
  getPolicies(sectorId?: string): PolicyViewModel[] {
    if (!sectorId || sectorId === 'all') return policies();
    return policies().filter(p => p.sectorId === sectorId);
  },

  getPolicyBySlug(slug: string): PolicyViewModel | undefined {
    return policies().find(p => p.slug === slug || p.id === slug);
  },

  // Programmes
  getProgrammes(sectorId?: string): ProgrammeViewModel[] {
    if (!sectorId || sectorId === 'all') return programmes();
    return programmes().filter(p => p.sectorId === sectorId);
  },

  getProgrammeBySlug(slug: string): ProgrammeViewModel | undefined {
    return programmes().find(p => p.slug === slug || p.id === slug);
  },

  // Cross-Type Latest Updates
  getLatestUpdates(limit = 3): LatestUpdateItem[] {
    const achs: LatestUpdateItem[] = achievements().map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      summary: a.summary,
      recordType: a.recordType || 'achievement',
      recordTypeLabel: a.recordTypeLabel || 'Achievement',
      status: a.status,
      statusLabel: a.statusLabel,
      leadMda: a.leadMda,
      leadSource: a.evidenceClaims?.[0]?.sources?.[0]?.publisher || a.leadMda || 'Federal Government of Nigeria',
      routePath: `/achievements/${a.slug || a.id}`,
      eventDate: a.date,
      publishedAt: a.publishedAt || a.date,
      updatedAt: a.updatedAt || a.publishedAt || a.date,
      verificationStatus: a.verificationStatus,
    }));

    const projs: LatestUpdateItem[] = projects().map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      recordType: 'physical_project',
      recordTypeLabel: p.projectTypeLabel || 'Capital Project',
      status: p.status,
      statusLabel: p.statusLabel,
      leadMda: p.executingAgency,
      leadSource: p.evidenceClaims?.[0]?.sources?.[0]?.publisher || p.executingAgency || 'Federal Ministry of Works',
      routePath: `/projects/${p.slug || p.id}`,
      eventDate: p.completionOrCurrentDate || p.startDate,
      publishedAt: p.publishedAt || p.startDate,
      updatedAt: p.updatedAt || p.publishedAt || p.startDate,
      verificationStatus: undefined,
    }));

    const pols: LatestUpdateItem[] = policies().map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      recordType: 'policy',
      recordTypeLabel: p.policyTypeLabel || 'Statutory Policy',
      status: p.status,
      statusLabel: p.statusLabel,
      leadMda: p.leadMinistry,
      leadSource: p.evidenceClaims?.[0]?.sources?.[0]?.publisher || p.leadMinistry || 'Federal Ministry of Justice',
      routePath: `/policies/${p.slug || p.id}`,
      eventDate: p.effectiveDate || p.approvalDate,
      publishedAt: p.publishedAt || p.approvalDate,
      updatedAt: p.updatedAt || p.publishedAt || p.approvalDate,
      verificationStatus: undefined,
    }));

    const prgs: LatestUpdateItem[] = programmes().map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      recordType: 'programme',
      recordTypeLabel: p.programmeTypeLabel || 'National Programme',
      status: p.status,
      statusLabel: p.statusLabel,
      leadMda: p.coordinatingAgency,
      leadSource: p.evidenceClaims?.[0]?.sources?.[0]?.publisher || p.coordinatingAgency || 'Federal Government of Nigeria',
      routePath: `/programmes/${p.slug || p.id}`,
      eventDate: p.launchDate,
      publishedAt: p.publishedAt || p.launchDate,
      updatedAt: p.updatedAt || p.publishedAt || p.launchDate,
      verificationStatus: undefined,
    }));

    const allRecords = [...achs, ...projs, ...pols, ...prgs];

    allRecords.sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return a.title.localeCompare(b.title);
    });

    return allRecords.slice(0, limit);
  },

  // Adjacent Achievements Navigation
  getAdjacentAchievements(slug: string): { prev: AchievementViewModel | null; next: AchievementViewModel | null } {
    const list = this.getAchievements({ sortBy: 'newest' });
    const index = list.findIndex(a => a.slug === slug || a.id === slug);
    if (index === -1) return { prev: null, next: null };
    const prev = index > 0 ? list[index - 1] : null;
    const next = index < list.length - 1 ? list[index + 1] : null;
    return { prev, next };
  },

  getRelatedAchievements(achievement: AchievementViewModel, limit = 3): AchievementViewModel[] {
    const all = this.getAchievements();
    return all
      .filter(a => (a.slug !== achievement.slug && a.id !== achievement.id) && (
        a.sectorId === achievement.sectorId ||
        a.publicNavigationGroup === achievement.publicNavigationGroup ||
        a.date.slice(0, 4) === achievement.date.slice(0, 4)
      ))
      .slice(0, limit);
  },

  getTimelineEventsForAchievement(slugOrId: string): TimelineEventViewModel[] {
    const ach = this.getAchievementBySlug(slugOrId);
    const allEvents = this.getTimelineEvents();
    if (!ach) return [];
    return allEvents.filter(e =>
      e.recordId === ach.id ||
      e.recordId === ach.slug ||
      e.recordSlug === ach.slug ||
      (ach.title && e.title && ach.title.toLowerCase().includes(e.title.toLowerCase().slice(0, 20)))
    );
  },

  // Timeline Events
  getTimelineEvents(filters?: TimelineFilterOptions): TimelineEventViewModel[] {
    const allAchs = achievements();
    const allProjs = projects();
    const allPols = policies();
    const allPrgs = programmes();

    let events = timelineEvents().map(e => {
      const slug = e.slug || e.id.toLowerCase();
      let associatedRecordId = e.associatedRecordId || e.recordId;
      let associatedRecordSlug = e.associatedRecordSlug || e.recordSlug;
      let associatedRecordType = e.associatedRecordType || (e.recordType as any);
      let associatedRecordTitle = e.associatedRecordTitle;
      let associatedRecordRoute: string | undefined = undefined;

      if (associatedRecordId || associatedRecordSlug) {
        const ach = allAchs.find(a => a.id === associatedRecordId || a.slug === associatedRecordId || a.slug === associatedRecordSlug || (a.title && e.title && a.title.toLowerCase().includes(e.title.toLowerCase().slice(0, 20))));
        if (ach) {
          associatedRecordSlug = ach.slug;
          associatedRecordType = 'achievement';
          associatedRecordTitle = ach.title;
          associatedRecordRoute = `/achievements/${ach.slug}`;
        } else {
          const prj = allProjs.find(p => p.id === associatedRecordId || p.slug === associatedRecordId || p.slug === associatedRecordSlug);
          if (prj) {
            associatedRecordSlug = prj.slug;
            associatedRecordType = 'project';
            associatedRecordTitle = prj.title;
            associatedRecordRoute = `/projects/${prj.slug}`;
          } else {
            const pol = allPols.find(p => p.id === associatedRecordId || p.slug === associatedRecordId || p.slug === associatedRecordSlug);
            if (pol) {
              associatedRecordSlug = pol.slug;
              associatedRecordType = 'policy';
              associatedRecordTitle = pol.title;
              associatedRecordRoute = `/policies/${pol.slug}`;
            } else {
              const prg = allPrgs.find(pr => pr.id === associatedRecordId || pr.slug === associatedRecordId || pr.slug === associatedRecordSlug);
              if (prg) {
                associatedRecordSlug = prg.slug;
                associatedRecordType = 'programme';
                associatedRecordTitle = prg.title;
                associatedRecordRoute = `/programmes/${prg.slug}`;
              }
            }
          }
        }
      }

      return {
        ...e,
        slug,
        routePath: `/timeline/${slug}`,
        associatedRecordId,
        associatedRecordSlug,
        associatedRecordType,
        associatedRecordTitle,
        recordSlug: associatedRecordSlug,
        recordType: associatedRecordType || 'achievement',
      };
    });

    if (filters) {
      if (filters.year && filters.year !== 'all') {
        events = events.filter(e => e.eventDate.startsWith(filters.year!) || String(e.year) === filters.year);
      }
      if (filters.sectorId && filters.sectorId !== 'all') {
        events = events.filter(e => e.sectorId === filters.sectorId || (e as any).sectorSlug === filters.sectorId);
      }
      if (filters.eventType && filters.eventType !== 'all') {
        events = events.filter(e => e.eventType === filters.eventType || e.stage === filters.eventType);
      }
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        events = events.filter(e => 
          e.title.toLowerCase().includes(q) || 
          e.summary.toLowerCase().includes(q) || 
          (e.details && e.details.toLowerCase().includes(q)) ||
          e.leadActor.toLowerCase().includes(q)
        );
      }
    }

    events.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
    return events;
  },

  getTimelineEventByIdOrSlug(idOrSlug: string): TimelineEventViewModel | undefined {
    if (!idOrSlug) return undefined;
    const clean = idOrSlug.toLowerCase().trim();
    const parts = clean.split('/').filter(Boolean);
    const candidateSlug = parts[parts.length - 1];
    const candidateId = parts[0];

    const allEvents = this.getTimelineEvents();
    return allEvents.find(e => 
      e.slug.toLowerCase() === clean ||
      e.id.toLowerCase() === clean ||
      e.slug.toLowerCase() === candidateSlug ||
      e.id.toLowerCase() === candidateId ||
      e.id.toLowerCase().replace(/[-_]/g, '') === clean.replace(/[-_]/g, '') ||
      e.slug.toLowerCase().replace(/[-_]/g, '') === clean.replace(/[-_]/g, '')
    );
  },

  getAdjacentTimelineEvents(idOrSlug: string): { prev: TimelineEventViewModel | null; next: TimelineEventViewModel | null } {
    const allEvents = this.getTimelineEvents();
    const current = this.getTimelineEventByIdOrSlug(idOrSlug);
    if (!current) return { prev: null, next: null };

    const index = allEvents.findIndex(e => e.id === current.id || e.slug === current.slug);
    if (index === -1) return { prev: null, next: null };

    return {
      prev: index > 0 ? allEvents[index - 1] : null,
      next: index < allEvents.length - 1 ? allEvents[index + 1] : null,
    };
  },

  getRelatedTimelineEvents(event: TimelineEventViewModel, limit = 3): TimelineEventViewModel[] {
    const allEvents = this.getTimelineEvents();
    return allEvents
      .filter(e => e.id !== event.id && (e.sectorId === event.sectorId || e.category === event.category || e.year === event.year))
      .slice(0, limit);
  },

  // States & Geography
  getStates(): StateProfileViewModel[] {
    return states();
  },

  getStateBySlug(slug: string): StateProfileViewModel | undefined {
    if (!slug) return undefined;
    const lower = slug.toLowerCase().replace(/[-_\s]/g, '');
    return states().find(s => {
      const sName = s.name.toLowerCase().replace(/[-_\s]/g, '');
      const sSlug = s.slug.toLowerCase().replace(/[-_\s]/g, '');
      const sCode = s.code.toLowerCase().replace(/[-_\s]/g, '');
      return sSlug === lower || sName === lower || sCode === lower || sSlug.includes(lower) || lower.includes(sSlug);
    });
  },

  // Datasets
  getDatasets(): DatasetResourceViewModel[] {
    return datasets();
  },

  getPublicDownloadData(): Record<string, string | null>[] {
    if (runtimeData) return runtimeData.publicDownload;
    return achievements().map((record) => ({
      slug: record.slug,
      record_type: record.recordType,
      title: record.title,
      summary: record.summary,
      status: record.status,
      verification_status: record.verificationStatus,
      sector: record.sectorId,
      published_at: record.date,
    }));
  },

  // Macro Counters for Hero & Dashboard
  getMacroCounters() {
    if (runtimeData) return runtimeData.macroCounters;
    return {
      timeframe: "29 May 2023 — August 2026",
      verifiedAchievements: achievements().length,
      canonicalSectors: sectors().length,
      capitalProjectsActive: projects().length,
      subNationalStatesTracked: states().length,
      studentBeneficiariesFormatted: "350,000+",
      externalReservesFormatted: "Strengthened Buffer",
      highwayKilometersFormatted: "2,400+ km",
      lastAuditSync: "2026-08-15"
    };
  },

  // Global Search
  searchGlobal(query: string): GlobalSearchResultItem[] {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    const results: GlobalSearchResultItem[] = [];

    // Search Achievements
    for (const a of achievements()) {
      if (a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.sectorName.toLowerCase().includes(q)) {
        results.push({
          id: a.id,
          title: a.title,
          subtitle: `${a.sectorName} • ${a.statusLabel}`,
          category: 'Achievements',
          url: `/achievements/${a.slug}`,
          badgeText: a.statusLabel,
          badgeVariant: 'emerald'
        });
      }
    }

    // Search Projects
    for (const p of projects()) {
      if (p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.contractor?.toLowerCase().includes(q)) {
        results.push({
          id: p.id,
          title: p.title,
          subtitle: `${p.sectorName} • Progress: ${p.progressPercentage}%`,
          category: 'Projects',
          url: `/projects/${p.slug}`,
          badgeText: `${p.progressPercentage}%`,
          badgeVariant: 'gold'
        });
      }
    }

    // Search Policies
    for (const pol of policies()) {
      if (pol.title.toLowerCase().includes(q) || pol.summary.toLowerCase().includes(q)) {
        results.push({
          id: pol.id,
          title: pol.title,
          subtitle: `${pol.policyTypeLabel} • ${pol.statusLabel}`,
          category: 'Policies',
          url: `/policies/${pol.slug}`,
          badgeText: pol.statusLabel,
          badgeVariant: 'navy'
        });
      }
    }

    // Search Programmes
    for (const programme of programmes()) {
      if (programme.title.toLowerCase().includes(q) || programme.summary.toLowerCase().includes(q) || programme.coordinatingAgency?.toLowerCase().includes(q)) {
        results.push({
          id: programme.id,
          title: programme.title,
          subtitle: `${programme.sectorName} • ${programme.statusLabel}`,
          category: 'Programmes',
          url: `/programmes/${programme.slug}`,
          badgeText: programme.statusLabel,
          badgeVariant: 'emerald'
        });
      }
    }

    // Search Sectors
    for (const sec of sectors()) {
      if (sec.name.toLowerCase().includes(q) || sec.summary.toLowerCase().includes(q) || sec.keyObjectives.some(k => k.toLowerCase().includes(q))) {
        results.push({
          id: sec.id,
          title: sec.name,
          subtitle: `${sec.parentPublicGroupLabel} • ${sec.achievementCount} Achievements`,
          category: 'Sectors',
          url: `/sectors/${sec.slug}`,
          badgeText: 'Sector',
          badgeVariant: 'slate'
        });
      }
    }

    // Search States
    for (const st of states()) {
      if (st.name.toLowerCase().includes(q) || st.capital.toLowerCase().includes(q) || st.geopoliticalZone.toLowerCase().includes(q)) {
        results.push({
          id: st.slug,
          title: `${st.name} State (${st.geopoliticalZone})`,
          subtitle: `Capital: ${st.capital} • ${st.projectCount} Projects`,
          category: 'States',
          url: `/states/${st.slug}`,
          badgeText: st.geopoliticalZone,
          badgeVariant: 'emerald'
        });
      }
    }

    return results.slice(0, 12);
  },

  // Client-Side Export Actions
  exportToCsv(data: Record<string, unknown>[], filename: string) {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers
          .map(header => {
            const val = row[header];
            if (val === null || val === undefined) return '""';
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportToJson(data: unknown, filename: string) {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportToTextSummary(record: AchievementViewModel) {
    const text = [
      `TINUBU ACHIEVEMENT TRACKER — OFFICIAL RESEARCH BRIEF (2023 - 2026)`,
      `===================================================================`,
      `TITLE: ${record.title}`,
      `SECTOR: ${record.sectorName} (${record.publicNavigationGroupLabel})`,
      `RECORD TYPE: ${record.recordTypeLabel}`,
      `IMPLEMENTATION STATUS: ${record.statusLabel}`,
      `VERIFICATION STATUS: ${record.verificationStatus}`,
      `EVIDENCE PROFILE: ${record.evidenceProfileLabel}`,
      `LEAD MDA: ${record.leadMda}`,
      `STATES COVERED: ${record.statesCovered.join(', ')}`,
      `DATE / PERIOD: ${record.date} (${record.datePrecision})`,
      ``,
      `EXECUTIVE SUMMARY:`,
      `${record.summary}`,
      ``,
      `DETAILED RECORD:`,
      `${record.description}`,
      ``,
      `EVIDENCE CLAIMS & CITATIONS:`,
      ...record.evidenceClaims.map((c, i) => 
        `[Claim ${i+1}] ${c.claimText}\n  Sources: ${c.sources.map(s => `${s.title} (${s.publisher}, Level: ${s.sourceLevel})`).join('; ')}`
      ),
      ``,
      `DATA STATUS: [CANONICAL PUBLIC RECORD]`,
      `===================================================================`
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${record.slug}-research-brief.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
