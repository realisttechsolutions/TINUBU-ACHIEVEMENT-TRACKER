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
const cloudBuildClient = new Client({
  urlPrefix: 'https://cloudbuild.googleapis.com',
  apiVersion: 'v1',
  auth: true,
});

async function main() {
  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });

  const buildsRes = await appHostingClient.get(
    `/projects/${PROJECT}/locations/${REGION}/backends/${BACKEND}/builds`,
    { headers },
  );

  console.log('Builds:');
  const builds = buildsRes.body.builds || [];
  const latestBuild = builds[0];
  console.log(JSON.stringify(latestBuild, null, 2));

  // Let's also check Cloud Build logs if build logs URI exists
  if (latestBuild?.buildLogsUri) {
    console.log(`Build logs URI: ${latestBuild.buildLogsUri}`);
  }
}

main().catch(console.error);
