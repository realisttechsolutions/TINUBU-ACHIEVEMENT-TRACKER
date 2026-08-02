export interface PolicyOutcomeRecord {
  id: string;
  policySlug: string;
  metricName: string;
  value: string;
  unit?: string;
  baseline?: string;
  period: string;
  auditBody: string;
  verificationSourceUrl: string;
}
