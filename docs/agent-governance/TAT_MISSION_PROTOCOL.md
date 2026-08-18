# TAT Mission Protocol: Mission Lifecycle & Mandatory Structure

**Authority:** Command Centre  
**Classification:** Standard Operating Procedure  
**Scope:** Mission Authoring, Ingestion, & Execution

---

## 1. Mandatory 13-Section Mission Structure

All engineering missions received or executed by agents must contain or be structured into the following 13 discrete sections:

1. **Mission ID & Title:** Unique identifier and mission name (e.g., `TAT M10H — STAGING CORRECTION & VERSION-HISTORY`).
2. **Mission Objective:** Clear, unambiguous definition of the target state.
3. **Authorized Scope:** Explicit list of files, subsystems, and cloud components permitted to be modified.
4. **Prohibited Scope:** Explicit negative constraints (e.g., no schema changes, no cloud mutations, no dependency additions).
5. **Certified Baseline SHA:** The exact commit SHA from which the mission must branch or execute.
6. **Target Environment:** Target GCP project (`tinubu-achievement-stg` or local only).
7. **Prerequisites & Dependencies:** Required tools, existing grants, secrets, or previous mission certifications.
8. **Implementation Plan:** Step-by-step engineering changes decomposed into minimal diffs.
9. **Acceptance Criteria:** Verifiable conditions required for mission success.
10. **Stop Conditions:** Specific triggers that demand immediate halt and escalation.
11. **Test & Verification Plan:** Required automated tests (`vitest`, `tsc`, `next build`) and database checks.
12. **Deployment Authorization Status:** Explicit declaration of whether Cloud Run or App Hosting deployments are authorized.
13. **Final Report Requirements:** Specific items, declarations, and evidence required for mission sign-off.

---

## 2. Prohibition of Implied Permissions

1. **Dangerous Permissions Must Be Explicit:** An agent must never infer missing permissions (e.g., database schema changes, IAM role updates, cloud deployments, production access) from general objectives.
2. **Production Default-Deny:** If a mission does not explicitly contain `PRODUCTION: AUTHORIZED`, production is strictly prohibited.
3. **AI Default-Deny:** If a mission does not explicitly contain `AI INTEGRATION: AUTHORIZED`, all LLM/Vertex AI calls are strictly prohibited.
4. **Uncertainty Escalation:** If any mission section is ambiguous or contradictory, the agent must halt and ask Command Centre for clarification.
