import { PolicyType, PolicyStatus } from "@/types/policy.types";

export const POLICY_TYPES: { value: PolicyType | "all"; label: string }[] = [
  { value: "all", label: "All Policy Types" },
  { value: "legislation", label: "Statutory Legislation / Acts" },
  { value: "executive-action", label: "Executive Actions & Directives" },
  { value: "fiscal-reform", label: "Fiscal & Revenue Reform" },
  { value: "monetary-financial-reform", label: "Monetary & FX Policy" },
  { value: "infrastructure-policy", label: "Infrastructure Framework" },
  { value: "social-policy", label: "Social Protection & Education" }
];

export const POLICY_STATUSES: { value: PolicyStatus | "all"; label: string }[] = [
  { value: "all", label: "All Implementation Statuses" },
  { value: "announced", label: "Announced" },
  { value: "approved", label: "Approved / FEC Assent" },
  { value: "enacted", label: "Enacted Law" },
  { value: "implementation-ongoing", label: "Implementation Ongoing" },
  { value: "effective", label: "Effective & Operational" },
  { value: "outcome-reported", label: "Impact Audited" }
];
