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
  if (!slug) return undefined;
  const normalized = slug.toLowerCase();
  return sectorsData.find((s) => 
    s.slug.toLowerCase() === normalized || 
    (s.id && s.id.toLowerCase() === normalized) ||
    (normalized === 'economy' && s.slug === 'economy-fiscal-reforms') ||
    (normalized === 'security' && s.slug === 'security-national-stability') ||
    (normalized === 'infrastructure' && s.slug === 'infrastructure-transportation') ||
    (normalized === 'social-services' && s.slug === 'social-protection-human-development') ||
    (normalized === 'governance' && s.slug === 'governance-public-service')
  );
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