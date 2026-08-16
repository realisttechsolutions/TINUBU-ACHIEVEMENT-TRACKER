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
  PublicNavigationGroupId
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

let runtimeData: PublicDataSnapshot | null = null;

export function hydrateDataAdapter(snapshot: PublicDataSnapshot | null) {
  runtimeData = snapshot;
}

const achievements = () => runtimeData?.achievements ?? DEMO_ACHIEVEMENTS;
const sectors = () => runtimeData?.sectors ?? CANONICAL_SECTORS;
const projects = () => runtimeData?.projects ?? DEMO_PROJECTS;
const policies = () => runtimeData?.policies ?? DEMO_POLICIES;
const programmes = () => runtimeData?.programmes ?? DEMO_PROGRAMMES;
const timelineEvents = () => runtimeData?.timelineEvents ?? DEMO_TIMELINE_EVENTS;
const states = () => runtimeData?.states ?? DEMO_NIGERIA_STATES;
const datasets = () => runtimeData?.datasets ?? DEMO_DATASETS;

export interface AchievementFilterOptions {
  searchQuery?: string;
  publicGroup?: PublicNavigationGroupId | 'all';
  sectorId?: string | 'all';
  recordType?: string | 'all';
  status?: string | 'all';
  verificationStatus?: string | 'all';
  evidenceProfile?: string | 'all';
  state?: string | 'all';
  year?: string | 'all';
  sortBy?: 'newest' | 'oldest' | 'title' | 'status';
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
    let results = [...achievements()];

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
        results = results.filter(a => a.statesCovered.includes(filters.state!) || a.statesCovered.includes('National') || a.statesCovered.includes('All 36 States'));
      }

      if (filters.year && filters.year !== 'all') {
        results = results.filter(a => a.date.startsWith(filters.year!));
      }

      if (filters.sortBy) {
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

  getAchievementBySlug(slug: string): AchievementViewModel | undefined {
    return achievements().find(a => a.slug === slug || a.id === slug);
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

  // Timeline Events
  getTimelineEvents(filters?: TimelineFilterOptions): TimelineEventViewModel[] {
    let events = [...timelineEvents()];

    if (filters) {
      if (filters.year && filters.year !== 'all') {
        events = events.filter(e => e.eventDate.startsWith(filters.year!));
      }
      if (filters.sectorId && filters.sectorId !== 'all') {
        events = events.filter(e => e.sectorId === filters.sectorId);
      }
      if (filters.eventType && filters.eventType !== 'all') {
        events = events.filter(e => e.eventType === filters.eventType);
      }
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        events = events.filter(e => e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q) || e.leadActor.toLowerCase().includes(q));
      }
    }

    events.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
    return events;
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
      verifiedAchievements: DEMO_ACHIEVEMENTS.length,
      canonicalSectors: CANONICAL_SECTORS.length,
      capitalProjectsActive: DEMO_PROJECTS.length,
      subNationalStatesTracked: DEMO_NIGERIA_STATES.length,
      studentBeneficiariesFormatted: "350,000+",
      externalReservesFormatted: "$38.5 Billion",
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
          url: `/projects#${p.slug}`,
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
          url: `/policies#${pol.slug}`,
          badgeText: pol.statusLabel,
          badgeVariant: 'navy'
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
      `DATA WATERMARK: ${record.isDemo ? '[DEMO / SYNTHETIC RESEARCH RECORD]' : '[PUBLIC DATABASE RECORD]'}`,
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
