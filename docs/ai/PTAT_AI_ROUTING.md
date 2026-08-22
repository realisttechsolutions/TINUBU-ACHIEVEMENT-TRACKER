# PTAT AI Intelligent Routing Specification

## Routing Decision Hierarchy

The routing engine classifies incoming queries into one of four explicit internal operating modes:

```
                  ┌────────────────────────┐
                  │     USER QUESTION      │
                  └───────────┬────────────┘
                              │
                    [Normalize & Rewrite]
                              │
                    [PTAT DB Retrieval]
                              │
           ┌──────────────────┴──────────────────┐
           │                                     │
   [PTAT Evidence Found]               [PTAT Evidence Not Found]
           │                                     │
     ┌─────┴──────┐                        ┌─────┴──────┐
     │            │                        │            │
[Complete]   [Gaps/Fresh]             [Factual/Current] [General]
     │            │                        │            │
     ▼            ▼                        ▼            ▼
 PTAT_ONLY   PTAT_PLUS_WEB           WEB_GROUNDED    GENERAL
```

### 1. `PTAT_ONLY`
- **Condition**: Deterministic PTAT retrieval yields strong matching records, verified claims, and official sources.
- **Execution**: Synthesis strictly grounded in the PTAT evidence packet with explicit Claim ID and Source ID citation validation.

### 2. `PTAT_PLUS_WEB`
- **Condition**: Foundational PTAT records exist, but the query requires recent post-milestone updates or broader context.
- **Execution**: PTAT evidence is treated as privileged baseline; Google Search grounding fills contextual gaps.

### 3. `WEB_GROUNDED`
- **Condition**: The query is outside PTAT database scope, but represents a factual, political, current, or public-policy question.
- **Execution**: Vertex AI Google Search Grounding dynamically retrieves verified public web sources.

### 4. `GENERAL`
- **Condition**: Low-risk general knowledge, educational, scientific, math, or conversational prompts.
- **Execution**: Natural AI synthesis without database refusal banners or search overhead.
