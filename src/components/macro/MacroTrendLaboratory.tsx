import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  Layers,
  TrendingUp,
  TrendingDown,
  Calendar,
  Building2,
  ExternalLink,
  Table as TableIcon,
  BarChart2
} from 'lucide-react';
import { MacroIndicatorSeries } from '@/types/macro.types';
import { Button } from '@/components/ui/button';

interface MacroTrendLaboratoryProps {
  seriesMap: Record<string, MacroIndicatorSeries>;
  selectedId: string;
  onSelectSeries: (id: string) => void;
}

export const MacroTrendLaboratory: React.FC<MacroTrendLaboratoryProps> = ({
  seriesMap,
  selectedId,
  onSelectSeries
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const seriesKeys = Object.keys(seriesMap);
  const currentSeries = seriesMap[selectedId] || seriesMap[seriesKeys[0]];

  return (
    <section
      aria-labelledby="trend-lab-heading"
      className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-md bg-gov-navy/10 dark:bg-gov-navy/40 text-gov-navy dark:text-gov-gold">
              <Layers className="w-4 h-4 text-gov-gold" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              LONGITUDINAL ANALYTICS
            </span>
          </div>
          <h2 id="trend-lab-heading" className="text-lg sm:text-xl font-bold text-foreground mt-1">
            Macro Trend Laboratory (2023 – 2026)
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Single-canvas high-resolution time series tracking trajectory against the May 2023 Inaugural Baseline.
          </p>
        </div>

        {/* View Mode Switcher: Chart vs Accessible Table */}
        <div className="flex items-center space-x-2 self-start lg:self-center">
          <div className="inline-flex p-1 rounded-lg bg-muted border border-border">
            <button
              type="button"
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center space-x-1.5 transition-all ${
                viewMode === 'chart'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="View as interactive chart"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Chart Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center space-x-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="View as data table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Data Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Indicator Selection Ribbon */}
      <div
        role="tablist"
        aria-label="Macro trend indicators"
        className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar border-b border-border/40"
      >
        {seriesKeys.map((key) => {
          const item = seriesMap[key];
          const isActive = item.id === currentSeries.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectSeries(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0 ${
                isActive
                  ? 'bg-gov-navy text-gov-gold dark:bg-gov-gold dark:text-gov-navy shadow-xs font-semibold'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border'
              }`}
            >
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Canvas Area */}
      <div className="mt-5">
        {viewMode === 'chart' ? (
          <div>
            {/* Chart Meta Summary Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <span className="text-muted-foreground font-mono uppercase text-[10px] block">May 2023 Baseline</span>
                <span className="text-sm font-bold text-foreground font-mono mt-0.5 block">
                  {currentSeries.tooltipFormatter(currentSeries.inaugurationBaselinePoint.value)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  {currentSeries.inaugurationBaselinePoint.note || currentSeries.inaugurationBaselinePoint.period}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <span className="text-muted-foreground font-mono uppercase text-[10px] block flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-status-green" /> Cycle Peak
                </span>
                <span className="text-sm font-bold text-foreground font-mono mt-0.5 block">
                  {currentSeries.tooltipFormatter(currentSeries.peakPoint.value)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  Recorded in {currentSeries.peakPoint.period}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <span className="text-muted-foreground font-mono uppercase text-[10px] block flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-amber-500" /> Cycle Trough
                </span>
                <span className="text-sm font-bold text-foreground font-mono mt-0.5 block">
                  {currentSeries.tooltipFormatter(currentSeries.troughPoint.value)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  Recorded in {currentSeries.troughPoint.period}
                </span>
              </div>
            </div>

            {/* Recharts Canvas */}
            <div className="h-72 sm:h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentSeries.data}
                  margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="macroGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11, fill: '#5E6B78' }}
                    tickLine={false}
                    axisLine={{ stroke: '#88888830' }}
                  />
                  <YAxis
                    tickFormatter={currentSeries.yAxisFormatter}
                    tick={{ fontSize: 11, fill: '#5E6B78' }}
                    tickLine={false}
                    axisLine={{ stroke: '#88888830' }}
                    domain={currentSeries.domain || ['auto', 'auto']}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const point = payload[0].payload;
                        return (
                          <div className="bg-popover border border-border p-3 rounded-lg shadow-lg text-xs">
                            <p className="font-semibold text-foreground">{label}</p>
                            <p className="text-gov-gold font-mono font-bold text-sm mt-1">
                              {currentSeries.tooltipFormatter(point.value)}
                            </p>
                            {point.isBaseline && (
                              <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold bg-gov-gold/20 text-gov-gold rounded">
                                May 2023 Baseline
                              </span>
                            )}
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Source: {currentSeries.source}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* May 2023 Baseline Reference Line */}
                  <ReferenceLine
                    x={currentSeries.inaugurationBaselinePoint.period}
                    stroke="#C5A059"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{
                      value: 'May 2023 Baseline',
                      position: 'top',
                      fill: '#C5A059',
                      fontSize: 10,
                      fontWeight: 600
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#C5A059"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#macroGradient)"
                    activeDot={{ r: 5, fill: '#0A2540', stroke: '#C5A059', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Description & Source Citation Footer */}
            <div className="mt-4 pt-3 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
              <p className="leading-relaxed">
                {currentSeries.description}
              </p>
              <a
                href={currentSeries.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-medium text-gov-navy dark:text-gov-gold hover:underline flex items-center gap-1"
              >
                <span>{currentSeries.source} Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          /* Accessible Data Ledger Table */
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th scope="col" className="py-2.5 px-4 font-semibold text-muted-foreground font-mono">Observation Period</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold text-muted-foreground font-mono">Statutory Reading</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold text-muted-foreground font-mono">Baseline Benchmark</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold text-muted-foreground font-mono">Source Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {currentSeries.data.map((point) => (
                  <tr
                    key={point.period}
                    className={`hover:bg-muted/20 ${point.isBaseline ? 'bg-gov-gold/10 font-semibold' : ''}`}
                  >
                    <td className="py-2.5 px-4 text-foreground flex items-center gap-2">
                      <span>{point.period}</span>
                      {point.isBaseline && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-gov-gold/20 text-gov-gold rounded">
                          BASELINE
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-foreground font-bold">
                      {currentSeries.tooltipFormatter(point.value)}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground">
                      {point.isBaseline
                        ? 'Reference Point'
                        : `${(point.value - currentSeries.inaugurationBaselinePoint.value > 0 ? '+' : '')}${(point.value - currentSeries.inaugurationBaselinePoint.value).toFixed(2)} pts`}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground">
                      {currentSeries.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default MacroTrendLaboratory;
