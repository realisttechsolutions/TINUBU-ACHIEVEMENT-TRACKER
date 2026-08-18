import fs from 'fs';
import path from 'path';

// Read the downloaded GeoJSON
const geojsonPath = path.resolve('public/data/geography/nigeria/nigeria-adm1-simplified.geojson');
const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

// Calculate Bounding Box
let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

function processCoords(coords) {
  if (typeof coords[0] === 'number') {
    const [lng, lat] = coords;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  } else {
    coords.forEach(processCoords);
  }
}

geojson.features.forEach(f => {
  processCoords(f.geometry.coordinates);
});

console.log('Nigeria Bounding Box:');
console.log(`Longitude (East/West): [${minLng.toFixed(4)}, ${maxLng.toFixed(4)}] (Span: ${(maxLng - minLng).toFixed(4)}°)`);
console.log(`Latitude (North/South): [${minLat.toFixed(4)}, ${maxLat.toFixed(4)}] (Span: ${(maxLat - minLat).toFixed(4)}°)`);

// ViewBox Dimensions
const SVG_WIDTH = 1000;
const SVG_HEIGHT = 850;
const PADDING = 40;

const drawWidth = SVG_WIDTH - PADDING * 2;
const drawHeight = SVG_HEIGHT - PADDING * 2;

// Projection function: Project WGS84 (lng, lat) to SVG (x, y)
// In SVG, y=0 is TOP, so higher latitude (North) maps to smaller y.
function project([lng, lat]) {
  const x = PADDING + ((lng - minLng) / (maxLng - minLng)) * drawWidth;
  const y = PADDING + ((maxLat - lat) / (maxLat - minLat)) * drawHeight;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

// Convert Polygon/MultiPolygon coordinates to SVG path "d" attribute
function coordsToPath(coordinates, geomType) {
  if (geomType === 'Polygon') {
    return coordinates.map(ring => {
      const points = ring.map(project);
      if (points.length === 0) return '';
      return `M${points[0][0]},${points[0][1]} ` + points.slice(1).map(p => `L${p[0]},${p[1]}`).join(' ') + ' Z';
    }).join(' ');
  } else if (geomType === 'MultiPolygon') {
    return coordinates.map(polygon => {
      return polygon.map(ring => {
        const points = ring.map(project);
        if (points.length === 0) return '';
        return `M${points[0][0]},${points[0][1]} ` + points.slice(1).map(p => `L${p[0]},${p[1]}`).join(' ') + ' Z';
      }).join(' ');
    }).join(' ');
  }
  return '';
}

// Calculate centroid of polygon for label positioning
function calculateCenter(coordinates, geomType) {
  let allPoints = [];
  function collectPoints(c) {
    if (typeof c[0] === 'number') {
      allPoints.push(c);
    } else {
      c.forEach(collectPoints);
    }
  }
  collectPoints(coordinates);

  if (allPoints.length === 0) return [500, 425];

  let sumLng = 0, sumLat = 0;
  allPoints.forEach(([lng, lat]) => {
    sumLng += lng;
    sumLat += lat;
  });

  const avgLng = sumLng / allPoints.length;
  const avgLat = sumLat / allPoints.length;

  return project([avgLng, avgLat]);
}

// State mapping dictionary
const STATE_NAME_TO_CODE_MAP = {
  "Abia": "NG-AB",
  "Abuja Federal Capital Territory": "NG-FC",
  "Federal Capital Territory": "NG-FC",
  "FCT": "NG-FC",
  "Adamawa": "NG-AD",
  "Akwa Ibom": "NG-AK",
  "Anambra": "NG-AN",
  "Bauchi": "NG-BA",
  "Bayelsa": "NG-BY",
  "Benue": "NG-BE",
  "Borno": "NG-BO",
  "Cross River": "NG-CR",
  "Delta": "NG-DE",
  "Ebonyi": "NG-EB",
  "Edo": "NG-ED",
  "Ekiti": "NG-EK",
  "Enugu": "NG-EN",
  "Gombe": "NG-GO",
  "Imo": "NG-IM",
  "Jigawa": "NG-JI",
  "Kaduna": "NG-KD",
  "Kano": "NG-KN",
  "Katsina": "NG-KT",
  "Kebbi": "NG-KB",
  "Kogi": "NG-KO",
  "Kwara": "NG-KW",
  "Lagos": "NG-LA",
  "Nasarawa": "NG-NA",
  "Niger": "NG-NI",
  "Ogun": "NG-OG",
  "Ondo": "NG-ON",
  "Osun": "NG-OS",
  "Oyo": "NG-OY",
  "Plateau": "NG-PL",
  "Rivers": "NG-RI",
  "Sokoto": "NG-SO",
  "Taraba": "NG-TA",
  "Yobe": "NG-YO",
  "Zamfara": "NG-ZA"
};

// Normalize Kebbi ISO code in geoBoundaries (sometimes listed as NG-KE instead of standard NG-KB)
const ISO_OVERRIDE = {
  "NG-KE": "NG-KB"
};

const processedFeatures = geojson.features.map(f => {
  const shapeName = f.properties?.shapeName || '';
  const rawIso = f.properties?.shapeISO || '';
  const code = STATE_NAME_TO_CODE_MAP[shapeName] || ISO_OVERRIDE[rawIso] || rawIso;
  const geomType = f.geometry.type;
  const d = coordsToPath(f.geometry.coordinates, geomType);
  const center = calculateCenter(f.geometry.coordinates, geomType);

  return {
    rawName: shapeName,
    code,
    center,
    d
  };
});

console.log(`\nProcessed ${processedFeatures.length} state paths successfully.`);
processedFeatures.forEach(p => {
  console.log(`- ${p.code}: ${p.rawName} (center: [${p.center[0]}, ${p.center[1]}], path length: ${p.d.length} chars)`);
});
