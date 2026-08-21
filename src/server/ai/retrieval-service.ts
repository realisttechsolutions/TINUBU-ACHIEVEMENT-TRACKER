import type { QueryExecutor } from '../db/pool';
import type { PTATAIContext, RetrievalOptions } from '../../types/ai.types';
import { classifyIntentAndExtractConstraints } from './intent-classifier';
import { matchEntitiesFromRecords } from './entity-matcher';
import { PTATAIRetrievalEngine } from './retrieval-engine';
import { assembleAnswerContext } from './answer-assembler';

const NIGERIAN_STATES: Record<string, string> = {
  abia: 'NG-AB',
  adamawa: 'NG-AD',
  'akwa ibom': 'NG-AK',
  anambra: 'NG-AN',
  bauchi: 'NG-BA',
  bayelsa: 'NG-BY',
  benue: 'NG-BE',
  borno: 'NG-BO',
  'cross river': 'NG-CR',
  delta: 'NG-DE',
  ebonyi: 'NG-EB',
  edo: 'NG-ED',
  ekiti: 'NG-EK',
  enugu: 'NG-EN',
  fct: 'NG-FC',
  'federal capital territory': 'NG-FC',
  abuja: 'NG-FC',
  gombe: 'NG-GO',
  imo: 'NG-IM',
  jigawa: 'NG-JI',
  kaduna: 'NG-KD',
  kano: 'NG-KN',
  katsina: 'NG-KT',
  kebbi: 'NG-KB',
  kogi: 'NG-KO',
  kwara: 'NG-KW',
  lagos: 'NG-LA',
  nasarawa: 'NG-NA',
  niger: 'NG-NI',
  ogun: 'NG-OG',
  ondo: 'NG-ON',
  osun: 'NG-OS',
  oyo: 'NG-OY',
  plateau: 'NG-PL',
  rivers: 'NG-RI',
  sokoto: 'NG-SO',
  taraba: 'NG-TA',
  yobe: 'NG-YO',
  zamfara: 'NG-ZA',
};

export class PTATAIRetrievalService {
  private readonly db: QueryExecutor;
  private readonly engine: PTATAIRetrievalEngine;

  constructor(db: QueryExecutor) {
    this.db = db;
    this.engine = new PTATAIRetrievalEngine(db);
  }

  async retrievePTATContext(query: string, options: RetrievalOptions = {}): Promise<PTATAIContext> {
    const trimmedQuery = (query || '').trim();
    if (!trimmedQuery) {
      return assembleAnswerContext(
        query,
        'SUMMARY_QUERY',
        {},
        [],
        {
          records: [],
          claims: [],
          sources: [],
          financials: [],
          beneficiaries: [],
          timelines: [],
          geographies: [],
          stats: { recordsScanned: 0, claimsScanned: 0, sourcesScanned: 0, latencyMs: 0 },
        },
      );
    }

    // 1. Classify Intent and Extract Constraints (Generic intent classification)
    const { intent, constraints } = classifyIntentAndExtractConstraints(trimmedQuery);

    // 2. Check for Comparison Query
    if (constraints.comparisonTargets) {
      const comp = constraints.comparisonTargets;
      const firstConstraints = { ...constraints, keywords: undefined, entityName: undefined, comparisonTargets: undefined };
      const secondConstraints = { ...constraints, keywords: undefined, entityName: undefined, comparisonTargets: undefined };

      if (comp.type === 'state') {
        const firstCode = NIGERIAN_STATES[comp.first.toLowerCase()];
        const secondCode = NIGERIAN_STATES[comp.second.toLowerCase()];
        firstConstraints.state = comp.first;
        firstConstraints.stateCode = firstCode;
        secondConstraints.state = comp.second;
        secondConstraints.stateCode = secondCode;
      } else if (comp.type === 'record_type') {
        firstConstraints.recordType = comp.first as any;
        secondConstraints.recordType = comp.second as any;
      } else if (comp.type === 'year') {
        firstConstraints.year = parseInt(comp.first, 10);
        secondConstraints.year = parseInt(comp.second, 10);
      }

      const [firstResults, secondResults] = await Promise.all([
        this.engine.retrieve(firstConstraints, options),
        this.engine.retrieve(secondConstraints, options),
      ]);

      const combinedRecords = [...firstResults.records, ...secondResults.records];
      const combinedClaims = [...firstResults.claims, ...secondResults.claims];
      const combinedSources = [...firstResults.sources, ...secondResults.sources];
      const combinedFinancials = [...firstResults.financials, ...secondResults.financials];
      const combinedBeneficiaries = [...firstResults.beneficiaries, ...secondResults.beneficiaries];
      const combinedTimelines = [...firstResults.timelines, ...secondResults.timelines];
      const combinedGeographies = [...firstResults.geographies, ...secondResults.geographies];

      const combinedResults = {
        records: combinedRecords,
        claims: combinedClaims,
        sources: combinedSources,
        financials: combinedFinancials,
        beneficiaries: combinedBeneficiaries,
        timelines: combinedTimelines,
        geographies: combinedGeographies,
        stats: {
          recordsScanned: combinedRecords.length,
          claimsScanned: combinedClaims.length,
          sourcesScanned: combinedSources.length,
          latencyMs: firstResults.stats.latencyMs + secondResults.stats.latencyMs,
        },
      };

      const dynamicMatched = matchEntitiesFromRecords(trimmedQuery, combinedRecords);
      const entityNames =
        dynamicMatched.length > 0
          ? dynamicMatched.map((e) => e.name)
          : [comp.first, comp.second];

      const cleanComparisonConstraints = {
        ...constraints,
        keywords: undefined,
        entityName: undefined,
      };

      return assembleAnswerContext(
        trimmedQuery,
        intent,
        cleanComparisonConstraints,
        entityNames,
        combinedResults,
        {
          firstResults,
          secondResults,
        }
      );
    }

    // 3. Dynamic Database-Driven Retrieval
    const retrievalResults = await this.engine.retrieve(constraints, options);

    // 4. Disambiguate matched entities dynamically from database records
    const dynamicMatched = matchEntitiesFromRecords(trimmedQuery, retrievalResults.records);
    const entityNames = dynamicMatched.map((e) => e.name);

    // 5. Assemble Structured Context Bundle
    return assembleAnswerContext(trimmedQuery, intent, constraints, entityNames, retrievalResults);
  }
}
