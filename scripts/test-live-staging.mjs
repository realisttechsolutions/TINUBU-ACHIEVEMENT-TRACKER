import https from 'https';

const BASE_URL = 'https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app';

const ROUTES_TO_TEST = [
  '/',
  '/achievements',
  '/achievements/nelfund-student-loan-disbursement',
  '/achievements/lagos-calabar-coastal-highway-section-1',
  '/achievements/fx-market-unification-single-window',
  '/policies',
  '/policies/electricity-act-2023',
  '/policies/student-loans-enactment-act-2024',
  '/projects',
  '/projects/lagos-calabar-coastal-highway-section-1',
  '/programmes',
  '/programmes/presidential-conditional-grant-scheme',
  '/sectors',
  '/sectors/economy-fiscal-reforms',
  '/timeline',
  '/impact-map',
  '/states',
  '/states/lagos',
  '/states/kano',
  '/data',
  '/data-sources',
  '/downloads',
  '/sources',
  '/corrections',
  '/api/health',
  '/robots.txt',
  '/sitemap.xml',
  '/non-existent-page-404-check'
];

const MOJIBAKE_SIGNATURES = [
  'â€',
  'â€“',
  'â€”',
  'â€™',
  'â€œ',
  'Â',
  'Ã',
  'âŒ˜',
  'ï¿½',
  'â†’'
];

function fetchRoute(path) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    const start = Date.now();
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const latency = Date.now() - start;
        resolve({
          path,
          status: res.statusCode,
          headers: res.headers,
          latency,
          body: data
        });
      });
    }).on('error', (err) => {
      resolve({
        path,
        status: 0,
        headers: {},
        latency: 0,
        body: '',
        error: err.message
      });
    });
  });
}

async function main() {
  console.log(`\n======================================================================`);
  console.log(`TINUBU ACHIEVEMENT TRACKER V2 — LIVE STAGING CERTIFICATION`);
  console.log(`Target URL: ${BASE_URL}`);
  console.log(`======================================================================\n`);

  let totalMojiCount = 0;
  const results = [];

  for (const route of ROUTES_TO_TEST) {
    const res = await fetchRoute(route);
    const mojiFound = [];

    for (const sig of MOJIBAKE_SIGNATURES) {
      if (res.body.includes(sig)) {
        // Count occurrences
        const count = res.body.split(sig).length - 1;
        mojiFound.push(`${sig} (${count})`);
        totalMojiCount += count;
      }
    }

    results.push({
      route,
      status: res.status,
      latency: `${res.latency}ms`,
      xRobotsTag: res.headers['x-robots-tag'] || 'none',
      bodyLength: res.body.length,
      mojibake: mojiFound.length > 0 ? mojiFound.join(', ') : 'CLEAN (0)',
      sample: res.body.slice(0, 150).replace(/\n/g, ' ')
    });
  }

  console.table(results.map(r => ({
    Route: r.route,
    Status: r.status,
    Latency: r.latency,
    'X-Robots-Tag': r.xRobotsTag,
    Bytes: r.bodyLength,
    Mojibake: r.mojibake
  })));

  console.log(`\nTOTAL MOJIBAKE CHARACTERS FOUND ACROSS ALL ROUTES: ${totalMojiCount}`);

  // Inspect Health Endpoint
  const healthRes = await fetchRoute('/api/health');
  console.log('\n--- HEALTH ENDPOINT RESPONSE ---');
  console.log('Status:', healthRes.status);
  console.log('Headers:', JSON.stringify(healthRes.headers, null, 2));
  console.log('Body:', healthRes.body);

  // Inspect Robots.txt
  const robotsRes = await fetchRoute('/robots.txt');
  console.log('\n--- ROBOTS.TXT RESPONSE ---');
  console.log('Status:', robotsRes.status);
  console.log('Body:\n' + robotsRes.body);

  // Inspect Electricity Act Policy Detail
  const policyRes = await fetchRoute('/policies/electricity-act-2023');
  console.log('\n--- POLICY DETAIL (/policies/electricity-act-2023) ---');
  console.log('Status:', policyRes.status);
  console.log('Contains "Policy Record Not Found":', policyRes.body.includes('Policy Record Not Found'));
  console.log('Contains "Electricity Act 2023":', policyRes.body.includes('Electricity Act 2023'));

  // Inspect Staging Banner
  const homeRes = await fetchRoute('/');
  console.log('\n--- STAGING BANNER CHECK ---');
  console.log('Contains "STAGING":', homeRes.body.includes('STAGING'));
  console.log('Contains "test environment":', homeRes.body.includes('test environment') || homeRes.body.includes('Staging'));
}

main().catch(console.error);
