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

  console.log('Inspecting Identity Platform MFA Configuration for Project:', PROJECT);
  const configRes = await fetch(
    `https://identitytoolkit.googleapis.com/v2/projects/${PROJECT}/config`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );

  const data = await configRes.json();
  console.log('Identity Platform Config:');
  console.log(JSON.stringify(data.mfa, null, 2));

  // Check super admin user MFA enrollment status
  const lookup = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:lookup`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ email: ['staging-qa-superadmin@tinubu.stg'] }),
    }
  );
  const lookupData = await lookup.json();
  const superAdmin = lookupData.users?.[0];
  console.log('\nSuper Admin User MFA Status:');
  console.log(` - Email: ${superAdmin?.email}`);
  console.log(` - MFA Info: ${JSON.stringify(superAdmin?.mfaInfo || [], null, 2)}`);
  console.log(` - MultiFactor: ${JSON.stringify(superAdmin?.multiFactor || [], null, 2)}`);
}

main().catch(console.error);
