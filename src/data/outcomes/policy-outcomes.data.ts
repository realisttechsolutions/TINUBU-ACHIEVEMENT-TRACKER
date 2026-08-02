import { PolicyOutcomeRecord } from "./policy-outcomes.types";

export const policyOutcomesData: PolicyOutcomeRecord[] = [
  {
    id: "poc-001",
    policySlug: "access-to-higher-education-act",
    metricName: "Tertiary Student Loan Disbursements",
    value: "200,000+",
    unit: "Students",
    baseline: "0",
    period: "Q3 2024",
    auditBody: "NELFUND Board Audit",
    verificationSourceUrl: "https://nelfund.gov.ng/"
  },
  {
    id: "poc-002",
    policySlug: "fuel-subsidy-termination-directive",
    policySlug: "fuel-subsidy-termination-directive",
    metricName: "Annual Fiscal Savings",
    value: "4.2 Trillion",
    unit: "NGN",
    baseline: "-4.0 Trillion Deficit",
    period: "FY 2023/2024",
    auditBody: "Central Bank of Nigeria",
    verificationSourceUrl: "https://www.cbn.gov.ng/"
  },
  {
    id: "poc-003",
    policySlug: "fx-market-unification-framework",
    metricName: "Cleared FX Forward Obligations",
    value: "7.0 Billion",
    unit: "USD",
    baseline: "$7bn pending backlog",
    period: "Q1 2024",
    auditBody: "Central Bank of Nigeria",
    verificationSourceUrl: "https://www.cbn.gov.ng/"
  }
];
