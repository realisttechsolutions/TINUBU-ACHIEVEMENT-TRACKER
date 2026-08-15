'use client';

import React, { useState } from "react";
import { Link } from "@/lib/navigation";
import { List, Search, ChevronRight } from "lucide-react";
import { StateRecord, GeopoliticalZone } from "@/types/geography.types";
import { getStateImpactSummary } from "@/services/geographyService";

interface GeographicTableViewProps {
  states: StateRecord[];
  getZoneColor: (zone: GeopoliticalZone) => string;
}

export const GeographicTableView: React.FC<GeographicTableViewProps> = ({ states, getZoneColor }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStates = states.filter((st) =>
    st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gov-navy/30 p-6 rounded-2xl border border-gov-border shadow-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-gov-navy dark:text-white flex items-center gap-2">
          <List className="h-5 w-5 text-gov-emerald" />
          State-by-State Impact Directory ({filteredStates.length} Units)
        </h3>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gov-slate" />
          <input
            type="text"
            placeholder="Filter states by name, capital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gov-canvas dark:bg-gov-navy border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gov-canvas dark:bg-gov-navy border-b border-gov-border text-gov-slate uppercase font-bold tracking-wider">
              <th className="p-3">State</th>
              <th className="p-3">Capital</th>
              <th className="p-3">Geopolitical Zone</th>
              <th className="p-3">Documented Interventions</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gov-border">
            {filteredStates.map((st) => {
              const summary = getStateImpactSummary(st.slug);
              return (
                <tr key={st.code} className="hover:bg-gov-canvas/60 dark:hover:bg-gov-navy/50 transition-colors">
                  <td className="p-3 font-bold text-gov-navy dark:text-white">
                    <Link to={`/states/${st.slug}`} className="hover:text-gov-emerald">
                      {st.name}
                    </Link>
                  </td>
                  <td className="p-3 text-gov-slate">{st.capital}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getZoneColor(st.zone) }} />
                      {st.zone}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gov-emerald">
                    {summary?.totalPublishedRecords || 0} Records
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/states/${st.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gov-navy dark:text-white hover:text-gov-emerald"
                    >
                      Dashboard <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeographicTableView;
