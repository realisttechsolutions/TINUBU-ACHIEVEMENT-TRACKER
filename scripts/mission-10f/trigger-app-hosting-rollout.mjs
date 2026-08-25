import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const { Client } = require('../../node_modules/firebase-tools/lib/apiv2');

const PROJECT = 'tinubu-achievement-stg';
const REGION = 'us-central1';
const BACKEND = 'tat-staging';
const headers = { 'x-goog-user-project': PROJECT };
const appHostingClient = new Client({
  urlPrefix: 'https://firebaseapphosting.googleapis.com',
  apiVersion: 'v1beta',
  auth: true,
});

async function main() {
  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });

  const buildId = `build-${Date.now()}`;
  console.log(`Triggering App Hosting Build: ${buildId}...`);

  // Create build
  const buildRes = await appHostingClient.post(
    `/projects/${PROJECT}/locations/${REGION}/backends/${BACKEND}/builds`,
    {
      source: {
        codebase: {
          branch: 'antigravity/mission-10j-e-final-frontend-certification',
        },
      },
    },
    {
      headers,
      queryParams: { buildId },
    },
  );

  console.log('Build Response:', JSON.stringify(buildRes.body, null, 2));

  const buildOpName = buildRes.body.name;
  console.log(`Waiting for Build Operation: ${buildOpName}...`);

  // Poll operation
  const deadline = Date.now() + 15 * 60 * 1000;
  let buildResult = null;
  while (Date.now() < deadline) {
    const op = await appHostingClient.get(`/${buildOpName}`, { headers });
    if (op.body.done) {
      if (op.body.error) throw new Error(`Build failed: ${JSON.stringify(op.body.error)}`);
      buildResult = op.body.response;
      console.log('Build completed successfully!');
      break;
    }
    console.log(' - Building in progress...');
    await new Promise((r) => setTimeout(r, 10000));
  }

  // Create Rollout
  const rolloutId = `rollout-${Date.now()}`;
  console.log(`Triggering Rollout: ${rolloutId}...`);
  const rolloutRes = await appHostingClient.post(
    `/projects/${PROJECT}/locations/${REGION}/backends/${BACKEND}/rollouts`,
    {
      build: `projects/${PROJECT}/locations/${REGION}/backends/${BACKEND}/builds/${buildId}`,
    },
    {
      headers,
      queryParams: { rolloutId },
    },
  );

  console.log('Rollout Response:', JSON.stringify(rolloutRes.body, null, 2));
  const rolloutOpName = rolloutRes.body.name;
  console.log(`Waiting for Rollout Operation: ${rolloutOpName}...`);

  while (Date.now() < deadline) {
    const op = await appHostingClient.get(`/${rolloutOpName}`, { headers });
    if (op.body.done) {
      if (op.body.error) throw new Error(`Rollout failed: ${JSON.stringify(op.body.error)}`);
      console.log('Rollout completed successfully! Live at tat-staging--tinubu-achievement-stg.us-central1.hosted.app');
      break;
    }
    console.log(' - Rollout in progress...');
    await new Promise((r) => setTimeout(r, 10000));
  }
}

main().catch(console.error);
