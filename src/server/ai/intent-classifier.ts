import type { QueryIntent, QueryConstraints } from '../../types/ai.types';

export interface ClassifiedIntent {
  intent: QueryIntent;
  constraints: QueryConstraints;
  rawQuery: string;
}

export const NIGERIAN_STATES: Record<string, string> = {
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

export const SECTOR_ALIASES: Record<string, { code: string; label: string }> = {
  education: { code: 'education_human_capital', label: 'Education and Human Capital' },
  school: { code: 'education_human_capital', label: 'Education and Human Capital' },
  schools: { code: 'education_human_capital', label: 'Education and Human Capital' },
  university: { code: 'education_human_capital', label: 'Education and Human Capital' },
  universities: { code: 'education_human_capital', label: 'Education and Human Capital' },
  student: { code: 'education_human_capital', label: 'Education and Human Capital' },
  students: { code: 'education_human_capital', label: 'Education and Human Capital' },
  teacher: { code: 'education_human_capital', label: 'Education and Human Capital' },
  teachers: { code: 'education_human_capital', label: 'Education and Human Capital' },
  tvet: { code: 'education_human_capital', label: 'Education and Human Capital' },
  tertiary: { code: 'education_human_capital', label: 'Education and Human Capital' },
  learning: { code: 'education_human_capital', label: 'Education and Human Capital' },
  health: { code: 'healthcare_public_health', label: 'Healthcare and Public Health' },
  healthcare: { code: 'healthcare_public_health', label: 'Healthcare and Public Health' },
  hospital: { code: 'healthcare_public_health', label: 'Healthcare and Public Health' },
  hospitals: { code: 'healthcare_public_health', label: 'Healthcare and Public Health' },
  medical: { code: 'healthcare_public_health', label: 'Healthcare and Public Health' },
  medicine: { code: 'healthcare_public_health', label: 'Healthcare and Public Health' },
  agriculture: { code: 'agriculture_food_security', label: 'Agriculture and Food Security' },
  farming: { code: 'agriculture_food_security', label: 'Agriculture and Food Security' },
  farmer: { code: 'agriculture_food_security', label: 'Agriculture and Food Security' },
  farmers: { code: 'agriculture_food_security', label: 'Agriculture and Food Security' },
  food: { code: 'agriculture_food_security', label: 'Agriculture and Food Security' },
  fertilizer: { code: 'agriculture_food_security', label: 'Agriculture and Food Security' },
  ginger: { code: 'agriculture_food_security', label: 'Agriculture and Food Security' },
  crops: { code: 'agriculture_food_security', label: 'Agriculture and Food Security' },
  electricity: { code: 'power_energy_natural_resources', label: 'Power, Energy and Natural Resources' },
  power: { code: 'power_energy_natural_resources', label: 'Power, Energy and Natural Resources' },
  energy: { code: 'power_energy_natural_resources', label: 'Power, Energy and Natural Resources' },
  solar: { code: 'power_energy_natural_resources', label: 'Power, Energy and Natural Resources' },
  gas: { code: 'power_energy_natural_resources', label: 'Power, Energy and Natural Resources' },
  transport: { code: 'infrastructure_transportation', label: 'Infrastructure and Transportation' },
  transportation: { code: 'infrastructure_transportation', label: 'Infrastructure and Transportation' },
  road: { code: 'infrastructure_transportation', label: 'Infrastructure and Transportation' },
  roads: { code: 'infrastructure_transportation', label: 'Infrastructure and Transportation' },
  highway: { code: 'infrastructure_transportation', label: 'Infrastructure and Transportation' },
  rail: { code: 'infrastructure_transportation', label: 'Infrastructure and Transportation' },
  railway: { code: 'infrastructure_transportation', label: 'Infrastructure and Transportation' },
  aviation: { code: 'infrastructure_transportation', label: 'Infrastructure and Transportation' },
  airport: { code: 'infrastructure_transportation', label: 'Infrastructure and Transportation' },
  ports: { code: 'infrastructure_transportation', label: 'Infrastructure and Transportation' },
  housing: { code: 'housing_urban_development', label: 'Housing and Urban Development' },
  houses: { code: 'housing_urban_development', label: 'Housing and Urban Development' },
  cities: { code: 'housing_urban_development', label: 'Housing and Urban Development' },
  economy: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  economic: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  finance: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  financial: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  tax: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  taxes: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  revenue: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  fx: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  forex: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  banking: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  credit: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  digital: { code: 'digital_economy_science_innovation', label: 'Digital Economy, Science and Innovation' },
  tech: { code: 'digital_economy_science_innovation', label: 'Digital Economy, Science and Innovation' },
  technology: { code: 'digital_economy_science_innovation', label: 'Digital Economy, Science and Innovation' },
  broadband: { code: 'digital_economy_science_innovation', label: 'Digital Economy, Science and Innovation' },
  telecom: { code: 'digital_economy_science_innovation', label: 'Digital Economy, Science and Innovation' },
  security: { code: 'security_national_stability', label: 'Security and National Stability' },
  defence: { code: 'security_national_stability', label: 'Security and National Stability' },
  military: { code: 'security_national_stability', label: 'Security and National Stability' },
  police: { code: 'security_national_stability', label: 'Security and National Stability' },
  environment: { code: 'environment_climate', label: 'Environment and Climate' },
  climate: { code: 'environment_climate', label: 'Environment and Climate' },
  youth: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  youths: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  young: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  employment: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  empowerment: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  empower: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  job: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  jobs: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  skills: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  skill: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  training: { code: 'youth_employment_skills', label: 'Youth, Employment and Skills' },
  enterprise: { code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' },
  loans: { code: 'education_human_capital', label: 'Education and Human Capital' },
  loan: { code: 'education_human_capital', label: 'Education and Human Capital' },
  governance: { code: 'governance_public_service', label: 'Governance and Public Service' },
};

export const STOP_WORDS = new Set([
  'what', 'has', 'have', 'had', 'been', 'done', 'doing', 'in', 'tell', 'me', 'about',
  'something', 'does', 'not', 'contain', 'show', 'which', 'records', 'how', 'much',
  'who', 'where', 'when', 'the', 'a', 'an', 'of', 'for', 'to', 'and', 'or', 'is',
  'are', 'was', 'were', 'with', 'tinubu', 'president', 'presidency', 'administration',
  'happened', 'changed', 'supports', 'support', 'evidence', 'exists', 'exist', 'recorded',
  'details', 'give', 'overview', 'summary', 'across', 'all', 'by', 'on', 'at', 'from',
  'into', 'out', 'up', 'down', 'only', 'state', 'states', 'since', 'before', 'after',
  'during', 'under', 'average', 'temperature', 'planet', 'mayor', 'many', 'built',
  'achievement', 'achievements', 'project', 'projects', 'policy', 'policies',
  'programme', 'programmes', 'program', 'programs', 'disbursed', 'disbursement',
  'spent', 'spending', 'expenditure', 'commitment', 'commitments', 'budget', 'cost',
  'benefited', 'beneficiary', 'beneficiaries', 'insufficient', 'primary', 'source', 'sources',
  'reform', 'reforms', 'centre', 'centres', 'ptat', 'according', 'current', 'currently',
  'government', 'governments', 'govt', 'public', 'latest', 'recent', 'today', 'now', 'prime',
  'minister', 'ministers', 'stock', 'stocks', 'prices', 'price', 'share', 'shares',
  'database', 'system', 'app', 'application', 'platform', 'tracker', 'tracking',
  'search', 'lookup', 'info', 'information', 'data', 'query', 'question', 'answer',
  'list', 'listing', 'report', 'reported', 'reporting', 'record', 'recording',
  'did', 'do', 'can', 'could', 'would', 'should', 'will', 'shall', 'may', 'might', 'must',
  'implement', 'implements', 'implemented', 'implementing', 'implementation',
  'technical', 'specifications', 'specification', 'spec', 'specs', 'feature', 'features',
  'award', 'awards', 'won', 'win', 'winning', 'winner', 'picture', 'pictures',
  'block', 'blocks', 'reward', 'rewards', 'final', 'finals', 'cup', 'cups', 'world',
  'results', 'result', 'election', 'elections', 'parliament', 'parliaments',
  'speed', 'high', 'construction', 'develop', 'development', 'facility', 'facilities',
  'scheme', 'schemes', 'value', 'values', 'index', 'indices', 'rate', 'rates',
  'ad', 'bc', 'era', 'centuries', 'century',
  // Colloquial / conversational fillers & modifiers
  'so', 'far', 'pls', 'please', 'know', 'get', 'got', 'like', 'see', 'check', 'find',
  'any', 'some', 'good', 'well', 'also', 'too', 'just', 'really', 'very', 'more', 'most',
  'less', 'least', 'than', 'then', 'there', 'here', 'their', 'they', 'them', 'our', 'us',
  'my', 'your', 'his', 'her', 'its', 'whats', 'whose', 'why', 'people', 'person', 'persons',
  'nigerian', 'nigerians', 'country', 'nation', 'national', 'federal'
]);

export function classifyIntentAndExtractConstraints(query: string): ClassifiedIntent {
  const normalized = query.toLowerCase().trim();
  const constraints: QueryConstraints = {};

  // 1. Primary Source / Official Filter Constraint
  if (
    normalized.includes('primary source') ||
    normalized.includes('primary sources') ||
    normalized.includes('official source') ||
    normalized.includes('official sources') ||
    normalized.includes('government sources only') ||
    normalized.includes('official sources only') ||
    normalized.includes('primary sources only')
  ) {
    constraints.primaryOnly = true;
    constraints.officialOnly = true;
  }

  // 2. Extract State / FCT (Generic Geographic Parsing)
  let matchedStateToken: string | null = null;
  for (const [stateName, stateCode] of Object.entries(NIGERIAN_STATES)) {
    const stateRegex = new RegExp(`\\b${stateName}\\b`, 'i');
    if (stateRegex.test(normalized)) {
      constraints.state = stateName.charAt(0).toUpperCase() + stateName.slice(1);
      constraints.stateCode = stateCode;
      matchedStateToken = stateName;
      if (stateCode === 'NG-FC') {
        constraints.isFCT = true;
      }
      break;
    }
  }

  // 3. Extract Sector (Generic Domain Mapping)
  let matchedSectorToken: string | null = null;
  for (const [keyword, sectorMeta] of Object.entries(SECTOR_ALIASES)) {
    const secRegex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (secRegex.test(normalized)) {
      constraints.sector = sectorMeta.label;
      constraints.sectorCode = sectorMeta.code;
      matchedSectorToken = keyword;
      break;
    }
  }

  // 4. Extract Record Type
  if (normalized.includes('achievement') || normalized.includes('achievements')) {
    constraints.recordType = 'achievement';
  } else if (normalized.includes('policy') || normalized.includes('policies')) {
    constraints.recordType = 'policy';
  } else if (normalized.includes('project') || normalized.includes('projects')) {
    constraints.recordType = 'physical_project';
  } else if ((normalized.includes('programme') || normalized.includes('programmes')) && !normalized.includes('student loan')) {
    constraints.recordType = 'programme';
  }

  // 5. Extract Years / Dates
  const yearMatch = normalized.match(/\b(2023|2024|2025|2026)\b/g);
  if (yearMatch && yearMatch.length > 0) {
    if (yearMatch.length === 1) {
      constraints.year = parseInt(yearMatch[0], 10);
      if (normalized.includes('since') || normalized.includes('from') || normalized.includes('after')) {
        constraints.dateStart = `${yearMatch[0]}-01-01`;
      }
    } else {
      constraints.yearComparison = yearMatch.map((y) => parseInt(y, 10));
    }
  }

  // 6. Extract Status Constraint
  if (normalized.includes('completed') || normalized.includes('finished') || normalized.includes('delivered')) {
    constraints.statusConstraint = 'completed';
  } else if (normalized.includes('operational') || normalized.includes('live') || normalized.includes('functioning')) {
    constraints.statusConstraint = 'operational';
  } else if (normalized.includes('in progress') || normalized.includes('ongoing') || normalized.includes('under implementation')) {
    constraints.statusConstraint = 'in_progress';
  } else if (normalized.includes('enacted') || normalized.includes('legislated') || normalized.includes('passed')) {
    constraints.statusConstraint = 'enacted';
  }

  // 7. Extract Financial Concept
  if (
    normalized.includes('disbursed') ||
    normalized.includes('disbursement') ||
    normalized.includes('spent') ||
    normalized.includes('spending') ||
    normalized.includes('expenditure') ||
    normalized.includes('budget') ||
    normalized.includes('cost') ||
    normalized.includes('how much') ||
    normalized.includes('commitment') ||
    normalized.includes('commitments') ||
    normalized.includes('revenue') ||
    normalized.includes('investment') ||
    normalized.includes('funds') ||
    normalized.includes('funding')
  ) {
    if (normalized.includes('commitment') || normalized.includes('commitments')) {
      constraints.financialType = 'programme_envelope';
    } else if (normalized.includes('disbursed') || normalized.includes('disbursement')) {
      constraints.financialType = 'funding_released';
    } else if (normalized.includes('expenditure') || normalized.includes('spent')) {
      constraints.financialType = 'reported_expenditure';
    } else if (normalized.includes('investment')) {
      constraints.financialType = 'private_investment';
    }
  }

  // 8. Extract Beneficiary Concept
  if (
    normalized.includes('who benefited') ||
    normalized.includes('beneficiary') ||
    normalized.includes('beneficiaries') ||
    normalized.includes('how many people') ||
    normalized.includes('trained') ||
    normalized.includes('registered') ||
    normalized.includes('supported')
  ) {
    if (normalized.includes('trained')) {
      constraints.beneficiaryStage = 'trained';
    } else if (normalized.includes('supported') || normalized.includes('received')) {
      constraints.beneficiaryStage = 'supported';
    }
  }

  // 9. Extract Comparison Targets
  const compareMatch = normalized.match(/compare\s+([\w\s]+?)\s+(?:and|vs|with|against)\s+([\w\s]+)/i);
  const vsMatch = normalized.match(/([\w\s]+?)\s+(?:vs|versus)\s+([\w\s]+)/i);
  const comp = compareMatch || vsMatch;
  if (comp) {
    const rawFirst = comp[1].trim();
    const rawSecond = comp[2].trim();

    if (NIGERIAN_STATES[rawFirst] && NIGERIAN_STATES[rawSecond]) {
      constraints.comparisonTargets = {
        type: 'state',
        first: rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1),
        second: rawSecond.charAt(0).toUpperCase() + rawSecond.slice(1),
      };
    } else if (
      (rawFirst.includes('project') && rawSecond.includes('programme')) ||
      (rawFirst.includes('programme') && rawSecond.includes('project'))
    ) {
      constraints.comparisonTargets = {
        type: 'record_type',
        first: 'physical_project',
        second: 'programme',
      };
    } else if (constraints.yearComparison && constraints.yearComparison.length >= 2) {
      constraints.comparisonTargets = {
        type: 'year',
        first: String(constraints.yearComparison[0]),
        second: String(constraints.yearComparison[1]),
      };
    }
  }

  // 10. Extract Entity Search Keywords (Generic Data-Driven Extraction)
  const rawTokens = normalized
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);

  const cleanTokens: string[] = [];

  for (const token of rawTokens) {
    if (STOP_WORDS.has(token)) continue;
    if (matchedStateToken && (token === matchedStateToken || matchedStateToken.includes(token))) continue;
    if (matchedSectorToken && (token === matchedSectorToken || matchedSectorToken.includes(token))) continue;
    if (/^\d+$/.test(token)) continue;
    if (token.length <= 2) continue;

    cleanTokens.push(token);
  }

  if (cleanTokens.length > 0) {
    constraints.keywords = cleanTokens;
    constraints.entityName = cleanTokens.join(' ');
  }

  // Determine Intent Class (16 classes)
  let intent: QueryIntent = 'SUMMARY_QUERY';

  const filterCount = [
    Boolean(constraints.state),
    Boolean(constraints.sector),
    Boolean(constraints.recordType),
    Boolean(constraints.year || constraints.dateStart),
    Boolean(constraints.statusConstraint),
  ].filter(Boolean).length;

  const hasEntityKeyword = Boolean(
    cleanTokens.length > 0 && !constraints.financialType
  );

  if (constraints.comparisonTargets || normalized.startsWith('compare ') || normalized.includes(' vs ')) {
    intent = 'COMPARISON_QUERY';
  } else if (filterCount >= 2) {
    intent = 'MULTI_FILTER_QUERY';
  } else if (normalized.startsWith('show primary') || normalized.includes('primary sources only') || normalized.includes('sources only') || normalized.includes('official sources only')) {
    intent = 'SOURCE_QUERY';
  } else if (normalized.includes('what evidence') || normalized.includes('evidence supports') || normalized.includes('evidence exists') || normalized.includes('insufficient evidence')) {
    intent = 'EVIDENCE_QUERY';
  } else if (normalized.includes('how much') || normalized.includes('disbursed') || normalized.includes('financial commitments') || (constraints.financialType && !hasEntityKeyword)) {
    intent = 'FINANCIAL_QUERY';
  } else if (normalized.includes('who benefited') || normalized.includes('how many people') || (constraints.beneficiaryStage && !hasEntityKeyword)) {
    intent = 'BENEFICIARY_QUERY';
  } else if (hasEntityKeyword && cleanTokens.length > 0 && !constraints.state && !constraints.sector && !constraints.recordType) {
    intent = 'ENTITY_LOOKUP';
  } else if (constraints.financialType) {
    intent = 'FINANCIAL_QUERY';
  } else if (constraints.beneficiaryStage) {
    intent = 'BENEFICIARY_QUERY';
  } else if (normalized.includes('timeline') || normalized.includes('when did') || normalized.includes('what happened in') || normalized.includes('history of')) {
    intent = 'TIMELINE_QUERY';
  } else if (normalized.includes('completed') || normalized.includes('status') || normalized.includes('progress') || normalized.includes('operational')) {
    intent = 'STATUS_QUERY';
  } else if (constraints.keywords && constraints.keywords.length > 0 && !constraints.state && !constraints.sector && !constraints.recordType) {
    intent = 'ENTITY_LOOKUP';
  } else if (constraints.state && !constraints.sector && !constraints.recordType) {
    intent = 'GEOGRAPHIC_QUERY';
  } else if (constraints.sector && !constraints.state && !constraints.recordType) {
    intent = 'SECTOR_QUERY';
  } else if (constraints.recordType === 'programme') {
    intent = 'PROGRAMME_QUERY';
  } else if (constraints.recordType === 'physical_project') {
    intent = 'PROJECT_QUERY';
  } else if (constraints.recordType === 'policy') {
    intent = 'POLICY_QUERY';
  } else if (constraints.recordType === 'achievement') {
    intent = 'ACHIEVEMENT_QUERY';
  } else {
    intent = 'SUMMARY_QUERY';
  }

  return {
    intent,
    constraints,
    rawQuery: query,
  };
}
