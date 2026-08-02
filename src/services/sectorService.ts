import { SectorRecord, SectorPublicationStatus } from "@/types/sector";
import { sectorsData } from "@/data/sectors/sectors.data";
import { achievementsData } from "@/data/achievements/achievements.data";
import { AchievementRecord } from "@/types/achievement";

export const getAllSectors = (): SectorRecord[] => {
  return sectorsData;
};

export const getPublicSectors = (): SectorRecord[] => {
  return sectorsData.filter(
    (s) => s.publicationStatus === "active" || s.publicationStatus === "active-with-qualification"
  );
};

export const getDevelopingSectors = (): SectorRecord[] => {
  return sectorsData.filter((s) => s.publicationStatus === "developing");
};

export const getSectorBySlug = (slug: string): SectorRecord | undefined => {
  return sectorsData.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
};

export const getSectorAchievements = (sectorSlug: string): AchievementRecord[] => {
  const sector = getSectorBySlug(sectorSlug);
  if (!sector) return [];

  const filterCategory = sector.achievementFilterCategory || sector.slug;
  return achievementsData.filter(
    (achievement) =>
      achievement.sector.toLowerCase() === filterCategory.toLowerCase() &&
      achievement.publicationStatus === "publishable"
  );
};

export const getRelatedSectors = (sectorSlug: string): SectorRecord[] => {
  const sector = getSectorBySlug(sectorSlug);
  if (!sector || !sector.relatedSectorSlugs) return [];

  return sector.relatedSectorSlugs
    .map((slug) => getSectorBySlug(slug))
    .filter((s): s is SectorRecord => s !== undefined);
};
