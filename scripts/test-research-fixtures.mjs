/**
 * Permanent positive/negative fixture suite for Research Contract v1.1.2.
 * Every negative fixture invokes a real validator code path and must produce
 * a non-zero error count. The complete current 19-template package is the
 * positive fixture and must produce zero errors.
 */

function firstRow(packageMap, templateName) {
  return packageMap.get(templateName)[0];
}

export async function runFixtureSuite(engine) {
  console.log('\n--- RUNNING PERMANENT FIXTURE SUITE v1.1.2 ---');
  let positivePassed = 0;
  let negativePassed = 0;
  let failed = 0;

  const positiveFixtures = [
    {
      name: 'POS-01: Valid complete 19-template package',
      run: currentEngine => currentEngine.countPackageErrors(currentEngine.cloneCurrentPackage()),
    },
  ];

  const negativeFixtures = [
    {
      name: 'NEG-01: Missing registry enum in mapped financial schema',
      run: currentEngine => {
        const codes = currentEngine.getVocabularyCodes('financial_value_types').filter(value => value !== 'savings_estimate');
        return currentEngine.checkSchemaVocabulary({ properties: { financial_type: { enum: codes } } }, 'financial_record.schema.json');
      },
    },
    {
      name: 'NEG-02: Extra schema enum',
      run: currentEngine => {
        const codes = [...currentEngine.getVocabularyCodes('financial_value_types'), 'unregistered_financial_type'];
        return currentEngine.checkSchemaVocabulary({ properties: { financial_type: { enum: codes } } }, 'financial_record.schema.json');
      },
    },
    {
      name: 'NEG-03: Deprecated vocabulary alias',
      run: currentEngine => {
        const codes = currentEngine.getVocabularyCodes('date_precisions').map(value => value === 'exact_day' ? 'exact-day' : value);
        return currentEngine.checkSchemaVocabulary({ properties: { date_precision: { enum: codes } } }, 'timeline_event.schema.json');
      },
    },
    {
      name: 'NEG-04: Invalid identifier',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'data_gap'), gap_id: 'invalid id' };
        return currentEngine.countRowErrors('data_gap', row);
      },
    },
    {
      name: 'NEG-05: Missing required field',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'data_gap') };
        delete row.gap_id;
        return currentEngine.countRowErrors('data_gap', row);
      },
    },
    {
      name: 'NEG-06: Duplicate primary identifier',
      run: currentEngine => {
        const packageMap = currentEngine.cloneCurrentPackage();
        packageMap.get('achievement_record').push({ ...firstRow(packageMap, 'achievement_record') });
        return currentEngine.checkPackageIntegrity(packageMap);
      },
    },
    {
      name: 'NEG-07: Missing source FK',
      run: currentEngine => {
        const packageMap = currentEngine.cloneCurrentPackage();
        firstRow(packageMap, 'claim_source_relationship').source_id = '[MISSING-SRC-999]';
        return currentEngine.checkPackageIntegrity(packageMap);
      },
    },
    {
      name: 'NEG-08: Missing claim FK',
      run: currentEngine => {
        const packageMap = currentEngine.cloneCurrentPackage();
        firstRow(packageMap, 'claim_source_relationship').claim_id = '[MISSING-CLM-999]';
        return currentEngine.checkPackageIntegrity(packageMap);
      },
    },
    {
      name: 'NEG-09: Missing record FK',
      run: currentEngine => {
        const packageMap = currentEngine.cloneCurrentPackage();
        firstRow(packageMap, 'claim_extraction').record_id = '[MISSING-REC-999]';
        return currentEngine.checkPackageIntegrity(packageMap);
      },
    },
    {
      name: 'NEG-10: Missing indicator FK',
      run: currentEngine => {
        const packageMap = currentEngine.cloneCurrentPackage();
        firstRow(packageMap, 'indicator_observation').indicator_id = '[MISSING-IND-999]';
        return currentEngine.checkPackageIntegrity(packageMap);
      },
    },
    {
      name: 'NEG-11: Duplicate-review missing record FK',
      run: currentEngine => {
        const packageMap = currentEngine.cloneCurrentPackage();
        firstRow(packageMap, 'duplicate_review').record_id_1 = '[MISSING-REC-999]';
        return currentEngine.checkPackageIntegrity(packageMap);
      },
    },
    {
      name: 'NEG-12: Invalid relationship supersession FK',
      run: currentEngine => {
        const packageMap = currentEngine.cloneCurrentPackage();
        firstRow(packageMap, 'claim_source_relationship').superseded_by_relationship_id = '[MISSING-CSR-999]';
        return currentEngine.checkPackageIntegrity(packageMap);
      },
    },
    {
      name: 'NEG-13: Invalid source role',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'claim_source_relationship'), source_role: 'invalid_role' };
        return currentEngine.countRowErrors('claim_source_relationship', row);
      },
    },
    {
      name: 'NEG-14: Invalid relationship type',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'claim_source_relationship'), relationship_type: 'invalid_relationship' };
        return currentEngine.countRowErrors('claim_source_relationship', row);
      },
    },
    {
      name: 'NEG-15: Duplicate claim-source relationship composite',
      run: currentEngine => {
        const packageMap = currentEngine.cloneCurrentPackage();
        const duplicate = { ...firstRow(packageMap, 'claim_source_relationship'), relationship_id: '[EXAMPLE-ONLY-CSR-002]' };
        packageMap.get('claim_source_relationship').push(duplicate);
        return currentEngine.checkPackageIntegrity(packageMap);
      },
    },
    {
      name: 'NEG-16: Invalid financial type',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'financial_record'), financial_type: 'invalid_type' };
        return currentEngine.countRowErrors('financial_record', row);
      },
    },
    {
      name: 'NEG-17: Invalid financial numeric value',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'financial_record'), amount: '0' };
        return currentEngine.countRowErrors('financial_record', row);
      },
    },
    {
      name: 'NEG-18: Invalid beneficiary stage',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'beneficiary_record'), beneficiary_stage: 'invalid_stage' };
        return currentEngine.countRowErrors('beneficiary_record', row);
      },
    },
    {
      name: 'NEG-19: Invalid beneficiary count',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'beneficiary_record'), count_value: '-1' };
        return currentEngine.countRowErrors('beneficiary_record', row);
      },
    },
    {
      name: 'NEG-20: Invalid date',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'timeline_event'), event_date: 'not-a-date' };
        return currentEngine.countRowErrors('timeline_event', row);
      },
    },
    {
      name: 'NEG-21: Incompatible date precision',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'timeline_event'), event_date: '2023-06', date_precision: 'exact_day' };
        return currentEngine.countRowErrors('timeline_event', row);
      },
    },
    {
      name: 'NEG-22: Invalid period range',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'financial_record'), period_start: '2024-06-30', period_end: '2024-01-01' };
        return currentEngine.countRowErrors('financial_record', row);
      },
    },
    {
      name: 'NEG-23: Wrong sector/public-group pairing',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'achievement_record'), public_navigation_group: 'security', sector: 'power_energy_natural_resources' };
        return currentEngine.countRowErrors('achievement_record', row);
      },
    },
    {
      name: 'NEG-24: Missing exact example marker',
      run: currentEngine => {
        const row = { ...firstRow(currentEngine.cloneCurrentPackage(), 'data_gap') };
        for (const [field, value] of Object.entries(row)) row[field] = value.replace('[EXAMPLE ONLY - NOT A PRODUCTION RECORD]', 'EXAMPLE');
        return currentEngine.countRowErrors('data_gap', row);
      },
    },
    {
      name: 'NEG-25: Malformed quoted CSV',
      run: currentEngine => {
        try {
          currentEngine.parseCsv('id,title\n[001],"Unclosed quote\n', 'malformed.csv');
          return 0;
        } catch {
          return 1;
        }
      },
    },
  ];

  for (const fixture of positiveFixtures) {
    try {
      const errorCount = fixture.run(engine);
      if (errorCount === 0) {
        console.log(`PASS (zero errors): ${fixture.name}`);
        positivePassed += 1;
      } else {
        console.error(`FAIL (${errorCount} errors): ${fixture.name}`);
        failed += 1;
      }
    } catch (error) {
      console.error(`FAIL (unexpected exception): ${fixture.name} - ${error.message}`);
      failed += 1;
    }
  }

  for (const fixture of negativeFixtures) {
    try {
      const errorCount = fixture.run(engine);
      if (Number.isInteger(errorCount) && errorCount > 0) {
        console.log(`PASS (expected non-zero=${errorCount}): ${fixture.name}`);
        negativePassed += 1;
      } else {
        console.error(`FAIL (did not produce non-zero errors): ${fixture.name}`);
        failed += 1;
      }
    } catch (error) {
      console.error(`FAIL (unexpected exception instead of counted error): ${fixture.name} - ${error.message}`);
      failed += 1;
    }
  }

  console.log(`\nFixture Results: ${positivePassed}/${positiveFixtures.length} positive passed; ${negativePassed}/${negativeFixtures.length} negative produced non-zero errors; ${failed} failed`);
  return failed === 0;
}
