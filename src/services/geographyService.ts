import { StateRecord, ZoneRecord, StateImpactSummary, GeopoliticalZone } from "@/types/geography.types";
import { statesData, geopoliticalZones } from "@/data/geography/states.data";
import { achievementsData } from "@/data/achievements/achievements.data";
import { AchievementRecord } from "@/types/achievement";
import { dataAdapter } from '@/adapters/dataAdapter';

export const getAllStates = (): StateRecord[] => {
  return statesData;
};

export const getStateBySlug = (slug: string): StateRecord | undefined => {
  return statesData.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
};

export const getStateByCode = (code: string): StateRecord | undefined => {
  return statesData.find((s) => s.code.toUpperCase() === code.toUpperCase());
};

export const getGeopoliticalZones = (): ZoneRecord[] => {
  return geopoliticalZones;
};

export const getZoneById = (id: string): ZoneRecord | undefined => {
  return geopoliticalZones.find((z) => z.id.toLowerCase() === id.toLowerCase());
};

export const getStateAchievements = (stateSlug: string): AchievementRecord[] => {
  const state = getStateBySlug(stateSlug);
  if (!state) return [];

  const stateNameLower = state.shortName.toLowerCase();

  return achievementsData.filter((achievement) => {
    // Check state-specific array match
    if (achievement.statesCovered && achievement.statesCovered.length > 0) {
      const isExplicitlyCovered = achievement.statesCovered.some(
        (s) =>
          s.toLowerCase().includes(stateNameLower) ||
          s.toLowerCase().includes("all 36 states") ||
          s.toLowerCase() === "national"
      );
      if (isExplicitlyCovered) return true;
    }

    // Check beneficiaries or scope description
    if (achievement.beneficiariesOrScope) {
      const scopeLower = achievement.beneficiariesOrScope.toLowerCase();
      if (scopeLower.includes(stateNameLower) || scopeLower.includes("36 states") || scopeLower.includes("national")) {
        return true;
      }
    }

    // Check geopolitical zone match
    if (achievement.geopoliticalZone) {
      const zoneLower = achievement.geopoliticalZone.toLowerCase();
      if (zoneLower.includes(state.zone.toLowerCase()) || zoneLower.includes("national")) {
        return true;
      }
    }

    return false;
  });
};

export const getStateImpactSummary = (stateSlug: string): StateImpactSummary | undefined => {
  const state = getStateBySlug(stateSlug);
  if (!state) return undefined;

  const achievements = dataAdapter.getAchievements({ state: state.shortName });

  let stateSpecificCount = 0;
  let multiStateCount = 0;
  let nationalCount = 0;

  const activeSectorsSet = new Set<string>();
  const leadMinistriesSet = new Set<string>();

  achievements.forEach((ach) => {
    activeSectorsSet.add(ach.sectorName);
    leadMinistriesSet.add(ach.leadMda);

    const isNational =
      ach.statesCovered.some((covered) => covered.toLowerCase() === 'national' || covered.toLowerCase().includes('36 states'));

    if (isNational) {
      nationalCount++;
    } else if (ach.statesCovered && ach.statesCovered.length > 1) {
      multiStateCount++;
    } else {
      stateSpecificCount++;
    }
  });

  return {
    state,
    totalPublishedRecords: achievements.length,
    stateSpecificRecordsCount: stateSpecificCount,
    multiStateRecordsCount: multiStateCount,
    nationalRecordsCount: nationalCount,
    activeSectors: Array.from(activeSectorsSet),
    leadMinistries: Array.from(leadMinistriesSet),
  };
};

export const filterAchievementsByZoneAndState = (
  zoneName?: GeopoliticalZone,
  stateCode?: string
): AchievementRecord[] => {
  if (!zoneName && !stateCode) return achievementsData;

  if (stateCode) {
    const state = getStateByCode(stateCode);
    if (state) return getStateAchievements(state.slug);
  }

  if (zoneName) {
    const zone = geopoliticalZones.find((z) => z.name === zoneName);
    if (zone) {
      return achievementsData.filter((ach) => {
        if (ach.geopoliticalZone && ach.geopoliticalZone.toLowerCase().includes(zoneName.toLowerCase())) {
          return true;
        }
        if (ach.statesCovered) {
          return zone.states.some((stCode) => {
            const st = getStateByCode(stCode);
            return st && ach.statesCovered?.some((s) => s.toLowerCase().includes(st.shortName.toLowerCase()));
          });
        }
        return false;
      });
    }
  }

  return achievementsData;
};
