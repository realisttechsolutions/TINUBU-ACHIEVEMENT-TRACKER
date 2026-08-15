# Tinubu Achievement Tracker — Human & AI Operating Model & Escalation Policy (v1.1.1)

**Standard Version:** 1.1.1  
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1.1  

---

## 1. Core Operating Principle: Strict Separation of Duties

> [!IMPORTANT]
> **NO SINGLE AI AGENT OR RESEARCHER MAY DISCOVER, EXTRACT, APPROVE, AND PUBLISH A RECORD.**  
> Research tasks are distributed across 11 discrete roles to guarantee independent multi-agent verification, factual reconciliation, automated QA, and mandatory human sign-off before any claim is published.

---

## 2. The 11 Research Operating Roles

```text
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                11 RESEARCH OPERATING ROLES                                        |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| 1. RESEARCH PLANNER:           Authorizes research tasks, assigns sector portfolios, sets risks.  |
| 2. SOURCE DISCOVERY AGENT:     Scans gazettes, agency portals, NBS/CBN releases for raw leads.    |
| 3. SOURCE CAPTURE AGENT:       Captures source metadata, URLs, document numbers, archive hashes.  |
| 4. EXTRACTION AGENT:           Extracts atomic claims, numeric figures, dates, and exact locators.|
| 5. ENTITY RESOLUTION AGENT:    Resolves MDAs, institutions, sectors, and geographies to PKs.     |
| 6. VERIFICATION AGENT:         Cross-checks claims against multi-tier independent evidence.       |
| 7. RECONCILIATION AGENT:       Adjudicates contradictions, duplicate candidates, and aliases.     |
| 8. SCHEMA / QA AGENT:          Executes automated AJV Draft-07 validation and dry-run checks.     |
| 9. EDITORIAL AGENT:            Audits compliance with the 18 Truth Safeguards and drafting tone.  |
| 10. HUMAN REVIEWER / LEAD:     Mandatory human approval for publication and high-risk claims.     |
| 11. DATA PUBLISHER:            Executes privileged transactional ingestion to database.           |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
```

---

## 3. Governed Human-Review Escalation Policy

### 3.1 Primary Qualitative Escalation Triggers
Human Lead Reviewer sign-off is mandatory whenever a research task or claim meets any of the following qualitative criteria:
1. **Research Risk Tier:** Any task or claim rated **High** or **Critical** in Gate 0.
2. **Defense & Strategic Security:** Military operations, counter-terrorism metrics, intelligence procurement, or tactical infrastructure coordinates.
3. **Factual Uncertainty & Contradictions:** Unresolved competing figures or conflicting official reports recorded in `contradiction_log.csv`.
4. **Legal & Reputational Exposure:** Active litigations, constitutional questions, disputed statutory mandates, or ministerial retractions.
5. **Contextual Materiality:** Broad macroeconomic causal claims attributing national trends solely to executive policy.
6. **Exceptional Public Significance:** Ground-breaking national structural reforms (e.g. FX market unification, fuel subsidy removal, state electricity devolution).

### 3.2 Configurable Quantitative Escalation Floors
To ensure automated safety across high-volume pipelines, the platform maintains quantitative escalation floors:
- **Major Financial Values:** Any single financial allocation, contract award, or reported expenditure exceeding **₦100 Billion** (or $100 Million USD).
- **Major Beneficiary Totals:** Any single beneficiary count exceeding **500,000 individuals, households, or MSMEs**.

#### Governance Controls for Quantitative Floors:
- **Policy Owner:** Data Governance Directorate.
- **Review Cadence:** Semi-annually (aligned with national budget cycles and inflation adjustments).
- **Subordination Rule:** Smaller financial or beneficiary figures **must not bypass human review** if they meet any qualitative escalation trigger above.
- **Override Authority:** Only the Lead Editor in consultation with the Editorial Board may adjust threshold parameters.

---

## 4. Implementation-Neutral Access Control Matrix

| Operating Role | Functional Access Level | Data Ingestion Privilege |
|---|---|---|
| Public Reader | Read-only access to published public queries | None |
| Researcher / Extraction Agent | Draft, extract, and stage batch data | Staging queue only |
| Verification / QA Agent | Read internal drafts, execute validation | Validation execution |
| Editor / Editorial Agent | Editorial review and truth audits | Review decision staging |
| Human Lead Reviewer | Publication approval authority | Approval token issuance |
| Compliance Officer | Full audit, redaction, retraction logs | Audit & correction commit |
| System Administrator / Publisher | Database administration and ingestion runner | Transactional production commit |
