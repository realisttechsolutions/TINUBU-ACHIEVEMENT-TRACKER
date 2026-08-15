import { createLocalDatabase } from '../../backend/local/database.mjs';

export async function rollbackBatch(db, batchExternalId) {
  await db.query('BEGIN');
  try {
    const batchRes = await db.query(
      'SELECT id, status FROM research_batches WHERE external_id = $1',
      [batchExternalId]
    );

    if (batchRes.rows.length === 0) {
      throw new Error(`Batch ${batchExternalId} not found`);
    }

    const batchId = batchRes.rows[0].id;

    // 1. Withdraw all records published by this batch
    await db.query(
      `UPDATE records
       SET publication_status = 'withdrawn',
           is_public = false,
           workflow_status = 'rejected',
           withdrawn_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP`
    );

    // 2. Mark evidence claims as rejected
    await db.query(
      `UPDATE evidence_claims
       SET workflow_status = 'rejected'`
    );

    // 3. Mark sources as retracted
    await db.query(
      `UPDATE sources
       SET source_status = 'retracted'`
    );

    // 4. Update batch status to compensated with rollback mode
    await db.query(
      `UPDATE research_batches
       SET status = 'compensated',
           mode = 'rollback',
           completed_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [batchId]
    );

    await db.query('COMMIT');
    return { success: true, batchId, status: 'compensated' };
  } catch (err) {
    await db.query('ROLLBACK');
    return { success: false, error: err.message };
  }
}

async function main() {
  const batchExternalId = process.argv[2] || 'BATCH-2024-M02-001';
  console.log(`Executing batch rollback for: ${batchExternalId}...`);

  const db = await createLocalDatabase({ seed: false });
  const result = await rollbackBatch(db, batchExternalId);

  if (result.success) {
    console.log(`PASS: Batch ${batchExternalId} (${result.batchId}) successfully rolled back.`);
  } else {
    console.error(`FAILED: Batch rollback error: ${result.error}`);
    process.exit(1);
  }
  await db.close();
}

if (process.argv[1] && process.argv[1].endsWith('rollback-batch.mjs')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
