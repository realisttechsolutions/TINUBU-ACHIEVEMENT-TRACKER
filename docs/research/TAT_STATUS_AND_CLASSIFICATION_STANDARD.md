# Tinubu Achievement Tracker — Status & Classification Standard (v1.1.2)

**Standard Version:** 1.1.2
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1.2
**Controlled Vocabulary:** `research/schemas/canonical-vocabulary.v1.1.2.json`

---

## 1. Separation of Classification Dimensions

Research Contract v1.1.2 strictly separates classification into **five independent namespaces**. Implementation status remains a separate delivery-lifecycle field. Overloading multiple classification concepts into a single field is strictly prohibited:

```text
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                5 INDEPENDENT CLASSIFICATION DIMENSIONS                            |
+────────────────────────────────────────┬──────────────────────────────────────────────────────────+
| Dimension                              | Controlled Canonical Codes                               |
+────────────────────────────────────────┼──────────────────────────────────────────────────────────+
| 1. DATA VALUE NATURE                   | actual, provisional, estimated, projected, target,       |
|                                        | calculated, modelled                                     |
+────────────────────────────────────────┼──────────────────────────────────────────────────────────+
| 2. SOURCE ORIGIN                       | government_reported, independently_reported,             |
|                                        | mixed, unknown                                           |
+────────────────────────────────────────┼──────────────────────────────────────────────────────────+
| 3. VERIFICATION STATUS                 | source_confirmed, cross_referenced,                      |
|                                        | independently_corroborated, under_review, unverified,    |
|                                        | disputed, corrected, withdrawn                           |
+────────────────────────────────────────┼──────────────────────────────────────────────────────────+
| 4. INTERNAL WORKFLOW STATUS            | draft, research_review, evidence_review,                 |
|                                        | editorial_review, human_approval, ready_for_publication, |
|                                        | rejected, archived                                       |
+────────────────────────────────────────┼──────────────────────────────────────────────────────────+
| 5. EXTERNAL PUBLICATION STATUS         | unpublished, under_review, publishable,                  |
|                                        | publishable_with_qualification, published, corrected,    |
|                                        | withdrawn, archived                                      |
+────────────────────────────────────────┴──────────────────────────────────────────────────────────+
```

---

## 2. The 21-Stage Implementation Status Architecture

Every record tracked within the research repository must be assigned exactly one active implementation status code:

| # | Code | Public Label | Meaning & Definition | Minimum Evidentiary Threshold | What It Proves | What It Does NOT Prove |
|---:|---|---|---|---|---|---|
| 1 | `proposed` | Proposed | Concept under official policy formulation | Committee white paper, memo, or bill draft | Administrative intent | Does not prove approval or funding |
| 2 | `announced` | Announced | Publicly declared by President or Minister | Official press briefing transcript or State House release | Public commitment was made | Does not prove statutory approval or funding |
| 3 | `approved` | Approved | Sanctioned by competent statutory authority | FEC Approval Extract, Presidential Signature, or Board Resolution | Statutory sanction granted | Does not prove funding release or contract execution |
| 4 | `enacted` | Enacted | Statute passed by NASS and assented into law | Official Gazette with Act Number or Assent Certificate | Act is law of the Federation | Does not prove operational execution |
| 5 | `effective` | In Force | Subsidiary regulation or order active | Gazette commencement date or regulatory directive | Instrument is legally enforceable | Does not prove full public compliance |
| 6 | `funded` | Funded | Appropriation allocated in National Budget | Appropriation Act budget line item or facility agreement | Statutory financial envelope | Does not prove cash warrant release |
| 7 | `funding_released` | Funding Released | Cash or warrants released to implementing MDA | Accountant-General release warrant or treasury log | Funds were disbursed to MDA | Does not prove contractor payment or execution |
| 8 | `procurement` | In Procurement | Tendering, bidding, or BPP compliance active | BPP Certificate of No Objection or tender notice | Procurement process active | Does not prove contract award or site mobilization |
| 9 | `implementation_planning` | Planning Phase | Detailed engineering or design being finalized | Engineering survey, EIA report, or operational plan | Groundwork underway | Does not prove physical construction |
| 10 | `implementation_ongoing` | Ongoing Execution | Active physical construction or service rollout | Contractor progress report, site telemetry, inspection logs | Work is actively proceeding | Does not prove practical completion |
| 11 | `partially_delivered` | Partially Delivered | Substantive phase or section delivered and usable | Handover certificate for Phase 1 or section | Phase is usable by public | Does not prove entire project completion |
| 12 | `completed` | Completed | Full physical scope of works delivered | Certificate of Practical Completion | Construction finished | Does not prove facility is commissioned/staffed |
| 13 | `operational` | Operational | Commissioned, staffed, and actively serving public | Commissioning ceremony log or service telemetry | Public asset is functional | Does not prove long-term outcome |
| 14 | `outcome_reported` | Outcome Reported | Measurable public or economic outcome recorded | NBS statistical bulletin, MDA output report | Tangible public result occurred | Does not prove independent verification |
| 15 | `independently_assessed` | Independently Assessed | Outcome corroborated by external independent audit | World Bank, NEITI, or academic evaluation report | Objective external validation | Does not prove permanent perfection |
| 16 | `suspended` | Suspended | Temporarily paused by executive or court order | Official suspension circular or court injunction | Activity is on hold | Does not mean permanent cancellation |
| 17 | `superseded` | Superseded | Replaced by subsequent policy or project phase | Successor policy gazette or Phase 2 contract | Replaced by newer initiative | Does not erase historical validity |
| 18 | `repealed` | Repealed | Formally nullified or revoked by competent body | Repeal Act Gazette or Supreme Court judgment | Instrument is null and void | Does not apply retroactively |
| 19 | `under_review` | Under Review | Factual or evidentiary status undergoing review | Editorial discrepancy ticket or contradiction log | Claim is being investigated | Does not mean the claim is false |
| 20 | `archived` | Archived | Historical record retired from active tracking | Archival metadata record | Historical milestone completed | Does not require future freshness updates |
| 21 | `withdrawn` | Withdrawn | Claim or record retracted due to falsification/error | Formal editorial retraction notice | Claim was erroneous/invalid | Must remain visible in audit logs |

---

## 3. Allowed vs Forbidden State Transitions

```text
VALID LIFECYCLE PROGRESSIONS:
proposed  ──> announced ──> approved ──> enacted/effective ──> funded ──> funding_released
                                                                              │
completed <── partially_delivered <── implementation_ongoing <── procurement <┘
   │
   └──> operational ──> outcome_reported ──> independently_assessed

FORBIDDEN TRANSITIONS (DATA INTEGRITY VIOLATIONS):
❌ announced ──> completed       (Bypasses approval, funding, procurement, and execution)
❌ approved ──> outcome_reported  (Bypasses execution, completion, and operations)
❌ funded ──> operational         (Bypasses cash release, procurement, and construction)
❌ proposed ──> funded           (Bypasses executive approval and legislative appropriation)
```
