import { PolicyRecord, PolicyType, PolicyStatus, PolicyFilterOptions } from "@/types/policy.types";
import { policiesData } from "@/data/policies/policies.data";

export const getAllPolicies = (): PolicyRecord[] => {
  return policiesData.filter((p) => p.publicationStatus === "publishable" || p.publicationStatus === "publishable-with-qualification");
};

export const getPolicyBySlug = (slug: string): PolicyRecord | undefined => {
  return policiesData.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
};

export const getPoliciesBySector = (sectorSlug: string): PolicyRecord[] => {
  return getAllPolicies().filter((p) => p.sectorSlug.toLowerCase() === sectorSlug.toLowerCase());
};

export const filterPolicies = (options: PolicyFilterOptions): PolicyRecord[] => {
  const { type, status, sector, searchQuery } = options;

  return getAllPolicies().filter((policy) => {
    // Type Filter
    if (type && type !== "all" && policy.policyType !== type) {
      return false;
    }

    // Status Filter
    if (status && status !== "all" && policy.status !== status) {
      return false;
    }

    // Sector Filter
    if (sector && sector !== "all" && policy.sectorSlug.toLowerCase() !== sector.toLowerCase()) {
      return false;
    }

    // Search Query Filter
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      const matchesTitle = policy.title.toLowerCase().includes(q) || policy.shortTitle.toLowerCase().includes(q);
      const matchesSummary = policy.summary.toLowerCase().includes(q);
      const matchesAgency = policy.leadAgency.toLowerCase().includes(q);
      const matchesAuthority = policy.authorityReference?.toLowerCase().includes(q);

      if (!matchesTitle && !matchesSummary && !matchesAgency && !matchesAuthority) {
        return false;
      }
    }

    return true;
  });
};
