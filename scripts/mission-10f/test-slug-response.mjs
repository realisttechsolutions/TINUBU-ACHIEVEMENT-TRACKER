const STAGING_URL = 'https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app';
const TEST_SLUG = 'system-test-ptat-administrative-workflow-validation';

async function main() {
  const res = await fetch(`${STAGING_URL}/achievements/${TEST_SLUG}`);
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body start:', text.slice(0, 500));
}

main();
