# PTAT AI UI Security & Anti-Exploit Architecture
**Document ID**: PTAT-M08C-SEC-001  
**Authority**: President Tinubu Achievement Tracker (PTAT)  
**Status**: ACTIVE / CERTIFIED  

---

## 1. Threat Model & Security Posture

The PTAT AI user interface operates on an untrusted public web environment. The following threats are mitigated by architectural isolation:

```
[Untrusted Client Browser]
         │
         ▼
[POST /api/ai/ask] ──(Input Validation & Sanitization)
         │           • Content-Type: application/json
         │           • Question Length ≤ 2000 chars
         │           • Rejection of Forbidden Overrides (model, systemInstruction, etc.)
         │
         ▼
[PTATGroundedSynthesisService] (Server-Only Execution)
         │           • Cloud SQL Parameterized Queries (Zero Raw SQL Interpolation)
         │           • Allowlisted Vertex AI Configuration (global / gemini-3.6-flash)
         │
         ▼
[Google Vertex AI Gemini-3.6-Flash]
         │           • Strict Grounded Context Injection
         │           • Citation Allowlist Enforcement
         │
         ▼
[Verified Response Payload]
```

---

## 2. Invariants & Defenses

### 2.1 Zero Client-to-Vertex Calls
- Client applications possess zero GCP credentials, API keys, or Vertex AI access tokens.
- All requests are brokered by the Next.js server runtime.

### 2.2 Parameter Tampering Prevention
- Any request attempting to supply client-level model identifiers (`model`), system instructions (`systemInstruction`), temperatures (`temperature`), or Vertex configuration overrides is rejected with `400 Bad Request` (`FORBIDDEN_PARAMETER`).

### 2.3 Prompt Injection Defense
- User inputs are bounded to 2000 characters.
- System instructions for Vertex AI explicitly prohibit following user commands that attempt to override grounding rules, cite unverified sources, or engage in conversational speculation.

### 2.4 Error Masking & Information Leakage Prevention
- Database errors and Vertex AI stack traces are trapped and masked into generic, helpful error codes for the citizen. Internal hostnames, database connection strings, and IAM role details are never transmitted to the browser.
