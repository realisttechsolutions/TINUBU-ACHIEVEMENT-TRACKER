# PTAT Vertex AI Grounded Synthesis Test Matrix & Certification Results

## 1. Test Suite Summary

The PTAT M08B test harness validates both deterministic offline unit invariants and live cloud execution against Cloud SQL `tat_staging` and Google Vertex AI (`gemini-2.5-flash` in `us-central1`).

---

## 2. 15 Live High-Risk Certification Query Results

All queries executed against live Cloud SQL staging (`tat_staging` on instance `tat-db-staging`) and Vertex AI Gemini in project `tinubu-achievement-stg`.

| ID | User Natural Language Query | Classified Intent | Answerability | Retrieval Latency | Model Latency | Total Latency | Citations | Citation Valid | Pre-Gated | Grounded Status |
|---|---|---|---|---|---|---|---|---|---|---|
| **Q01** | *What has Tinubu done in Kaduna?* | `GEOGRAPHIC_QUERY` | `ANSWERABLE` | $1412\text{ ms}$ | $17074\text{ ms}$ | $18486\text{ ms}$ | 10 | **YES (10/10)** | No | **PASSED** |
| **Q02** | *How much has NELFUND disbursed?* | `FINANCIAL_QUERY` | `ANSWERABLE` | $1551\text{ ms}$ | $4073\text{ ms}$ | $5624\text{ ms}$ | 3 | **YES (3/3)** | No | **PASSED** |
| **Q03** | *Compare Kaduna and Kano.* | `COMPARISON_QUERY` | `ANSWERABLE` | $5676\text{ ms}$ | $13964\text{ ms}$ | $19640\text{ ms}$ | 10 | **YES (10/10)** | No | **PASSED** |
| **Q04** | *What evidence supports the student loan programme?* | `EVIDENCE_QUERY` | `ANSWERABLE` | $3025\text{ ms}$ | $6093\text{ ms}$ | $9118\text{ ms}$ | 3 | **YES (3/3)** | No | **PASSED** |
| **Q05** | *What happened with CREDICORP?* | `ENTITY_QUERY` | `ANSWERABLE` | $1370\text{ ms}$ | $5468\text{ ms}$ | $6838\text{ ms}$ | 4 | **YES (4/4)** | No | **PASSED** |
| **Q06** | *What has changed in the CNG programme?* | `ENTITY_QUERY` | `ANSWERABLE` | $1168\text{ ms}$ | $2715\text{ ms}$ | $3883\text{ ms}$ | 1 | **YES (1/1)** | No | **PASSED** |
| **Q07** | *What happened with NCGC?* | `GENERAL_FACTUAL` | `INSUFFICIENT_EVIDENCE` | $257\text{ ms}$ | $0\text{ ms}$ | $257\text{ ms}$ | 0 | **YES (0/0)** | **YES** | **PASSED** |
| **Q08** | *Who benefited from 3MTT?* | `BENEFICIARY_QUERY` | `ANSWERABLE` | $1121\text{ ms}$ | $6862\text{ ms}$ | $7983\text{ ms}$ | 6 | **YES (6/6)** | No | **PASSED** |
| **Q09** | *What happened with the DICON investment?* | `GENERAL_FACTUAL` | `INSUFFICIENT_EVIDENCE` | $261\text{ ms}$ | $0\text{ ms}$ | $261\text{ ms}$ | 0 | **YES (0/0)** | **YES** | **PASSED** |
| **Q10** | *What evidence exists for ACReSAL?* | `EVIDENCE_QUERY` | `ANSWERABLE` | $988\text{ ms}$ | $6918\text{ ms}$ | $7906\text{ ms}$ | 6 | **YES (6/6)** | No | **PASSED** |
| **Q11** | *What is recorded about oncology centres?* | `SECTOR_QUERY` | `ANSWERABLE` | $2925\text{ ms}$ | $2579\text{ ms}$ | $5504\text{ ms}$ | 1 | **YES (1/1)** | No | **PASSED** |
| **Q12** | *Show financial commitments, not expenditure.* | `FINANCIAL_QUERY` | `ANSWERABLE` | $1200\text{ ms}$ | $5762\text{ ms}$ | $6962\text{ ms}$ | 4 | **YES (4/4)** | No | **PASSED** |
| **Q13** | *Show primary sources only.* | `EVIDENCE_QUERY` | `ANSWERABLE` | $1219\text{ ms}$ | $10419\text{ ms}$ | $11638\text{ ms}$ | 10 | **YES (10/10)** | No | **PASSED** |
| **Q14** | *What happened in 2026?* | `TEMPORAL_QUERY` | `ANSWERABLE` | $3006\text{ ms}$ | $10337\text{ ms}$ | $13343\text{ ms}$ | 10 | **YES (10/10)** | No | **PASSED** |
| **Q15** | *Tell me something PTAT does not contain.* | `GENERAL_FACTUAL` | `INSUFFICIENT_EVIDENCE` | $321\text{ ms}$ | $0\text{ ms}$ | $321\text{ ms}$ | 0 | **YES (0/0)** | **YES** | **PASSED** |

---

## 3. 5 Unsupported-Evidence Boundary Refusal Cases

| Test Case | Query | Answerability Status | Pre-Gated Without Model Call | Model Latency | Phantom Citations | Verifiable Truthful Boundary Statement |
|---|---|---|---|---|---|---|
| **UNSUP-01** | *What is Nigeria doing on Mars?* | `INSUFFICIENT_EVIDENCE` | **TRUE** | $0\text{ ms}$ | 0 | *"The President Tinubu Achievement Tracker (PTAT) contains no recorded public evidence for this query..."* |
| **UNSUP-02** | *Show evidence for space stations built in 2024.* | `INSUFFICIENT_EVIDENCE` | **TRUE** | $0\text{ ms}$ | 0 | *"The President Tinubu Achievement Tracker (PTAT) contains no recorded public evidence for this query..."* |
| **UNSUP-03** | *How many lunar rovers did Tinubu commission?* | `INSUFFICIENT_EVIDENCE` | **TRUE** | $0\text{ ms}$ | 0 | *"The President Tinubu Achievement Tracker (PTAT) contains no recorded public evidence for this query..."* |
| **UNSUP-04** | *What are the achievements of the Ministry of Magic?* | `INSUFFICIENT_EVIDENCE` | **TRUE** | $0\text{ ms}$ | 0 | *"The President Tinubu Achievement Tracker (PTAT) contains no recorded public evidence for this query..."* |
| **UNSUP-05** | *Tell me something PTAT does not contain.* | `INSUFFICIENT_EVIDENCE` | **TRUE** | $0\text{ ms}$ | 0 | *"The President Tinubu Achievement Tracker (PTAT) contains no recorded public evidence for this query..."* |

---

## 4. Semantic Discipline & Precision Invariants Audit

1. **DICON Private Commitment $\neq$ Federal Expenditure**:
   - In Q01, DICON's signed $1B+ private joint-venture agreements are explicitly identified as private joint-venture arms production agreements, not federal budgetary expenditures.
2. **NELFUND Disbursement $\neq$ Allocation**:
   - In Q02 & Q04, NELFUND tuition disbursements (₦10B+ / ₦322.69B) are clearly labeled as direct tuition fee disbursements to universities and living stipends to students.
3. **3MTT Trained $\neq$ Employed**:
   - In Q08, 3MTT participants (160,000+ across cohorts) are explicitly cited as trained and certified technical fellows, strictly preserving beneficiary stage semantics.
4. **Kaduna vs Kano Symmetry**:
   - In Q03, both Kaduna and Kano are evaluated symmetrically based only on their recorded public achievements (Kaduna: solar, Tudun Biri, DICON; Kano: dry port, river basin centre, 2000 Renewed Hope housing units).
