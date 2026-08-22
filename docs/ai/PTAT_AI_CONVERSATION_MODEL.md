# PTAT AI Conversation Model & Context Resolution
**Document ID**: PTAT-M08C-CONV-001  
**Authority**: President Tinubu Achievement Tracker (PTAT)  
**Status**: ACTIVE / CERTIFIED  

---

## 1. Grounding Invariant in Multi-Turn Dialogues

In conversational AI systems, multi-turn dialogues often introduce the risk of conversational hallucination, where previous assistant outputs become false "factual authority" for subsequent inferences.

PTAT AI enforces a strict **Epistemic Isolation Rule**:
> **Core Doctrine**: The Cloud SQL verified database is the SOLE authoritative source of truth. Previous assistant text is NEVER treated as ground truth or used to invent facts. Only user questions are used to resolve contextual pronouns, topics, and geographical continuity.

---

## 2. Follow-Up Resolution Mechanism (`follow-up-resolver.ts`)

When a citizen submits a conversational follow-up such as:
1. Turn 1: *"What has Tinubu done in Kaduna?"* (Assistant returns Kaduna achievements).
2. Turn 2: *"What about education specifically?"*

The server-side resolver executes deterministic intent bridging:
1. **History Filtering**: Extracts only `role === 'user'` messages from bounded conversation history (max 6 turns).
2. **Entity & Constraint Inheritance**:
   - Detects that Turn 1 mentioned `Kaduna` (State constraint `NG-KD`).
   - Detects that Turn 2 introduces an implied sector `education` (`education_human_capital`) without specifying a state.
   - Synthesizes effective query: `"education in Kaduna"`.
3. **Database Execution**: The retrieval engine queries Cloud SQL for records matching State `Kaduna` AND Sector `Education`.
4. **Vertex AI Grounded Synthesis**: Gemini receives the exact Cloud SQL records retrieved for the effective query, producing a strictly grounded answer with official citations.

---

## 3. Supported Follow-Up Patterns

| Pattern | Input Example | Inherited Entity | Effective Grounded Query |
| :--- | :--- | :--- | :--- |
| Implicit Sector | *"What about education?"* | Previous State: *Kaduna* | `"education in Kaduna"` |
| Implicit State | *"What about in Kano?"* | Previous Sector: *Power* | `"power in Kano"` |
| Pronoun Clarification | *"How much did that cost?"* | Previous Record: *NELFUND* | `"cost of NELFUND disbursement"` |
| Comparative Follow-Up | *"How does that compare to Lagos?"* | Previous State & Sector | `"compare Kaduna and Lagos education"` |
| Reset / New Topic | *"What is the National Single Window?"* | *None* (Topic is standalone) | `"National Single Window"` |

---

## 4. Bounded Context & Privacy Guarantees

1. **Session Scope Only**: Contextual memory exists only in browser memory and `sessionStorage` for the active user tab.
2. **Turn Bound**: History is strictly bounded to the last 6 turns (3 query-response pairs) to prevent prompt bloat and context drift.
3. **No Cross-User Context**: Each session is completely isolated. No user data is shared across sessions or stored in persistent user profiles.
