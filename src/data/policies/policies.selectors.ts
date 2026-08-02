import { PolicyRecord, PolicyFilterOptions } from "@/types/policy.types";
import { policiesData } from "./policies.data";

export const selectAllPolicies = (): PolicyRecord[] => {
  return policiesData.filter((p) => p.publicationStatus === "publishable" || p.publicationStatus === "publishable-with-qualification");
};

export const selectPolicyBySlug = (slug: string): PolicyRecord | undefined => {
  return policiesData.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
};

export const selectPoliciesBySector = (sectorSlug: string): PolicyRecord[] => {
  return selectAllPolicies().filter((p) => p.sectorSlug.toLowerCase() === sectorSlug.toLowerCase());
};

export const selectFilteredPolicies = (options: PolicyFilterOptions): PolicyRecord[] => {
  const { type, status, sector, searchQuery } = options;

  return selectAllPolicies().filter((policy) => {
    if (type && type !== "all" && policy.policyType !== type) return false;
    if (status && status !== "all" && policy.status !== status) return false;
    if (sector && sector !== "all" && policy.sectorSlug.toLowerCase() !== sector.toLowerCase()) return false;

    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      const matchesTitle = policy.title.toLowerCase().includes(q) || policy.shortTitle.toLowerCase().includes(q);
      const matchesSummary = policy.summary.toLowerCase().includes(q);
      const matchesAgency = policy.leadAgency.toLowerCase().includes(q);
      if (!matchesTitle && !matchesSummary && !matchesAgency) return false;
    }

    return true;
  });
};
