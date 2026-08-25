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

  const listRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:batchGet?maxResults=100`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );

  const data = await listRes.json();
  const users = data.users || [];

  const counts = {
    super_admin: 0,
    researcher: 0,
    reviewer: 0,
    publisher: 0,
    other: 0,
  };

  console.log(`Total Firebase Auth Users Found: ${users.length}\n`);
  for (const u of users) {
    let custom = {};
    try {
      if (u.customAttributes) custom = JSON.parse(u.customAttributes);
    } catch {}

    const role = custom.tat_role || 'none';
    if (counts[role] !== undefined) {
      counts[role]++;
    } else {
      counts.other++;
    }

    console.log(` - Email: ${u.email}, Role: ${role}, Staff: ${custom.tat_staff || false}, EmailVerified: ${u.emailVerified}`);
  }

  console.log('\n--- Staff Account Discovery Summary ---');
  console.log(`SUPER ADMIN USERS = ${counts.super_admin}`);
  console.log(`RESEARCHER USERS = ${counts.researcher}`);
  console.log(`REVIEWER USERS = ${counts.reviewer}`);
  console.log(`PUBLISHER USERS = ${counts.publisher}`);
}

main().catch(console.error);
