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

  try {
    const buildRes = await appHostingClient.get(
      `/projects/${PROJECT}/locations/${REGION}/backends/${BACKEND}/builds/build-1787643882667`,
      { headers },
    );
    console.log('Build build-1787643882667:', JSON.stringify(buildRes.body, null, 2));
  } catch (err) {
    console.error('Error fetching build:', err);
  }
}

main();
