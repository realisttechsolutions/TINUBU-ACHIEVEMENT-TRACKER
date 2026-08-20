import { ScopeDisplayInfo, GeographicScopeType } from '@/adapters/types';

interface RecordGeoInput {
  title?: string;
  summary?: string;
  statesCovered?: string[];
  geopoliticalZone?: string;
  geographicScope?: string;
}

const CORRIDOR_KEYWORDS = [
  'coastal highway',
  'superhighway',
  'corridor',
  'expressway',
  'pipeline',
  'akk gas',
  'rail line',
  'rail mass transit',
  'standard gauge',
  'dual carriageway',
  'bypass',
  'artery',
  'transmission line',
];

export function deriveGeographicScope(
  record: RecordGeoInput,
  selectedState?: string
): ScopeDisplayInfo {
  const titleLower = (record.title || '').toLowerCase();
  const summaryLower = (record.summary || '').toLowerCase();
  const states = record.statesCovered || [];
  const selectedLower = (selectedState || '').toLowerCase().trim();

  // Normalize states list
  const cleanStates = states.map((s) => s.trim());
  const isExplicitlyNational = cleanStates.some(
    (s) =>
      s.toLowerCase() === 'national' ||
      s.toLowerCase().includes('36 states') ||
      s.toLowerCase().includes('nationwide')
  );

  const isCorridor = CORRIDOR_KEYWORDS.some(
    (kw) => titleLower.includes(kw) || summaryLower.includes(kw)
  );

  // 1. Check FCT Specific
  const isOnlyFCT =
    cleanStates.length === 1 &&
    (cleanStates[0].toLowerCase().includes('fct') ||
      cleanStates[0].toLowerCase().includes('abuja'));
  if (isOnlyFCT || (titleLower.includes('abuja') && !isCorridor && !isExplicitlyNational && cleanStates.length <= 1)) {
    return {
      scope: 'fct_specific',
      label: 'FCT (Abuja)-Specific',
      badgeClass: 'bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      isNationwide: false,
      isStateSpecific: true,
      isMultiState: false,
      isCorridor: false,
      isFct: true,
    };
  }

  // 2. Check Specific Single State
  const nonNationalStates = cleanStates.filter(
    (s) =>
      s.toLowerCase() !== 'national' &&
      !s.toLowerCase().includes('36 states') &&
      !s.toLowerCase().includes('nationwide')
  );

  if (!isExplicitlyNational && nonNationalStates.length === 1) {
    const stateName = nonNationalStates[0];
    return {
      scope: 'state_specific',
      label: `${stateName}-Specific`,
      badgeClass: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      isNationwide: false,
      isStateSpecific: true,
      isMultiState: false,
      isCorridor: false,
      isFct: false,
    };
  }

  // 3. Check Corridor Projects
  if (isCorridor && (nonNationalStates.length >= 2 || titleLower.includes('highway') || titleLower.includes('corridor') || titleLower.includes('expressway'))) {
    return {
      scope: 'project_corridor',
      label: 'Project Corridor',
      badgeClass: 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      isNationwide: false,
      isStateSpecific: false,
      isMultiState: true,
      isCorridor: true,
      isFct: false,
    };
  }

  // 4. Check Multi-State (2 to 8 states)
  if (nonNationalStates.length >= 2 && nonNationalStates.length <= 8 && !isExplicitlyNational) {
    return {
      scope: 'multi_state',
      label: 'Multi-State',
      badgeClass: 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      isNationwide: false,
      isStateSpecific: false,
      isMultiState: true,
      isCorridor: false,
      isFct: false,
    };
  }

  // 5. Check Regional / Zonal
  if (
    record.geopoliticalZone &&
    record.geopoliticalZone.toLowerCase() !== 'national' &&
    !record.geopoliticalZone.toLowerCase().includes('36 states') &&
    !isExplicitlyNational
  ) {
    return {
      scope: 'regional_zonal',
      label: `${record.geopoliticalZone} Regional`,
      badgeClass: 'bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
      isNationwide: false,
      isStateSpecific: false,
      isMultiState: true,
      isCorridor: false,
      isFct: false,
    };
  }

  // 6. Default to Nationwide
  return {
    scope: 'nationwide',
    label: 'Nationwide',
    badgeClass: 'bg-gov-canvas dark:bg-white/5 text-gov-slate dark:text-gray-300 border-gov-border',
    isNationwide: true,
    isStateSpecific: false,
    isMultiState: false,
    isCorridor: false,
    isFct: false,
  };
}

export function getGeographicRelevanceRank(scope: ScopeDisplayInfo): number {
  if (scope.isStateSpecific || scope.isFct) return 1;
  if (scope.isCorridor || scope.isMultiState) return 2;
  if (scope.scope === 'regional_zonal') return 3;
  return 4; // Nationwide
}
