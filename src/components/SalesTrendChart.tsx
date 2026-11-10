import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  LineChart as LineChartIcon, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Info,
  Layers,
  Activity
} from 'lucide-react';
import { SaleRecord } from '../types';
import { getBrandTheme } from '../utils/brandColors';

interface SalesTrendChartProps {
  records: SaleRecord[];
  onOpenUpload?: () => void;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ records, onOpenUpload }) => {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'cumulative'>('area');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 1. Process filteredRecords into daily sorted timeline
  const dailyVelocityData = useMemo(() => {
    if (!records.length) return [];

    const map = new Map<string, {
      date: string;
      totalGmv: number;
      totalUnits: number;
      ordersCount: number;
      brandSales: Record<string, number>;
    }>();

    records.forEach(r => {
      const date = r.orderedDate;
      const curr = map.get(date) || {
        date,
        totalGmv: 0,
        totalUnits: 0,
        ordersCount: 0,
        brandSales: {},
      };

      curr.totalGmv += r.gmv;
      curr.totalUnits += r.unitsSold;
      curr.ordersCount += 1;

      const b = r.brand.toLowerCase();
      curr.brandSales[b] = (curr.brandSales[b] || 0) + r.gmv;

      map.set(date, curr);
    });

    // Chronological date sort
    const sortedDates = Array.from(map.keys()).sort();
    
    let runningCumulative = 0;
    return sortedDates.map((date, idx) => {
      const entry = map.get(date)!;
      runningCumulative += entry.totalGmv;

      // Day over day change
      let dodChange = 0;
      if (idx > 0) {
        const prev = map.get(sortedDates[idx - 1])!.totalGmv;
        dodChange = prev > 0 ? ((entry.totalGmv - prev) / prev) * 100 : 0;
      }

      return {
        ...entry,
        cumulativeGmv: runningCumulative,
        dodChange,
      };
    });
  }, [records]);

  // Extract all unique brands present in data
  const brandsInPeriod = useMemo(() => {
    const set = new Set<string>();
    dailyVelocityData.forEach(d => {
      Object.keys(d.brandSales).forEach(b => set.add(b));
    });
    return Array.from(set).sort();
  }, [dailyVelocityData]);

  // Metric stats
  const totalGmv = useMemo(() => {
    return dailyVelocityData.reduce((acc, d) => acc + d.totalGmv, 0);
  }, [dailyVelocityData]);

  const avgDailyVelocity = useMemo(() => {
    return dailyVelocityData.length > 0 ? totalGmv / dailyVelocityData.length : 0;
  }, [dailyVelocityData, totalGmv]);

  const peakDay = useMemo(() => {
    if (!dailyVelocityData.length) return null;
    return dailyVelocityData.slice().sort((a, b) => b.totalGmv - a.totalGmv)[0];
  }, [dailyVelocityData]);

  const maxVal = useMemo(() => {
    if (!dailyVelocityData.length) return 1000;
    if (chartType === 'cumulative') {
      return Math.max(...dailyVelocityData.map(d => d.cumulativeGmv), 1000);
    }
    return Math.max(...dailyVelocityData.map(d => d.totalGmv), 1000);
  }, [dailyVelocityData, chartType]);

  // If no data is loaded yet
  if (!records.length || !dailyVelocityData.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm mb-6 text-center transition-colors">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
          <Activity className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          No Sales Data Available for Trend Velocity
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
          Please upload your sales report Excel file (.xlsx) or CSV to generate dynamic daily GMV velocity curves and revenue trajectories.
        </p>
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            Upload Excel Sheet
          </button>
        )}
      </div>
    );
  }

  // SVG Coordinates calculation for Area and Line Chart
  const svgWidth = 900;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const points = dailyVelocityData.map((d, i) => {
    const x = paddingX + (i / Math.max(1, dailyVelocityData.length - 1)) * graphWidth;
    const value = chartType === 'cumulative' ? d.cumulativeGmv : d.totalGmv;
    const y = svgHeight - paddingY - (value / maxVal) * graphHeight;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  const activePoint = hoveredIdx !== null && points[hoveredIdx] ? points[hoveredIdx] : null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 transition-colors">
      
      {/* Header with Title & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Sales Trend &amp; Daily GMV Velocity
              </h2>
              <span className="text-xs text-slate-400">
                Processed {records.length} transactions across {dailyVelocityData.length} unique dates
              </span>
            </div>
          </div>
        </div>

        {/* Chart View Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                chartType === 'area'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span>Velocity Curve</span>
            </button>

            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Brand Bars</span>
            </button>

            <button
              onClick={() => setChartType('cumulative')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                chartType === 'cumulative'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Cumulative</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px] font-semibold">Total Filtered GMV</span>
          <span className="text-base font-black text-slate-900 dark:text-white">
            ₹{Math.round(totalGmv).toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] font-semibold">Average Daily Velocity</span>
          <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
            ₹{Math.round(avgDailyVelocity).toLocaleString('en-IN')} / day
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] font-semibold">Peak Sales Date</span>
          <span className="text-base font-black text-slate-800 dark:text-slate-100">
            {peakDay ? peakDay.date : 'N/A'} (₹{peakDay ? Math.round(peakDay.totalGmv).toLocaleString('en-IN') : 0})
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] font-semibold">Velocity Range</span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
            {dailyVelocityData[0]?.date} → {dailyVelocityData[dailyVelocityData.length - 1]?.date}
          </span>
        </div>
      </div>

      {/* Brand Color Indicators */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold">
        <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">Active Brands:</span>
        {brandsInPeriod.map(b => {
          const theme = getBrandTheme(b);
          return (
            <div key={b} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md" style={{ backgroundColor: theme.hex }} />
              <span className="text-slate-700 dark:text-slate-200 uppercase">{b}</span>
            </div>
          );
        })}
      </div>

      {/* Primary Chart Canvas */}
      <div className="relative">
        {/* Hover Floating Details Box */}
        {activePoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 backdrop-blur-md text-white text-xs py-2.5 px-4 rounded-2xl shadow-2xl border border-slate-700 pointer-events-none flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono font-bold text-amber-300">{activePoint.data.date}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-700 hidden sm:block" />
            <div>
              <span>Daily GMV: </span>
              <strong className="text-emerald-400 font-bold">₹{Math.round(activePoint.data.totalGmv).toLocaleString('en-IN')}</strong>
            </div>
            <div className="w-px h-3.5 bg-slate-700 hidden sm:block" />
            <div>
              <span>Units: </span>
              <strong className="text-white font-bold">{activePoint.data.totalUnits} pcs</strong>
            </div>
            {chartType === 'cumulative' && (
              <>
                <div className="w-px h-3.5 bg-slate-700 hidden sm:block" />
                <div>
                  <span>Cumulative: </span>
                  <strong className="text-indigo-300 font-bold">₹{Math.round(activePoint.data.cumulativeGmv).toLocaleString('en-IN')}</strong>
                </div>
              </>
            )}
            {activePoint.data.dodChange !== 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center ${
                activePoint.data.dodChange > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
              }`}>
                {activePoint.data.dodChange > 0 ? '+' : ''}{activePoint.data.dodChange.toFixed(1)}% DoD
              </span>
            )}
          </div>
        )}

        {/* 1. Area / Curve View */}
        {(chartType === 'area' || chartType === 'cumulative') && (
          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-64 sm:h-72 select-none overflow-visible"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />

              {/* Area Under Curve */}
              {areaD && (
                <path d={areaD} fill="url(#areaGradient)" />
              )}

              {/* Main Velocity Stroke Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {points.map((p, idx) => (
                <circle
                  key={p.data.date}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIdx === idx ? 6 : 3.5}
                  className={`transition-all cursor-pointer ${
                    hoveredIdx === idx 
                      ? 'fill-amber-400 stroke-slate-900 stroke-2' 
                      : 'fill-indigo-600 dark:fill-indigo-400 hover:fill-amber-400'
                  }`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              ))}
            </svg>

            {/* Date Labels below SVG */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-4 mt-2">
              <span>{dailyVelocityData[0]?.date}</span>
              {dailyVelocityData.length > 2 && (
                <span>{dailyVelocityData[Math.floor(dailyVelocityData.length / 2)]?.date}</span>
              )}
              <span>{dailyVelocityData[dailyVelocityData.length - 1]?.date}</span>
            </div>
          </div>
        )}

        {/* 2. Brand Stacked Bar View */}
        {chartType === 'bar' && (
          <div className="h-64 sm:h-72 flex items-end gap-1 sm:gap-2 overflow-x-auto pt-8 px-2 border-b border-slate-200 dark:border-slate-800">
            {dailyVelocityData.map((d, idx) => {
              const barHeightPx = Math.max(16, Math.round((d.totalGmv / maxVal) * 200));
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={d.date}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex-1 min-w-[24px] max-w-[48px] flex flex-col items-center justify-end group cursor-pointer h-full"
                >
                  {/* Daily total badge */}
                  <span className="text-[9px] font-bold text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{Math.round(d.totalGmv / 1000)}k
                  </span>

                  {/* Stacked Vertical Bar */}
                  <div 
                    className={`w-full rounded-t-lg overflow-hidden flex flex-col justify-end transition-all shadow-xs ${
                      isHovered ? 'ring-2 ring-indigo-500 scale-105 z-10 brightness-110' : 'opacity-95 group-hover:opacity-100'
                    }`}
                    style={{ height: `${barHeightPx}px` }}
                  >
                    {brandsInPeriod.map(b => {
                      const brandSales = d.brandSales[b] || 0;
                      if (!brandSales) return null;
                      const segmentHeightPx = Math.max(2, Math.round((brandSales / d.totalGmv) * barHeightPx));
                      const theme = getBrandTheme(b);

                      return (
                        <div
                          key={b}
                          style={{ height: `${segmentHeightPx}px`, backgroundColor: theme.hex }}
                          className="w-full transition-all"
                        />
                      );
                    })}
                  </div>

                  {/* X Axis Label */}
                  <div className="mt-2 text-[10px] text-slate-400 font-mono transform -rotate-45 sm:rotate-0 origin-top-left sm:origin-center whitespace-nowrap">
                    {d.date.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
