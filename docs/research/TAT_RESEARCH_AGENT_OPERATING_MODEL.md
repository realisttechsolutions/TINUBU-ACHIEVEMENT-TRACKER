# Tinubu Achievement Tracker — Human & AI Operating Model (v1.1)

**Standard Version:** 1.1  
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1  

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
| 9. EDITORIAL AGENT:            Audits compliance with the 13 Truth Rules and drafting standards.  |
| 10. HUMAN REVIEWER / LEAD:     Mandatory human approval for publication and high-risk claims.     |
| 11. DATA PUBLISHER:            Executes privileged transactional ingestion via Admin SDK.         |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
```

---

## 3. Mandatory Human Approval Triggers

Automated agent sign-off is **strictly prohibited** for:
1. **Critical & High Risk Claims:** Any claim designated as High or Critical risk in Gate 0.
2. **Major Financial Values:** Any financial allocation, contract, or expenditure exceeding **₦100 Billion** (or $100 Million USD).
3. **Major Beneficiary Totals:** Any beneficiary count exceeding **500,000 individuals or MSMEs**.
4. **Security & Strategic Assets:** Military operations, counter-terrorism metrics, defense procurements, and strategic geospatial coordinates.
5. **Unresolved Contradictions:** Any claim with competing official figures logged in `contradiction_log.csv`.
6. **Legally Sensitive Matters:** Constitutional matters, court rulings, or active litigations.
7. **Politically Sensitive Causal Claims:** Direct causal assertions attributing macroeconomic shifts solely to executive action.

---

## 4. Mapping to Authorization Roles

| Operating Role | Database / Auth Role | Client Access Level | Ingestion Privilege |
|---|---|---|---|
| Public Reader | `public` | Read-only to published connector queries | None |
| Researcher / Extraction Agent | `researcher` | Draft and stage permissions | Staging only via batch manifest |
| Verification / QA Agent | `verifier` | Read internal drafts + submit reviews | Validation execution |
| Editor / Editorial Agent | `editor` | Editorial review + pass/fail decisions | Review decision staging |
| Human Lead Reviewer | `lead_editor` | Final publication approval authority | Sign-off token issuance |
| Compliance Officer | `compliance_officer` | Full audit, redaction, retraction logs | Audit & correction commit |
| System Administrator / Publisher | `admin` | Full database management (Admin SDK) | Transactional production commit |
