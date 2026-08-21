# PTAT Grounded Answer Contract & Schema Specification

## 1. Overview

The **PTAT Grounded Answer Contract** defines the authoritative TypeScript data model returned by `PTATGroundedSynthesisService.answerQuestion()`. It encapsulates the synthesized narrative, key takeaways, validated citations, public record navigational links, boundary limitations, confidence scoring, and model telemetry.

---

## 2. Complete TypeScript Schema (`src/types/ai.types.ts`)

```typescript
export interface PTATGroundedAnswer {
  /** The original normalized user query string */
  query: string;

  /** Classified intent from M08A intent classifier */
  intent: QueryIntent;

  /** Answerability pre-gate status: ANSWERABLE, PARTIALLY_ANSWERABLE, or INSUFFICIENT_EVIDENCE */
  answerability: AnswerabilityStatus;

  /** Objective, evidence-grounded synthesized narrative */
  answer: string;

  /** 2 to 5 high-level executive takeaway bullet points */
  summaryBulletPoints?: string[];

  /** Strictly allowlisted and validated citations backing substantive claims */
  citations: PTATModelCitation[];

  /** Deep links to public canonical record detail pages */
  recordLinks: PTATAIRecordLink[];

  /** Explicit boundary caveats, geographic scope notes, or data limitations */
  limitations: string[];

  /** Multi-dimensional retrieval confidence metrics */
  confidence: PTATAIConfidence;

  /** Bilateral comparison summary (populated for COMPARISON_QUERY) */
  comparisonSummary?: {
    firstSubject: string;
    secondSubject: string;
    keyDifferences: string[];
  };

  /** Real-time latency, token usage, and engine metadata */
  modelMetadata: PTATModelMetadata;

  /** Detailed citation allowlist audit results */
  citationValidation: CitationValidationResult;

  /** Boolean indicating whether all generated citations passed allowlist verification */
  isGrounded: boolean;
}
```

---

## 3. Sub-Types & Field Definitions

### 3.1. `PTATModelCitation`
```typescript
export interface PTATModelCitation {
  /** UUID of the verified public claim in the evidence packet */
  claimId: string;

  /** UUID of the primary official source verifying this claim */
  sourceId: string;

  /** Canonical slug of the parent record */
  recordSlug: string;

  /** Official title of the cited primary document */
  sourceTitle?: string;

  /** Publishing MDA / institution name */
  publisher?: string;

  /** Direct public URL to the primary evidence document */
  url?: string;

  /** Source hierarchy tier: LEVEL_1 (Primary Official) to LEVEL_5 (Media) */
  sourceLevel?: string;

  /** Specific excerpt or factual quote supported by this citation */
  quoteOrSummary?: string;

  /** Verification flag confirming allowlist membership */
  isValidated: boolean;
}
```

### 3.2. `PTATModelMetadata`
```typescript
export interface PTATModelMetadata {
  model: string;                // e.g. 'gemini-2.5-flash'
  location: string;             // e.g. 'us-central1'
  apiVersion?: string;          // e.g. 'v1'
  retrievalLatencyMs: number;   // SQL retrieval time in milliseconds
  modelLatencyMs: number;       // Vertex AI generation time in milliseconds
  totalLatencyMs: number;       // Total end-to-end pipeline latency
  inputTokens?: number;         // Prompt token count
  outputTokens?: number;        // Candidate output token count
  thoughtTokens?: number;       // Internal thought token count
  totalTokens?: number;         // Total billing token count
  retriesAttempted: number;     // Number of transient retries
}
```

---

## 4. Concrete JSON Contract Examples

### 4.1. Fully Answerable Query Example (`What has Tinubu done in Kaduna?`)
```json
{
  "query": "What has Tinubu done in Kaduna?",
  "intent": "GEOGRAPHIC_QUERY",
  "answerability": "ANSWERABLE",
  "answer": "President Tinubu's administration has implemented several initiatives and projects in Kaduna State. These include the commissioning of a 2.5MW solar-hybrid plant at the Nigerian Defence Academy...",
  "summaryBulletPoints": [
    "Kaduna State has seen the commissioning of two solar power projects: 2.5MW NDA solar-hybrid and 100kWp Damau mini-grid.",
    "Federal Government delivered the Tudun Biri resettlement scheme with 133 housing units and a primary health centre.",
    "A ₦1.6B ginger recovery intervention by NADF supports 15,000 farmers."
  ],
  "citations": [
    {
      "claimId": "563e6bd0-790f-44e2-b51d-648b913113ca",
      "sourceId": "9a333422-ccba-464d-b6da-918f1d52f114",
      "recordSlug": "25mw-nda-solar-hybrid-plant-commissioned-in-kaduna",
      "sourceTitle": "NDA 2.5MW Solar Hybrid Power Plant Commissioning",
      "publisher": "Rural Electrification Agency / Nigeria Electrification Project",
      "url": "https://nep.rea.gov.ng/posts/Press_Release_NDA_Commissioning.html",
      "sourceLevel": "LEVEL_1",
      "quoteOrSummary": "REA commissioned a 2.5MW solar-hybrid plant at the NDA.",
      "isValidated": true
    }
  ],
  "recordLinks": [
    {
      "externalId": "25mw-nda-solar-hybrid-plant-commissioned-in-kaduna",
      "title": "2.5MW NDA solar-hybrid plant commissioned in Kaduna",
      "recordType": "physical_project",
      "route": "/records/25mw-nda-solar-hybrid-plant-commissioned-in-kaduna",
      "primaryState": "Kaduna State"
    }
  ],
  "limitations": [],
  "confidence": {
    "overallScore": 0.95,
    "confidenceTier": "HIGH",
    "explanation": "High confidence verified match across multiple sectors."
  },
  "modelMetadata": {
    "model": "gemini-2.5-flash",
    "location": "us-central1",
    "retrievalLatencyMs": 1412,
    "modelLatencyMs": 17074,
    "totalLatencyMs": 18486,
    "inputTokens": 18864,
    "outputTokens": 2090,
    "totalTokens": 20954,
    "retriesAttempted": 0
  },
  "citationValidation": {
    "valid": true,
    "totalCitations": 10,
    "validCitations": 10,
    "rejectedCitations": 0,
    "rejectionReasons": [],
    "validatedCitations": [...]
  },
  "isGrounded": true
}
```

### 4.2. Pre-Gated Unsupported Query Example (`What is Nigeria doing on Mars?`)
```json
{
  "query": "What is Nigeria doing on Mars?",
  "intent": "GENERAL_FACTUAL",
  "answerability": "INSUFFICIENT_EVIDENCE",
  "answer": "The President Tinubu Achievement Tracker (PTAT) contains no recorded public evidence for this query. Substantive factual statements are strictly restricted to verified PTAT public records.",
  "summaryBulletPoints": [
    "No matching public records, claims, or official sources found in the PTAT catalog."
  ],
  "citations": [],
  "recordLinks": [],
  "limitations": [
    "Zero evidence matches in the PTAT public catalog."
  ],
  "confidence": {
    "overallScore": 0.0,
    "confidenceTier": "UNANSWERABLE",
    "explanation": "Zero records matched user constraints."
  },
  "modelMetadata": {
    "model": "gemini-2.5-flash",
    "location": "us-central1",
    "retrievalLatencyMs": 257,
    "modelLatencyMs": 0,
    "totalLatencyMs": 257,
    "inputTokens": 0,
    "outputTokens": 0,
    "totalTokens": 0,
    "retriesAttempted": 0
  },
  "citationValidation": {
    "valid": true,
    "totalCitations": 0,
    "validCitations": 0,
    "rejectedCitations": 0,
    "rejectionReasons": [],
    "validatedCitations": []
  },
  "isGrounded": true
}
```
