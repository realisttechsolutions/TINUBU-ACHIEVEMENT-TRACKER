# TAT M09 Firebase Data Handoff Contract
## Interface Specification between Next.js Frontend and Codex Firebase Data Foundation (Mission 10)

**From:** Development Mission 09 (Antigravity Frontend & Next.js Architecture)  
**To:** Codex Engineering E01 / Mission 10 (Firebase Production Data Foundation & Ingestion)  
**Status:** READY FOR MISSION 10 INTEGRATION  

---

## 1. Unified Data Access Layer (`src/adapters/dataAdapter.ts`)

Mission 09 established a clean data facade interface (`dataAdapter.ts`) that isolates all React views from the underlying data source.

### Data Facade Methods Available:
- `dataAdapter.getAchievements(filter?: FilterOptions): Promise<AchievementRecord[]> | AchievementRecord[]`
- `dataAdapter.getAchievementBySlug(slug: string): Promise<AchievementRecord | undefined> | AchievementRecord | undefined`
- `dataAdapter.getSectors(): Promise<SectorRecord[]> | SectorRecord[]`
- `dataAdapter.getSectorBySlug(slug: string): Promise<SectorRecord | undefined> | SectorRecord | undefined`
- `dataAdapter.getStates(): Promise<StateRecord[]> | StateRecord[]`
- `dataAdapter.getStateBySlug(slug: string): Promise<StateRecord | undefined> | StateRecord | undefined`
- `dataAdapter.getPolicies(): Promise<PolicyRecord[]> | PolicyRecord[]`
- `dataAdapter.getPolicyBySlug(slug: string): Promise<PolicyRecord | undefined> | PolicyRecord | undefined`
- `dataAdapter.getMacroeconomicIndicators(): Promise<MacroIndicator[]> | MacroIndicator[]`
- `dataAdapter.getTimelineEvents(): Promise<TimelineEvent[]> | TimelineEvent[]`

---

## 2. Transition Plan for Mission 10 & 12 (Live Firebase Integration)

In Mission 10, Codex will provision the Firestore collections conforming to the 19 Research Schemas (v1.1.2).
In Mission 12, `src/adapters/dataAdapter.ts` will simply switch its internal data fetching from static arrays to Firebase Firestore client/admin SDK queries without requiring any changes to Next.js page components or views.