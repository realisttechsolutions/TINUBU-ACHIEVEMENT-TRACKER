'use client';

import React, { useState } from 'react';
import MacroHeroPulse from '@/components/macro/MacroHeroPulse';
import CausalitySafeguardNotice from '@/components/macro/CausalitySafeguardNotice';
import MacroTrendLaboratory from '@/components/macro/MacroTrendLaboratory';
import ReformTransmissionMatrix from '@/components/macro/ReformTransmissionMatrix';
import EconomicEngines from '@/components/macro/EconomicEngines';
import FiscalExternalObservatory from '@/components/macro/FiscalExternalObservatory';
import MacroBriefing from '@/components/macro/MacroBriefing';
import DataProvenanceLedger from '@/components/macro/DataProvenanceLedger';

import {
  MACRO_PULSE_INDICATORS,
  MACRO_SERIES_MAP,
  REFORM_TRANSMISSION_NODES,
  SECTOR_ENGINE_DATA,
  FISCAL_DEBT_DATA,
  FAAC_DISTRIBUTION_DATA,
  PROVENANCE_LEDGER_RECORDS
} from '@/data/macro-observatory';
import { TimeMode } from '@/types/macro.types';

export const Dashboard: React.FC = () => {
  const [timeMode, setTimeMode] = useState<TimeMode>('latest');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('real_gdp_growth');

  const handleSelectIndicator = (id: string) => {
    setSelectedIndicatorId(id);
    const labElement = document.getElementById('macro-trend-laboratory');
    if (labElement) {
      labElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full">
      {/* 1. Hero: National Economic Pulse & Primary Indicator Cards */}
      <MacroHeroPulse
        indicators={MACRO_PULSE_INDICATORS}
        timeMode={timeMode}
        onTimeModeChange={setTimeMode}
        selectedIndicatorId={selectedIndicatorId}
        onSelectIndicator={handleSelectIndicator}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2. Institutional Methodology & Causality Safeguard Banner */}
        <CausalitySafeguardNotice />

        {/* 3. Signature Macro Trend Laboratory */}
        <div id="macro-trend-laboratory" className="scroll-mt-24">
          <MacroTrendLaboratory
            seriesMap={MACRO_SERIES_MAP}
            selectedId={selectedIndicatorId}
            onSelectSeries={setSelectedIndicatorId}
          />
        </div>

        {/* 4. Reform to Economy Transmission Matrix */}
        <div id="reform-transmission" className="scroll-mt-24">
          <ReformTransmissionMatrix
            nodes={REFORM_TRANSMISSION_NODES}
            onSelectIndicator={handleSelectIndicator}
          />
        </div>

        {/* 5. Economic Engines: Real Economy Sector Dynamics (NBS GDP) */}
        <div id="economic-engines" className="scroll-mt-24">
          <EconomicEngines sectors={SECTOR_ENGINE_DATA} />
        </div>

        {/* 6. Fiscal & External Intelligence (DMO Public Debt & FAAC Distribution) */}
        <div id="fiscal-external" className="scroll-mt-24">
          <FiscalExternalObservatory
            debtData={FISCAL_DEBT_DATA}
            faacData={FAAC_DISTRIBUTION_DATA}
          />
        </div>

        {/* 7. What Changed? Statutory Intelligence Briefing */}
        <div id="macro-briefing" className="scroll-mt-24">
          <MacroBriefing />
        </div>

        {/* 8. Statutory Data Freshness & Provenance Ledger */}
        <div id="provenance-ledger" className="scroll-mt-24">
          <DataProvenanceLedger sources={PROVENANCE_LEDGER_RECORDS} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
