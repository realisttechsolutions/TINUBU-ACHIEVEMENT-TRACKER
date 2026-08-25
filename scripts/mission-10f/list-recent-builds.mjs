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

  const buildsRes = await appHostingClient.get(
    `/projects/${PROJECT}/locations/${REGION}/backends/${BACKEND}/builds`,
    { headers },
  );

  const builds = buildsRes.body.builds || [];
  console.log('Builds count:', builds.length);
  for (const b of builds.slice(0, 5)) {
    console.log(` - Build: ${b.name.split('/').pop()}, State: ${b.state}, Commit: ${b.source?.codebase?.hash?.substring(0, 7)} (${b.source?.codebase?.commitMessage}), CreateTime: ${b.createTime}`);
  }

  const rolloutsRes = await appHostingClient.get(
    `/projects/${PROJECT}/locations/${REGION}/backends/${BACKEND}/rollouts`,
    { headers },
  );
  const rollouts = rolloutsRes.body.rollouts || [];
  console.log('\nRollouts count:', rollouts.length);
  for (const r of rollouts.slice(0, 5)) {
    console.log(` - Rollout: ${r.name.split('/').pop()}, State: ${r.state}, Build: ${r.build?.split('/').pop()}, CreateTime: ${r.createTime}`);
  }
}

main().catch(console.error);
