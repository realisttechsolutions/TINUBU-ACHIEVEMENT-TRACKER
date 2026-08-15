# Data Contract: Research, Storage & API Interfaces

## 1. Scope & Versioning

- **Contract Version**: `1.1.2`
- **Taxonomy Vocabulary**: `canonical-vocabulary.v1.1.2.json`
- **Schema Validation Standard**: JSON Schema Draft-07 (Ajv)

## 2. Invariants & Rules
1. **Zero Data Invention**: All records must trace to primary or secondary published sources with verifiable URLs or archival references.
2. **Deterministic Foreign Keys**: All entity IDs are deterministically derived via UUID v5 hashing from the primary research external key.
3. **No Financial Aggregation**: Incompatible financial classes (`budgeted`, `approved`, `released`, `disbursed`, `spent`) must never be summed together.
4. **No Beneficiary Stage Conflation**: Distinct beneficiary stages (`targeted`, `registered`, `verified`, `trained`, `disbursed`, `benefited`) must remain separate in storage and reporting.
5. **No Direct Mutation on Audit Records**: `corrections`, `review_decisions`, and `record_versions` are strictly append-only.
