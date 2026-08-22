import { GoogleGenAI } from '@google/genai';
import type {
  PTATVertexConfig,
  PTATModelMetadata,
  PTATWebSource,
  PTATWebGroundingMetadata,
} from '../../types/ai.types';

export interface VertexGenerationResult {
  rawText: string;
  parsedJson?: any;
  metadata: PTATModelMetadata;
  webGrounding?: PTATWebGroundingMetadata;
  webSources?: PTATWebSource[];
}

export class PTATVertexClient {
  private client: GoogleGenAI | null = null;
  private config: PTATVertexConfig;

  constructor(customConfig?: Partial<PTATVertexConfig>) {
    this.config = {
      project: process.env.GOOGLE_CLOUD_PROJECT || 'tinubu-achievement-stg',
      location: process.env.GOOGLE_CLOUD_LOCATION || 'global',
      model: process.env.PTAT_VERTEX_MODEL || 'gemini-3.6-flash',
      temperature: 0.1,
      maxOutputTokens: 8192,
      thinkingLevel: 'LOW',
      timeoutMs: 30000,
      maxRetries: 2,
      ...customConfig,
    };
  }

  public getConfig(): PTATVertexConfig {
    return { ...this.config };
  }

  private getClient(): GoogleGenAI {
    if (!this.client) {
      this.client = new GoogleGenAI({
        vertexai: true,
        project: this.config.project,
        location: this.config.location,
      });
    }
    return this.client;
  }

  /**
   * Helper to parse grounding metadata from Gemini response candidates.
   */
  private extractGroundingMetadata(candidate: any): {
    webGrounding?: PTATWebGroundingMetadata;
    webSources?: PTATWebSource[];
  } {
    const rawGrounding = candidate?.groundingMetadata;
    if (!rawGrounding) return {};

    const webSearchQueries: string[] = Array.isArray(rawGrounding.webSearchQueries)
      ? rawGrounding.webSearchQueries
      : [];

    const webSources: PTATWebSource[] = [];
    if (Array.isArray(rawGrounding.groundingChunks)) {
      for (const chunk of rawGrounding.groundingChunks) {
        if (chunk.web?.uri) {
          let domain = '';
          try {
            const urlObj = new URL(chunk.web.uri);
            domain = urlObj.hostname.replace(/^www\./, '');
          } catch {
            domain = chunk.web.title || 'Web Source';
          }

          webSources.push({
            title: chunk.web.title || domain,
            url: chunk.web.uri,
            domain,
            publisher: domain,
          });
        }
      }
    }

    const groundingSupports: any[] = [];
    if (Array.isArray(rawGrounding.groundingSupports)) {
      for (const support of rawGrounding.groundingSupports) {
        if (support.segment?.text) {
          groundingSupports.push({
            segmentText: support.segment.text,
            startIndex: support.segment.startIndex,
            endIndex: support.segment.endIndex,
            groundingChunkIndices: Array.isArray(support.groundingChunkIndices)
              ? support.groundingChunkIndices
              : [],
          });
        }
      }
    }

    const searchEntryPointHtml = rawGrounding.searchEntryPoint?.renderedContent;

    return {
      webSources,
      webGrounding: {
        webSearchQueries,
        groundingChunks: webSources,
        groundingSupports,
        searchEntryPointHtml,
      },
    };
  }

  /**
   * Execute grounded content generation via Vertex AI Gemini (PTAT_ONLY).
   */
  public async generateGroundedContent(
    prompt: string,
    systemInstruction: string,
    retrievalLatencyMs: number = 0
  ): Promise<VertexGenerationResult> {
    const ai = this.getClient();
    const startTime = Date.now();
    let retriesAttempted = 0;
    let lastError: Error | null = null;

    const thinkingConfig: any = {};
    if (this.config.thinkingLevel) {
      thinkingConfig.thinkingLevel = this.config.thinkingLevel;
    } else if (this.config.thinkingBudget !== undefined) {
      thinkingConfig.thinkingBudget = this.config.thinkingBudget;
    } else {
      thinkingConfig.thinkingLevel = 'LOW';
    }

    while (retriesAttempted <= (this.config.maxRetries ?? 2)) {
      try {
        const response = await ai.models.generateContent({
          model: this.config.model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: this.config.temperature ?? 0.1,
            maxOutputTokens: this.config.maxOutputTokens ?? 8192,
            responseMimeType: 'application/json',
            thinkingConfig,
          },
        });

        const modelLatencyMs = Date.now() - startTime;
        const totalLatencyMs = retrievalLatencyMs + modelLatencyMs;
        const rawText = response.text || '';

        let parsedJson: any = undefined;
        if (rawText) {
          const trimmed = rawText.trim();
          const cleanText = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
          try {
            parsedJson = JSON.parse(cleanText);
          } catch {
            const match = cleanText.match(/\{[\s\S]*\}/);
            if (match) {
              try {
                parsedJson = JSON.parse(match[0]);
              } catch {
                try {
                  const sanitized = match[0].replace(
                    /"([^"\\]*(?:\\.[^"\\]*)*)"/gs,
                    (_m, str) =>
                      '"' +
                      str
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r')
                        .replace(/\t/g, '\\t') +
                      '"'
                  );
                  parsedJson = JSON.parse(sanitized);
                } catch {
                  parsedJson = undefined;
                }
              }
            }
          }
        }

        const usage = response.usageMetadata;
        const metadata: PTATModelMetadata = {
          model: this.config.model,
          location: this.config.location,
          apiVersion: 'v1',
          retrievalLatencyMs,
          modelLatencyMs,
          totalLatencyMs,
          inputTokens: usage?.promptTokenCount ?? 0,
          outputTokens: usage?.candidatesTokenCount ?? 0,
          totalTokens: usage?.totalTokenCount ?? 0,
          thoughtTokens: (usage as any)?.thoughtsTokenCount ?? 0,
          retriesAttempted,
          webGroundingApplied: false,
        };

        return {
          rawText,
          parsedJson,
          metadata,
        };
      } catch (err: any) {
        lastError = err;
        retriesAttempted++;

        const isTransient =
          err?.status === 429 ||
          err?.message?.includes('RESOURCE_EXHAUSTED') ||
          err?.message?.includes('ECONNRESET') ||
          err?.message?.includes('ETIMEDOUT');

        if (isTransient && retriesAttempted <= (this.config.maxRetries ?? 2)) {
          const backoffMs = retriesAttempted * 1000;
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          continue;
        }

        break;
      }
    }

    const modelLatencyMs = Date.now() - startTime;
    throw new Error(
      `PTAT Vertex AI Generation Failed after ${retriesAttempted} attempt(s) in ${modelLatencyMs}ms: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Execute Google Search Grounded content generation via Vertex AI Gemini (WEB_GROUNDED or PTAT_PLUS_WEB).
   */
  public async generateGroundedSearchContent(
    prompt: string,
    systemInstruction: string,
    retrievalLatencyMs: number = 0
  ): Promise<VertexGenerationResult> {
    const ai = this.getClient();
    const startTime = Date.now();
    let retriesAttempted = 0;
    let lastError: Error | null = null;

    while (retriesAttempted <= (this.config.maxRetries ?? 2)) {
      try {
        const response = await ai.models.generateContent({
          model: this.config.model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: this.config.temperature ?? 0.2,
            maxOutputTokens: this.config.maxOutputTokens ?? 4096,
            tools: [{ googleSearch: {} } as any],
          },
        });

        const modelLatencyMs = Date.now() - startTime;
        const totalLatencyMs = retrievalLatencyMs + modelLatencyMs;
        const rawText = response.text || '';
        const candidate = response.candidates?.[0];
        const { webGrounding, webSources } = this.extractGroundingMetadata(candidate);

        const usage = response.usageMetadata;
        const metadata: PTATModelMetadata = {
          model: this.config.model,
          location: this.config.location,
          apiVersion: 'v1',
          retrievalLatencyMs,
          modelLatencyMs,
          totalLatencyMs,
          inputTokens: usage?.promptTokenCount ?? 0,
          outputTokens: usage?.candidatesTokenCount ?? 0,
          totalTokens: usage?.totalTokenCount ?? 0,
          thoughtTokens: (usage as any)?.thoughtsTokenCount ?? 0,
          retriesAttempted,
          webGroundingApplied: true,
        };

        return {
          rawText,
          metadata,
          webGrounding,
          webSources,
        };
      } catch (err: any) {
        lastError = err;
        retriesAttempted++;

        const isTransient =
          err?.status === 429 ||
          err?.message?.includes('RESOURCE_EXHAUSTED') ||
          err?.message?.includes('ECONNRESET') ||
          err?.message?.includes('ETIMEDOUT');

        if (isTransient && retriesAttempted <= (this.config.maxRetries ?? 2)) {
          const backoffMs = retriesAttempted * 1000;
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          continue;
        }

        break;
      }
    }

    const modelLatencyMs = Date.now() - startTime;
    throw new Error(
      `PTAT Vertex AI Search Grounding Failed after ${retriesAttempted} attempt(s) in ${modelLatencyMs}ms: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Execute non-grounded general conversational synthesis (GENERAL mode).
   */
  public async generateGeneralContent(
    prompt: string,
    systemInstruction: string,
    retrievalLatencyMs: number = 0
  ): Promise<VertexGenerationResult> {
    const ai = this.getClient();
    const startTime = Date.now();
    let retriesAttempted = 0;
    let lastError: Error | null = null;

    while (retriesAttempted <= (this.config.maxRetries ?? 2)) {
      try {
        const response = await ai.models.generateContent({
          model: this.config.model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.3,
            maxOutputTokens: 2048,
          },
        });

        const modelLatencyMs = Date.now() - startTime;
        const totalLatencyMs = retrievalLatencyMs + modelLatencyMs;
        const rawText = response.text || '';

        const usage = response.usageMetadata;
        const metadata: PTATModelMetadata = {
          model: this.config.model,
          location: this.config.location,
          apiVersion: 'v1',
          retrievalLatencyMs,
          modelLatencyMs,
          totalLatencyMs,
          inputTokens: usage?.promptTokenCount ?? 0,
          outputTokens: usage?.candidatesTokenCount ?? 0,
          totalTokens: usage?.totalTokenCount ?? 0,
          thoughtTokens: (usage as any)?.thoughtsTokenCount ?? 0,
          retriesAttempted,
          webGroundingApplied: false,
        };

        return {
          rawText,
          metadata,
        };
      } catch (err: any) {
        lastError = err;
        retriesAttempted++;

        const isTransient =
          err?.status === 429 ||
          err?.message?.includes('RESOURCE_EXHAUSTED') ||
          err?.message?.includes('ECONNRESET') ||
          err?.message?.includes('ETIMEDOUT');

        if (isTransient && retriesAttempted <= (this.config.maxRetries ?? 2)) {
          const backoffMs = retriesAttempted * 1000;
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          continue;
        }

        break;
      }
    }

    const modelLatencyMs = Date.now() - startTime;
    throw new Error(
      `PTAT Vertex AI General Content Generation Failed after ${retriesAttempted} attempt(s) in ${modelLatencyMs}ms: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Lightweight utility to generate simple text (e.g. for query rewriting / normalization).
   */
  public async generateSimpleText(
    prompt: string,
    overrides?: Partial<PTATVertexConfig>
  ): Promise<VertexGenerationResult> {
    const ai = this.getClient();
    const startTime = Date.now();

    const response = await ai.models.generateContent({
      model: overrides?.model || this.config.model,
      contents: prompt,
      config: {
        temperature: overrides?.temperature ?? 0.1,
        maxOutputTokens: overrides?.maxOutputTokens ?? 128,
      },
    });

    const modelLatencyMs = Date.now() - startTime;
    const rawText = response.text || '';
    const usage = response.usageMetadata;

    const metadata: PTATModelMetadata = {
      model: this.config.model,
      location: this.config.location,
      apiVersion: 'v1',
      retrievalLatencyMs: 0,
      modelLatencyMs,
      totalLatencyMs: modelLatencyMs,
      inputTokens: usage?.promptTokenCount ?? 0,
      outputTokens: usage?.candidatesTokenCount ?? 0,
      totalTokens: usage?.totalTokenCount ?? 0,
      retriesAttempted: 0,
    };

    return {
      rawText,
      metadata,
    };
  }
}
