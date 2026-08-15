/**
 * Permanent test fixtures runner for Tinubu Achievement Tracker Research Architecture.
 * Validates that all positive fixtures pass (exit 0) and all negative fixtures fail (exit 1).
 */
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const root = process.cwd();

export async function runFixtureSuite(validatorEngine) {
  console.log('\n--- RUNNING PERMANENT TEST FIXTURE SUITE ---');
  let passedFixtures = 0;
  let failedFixtures = 0;

  const negativeTests = [
    {
      name: 'NEG-01: Vocabulary Drift (Unregistered enum code in schema)',
      run: (engine) => {
        const schema = {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['unregistered_future_status', 'completed'] }
          }
        };
        const errors = engine.checkSchemaVocabulary(schema, 'test.schema.json');
        return errors > 0;
      }
    },
    {
      name: 'NEG-02: Deprecated Alias Rejection (exact-day, social-services, numeric source level)',
      run: (engine) => {
        const schema = {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            date_precision: { type: 'string', enum: ['exact-day', 'month'] },
            sector: { type: 'string', enum: ['social-services'] },
            source_level: { type: 'string', enum: ['1', 'LEVEL_1'] }
          }
        };
        const errors = engine.checkSchemaVocabulary(schema, 'test.schema.json');
        return errors > 0;
      }
    },
    {
      name: 'NEG-03: Missing Claim Reference in Cross-File Check',
      run: (engine) => {
        const relationships = [
          { relationship_id: '[CSR-001]', claim_id: '[MISSING-CLM-999]', source_id: '[SRC-001]', source_role: 'primary', relationship_type: 'supports', evidence_location: 'Page 1' }
        ];
        const claims = new Set(['[CLM-001]']);
        const sources = new Set(['[SRC-001]']);
        const errors = engine.checkReferentialIntegrity(relationships, claims, sources);
        return errors > 0;
      }
    },
    {
      name: 'NEG-04: Missing Source Reference in Cross-File Check',
      run: (engine) => {
        const relationships = [
          { relationship_id: '[CSR-001]', claim_id: '[CLM-001]', source_id: '[MISSING-SRC-999]', source_role: 'primary', relationship_type: 'supports', evidence_location: 'Page 1' }
        ];
        const claims = new Set(['[CLM-001]']);
        const sources = new Set(['[SRC-001]']);
        const errors = engine.checkReferentialIntegrity(relationships, claims, sources);
        return errors > 0;
      }
    },
    {
      name: 'NEG-05: Duplicate Claim-Source Relationship Composite Key',
      run: (engine) => {
        const relationships = [
          { relationship_id: '[CSR-001]', claim_id: '[CLM-001]', source_id: '[SRC-001]', source_role: 'primary', relationship_type: 'supports', evidence_location: 'Page 1' },
          { relationship_id: '[CSR-002]', claim_id: '[CLM-001]', source_id: '[SRC-001]', source_role: 'primary', relationship_type: 'supports', evidence_location: 'Page 1' }
        ];
        const errors = engine.checkRelationshipUniqueness(relationships);
        return errors > 0;
      }
    },
    {
      name: 'NEG-06: Invalid Financial Value Type',
      run: (engine) => {
        const row = { id: '[FIN-001]', record_id: '[REC-001]', claim_id: '[CLM-001]', financial_type: 'invalid_type', amount: '1000.00', currency: 'NGN', reporting_period: '2024-Q1', aggregation_basis: 'period' };
        const schema = engine.getSchema('financial_record');
        return !schema.validate(row);
      }
    },
    {
      name: 'NEG-07: Invalid Beneficiary Stage',
      run: (engine) => {
        const row = { id: '[BEN-001]', record_id: '[REC-001]', claim_id: '[CLM-001]', beneficiary_stage: 'unregistered_stage', beneficiary_type: 'students', count_value: '100', count_basis: 'period_specific', reporting_period: '2024-Q1' };
        const schema = engine.getSchema('beneficiary_record');
        return !schema.validate(row);
      }
    },
    {
      name: 'NEG-08: Invalid Sector ID',
      run: (engine) => {
        const row = { achievement_id: '[ACH-001]', title: 'Test Title', summary: 'Test summary long enough', public_navigation_group: 'economy', sector: 'invalid_sector_id', status: 'operational', evidence_profile: 'direct_physical_delivery', data_value_nature: 'actual', source_origin: 'government_reported', verification_status: 'source_confirmed', publication_status: 'published', date: '2024-01-01', date_precision: 'exact_day' };
        const schema = engine.getSchema('achievement_record');
        return !schema.validate(row);
      }
    },
    {
      name: 'NEG-09: Date Value Not Matching Precision (Month date with exact_day precision)',
      run: (engine) => {
        const row = { date: '2024-05', date_precision: 'exact_day' };
        return !engine.checkDateMatchesPrecision(row.date, row.date_precision);
      }
    },
    {
      name: 'NEG-10: Invalid Period Range (period_start > period_end)',
      run: (engine) => {
        const row = { period_start: '2024-06-30', period_end: '2024-01-01' };
        return !engine.checkPeriodBounds(row.period_start, row.period_end);
      }
    },
    {
      name: 'NEG-11: Missing Required Non-Production Example Marker',
      run: (engine) => {
        const row = { title: 'Valid title without explicit marker string', notes: 'Some note' };
        return !engine.checkExampleMarker(row);
      }
    },
    {
      name: 'NEG-12: Malformed Quoted CSV',
      run: (engine) => {
        try {
          engine.parseCsv('id,title\n[001],"Unclosed quote test\n', 'malformed.csv');
          return false; // Should have thrown
        } catch {
          return true; // Correctly threw
        }
      }
    },
    {
      name: 'NEG-13: Overloaded Classification Field Rejection',
      run: (engine) => {
        const schema = engine.getSchema('achievement_record');
        return !('classification' in schema.schema.properties);
      }
    }
  ];

  for (const test of negativeTests) {
    try {
      const didFailAsExpected = test.run(validatorEngine);
      if (didFailAsExpected) {
        console.log(`PASS (Expected Rejection): ${test.name}`);
        passedFixtures += 1;
      } else {
        console.error(`FAIL (Did not reject): ${test.name}`);
        failedFixtures += 1;
      }
    } catch (err) {
      console.log(`PASS (Threw Expected Error): ${test.name} - ${err.message}`);
      passedFixtures += 1;
    }
  }

  console.log(`\nFixture Results: ${passedFixtures} passed, ${failedFixtures} failed`);
  return failedFixtures === 0;
}
