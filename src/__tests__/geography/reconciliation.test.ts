import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { NIGERIA_STATE_MAPPINGS, resolveStateMapping, getStateCode, getStateSlug } from '@/lib/geography/nigeria-state-mapping';
import { nigeriaStatePaths } from '@/data/geography/nigeria-states.geojson';
import { statesData, geopoliticalZones } from '@/data/geography/states.data';
import { getAllStates, getStateByCode, getStateBySlug } from '@/services/geographyService';

describe('PTAT Geography & GeoBoundaries Reconciliation (Hard Gate)', () => {
  it('validates local geoBoundaries GeoJSON artifact contains exactly 37 ADM1 features', () => {
    const geojsonPath = path.resolve('public/data/geography/nigeria/nigeria-adm1-simplified.geojson');
    expect(fs.existsSync(geojsonPath)).toBe(true);
    const raw = fs.readFileSync(geojsonPath, 'utf8');
    const geojson = JSON.parse(raw);
    expect(geojson.type).toBe('FeatureCollection');
    expect(geojson.features.length).toBe(37);
  });

  it('validates local source-metadata.json exists with complete provenance and checksums', () => {
    const metadataPath = path.resolve('public/data/geography/nigeria/source-metadata.json');
    expect(fs.existsSync(metadataPath)).toBe(true);
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    expect(metadata.boundaryId).toBe('NGA-ADM1-27671186');
    expect(metadata.featureCount).toBe(37);
    expect(metadata.license).toContain('Creative Commons');
    expect(metadata.sha256Checksum).toBeDefined();
  });

  it('reconciles 37 GeoJSON source features with 37 canonical PTAT units (0 unmatched, 0 duplicates)', () => {
    const geojsonPath = path.resolve('public/data/geography/nigeria/nigeria-adm1-simplified.geojson');
    const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

    const matchedCodes = new Set<string>();
    const matchedSlugs = new Set<string>();

    geojson.features.forEach((feature: any) => {
      const shapeName = feature.properties?.shapeName;
      expect(shapeName).toBeDefined();

      const resolved = resolveStateMapping(shapeName);
      expect(resolved).toBeDefined();
      if (resolved) {
        expect(matchedCodes.has(resolved.code)).toBe(false); // No duplicates
        expect(matchedSlugs.has(resolved.slug)).toBe(false); // No duplicate slugs
        matchedCodes.add(resolved.code);
        matchedSlugs.add(resolved.slug);
      }
    });

    expect(matchedCodes.size).toBe(37);
    expect(matchedSlugs.size).toBe(37);
  });

  it('normalizes all Federal Capital Territory naming variants to NG-FC / fct-abuja', () => {
    const fctVariants = [
      "Abuja Federal Capital Territory",
      "Federal Capital Territory",
      "FCT",
      "Abuja",
      "Federal Capital Territory (Abuja)",
      "fct abuja",
      "fct-abuja",
      "NG-FC"
    ];

    fctVariants.forEach(variant => {
      const resolved = resolveStateMapping(variant);
      expect(resolved).toBeDefined();
      expect(resolved?.code).toBe("NG-FC");
      expect(resolved?.slug).toBe("fct-abuja");
      expect(resolved?.zone).toBe("North-Central");
    });
  });

  it('verifies nigeriaStatePaths vector dataset contains 37 valid, unique, non-empty geometries', () => {
    expect(nigeriaStatePaths.length).toBe(37);
    const codes = new Set<string>();

    nigeriaStatePaths.forEach(statePath => {
      expect(statePath.code).toMatch(/^NG-[A-Z]{2}$/);
      expect(statePath.name.length).toBeGreaterThan(0);
      expect(statePath.d.startsWith('M')).toBe(true);
      expect(statePath.d.endsWith('Z') || statePath.d.includes('Z')).toBe(true);
      expect(statePath.center.length).toBe(2);
      expect(codes.has(statePath.code)).toBe(false);
      codes.add(statePath.code);

      // Verify each statePath maps to a valid state record in statesData
      const stateObj = getStateByCode(statePath.code);
      expect(stateObj).toBeDefined();
    });

    expect(codes.size).toBe(37);
  });

  it('verifies all 6 Nigerian Geopolitical Zones are covered with correct state counts', () => {
    expect(geopoliticalZones.length).toBe(6);
    
    let totalAssignedStates = 0;
    geopoliticalZones.forEach(zone => {
      expect(zone.states.length).toBeGreaterThanOrEqual(5);
      totalAssignedStates += zone.states.length;
    });

    expect(totalAssignedStates).toBe(37);
  });

  it('verifies state dashboard route URLs resolve from canonical slugs and not raw names', () => {
    const abiaSlug = getStateSlug("Abia");
    const lagosSlug = getStateSlug("Lagos");
    const fctSlug = getStateSlug("Abuja Federal Capital Territory");

    expect(abiaSlug).toBe("abia");
    expect(lagosSlug).toBe("lagos");
    expect(fctSlug).toBe("fct-abuja");
  });
});
