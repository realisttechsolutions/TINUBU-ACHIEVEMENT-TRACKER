# PTAT AI Validated Progressive Response Specification

## Streaming Transport & Event Contract

To deliver a responsive user experience while preventing unvalidated hallucinations or malformed citations from leaking into the UI, PTAT AI utilizes a **Validated Progressive Response** protocol over Server-Sent Events (SSE).

### Event Sequence

1. `event: status`
   - Data: `{ message: "Searching PTAT records..." }` | `{ message: "Checking current public sources..." }` | `{ message: "Preparing answer..." }`
2. `event: answer_start`
   - Data: `{ sourceMode: "PTAT_ONLY" | "PTAT_PLUS_WEB" | "WEB_GROUNDED" | "GENERAL", answerability: "ANSWERABLE" }`
3. `event: answer_chunk`
   - Data: `{ text: "..." }`
   - Emits natural semantic phrases (3–5 words per chunk) at a comfortable reading cadence (~20ms interval).
4. `event: sources`
   - Data: `{ citations: [...], webSources: [...], recordLinks: [...] }`
5. `event: metadata`
   - Data: `{ financialSummary: [...], beneficiarySummary: [...], limitations: [...], confidence: {...}, isGrounded: true }`
6. `event: done`
   - Data: `{ completed: true }`

### Error Containment
If synthesis or retrieval fails, an `event: error` is emitted with a user-friendly message, and the stream terminates cleanly without exposing internal stack traces or database queries.
