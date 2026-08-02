import { PolicyRecord } from "@/types/policy.types";

export interface PolicyValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePolicyRecord = (policy: PolicyRecord): PolicyValidationResult => {
  const errors: string[] = [];

  if (!policy.id) errors.push("Policy ID is required");
  if (!policy.slug) errors.push("Policy slug is required");
  if (!policy.title) errors.push("Policy title is required");
  if (!policy.sectorSlug) errors.push("Sector slug is required");
  if (!policy.effectiveDate) errors.push("Effective date is required");
  if (!policy.primarySources || policy.primarySources.length === 0) {
    errors.push("Primary source citation is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
