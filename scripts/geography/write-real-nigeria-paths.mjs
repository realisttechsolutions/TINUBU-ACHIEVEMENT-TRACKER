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

// ViewBox Dimensions: Standard 1000 x 850 with 30px padding for ideal SVG aspect ratio
const SVG_WIDTH = 1000;
const SVG_HEIGHT = 850;
const PADDING = 30;

const drawWidth = SVG_WIDTH - PADDING * 2;
const drawHeight = SVG_HEIGHT - PADDING * 2;

function project([lng, lat]) {
  const x = PADDING + ((lng - minLng) / (maxLng - minLng)) * drawWidth;
  const y = PADDING + ((maxLat - lat) / (maxLat - minLat)) * drawHeight;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

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

// Visual centroid calculation tuned for label placement
function calculateCenter(coordinates, geomType, code) {
  // Manual visual centroid overrides for complex crescent/concave shapes if needed
  const centroidOverrides = {
    "NG-LA": [115, 635],
    "NG-FC": [390, 442],
    "NG-CR": [485, 680],
    "NG-BY": [305, 755],
    "NG-RI": [365, 755],
    "NG-DE": [280, 690],
    "NG-ED": [275, 615],
    "NG-EK": [245, 530],
    "NG-OS": [180, 545],
    "NG-OG": [110, 590],
    "NG-OY": [115, 520],
    "NG-KW": [190, 440],
    "NG-KO": [335, 530],
    "NG-NA": [485, 465],
    "NG-PL": [555, 410],
    "NG-BE": [485, 575],
    "NG-TA": [660, 495],
    "NG-AD": [775, 395],
    "NG-BO": [835, 190],
    "NG-YO": [700, 185],
    "NG-GO": [695, 325],
    "NG-BA": [595, 265],
    "NG-KN": [485, 220],
    "NG-JI": [575, 190],
    "NG-KT": [420, 185],
    "NG-KD": [405, 300],
    "NG-NI": [260, 325],
    "NG-ZA": [310, 200],
    "NG-SO": [230, 145],
    "NG-KB": [205, 235],
    "NG-EB": [450, 650],
    "NG-EN": [400, 625],
    "NG-AN": [370, 655],
    "NG-IM": [380, 700],
    "NG-AB": [410, 715],
    "NG-AK": [430, 745]
  };

  if (centroidOverrides[code]) {
    return centroidOverrides[code];
  }

  let allPoints = [];
  function collectPoints(c) {
    if (typeof c[0] === 'number') {
      allPoints.push(c);
    } else {
      c.forEach(collectPoints);
    }
  }
  collectPoints(coordinates);

  let sumLng = 0, sumLat = 0;
  allPoints.forEach(([lng, lat]) => {
    sumLng += lng;
    sumLat += lat;
  });

  const avgLng = sumLng / allPoints.length;
  const avgLat = sumLat / allPoints.length;

  return project([avgLng, avgLat]);
}

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

const CANONICAL_SHORT_NAMES = {
  "NG-AB": "Abia",
  "NG-AD": "Adamawa",
  "NG-AK": "Akwa Ibom",
  "NG-AN": "Anambra",
  "NG-BA": "Bauchi",
  "NG-BY": "Bayelsa",
  "NG-BE": "Benue",
  "NG-BO": "Borno",
  "NG-CR": "Cross River",
  "NG-DE": "Delta",
  "NG-EB": "Ebonyi",
  "NG-ED": "Edo",
  "NG-EK": "Ekiti",
  "NG-EN": "Enugu",
  "NG-FC": "FCT (Abuja)",
  "NG-GO": "Gombe",
  "NG-IM": "Imo",
  "NG-JI": "Jigawa",
  "NG-KD": "Kaduna",
  "NG-KN": "Kano",
  "NG-KT": "Katsina",
  "NG-KB": "Kebbi",
  "NG-KO": "Kogi",
  "NG-KW": "Kwara",
  "NG-LA": "Lagos",
  "NG-NA": "Nasarawa",
  "NG-NI": "Niger",
  "NG-OG": "Ogun",
  "NG-ON": "Ondo",
  "NG-OS": "Osun",
  "NG-OY": "Oyo",
  "NG-PL": "Plateau",
  "NG-RI": "Rivers",
  "NG-SO": "Sokoto",
  "NG-TA": "Taraba",
  "NG-YO": "Yobe",
  "NG-ZA": "Zamfara"
};

const ISO_OVERRIDE = {
  "NG-KE": "NG-KB"
};

const processed = geojson.features.map(f => {
  const shapeName = f.properties?.shapeName || '';
  const rawIso = f.properties?.shapeISO || '';
  const code = STATE_NAME_TO_CODE_MAP[shapeName] || ISO_OVERRIDE[rawIso] || rawIso;
  const name = CANONICAL_SHORT_NAMES[code] || shapeName;
  const geomType = f.geometry.type;
  const d = coordsToPath(f.geometry.coordinates, geomType);
  const center = calculateCenter(f.geometry.coordinates, geomType, code);

  return {
    code,
    name,
    center,
    d
  };
});

// Sort by state code for deterministic output
processed.sort((a, b) => a.code.localeCompare(b.code));

const fileContent = `/**
 * NIGERIA ADM1 BOUNDARY VECTOR DATASET (36 States + FCT = 37 Units)
 * 
 * Provenance & Dataset Information:
 * - Dataset Name: geoBoundaries gbOpen Nigeria ADM1 (Level 1 Administrative Boundaries)
 * - Source Organization: geoBoundaries / William & Mary GeoLab & GRID3 Nigeria
 * - Boundary ID: NGA-ADM1-27671186
 * - Boundary Year: 2022 / Dec 2023 Build
 * - License: Creative Commons Attribution 4.0 International (CC BY 4.0)
 * - Coordinate Reference System: WGS 84 (EPSG:4326) Projected to SVG ViewBox
 * - Canonical Unit Count: Exactly 37 Units (36 States + Federal Capital Territory)
 * - Attribution: Boundary data provided by geoBoundaries (www.geoboundaries.org) / GRID3.
 */

export interface StateVectorPath {
  code: string;             // ISO 3166-2:NG code (e.g. "NG-LA", "NG-FC")
  name: string;             // Canonical short display name (e.g. "Lagos", "FCT (Abuja)")
  d: string;                // Real SVG path definition string
  center: [number, number]; // Visual centroid [x, y] in SVG viewbox space
}

export const NIGERIA_MAP_VIEWBOX = "0 0 1000 850";

export const nigeriaStatePaths: StateVectorPath[] = ${JSON.stringify(processed, null, 2)};
`;

const outputPath = path.resolve('src/data/geography/nigeria-states.geojson.ts');
fs.writeFileSync(outputPath, fileContent);
console.log(`\nSuccessfully wrote real vector paths to ${outputPath}`);
console.log(`Total units: ${processed.length}`);
