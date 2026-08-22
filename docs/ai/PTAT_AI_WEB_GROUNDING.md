# PTAT AI Google Search Grounding Specification

## Vertex AI Integration

PTAT AI leverages native Google Search Grounding through the Vertex AI SDK (`@google/genai`) and `gemini-3.6-flash` on the `tinubu-achievement-stg` project in the `global` region.

### Grounding Tool Configuration

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-3.6-flash',
  contents: prompt,
  config: {
    systemInstruction,
    temperature: 0.2,
    maxOutputTokens: 4096,
    tools: [{ googleSearch: {} }],
  },
});
```

### Source Evaluation & Priority

For public policy, financial, and governance queries:
1. **Tier 1**: Official Nigerian Government Portals (`.gov.ng`), Gazette repositories, Statutory Acts.
2. **Tier 2**: Multilateral institutions (World Bank, AfDB, IMF), verified MDA press releases.
3. **Tier 3**: Reputable international and national news publications.
4. **Excluded**: Unverified social media posts, partisan blogs, SEO content farms.

All web assertions extract real URLs and domain attribution from `candidate.groundingMetadata.groundingChunks`.
