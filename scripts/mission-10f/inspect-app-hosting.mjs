import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const { Client } = require('../../node_modules/firebase-tools/lib/apiv2');

const PROJECT = 'tinubu-achievement-stg';
const REGION = 'us-central1';
const headers = { 'x-goog-user-project': PROJECT };
const appHostingClient = new Client({
  urlPrefix: 'https://firebaseapphosting.googleapis.com',
  apiVersion: 'v1beta',
  auth: true,
});

async function main() {
  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });

  console.log('Inspecting App Hosting Backends...');
  const backendsRes = await appHostingClient.get(
    `/projects/${PROJECT}/locations/${REGION}/backends`,
    { headers },
  );
  console.log('Backends:');
  console.log(JSON.stringify(backendsRes.body, null, 2));

  const backendName = backendsRes.body.backends?.[0]?.name;
  if (backendName) {
    console.log(`\nInspecting Rollouts for ${backendName}...`);
    const rolloutsRes = await appHostingClient.get(
      `/${backendName}/rollouts`,
      { headers },
    );
    console.log('Rollouts (last 5):');
    const rollouts = rolloutsRes.body.rollouts || [];
    for (const r of rollouts.slice(0, 5)) {
      console.log(` - Rollout: ${r.name}, State: ${r.state}, CreateTime: ${r.createTime}, Build: ${r.build}`);
    }
  }
}

main().catch(console.error);
