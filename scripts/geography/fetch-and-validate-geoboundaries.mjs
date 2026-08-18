import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SIMPLIFIED_URL = 'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/NGA/ADM1/geoBoundaries-NGA-ADM1_simplified.geojson';
const FULL_URL = 'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/NGA/ADM1/geoBoundaries-NGA-ADM1.geojson';

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function computeSha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function run() {
  console.log('Fetching official geoBoundaries Nigeria ADM1 datasets...');
  
  const [simplifiedBuffer, fullBuffer] = await Promise.all([
    fetchBuffer(SIMPLIFIED_URL),
    fetchBuffer(FULL_URL)
  ]);

  const simplifiedSize = simplifiedBuffer.length;
  const fullSize = fullBuffer.length;
  const simplifiedSha = computeSha256(simplifiedBuffer);
  const fullSha = computeSha256(fullBuffer);

  console.log(`Full GeoJSON Size: ${(fullSize / 1024).toFixed(2)} KB (${fullSize} bytes)`);
  console.log(`Simplified GeoJSON Size: ${(simplifiedSize / 1024).toFixed(2)} KB (${simplifiedSize} bytes)`);
  console.log(`Simplified SHA-256: ${simplifiedSha}`);
  console.log(`Full SHA-256: ${fullSha}`);

  const simplifiedJson = JSON.parse(simplifiedBuffer.toString('utf-8'));
  console.log(`Feature Collection Type: ${simplifiedJson.type}`);
  console.log(`Feature Count: ${simplifiedJson.features?.length}`);

  const featureNames = simplifiedJson.features.map(f => ({
    name: f.properties?.shapeName || f.properties?.name || f.properties?.shapeISO,
    iso: f.properties?.shapeISO || f.properties?.shapeGroup,
    type: f.geometry?.type
  }));

  console.log('\nExtracted Features:');
  featureNames.forEach((f, i) => {
    console.log(`${i + 1}. ${f.name} (${f.iso}) - ${f.type}`);
  });

  // Save to target directory
  const targetDir = path.resolve('public/data/geography/nigeria');
  fs.mkdirSync(targetDir, { recursive: true });

  const simplifiedPath = path.join(targetDir, 'nigeria-adm1-simplified.geojson');
  fs.writeFileSync(simplifiedPath, simplifiedBuffer);

  const metadata = {
    sourceOrganization: 'geoBoundaries / William & Mary GeoLab',
    datasetProduct: 'gbOpen Nigeria ADM1',
    boundaryId: 'NGA-ADM1-27671186',
    countryIso: 'NGA',
    administrativeLevel: 'ADM1',
    featureCount: simplifiedJson.features.length,
    buildDate: 'Dec 12, 2023',
    sourceDataUpdateDate: 'Feb 26, 2023',
    retrievalDate: '2026-08-18',
    license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    attribution: 'Boundary data provided by geoBoundaries (www.geoboundaries.org) / GRID3.',
    underlyingSource: 'GRID3 Nigeria State Boundaries (data.grid3.org)',
    downloadUrl: SIMPLIFIED_URL,
    fullDownloadUrl: FULL_URL,
    fullPayloadBytes: fullSize,
    simplifiedPayloadBytes: simplifiedSize,
    selectedGeometryType: 'Simplified GeoJSON',
    sha256Checksum: simplifiedSha,
    fullSha256Checksum: fullSha
  };

  const metadataPath = path.join(targetDir, 'source-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`\nSuccessfully stored:`);
  console.log(`- ${simplifiedPath}`);
  console.log(`- ${metadataPath}`);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
