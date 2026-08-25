import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const apiv2 = require('../../node_modules/firebase-tools/lib/apiv2');

const PROJECT = 'tinubu-achievement-stg';
const headers = { 'x-goog-user-project': PROJECT };

async function main() {
  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });
  const token = await apiv2.getAccessToken();

  const usersRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:lookup`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        email: [
          'staging-qa-superadmin@tinubu.stg',
          'staging-qa-researcher@tinubu.stg',
          'staging-qa-reviewer@tinubu.stg',
          'staging-qa-publisher@tinubu.stg',
        ],
      }),
    }
  );

  const data = await usersRes.json();
  console.log('Existing Staff Users in Firebase Auth:');
  const found = data.users || [];
  for (const u of found) {
    console.log(` - Email: ${u.email}, UID: ${u.localId}, CustomAttributes: ${u.customAttributes}`);
  }
}

main().catch(console.error);
