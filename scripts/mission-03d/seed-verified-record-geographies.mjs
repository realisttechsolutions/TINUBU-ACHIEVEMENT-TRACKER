import { createFirebaseIamDatabase } from '../mission-10c/firebase-iam-pg.mjs';

const VERIFIED_RECORD_GEO_UPDATES = [
  {
    external_id: '[ACH-2024-0041]',
    slug: 'delivery-and-handover-of-tudun-biri-resettlement-scheme-in-kaduna-state',
    title: 'Delivery and Handover of Tudun Biri Resettlement Scheme in Kaduna State',
    state_codes: ['NG-KD'],
    coverage_role: 'covered',
    evidence: 'Federal Ministry of Housing Tudun Biri Handover, Igabi LGA Kaduna'
  },
  {
    external_id: '[ACH-2024-0040]',
    slug: 'construction-and-commissioning-of-15km-a2-pai-town-arterial-road-in-kwali-area-council',
    title: 'Construction and Commissioning of 15km A2-Pai Town Arterial Road in Kwali Area Council',
    state_codes: ['NG-FC'],
    coverage_role: 'covered',
    evidence: 'FCTA Kwali Area Council Road Commissioning'
  },
  {
    external_id: '[ACH-2024-0057]',
    slug: 'commissioning-of-greater-abuja-water-supply-network-phase-ii-loops-1-2-5-6',
    title: 'Commissioning of Greater Abuja Water Supply Network Phase II (Loops 1, 2, 5, 6)',
    state_codes: ['NG-FC'],
    coverage_role: 'covered',
    evidence: 'FCTA Water Distribution Phase II Gazette'
  },
  {
    external_id: '[ACH-2024-0058]',
    slug: 'kashimbila-40mw-multipurpose-hydropower-plant-grid-synchronization-inherited-completed',
    title: 'Kashimbila 40MW Multipurpose Hydropower Plant Grid Synchronization (INHERITED_COMPLETED)',
    state_codes: ['NG-TA'],
    coverage_role: 'covered',
    evidence: 'Federal Ministry of Power Kashimbila Taraba State Commissioning'
  },
  {
    external_id: '[ACH-2024-0053]',
    slug: 'completion-and-commissioning-of-three-federal-dams-odo-ape-rafin-yashin-amla-otukpo',
    title: 'Completion and Commissioning of Three Federal Dams (Odo-Ape, Rafin Yashin, Amla Otukpo)',
    state_codes: ['NG-KO', 'NG-NI', 'NG-BE'],
    coverage_role: 'covered',
    evidence: 'Federal Ministry of Water Resources (Odo-Ape Kogi, Rafin Yashin Niger, Amla Otukpo Benue)'
  },
  {
    external_id: '[ACH-2024-0060]',
    slug: 'maiduguri-airport-international-upgrade-national-flight-data-centre-launch',
    title: 'Maiduguri Airport International Upgrade & National Flight Data Centre Launch',
    state_codes: ['NG-BO'],
    coverage_role: 'covered',
    evidence: 'FAAN / NAMA Maiduguri Borno State Airport Upgrade'
  }
];

async function updateRecordGeographies() {
  let db;
  try {
    console.log("Connecting to Cloud SQL staging...");
    db = await createFirebaseIamDatabase({ max: 1 });

    await db.query("BEGIN");
    console.log("Transaction BEGIN");

    const beforeRgCount = await db.query("SELECT count(*)::int as count FROM record_geographies");
    console.log("BEFORE record_geographies count:", beforeRgCount.rows[0].count);

    // Get national unit ID
    const natRes = await db.query("SELECT id FROM geographic_units WHERE geography_type = 'national'");
    const nationalId = natRes.rows[0].id;

    // Get all geo units
    const geosRes = await db.query("SELECT id, code FROM geographic_units");
    const codeToId = new Map(geosRes.rows.map(g => [g.code, g.id]));

    let inserted = 0;
    let removedNational = 0;

    for (const update of VERIFIED_RECORD_GEO_UPDATES) {
      // Find record by external_id or slug
      const recRes = await db.query(
        "SELECT id, external_id, title FROM records WHERE external_id = $1 OR slug = $2",
        [update.external_id, update.slug]
      );
      if (recRes.rows.length === 0) {
        console.warn(`Record not found: ${update.external_id}`);
        continue;
      }
      const recordId = recRes.rows[0].id;

      // Remove national link if replacing with explicit state link
      const delRes = await db.query(
        "DELETE FROM record_geographies WHERE record_id = $1 AND geographic_unit_id = $2",
        [recordId, nationalId]
      );
      removedNational += delRes.rowCount;

      // Insert explicit state links
      for (const code of update.state_codes) {
        const geoId = codeToId.get(code);
        if (!geoId) {
          console.error(`Geo ID not found for code: ${code}`);
          continue;
        }
        const insRes = await db.query(`
          INSERT INTO record_geographies (record_id, geographic_unit_id, coverage_role)
          VALUES ($1, $2, $3)
          ON CONFLICT (record_id, geographic_unit_id, coverage_role) DO NOTHING
        `, [recordId, geoId, update.coverage_role]);
        if (insRes.rowCount > 0) {
          inserted += insRes.rowCount;
          console.log(`+ Linked ${update.external_id} "${update.title}" -> ${code}`);
        }
      }
    }

    console.log(`Inserted state relationships: ${inserted}`);
    console.log(`Replaced national relationships: ${removedNational}`);

    const afterRgCount = await db.query("SELECT count(*)::int as count FROM record_geographies");
    console.log("AFTER record_geographies count:", afterRgCount.rows[0].count);

    await db.query("COMMIT");
    console.log("Transaction COMMIT successfully executed.");

  } catch (err) {
    if (db) await db.query("ROLLBACK").catch(() => {});
    console.error("Error updating record geographies:", err);
    process.exit(1);
  } finally {
    if (db) await db.close();
  }
}

updateRecordGeographies();
