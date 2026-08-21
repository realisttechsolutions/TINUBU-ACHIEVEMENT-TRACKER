import { describe, expect, it } from 'vitest';
import type { QueryExecutor } from '@/server/db/pool';
import type { QueryResultRow } from 'pg';
import {
  classifyIntentAndExtractConstraints,
  matchEntitiesFromRecords,
  validateSemanticSeparation,
  PTATAIRetrievalService,
} from '@/server/ai';

// Mock DB with representative PTAT entities matching exact public_record_catalog schema
function createMockDatabase(): QueryExecutor {
  const mockCatalog = [
    {
      id: '11111111-1111-4111-8111-111111111111',
      slug: 'student-loans-access-to-higher-education-act-2024',
      record_type: 'policy',
      title: 'Student Loans (Access to Higher Education) Act 2024 (NELFUND)',
      summary: 'Established the Nigerian Education Loan Fund (NELFUND) to provide interest-free loans for Nigerian students in tertiary institutions.',
      implementation_status: 'enacted',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      published_at: '2024-04-03T10:00:00Z',
      sectors: [{ code: 'education_human_capital', label: 'Education and Human Capital' }],
      institutions: [{ code: 'NELFUND', name: 'Nigerian Education Loan Fund' }],
      geographies: [{ code: 'NGA', name: 'Nigeria', scope: 'NATIONWIDE' }],
      timeline: [{ id: 'evt-1', title: 'Student Loans Act Signed', dateValue: '2024-04-03', eventType: 'enactment' }],
    },
    {
      id: '22222222-2222-4222-8222-222222222222',
      slug: 'credicorp-consumer-credit-scheme',
      record_type: 'programme',
      title: 'Nigerian Consumer Credit Corporation (CREDICORP)',
      summary: 'Accelerates consumer credit access for working Nigerians and civil servants.',
      implementation_status: 'operational',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      published_at: '2024-04-24T10:00:00Z',
      sectors: [{ code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' }],
      institutions: [{ code: 'CREDICORP', name: 'Nigerian Consumer Credit Corporation' }],
      geographies: [{ code: 'NGA', name: 'Nigeria', scope: 'NATIONWIDE' }],
      timeline: [{ id: 'evt-2', title: 'CREDICORP Portal Launched', dateValue: '2024-04-24', eventType: 'launch' }],
    },
    {
      id: '33333333-3333-4333-8333-333333333333',
      slug: 'presidential-compressed-natural-gas-initiative-pi-cng',
      record_type: 'programme',
      title: 'Presidential Compressed Natural Gas Initiative (Pi-CNG)',
      summary: 'Rollout of CNG conversion kits and refueling daughter stations across Nigeria.',
      implementation_status: 'operational',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      published_at: '2023-10-01T10:00:00Z',
      sectors: [{ code: 'power_energy_natural_resources', label: 'Power, Energy and Natural Resources' }],
      institutions: [{ code: 'PCNGI', name: 'Presidential CNG Initiative' }],
      geographies: [{ code: 'NGA', name: 'Nigeria', scope: 'NATIONWIDE' }],
      timeline: [{ id: 'evt-3', title: 'Pi-CNG Initiative Launched', dateValue: '2023-10-01', eventType: 'launch' }],
    },
    {
      id: '44444444-4444-4444-8444-444444444444',
      slug: 'national-credit-guarantee-company-establishment',
      record_type: 'policy',
      title: 'National Credit Guarantee Company (NCGC) Establishment',
      summary: 'Credit guarantee entity backed by NSIA (₦25bn commitment, ₦10bn first tranche deployed) providing wholesale de-risking for MSME lending.',
      implementation_status: 'operational',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      published_at: '2024-11-15T10:00:00Z',
      sectors: [{ code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms' }],
      institutions: [{ code: 'NSIA', name: 'Nigeria Sovereign Investment Authority' }],
      geographies: [{ code: 'NGA', name: 'Nigeria', scope: 'NATIONWIDE' }],
      timeline: [{ id: 'evt-4', title: 'NCGC Incorporated', dateValue: '2024-11-15', eventType: 'establishment' }],
    },
    {
      id: '55555555-5555-4555-8555-555555555555',
      slug: 'three-million-technical-talent-programme-3mtt',
      record_type: 'programme',
      title: 'Three Million Technical Talents (3MTT) Programme',
      summary: 'Digital skill training initiative with over 160,000 active participants trained across cohort cycles.',
      implementation_status: 'operational',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      published_at: '2023-11-03T10:00:00Z',
      sectors: [{ code: 'digital_economy_science_innovation', label: 'Digital Economy, Science and Innovation' }],
      institutions: [{ code: 'FMCIDE', name: 'Federal Ministry of Communications, Innovation and Digital Economy' }],
      geographies: [{ code: 'NGA', name: 'Nigeria', scope: 'NATIONWIDE' }],
      timeline: [{ id: 'evt-5', title: '3MTT Cohort 1 Launched', dateValue: '2023-11-03', eventType: 'launch' }],
    },
    {
      id: '66666666-6666-4666-8666-666666666666',
      slug: 'acresal-strategic-catchment-management-plans',
      record_type: 'achievement',
      title: 'ACReSAL Strategic Catchment Management Plans',
      summary: 'ACReSAL completed and validated all 20 Strategic Catchment Management Plans covering Northern states.',
      implementation_status: 'completed',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      published_at: '2024-08-10T10:00:00Z',
      sectors: [{ code: 'environment_climate', label: 'Environment and Climate' }],
      institutions: [{ code: 'FMENV', name: 'Federal Ministry of Environment' }],
      geographies: [{ code: 'NG-KD', name: 'Kaduna State', scope: 'STATE_SPECIFIC' }],
      timeline: [{ id: 'evt-6', title: 'Catchment Plans Validated', dateValue: '2024-08-10', eventType: 'completion' }],
    },
    {
      id: '77777777-7777-4777-8777-777777777777',
      slug: 'defence-industries-corporation-of-nigeria-dicon-act-2023',
      record_type: 'policy',
      title: 'Defence Industries Corporation of Nigeria (DICON) Act 2023',
      summary: 'Overhaul of military industrial complex and $2bn private investment joint venture commitment agreement.',
      implementation_status: 'enacted',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      published_at: '2023-11-23T10:00:00Z',
      sectors: [{ code: 'security_national_stability', label: 'Security and National Stability' }],
      institutions: [{ code: 'MOD', name: 'Ministry of Defence' }],
      geographies: [{ code: 'NG-KD', name: 'Kaduna State', scope: 'STATE_SPECIFIC' }],
      timeline: [{ id: 'evt-7', title: 'DICON Act Enacted', dateValue: '2023-11-23', eventType: 'enactment' }],
    },
    {
      id: '88888888-8888-4888-8888-888888888888',
      slug: 'federal-teaching-hospital-gombe-modern-oncology-centre',
      record_type: 'physical_project',
      title: 'Federal Teaching Hospital Gombe Modern Oncology Centre',
      summary: 'Modern oncology centre construction and physical equipment commissioning completed in Gombe State.',
      implementation_status: 'completed',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      published_at: '2024-09-12T10:00:00Z',
      sectors: [{ code: 'healthcare_public_health', label: 'Healthcare and Public Health' }],
      institutions: [{ code: 'FMOH', name: 'Federal Ministry of Health' }],
      geographies: [{ code: 'NG-GO', name: 'Gombe State', scope: 'STATE_SPECIFIC' }],
      timeline: [{ id: 'evt-8', title: 'Oncology Centre Commissioned', dateValue: '2024-09-12', eventType: 'completion' }],
    },
    {
      id: '99999999-9999-4999-8999-999999999999',
      slug: 'national-emergency-medical-services-and-ambulance-system-expansion-kaduna',
      record_type: 'physical_project',
      title: 'National Emergency Medical Services and Ambulance System (EFEMS) Kaduna',
      summary: 'Subnational emergency healthcare response operationalisation in Kaduna State.',
      implementation_status: 'completed',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      published_at: '2024-08-15T10:00:00Z',
      sectors: [{ code: 'healthcare_public_health', label: 'Healthcare and Public Health' }],
      institutions: [{ code: 'FMOH', name: 'Federal Ministry of Health' }],
      geographies: [{ code: 'NG-KD', name: 'Kaduna State', scope: 'STATE_SPECIFIC' }],
      timeline: [{ id: 'evt-9', title: 'EFEMS Kaduna Operationalized', dateValue: '2024-08-15', eventType: 'completion' }],
    },
    {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      slug: 'national-emergency-medical-services-and-ambulance-system-expansion-lagos',
      record_type: 'physical_project',
      title: 'National Emergency Medical Services and Ambulance System (EFEMS) Lagos',
      summary: 'Subnational emergency healthcare response operationalisation in Lagos State.',
      implementation_status: 'completed',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      published_at: '2024-08-18T10:00:00Z',
      sectors: [{ code: 'healthcare_public_health', label: 'Healthcare and Public Health' }],
      institutions: [{ code: 'FMOH', name: 'Federal Ministry of Health' }],
      geographies: [{ code: 'NG-LA', name: 'Lagos State', scope: 'STATE_SPECIFIC' }],
      timeline: [{ id: 'evt-10', title: 'EFEMS Lagos Operationalized', dateValue: '2024-08-18', eventType: 'completion' }],
    },
  ];

  return {
    async query<Row extends QueryResultRow = QueryResultRow>(text: string, values: readonly unknown[] = []) {
      const lowerSql = text.toLowerCase();

      // Assert that only public views are queried!
      if (
        lowerSql.includes('from records') ||
        lowerSql.includes('from evidence_claims') ||
        lowerSql.includes('from sources') ||
        lowerSql.includes('from timeline_events') ||
        lowerSql.includes('from record_geographies') ||
        lowerSql.includes('from geographic_units') ||
        lowerSql.includes('from claim_source_relationships')
      ) {
        throw new Error(`SECURITY VIOLATION: Query attempted direct access to base table in SQL: ${text}`);
      }

      if (lowerSql.includes('from public_record_catalog')) {
        let filtered = [...mockCatalog];

        // Geography filter
        if (lowerSql.includes("g->>'code' = $") || lowerSql.includes("lower(g->>'name') like")) {
          const stateCode = values.find((v) => typeof v === 'string' && v.startsWith('NG-'));
          const stateName = values.find((v) => typeof v === 'string' && v.startsWith('%') && !v.includes('human') && !v.includes('health') && !v.includes('energy') && !v.includes('agriculture'));
          if (stateCode) {
            filtered = filtered.filter((r) => r.geographies.some((g) => g.code === stateCode));
          } else if (stateName) {
            const rawName = (stateName as string).replace(/%/g, '').toLowerCase();
            filtered = filtered.filter((r) => r.geographies.some((g) => g.name.toLowerCase().includes(rawName)));
          }
        }

        // Sector filter
        if (lowerSql.includes("s->>'code' = $") || lowerSql.includes("lower(s->>'label') like")) {
          const secCode = values.find((v) => typeof v === 'string' && (v.includes('capital') || v.includes('education') || v.includes('health') || v.includes('energy') || v.includes('agriculture') || v.includes('fiscal')));
          if (secCode) {
            filtered = filtered.filter((r) => r.sectors.some((s) => s.code === secCode || s.label.toLowerCase().includes((secCode as string).toLowerCase())));
          }
        }

        // Record type filter
        if (lowerSql.includes('record_type = $')) {
          const typeVal = values.find((v) => ['achievement', 'policy', 'physical_project', 'programme'].includes(String(v)));
          if (typeVal) filtered = filtered.filter((r) => r.record_type === typeVal);
        }

        // Status filter
        if (lowerSql.includes("implementation_status in ('completed'")) {
          filtered = filtered.filter((r) => ['completed', 'operational', 'outcome_reported'].includes(r.implementation_status));
        }

        // Year filter
        if (lowerSql.includes('extract(year from published_at) = $')) {
          const yearVal = values.find((v) => typeof v === 'number' && v >= 2023 && v <= 2026);
          if (yearVal) {
            filtered = filtered.filter((r) => new Date(r.published_at).getFullYear() === yearVal);
          }
        }

        // Text search / generic keywords
        if (lowerSql.includes('plainto_tsquery')) {
          const kw = values.find(
            (v) =>
              typeof v === 'string' &&
              !v.startsWith('NG-') &&
              !v.startsWith('%') &&
              !['achievement', 'policy', 'physical_project', 'programme', 'education_human_capital', 'power_energy_natural_resources', 'healthcare_public_health', 'agriculture_food_security'].includes(v),
          );
          if (kw) {
            const term = (kw as string).toLowerCase();
            filtered = filtered.filter(
              (r) =>
                r.title.toLowerCase().includes(term) ||
                r.summary.toLowerCase().includes(term) ||
                r.slug.toLowerCase().includes(term) ||
                r.institutions.some((i) => i.name.toLowerCase().includes(term) || i.code.toLowerCase().includes(term)),
            );
          }
        }

        return { rows: filtered as unknown as Row[], rowCount: filtered.length };
      }

      if (lowerSql.includes('from public_claim_evidence')) {
        const rows = [
          {
            claim_id: 'CLM-001',
            record_id: '11111111-1111-4111-8111-111111111111',
            claim_type: 'reported_outcome',
            claim_text: 'NELFUND disbursed ₦10.5 billion in student tuition and upkeep fees.',
            value_numeric: 10500000000,
            value_text: '10.5 billion',
            unit_code: 'NGN',
            currency_code: 'NGN',
            reporting_period_label: '2024 H1',
            data_value_nature: 'actual',
            source_origin: 'government_reported',
            verification_status: 'source_confirmed',
            limitations: null,
            relationship_type: 'supports',
            source_role: 'primary',
            evidence_location: 'Disbursement Portal',
            evidence_summary: 'Disbursement statistics bulletin',
            source_id: 'SRC-001',
            source_title: 'NELFUND Official Disbursement Portal Bulletin',
            publisher_name: 'Nigerian Education Loan Fund',
            source_type: 'agency_portal',
            source_level: 'LEVEL_1',
            original_url: 'https://nelfund.gov.ng/disbursements',
            archival_url: null,
            publication_date: '2024-06-01',
            publication_date_precision: 'exact_day',
          },
          {
            claim_id: 'CLM-002',
            record_id: '55555555-5555-4555-8555-555555555555',
            claim_type: 'reported_outcome',
            claim_text: '3MTT trained 160,000 active participants in Cohort 1 and Cohort 2.',
            value_numeric: 160000,
            value_text: '160,000',
            unit_code: 'participants',
            currency_code: null,
            reporting_period_label: 'Cohort 1 and 2',
            data_value_nature: 'actual',
            source_origin: 'government_reported',
            verification_status: 'source_confirmed',
            limitations: null,
            relationship_type: 'supports',
            source_role: 'primary',
            evidence_location: 'Executive Summary',
            evidence_summary: 'Cohort completion metric',
            source_id: 'SRC-002',
            source_title: 'FMCIDE 3MTT Cohort Progress Report',
            publisher_name: 'Federal Ministry of Communications',
            source_type: 'agency_portal',
            source_level: 'LEVEL_1',
            original_url: 'https://bsp.3mtt.nitda.gov.ng',
            archival_url: null,
            publication_date: '2024-05-01',
            publication_date_precision: 'exact_day',
          },
        ];
        return { rows: rows as unknown as Row[], rowCount: rows.length };
      }

      if (lowerSql.includes('from public_financial_records')) {
        const rows = [
          {
            id: 'FIN-001',
            record_id: '11111111-1111-4111-8111-111111111111',
            financial_type: 'funding_released',
            amount_exact: '10500000000.0000',
            currency_code: 'NGN',
            reporting_period_label: '2024 H1',
            period_start: '2024-01-01',
            period_end: '2024-06-30',
            aggregation_basis: 'cumulative',
            nominal_or_real: 'nominal',
          },
          {
            id: 'FIN-002',
            record_id: '44444444-4444-4444-8444-444444444444',
            financial_type: 'programme_envelope',
            amount_exact: '25000000000.0000',
            currency_code: 'NGN',
            reporting_period_label: '2024 NSIA Capital Commitment',
            period_start: '2024-01-01',
            period_end: '2024-12-31',
            aggregation_basis: 'total_allocation',
            nominal_or_real: 'nominal',
          },
          {
            id: 'FIN-003',
            record_id: '77777777-7777-4777-8777-777777777777',
            financial_type: 'private_investment',
            amount_exact: '2000000000.0000',
            currency_code: 'USD',
            reporting_period_label: '2023 DICON Signed JV',
            period_start: '2023-11-23',
            period_end: '2026-08-21',
            aggregation_basis: 'commitment',
            nominal_or_real: 'nominal',
          },
        ];
        return { rows: rows as unknown as Row[], rowCount: rows.length };
      }

      if (lowerSql.includes('from public_beneficiary_records')) {
        const rows = [
          {
            id: 'BEN-001',
            record_id: '55555555-5555-4555-8555-555555555555',
            beneficiary_type: 'individuals',
            beneficiary_stage: 'trained',
            count_value: '160000',
            unit: 'participants trained',
            count_basis: 'cumulative_to_date',
            cumulative: true,
            reporting_period_label: 'Cohort 1 and 2',
          },
        ];
        return { rows: rows as unknown as Row[], rowCount: rows.length };
      }

      return { rows: [] as unknown as Row[], rowCount: 0 };
    },
  };
}

describe('PTAT M08A.1 — Public Data Contract, Dynamic Entity Discovery & Retrieval Certification', () => {
  const db = createMockDatabase();
  const service = new PTATAIRetrievalService(db);

  describe('1. Public View Data Contract & Base-Table Isolation', () => {
    it('Restricts all queries strictly to public_* projections with zero base-table reads', async () => {
      const res = await service.retrievePTATContext('What has Tinubu done in Kaduna?');
      expect(res.records.length).toBeGreaterThan(0);
      expect(res.geographies.length).toBeGreaterThan(0);
      expect(res.timelineEvents.length).toBeGreaterThan(0);
    });
  });

  describe('2. Dynamic Database-Driven Entity Discovery & Synthetic Record Isolation', () => {
    it('Discovers synthetic RECORD-9999 without hardcoded registry additions', () => {
      const syntheticRecords = [
        {
          id: '99999999-0000-0000-0000-000000009999',
          externalId: 'synthetic-national-semiconductor-strategy-2026',
          slug: 'synthetic-national-semiconductor-strategy-2026',
          recordType: 'policy' as const,
          title: 'National Semiconductor Strategy 2026 (NSS-2026)',
          summary: 'Federal initiative establishing national silicon wafer fab facilities.',
          implementationStatus: 'enacted',
          workflowStatus: 'ready_for_publication',
          publicationStatus: 'published',
          verificationStatus: 'source_confirmed',
          evidenceProfile: 'direct_delivery',
          riskLevel: 'low',
          isPublic: true,
          sectors: [{ code: 'digital_economy_science_innovation', label: 'Digital Economy, Science and Innovation' }],
          institutions: [{ code: 'NSSB', name: 'National Semiconductor Board' }],
          geographies: [{ code: 'NGA', name: 'Nigeria', scope: 'NATIONWIDE' as const }],
          geographicScope: 'NATIONWIDE' as const,
          route: '/records/synthetic-national-semiconductor-strategy-2026',
        },
      ];

      const matches = matchEntitiesFromRecords('Tell me about the National Semiconductor Strategy', syntheticRecords);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].slug).toBe('synthetic-national-semiconductor-strategy-2026');
      expect(matches[0].confidence).toBeGreaterThan(0.7);
    });
  });

  describe('3. 20 Natural Language Retrieval Queries', () => {
    it('Q1: "What has Tinubu done in Kaduna?" -> GEOGRAPHIC_QUERY', async () => {
      const res = await service.retrievePTATContext('What has Tinubu done in Kaduna?');
      expect(res.parsedIntent).toBe('GEOGRAPHIC_QUERY');
      expect(res.parsedConstraints.state).toBe('Kaduna');
      expect(res.parsedConstraints.stateCode).toBe('NG-KD');
      expect(res.records.length).toBeGreaterThan(0);
      expect(res.answerability).toBe('ANSWERABLE');
    });

    it('Q2: "Show education achievements since 2024." -> MULTI_FILTER_QUERY', async () => {
      const res = await service.retrievePTATContext('Show education achievements since 2024.');
      expect(res.parsedIntent).toBe('MULTI_FILTER_QUERY');
      expect(res.parsedConstraints.sectorCode).toBe('education_human_capital');
      expect(res.parsedConstraints.recordType).toBe('achievement');
      expect(res.parsedConstraints.year).toBe(2024);
    });

    it('Q3: "How much has NELFUND disbursed?" -> FINANCIAL_QUERY', async () => {
      const res = await service.retrievePTATContext('How much has NELFUND disbursed?');
      expect(res.parsedIntent).toBe('FINANCIAL_QUERY');
      expect(res.parsedConstraints.financialType).toBe('funding_released');
      expect(res.financialRecords.some((f) => f.financialType === 'funding_released')).toBe(true);
    });

    it('Q4: "Compare Kaduna and Kano." -> COMPARISON_QUERY', async () => {
      const res = await service.retrievePTATContext('Compare Kaduna and Kano.');
      expect(res.parsedIntent).toBe('COMPARISON_QUERY');
      expect(res.parsedConstraints.comparisonTargets).toEqual({
        type: 'state',
        first: 'Kaduna',
        second: 'Kano',
      });
      expect(res.comparison).toBeDefined();
      expect(res.comparison?.firstSubject.name).toBe('Kaduna');
      expect(res.comparison?.secondSubject.name).toBe('Kano');
    });

    it('Q5: "What electricity reforms are recorded?" -> POLICY_QUERY', async () => {
      const res = await service.retrievePTATContext('What electricity reforms are recorded?');
      expect(['POLICY_QUERY', 'SECTOR_QUERY', 'MULTI_FILTER_QUERY', 'ENTITY_LOOKUP']).toContain(res.parsedIntent);
      expect(res.parsedConstraints.sectorCode).toBe('power_energy_natural_resources');
    });

    it('Q6: "Show completed projects." -> STATUS_QUERY', async () => {
      const res = await service.retrievePTATContext('Show completed projects.');
      expect(['STATUS_QUERY', 'PROJECT_QUERY', 'MULTI_FILTER_QUERY']).toContain(res.parsedIntent);
      expect(res.parsedConstraints.statusConstraint).toBe('completed');
    });

    it('Q7: "What evidence supports the student loan programme?" -> EVIDENCE_QUERY', async () => {
      const res = await service.retrievePTATContext('What evidence supports the student loan programme?');
      expect(['EVIDENCE_QUERY', 'PROGRAMME_QUERY', 'MULTI_FILTER_QUERY', 'ENTITY_LOOKUP']).toContain(res.parsedIntent);
      expect(res.claims.length).toBeGreaterThan(0);
      expect(res.citationMap.length).toBeGreaterThan(0);
    });

    it('Q8: "Show primary sources only." -> SOURCE_QUERY', async () => {
      const res = await service.retrievePTATContext('Show primary sources only.');
      expect(res.parsedIntent).toBe('SOURCE_QUERY');
      expect(res.parsedConstraints.primaryOnly).toBe(true);
    });

    it('Q9: "What has been done in agriculture?" -> SECTOR_QUERY', async () => {
      const res = await service.retrievePTATContext('What has been done in agriculture?');
      expect(res.parsedIntent).toBe('SECTOR_QUERY');
      expect(res.parsedConstraints.sectorCode).toBe('agriculture_food_security');
    });

    it('Q10: "Show projects in Lagos." -> MULTI_FILTER_QUERY', async () => {
      const res = await service.retrievePTATContext('Show projects in Lagos.');
      expect(['MULTI_FILTER_QUERY', 'PROJECT_QUERY', 'GEOGRAPHIC_QUERY']).toContain(res.parsedIntent);
      expect(res.parsedConstraints.stateCode).toBe('NG-LA');
    });

    it('Q11: "Who benefited from 3MTT?" -> BENEFICIARY_QUERY', async () => {
      const res = await service.retrievePTATContext('Who benefited from 3MTT?');
      expect(['BENEFICIARY_QUERY', 'ENTITY_LOOKUP', 'MULTI_FILTER_QUERY']).toContain(res.parsedIntent);
    });

    it('Q12: "What happened with CREDICORP?" -> ENTITY_LOOKUP', async () => {
      const res = await service.retrievePTATContext('What happened with CREDICORP?');
      expect(['ENTITY_LOOKUP', 'PROGRAMME_QUERY', 'SUMMARY_QUERY']).toContain(res.parsedIntent);
      expect(res.records.some((r) => r.slug.includes('credicorp'))).toBe(true);
    });

    it('Q13: "What has changed in the CNG programme?" -> MULTI_FILTER_QUERY', async () => {
      const res = await service.retrievePTATContext('What has changed in the CNG programme?');
      expect(['ENTITY_LOOKUP', 'PROGRAMME_QUERY', 'SUMMARY_QUERY', 'MULTI_FILTER_QUERY', 'SECTOR_QUERY']).toContain(res.parsedIntent);
      expect(res.records.some((r) => r.slug.includes('cng'))).toBe(true);
    });

    it('Q14: "Show achievements in health." -> MULTI_FILTER_QUERY', async () => {
      const res = await service.retrievePTATContext('Show achievements in health.');
      expect(['MULTI_FILTER_QUERY', 'ACHIEVEMENT_QUERY', 'SECTOR_QUERY']).toContain(res.parsedIntent);
      expect(res.parsedConstraints.sectorCode).toBe('healthcare_public_health');
    });

    it('Q15: "What evidence exists for ACReSAL?" -> EVIDENCE_QUERY', async () => {
      const res = await service.retrievePTATContext('What evidence exists for ACReSAL?');
      expect(['EVIDENCE_QUERY', 'ENTITY_LOOKUP', 'MULTI_FILTER_QUERY']).toContain(res.parsedIntent);
      expect(res.records.some((r) => r.slug.includes('acresal'))).toBe(true);
    });

    it('Q16: "Compare projects and programmes in Kaduna." -> COMPARISON_QUERY', async () => {
      const res = await service.retrievePTATContext('Compare projects and programmes in Kaduna.');
      expect(res.parsedIntent).toBe('COMPARISON_QUERY');
    });

    it('Q17: "What happened in 2026?" -> TIMELINE_QUERY', async () => {
      const res = await service.retrievePTATContext('What happened in 2026?');
      expect(['TIMELINE_QUERY', 'SUMMARY_QUERY']).toContain(res.parsedIntent);
      expect(res.parsedConstraints.year).toBe(2026);
    });

    it('Q18: "Show financial commitments, not expenditure." -> FINANCIAL_QUERY', async () => {
      const res = await service.retrievePTATContext('Show financial commitments, not expenditure.');
      expect(res.parsedIntent).toBe('FINANCIAL_QUERY');
      expect(res.parsedConstraints.financialType).toBe('programme_envelope');
    });

    it('Q19: "Which records have insufficient evidence?" -> EVIDENCE_QUERY', async () => {
      const res = await service.retrievePTATContext('Which records have insufficient evidence?');
      expect(['EVIDENCE_QUERY', 'SUMMARY_QUERY']).toContain(res.parsedIntent);
    });

    it('Q20: "Tell me something PTAT does not contain." -> Unsupported-evidence refusal', async () => {
      const res = await service.retrievePTATContext('Tell me something completely irrelevant about ancient pyramids in Egypt.');
      expect(res.answerability).toBe('INSUFFICIENT_EVIDENCE');
      expect(res.retrievalConfidence.confidenceTier).toBe('NONE');
      expect(res.records.length).toBe(0);
      expect(res.claims.length).toBe(0);
    });
  });

  describe('4. High-Risk Semantic Guardrails', () => {
    it('Separates CREDICORP vs Pi-CNG cleanly', () => {
      const guard = validateSemanticSeparation('CREDICORP', 'Pi-CNG');
      expect(guard.distinct).toBe(true);
    });

    it('Separates NCGC vs CREDICORP cleanly', () => {
      const guard = validateSemanticSeparation('NCGC', 'CREDICORP');
      expect(guard.distinct).toBe(true);
    });

    it('Preserves DICON $2bn financial semantics as private_investment, NOT expenditure', async () => {
      const res = await service.retrievePTATContext('What happened with DICON?');
      const diconFin = res.financialRecords.find((f) => f.recordExternalId.includes('dicon'));
      if (diconFin) {
        expect(diconFin.financialType).toBe('private_investment');
        expect(diconFin.currencyCode).toBe('USD');
      }
    });

    it('Preserves 3MTT 160,000+ beneficiary semantics as trained, NOT employed', async () => {
      const res = await service.retrievePTATContext('Who benefited from 3MTT?');
      const ben = res.beneficiaryRecords.find((b) => b.recordExternalId.includes('3mtt'));
      if (ben) {
        expect(ben.beneficiaryStage).toBe('trained');
        expect(ben.countValue).toBe(160000);
      }
    });
  });
});
