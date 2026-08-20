import { createFirebaseIamDatabase } from '../mission-10c/firebase-iam-pg.mjs';

const MISSING_ADM1_STATES = [
  { code: 'NG-AD', name: 'Adamawa State' },
  { code: 'NG-AK', name: 'Akwa Ibom State' },
  { code: 'NG-BY', name: 'Bayelsa State' },
  { code: 'NG-BE', name: 'Benue State' },
  { code: 'NG-EB', name: 'Ebonyi State' },
  { code: 'NG-EK', name: 'Ekiti State' },
  { code: 'NG-GO', name: 'Gombe State' },
  { code: 'NG-IM', name: 'Imo State' },
  { code: 'NG-KD', name: 'Kaduna State' },
  { code: 'NG-KT', name: 'Katsina State' },
  { code: 'NG-KO', name: 'Kogi State' },
  { code: 'NG-KW', name: 'Kwara State' },
  { code: 'NG-NA', name: 'Nasarawa State' },
  { code: 'NG-NI', name: 'Niger State' },
  { code: 'NG-ON', name: 'Ondo State' },
  { code: 'NG-OS', name: 'Osun State' },
  { code: 'NG-SO', name: 'Sokoto State' },
  { code: 'NG-TA', name: 'Taraba State' },
  { code: 'NG-YO', name: 'Yobe State' },
  { code: 'NG-ZA', name: 'Zamfara State' }
];

const NATIONAL_ID = '30000000-0000-4000-8000-000000000001';

async function seedStagingGeography() {
  let db;
  try {
    console.log("Connecting to Cloud SQL staging (tat-db-staging / tat_staging)...");
    db = await createFirebaseIamDatabase({ max: 1 });

    await db.query("BEGIN");
    console.log("Transaction BEGIN");

    const beforeRes = await db.query(`
      SELECT 
        count(*)::int as total,
        count(*) FILTER (WHERE geography_type IN ('state', 'fct'))::int as adm1_count,
        count(*) FILTER (WHERE geography_type = 'national')::int as national_count
      FROM geographic_units
    `);
    console.log("BEFORE COUNTS:", beforeRes.rows[0]);

    let inserted = 0;
    for (const state of MISSING_ADM1_STATES) {
      const res = await db.query(`
        INSERT INTO geographic_units (id, code, name, geography_type, parent_geographic_unit_id, sensitivity_class, active)
        VALUES (gen_random_uuid(), $1, $2, 'state', $3, 'public', true)
        ON CONFLICT (code) DO NOTHING
        RETURNING code, name
      `, [state.code, state.name, NATIONAL_ID]);
      if (res.rowCount > 0) {
        inserted += res.rowCount;
        console.log(`+ Seeded: ${state.name} (${state.code})`);
      }
    }
    console.log(`Total rows inserted: ${inserted}`);

    // Verify
    const verifyRes = await db.query(`
      SELECT 
        count(*)::int as total,
        count(*) FILTER (WHERE geography_type IN ('state', 'fct'))::int as adm1_count,
        count(*) FILTER (WHERE geography_type = 'national')::int as national_count
      FROM geographic_units
    `);
    console.log("VERIFICATION COUNTS:", verifyRes.rows[0]);

    if (verifyRes.rows[0].adm1_count !== 37) {
      throw new Error(`Integrity verification failed: expected 37 ADM1 units, got ${verifyRes.rows[0].adm1_count}`);
    }

    const dupRes = await db.query(`
      SELECT code, count(*) as count
      FROM geographic_units
      GROUP BY code
      HAVING count(*) > 1
    `);
    if (dupRes.rows.length > 0) {
      throw new Error(`Duplicate codes found: ${JSON.stringify(dupRes.rows)}`);
    }

    await db.query("COMMIT");
    console.log("Transaction COMMIT successfully executed.");

  } catch (err) {
    if (db) await db.query("ROLLBACK").catch(() => {});
    console.error("FATAL: Staging DML failed and was rolled back:", err);
    process.exit(1);
  } finally {
    if (db) await db.close();
  }
}

seedStagingGeography();
