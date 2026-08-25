const STAGING_URL = 'https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app';
const TEST_SLUG = 'system-test-ptat-administrative-workflow-validation';

async function main() {
  const res = await fetch(`${STAGING_URL}/achievements/${TEST_SLUG}`);
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Contains SYSTEM TEST:', text.includes('SYSTEM TEST'));
  console.log('Contains Not Found:', text.includes('Not Found') || text.includes('could not be found'));
  console.log('Title in HTML:', text.match(/<title>(.*?)<\/title>/)?.[1]);
}

main();
