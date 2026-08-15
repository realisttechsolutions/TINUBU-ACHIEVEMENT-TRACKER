# Tinubu Achievement Tracker — Atomic Evidence Standard (v1.1)

**Standard Version:** 1.1.2
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1.2
**Schema Mapping:** `research/schemas/claim_extraction.schema.json` & `research/schemas/claim_source_relationship.schema.json`  

---

## 1. Principles of Atomic Claim Extraction

Research Contract v1.1 mandates that all research records decompose high-level governance accomplishments into **atomic factual claims**:
1. **Atomicity:** Each claim must assert exactly one verifiable factual proposition (e.g. "FEC approved ₦47B contract", "Phase 1 covers 47 kilometers", "Disbursement commenced on 15 May 2024").
2. **Decoupled Verification:** Claims are verified independently through many-to-many source links rather than binding the entire parent record to a single URL.
3. **Structured Attribution:** Every claim specifies its Data Value Nature (`actual`, `provisional`, `estimated`, etc.) and Reporting Origin (`government_reported`, `independently_reported`).
4. **Content Minimization:** Full-text copyright infringement is strictly prevented. Researchers must record concise summaries and exact locators (`page`, `section`, `table`, `paragraph`, `dataset_row`).

---

## 2. Claim Classification & Verification Matrix

Every atomic claim must be categorized under one of the 12 canonical claim types:
- `legal_status`: Statutory validity, gazette reference, assent.
- `policy_action`: Executive directive, circular issuance, strategy launch.
- `implementation_status`: Current delivery stage within the 21-stage lifecycle.
- `project_status`: Physical construction progress percentage, section completion.
- `financial_value`: Monetary allocation, approval, warrant release, or expenditure.
- `beneficiary_value`: Enumerated count of screened, approved, or disbursed beneficiaries.
- `statistical_indicator`: Measured change in national macro or sectoral time series.
- `geographic_scope`: Spatial coverage (states, LGAs, corridors, coordinates).
- `timeline_event`: Specific dated milestone occurrence.
- `reported_outcome`: Empirical societal, operational, or economic outcome.
- `institutional_responsibility`: Lead executing MDA and partner institutions.
- `context`: Macroeconomic, historical, or baseline framing.
