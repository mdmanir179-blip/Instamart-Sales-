import React from 'react';
import { 
  Award, 
  TrendingUp, 
  Package, 
  MapPin, 
  Tag, 
  Percent, 
  Layers, 
  Sparkles,
  BarChart2
} from 'lucide-react';
import { SaleRecord, BrandMetricSummary } from '../types';
import { getBrandTheme } from '../utils/brandColors';

interface BrandMetricsTabProps {
  records: SaleRecord[];
  brandMetrics: BrandMetricSummary[];
}

export const BrandMetricsTab: React.FC<BrandMetricsTabProps> = ({
  records,
  brandMetrics,
}) => {
  const totalGmv = records.reduce((acc, r) => acc + r.gmv, 0);
  const totalUnits = records.reduce((acc, r) => acc + r.unitsSold, 0);

  // Month-wise breakdown per brand
  const monthBreakdown = React.useMemo(() => {
    const months = ['2026-08', '2026-09', '2026-10'];
    const data: Record<string, Record<string, { gmv: number; units: number }>> = {};

    brandMetrics.forEach(b => {
      data[b.brand] = {};
      months.forEach(m => {
        data[b.brand][m] = { gmv: 0, units: 0 };
      });
    });

    records.forEach(r => {
      const m = r.orderedDate.substring(0, 7);
      if (data[r.brand] && data[r.brand][m]) {
        data[r.brand][m].gmv += r.gmv;
        data[r.brand][m].units += r.unitsSold;
      }
    });

    return data;
  }, [records, brandMetrics]);

  return (
    <div className="space-y-6">
      {/* Tab Overview Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Award className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-black tracking-tight">
                Brand Intelligence &amp; Comparative Analytics
              </h2>
            </div>
            <p className="text-xs text-indigo-200/90 max-w-2xl leading-relaxed">
              In-depth strategic metrics: market share, Average Selling Price (ASP), volume contribution, combo ratios, and month-over-month growth velocity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
              <span className="text-[10px] text-indigo-200 uppercase font-semibold block">Tracked Brands</span>
              <span className="text-xl font-black text-amber-300">{brandMetrics.length} Brands Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {brandMetrics.map((bm) => {
          const shareGmv = ((bm.totalGMV / (totalGmv || 1)) * 100).toFixed(1);
          const shareUnits = ((bm.totalUnits / (totalUnits || 1)) * 100).toFixed(1);
          const brandTheme = getBrandTheme(bm.brand);

          return (
            <div 
              key={bm.brand}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md transition-all hover:shadow-lg relative overflow-hidden"
            >
              {/* Header Accent Bar with signature brand color */}
              <div 
                className="absolute top-0 left-0 right-0 h-2.5" 
                style={{ backgroundColor: brandTheme.hex }}
              />

              <div className="flex items-center justify-between mb-5 mt-1.5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-md"
                    style={{ backgroundColor: brandTheme.hex }}
                  >
                    {bm.brand.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-slate-900 dark:text-white tracking-wide">
                      {bm.brand}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {bm.brand.toLowerCase() === 'averx' ? 'Beauty, Grooming, Kitchen & Disposables' : 'Cameras, Fast Charging Cables & Tripods'}
                    </span>
                  </div>
                </div>

                {/* Market Share Badge */}
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
                    {shareGmv}% GMV Share
                  </span>
                </div>
              </div>

              {/* 4 Core Brand Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Brand GMV Revenue</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    ₹{Math.round(bm.totalGMV).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{bm.ordersCount} total orders</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Units Volume Sold</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {bm.totalUnits.toLocaleString('en-IN')} <span className="text-xs font-normal">pcs</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{shareUnits}% volume share</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Avg Selling Price (ASP)</span>
                  <span 
                    className="text-xl font-black"
                    style={{ color: brandTheme.hex }}
                  >
                    ₹{Math.round(bm.asp).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Per unit sold</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Avg Order Value (AOV)</span>
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                    ₹{Math.round(bm.aov).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Per order basket</span>
                </div>
              </div>

              {/* Monthly Velocity Tracker */}
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 mb-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-indigo-500" /> Monthly Revenue Breakdown
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {['2026-08', '2026-09', '2026-10'].map((m) => {
                    const mData = monthBreakdown[bm.brand]?.[m] || { gmv: 0, units: 0 };
                    return (
                      <div key={m} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">{m}</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100 block">
                          ₹{Math.round(mData.gmv).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400">{mData.units} pcs</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Brand Footprint & Top SKU */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> Top Market Hub:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">
                    {bm.topCity}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Top Selling Product:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px] text-right" title={bm.topProduct}>
                    {bm.topProduct}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                    <Tag className="w-3.5 h-3.5 text-violet-500" /> Combo Pack Volume:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {bm.comboShare.toFixed(1)}% of orders
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Head-to-Head Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          Comparative Brand Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Performance Dimension</th>
                {brandMetrics.map(b => (
                  <th key={b.brand} className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200 uppercase">
                    {b.brand}
                  </th>
                ))}
                <th className="py-3 px-4">Portfolio Aggregate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Gross Merchandise Value (GMV)</td>
                {brandMetrics.map(b => (
                  <td key={b.brand} className="py-3.5 px-4 font-bold">
                    ₹{Math.round(b.totalGMV).toLocaleString('en-IN')} ({((b.totalGMV / (totalGmv || 1)) * 100).toFixed(1)}%)
                  </td>
                ))}
                <td className="py-3.5 px-4 font-black text-indigo-600 dark:text-indigo-400">
                  ₹{Math.round(totalGmv).toLocaleString('en-IN')}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Units Sold (Volume)</td>
                {brandMetrics.map(b => (
                  <td key={b.brand} className="py-3.5 px-4">
                    {b.totalUnits.toLocaleString('en-IN')} pcs ({((b.totalUnits / (totalUnits || 1)) * 100).toFixed(1)}%)
                  </td>
                ))}
                <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400">
                  {totalUnits.toLocaleString('en-IN')} pcs
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Average Selling Price (ASP)</td>
                {brandMetrics.map(b => (
                  <td key={b.brand} className="py-3.5 px-4 font-semibold">
                    ₹{Math.round(b.asp)}
                  </td>
                ))}
                <td className="py-3.5 px-4 font-semibold">
                  ₹{Math.round(totalUnits > 0 ? totalGmv / totalUnits : 0)}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Average Order Value (AOV)</td>
                {brandMetrics.map(b => (
                  <td key={b.brand} className="py-3.5 px-4">
                    ₹{Math.round(b.aov)}
                  </td>
                ))}
                <td className="py-3.5 px-4">
                  ₹{Math.round(records.length > 0 ? totalGmv / records.length : 0)}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Combo Unit Contribution</td>
                {brandMetrics.map(b => (
                  <td key={b.brand} className="py-3.5 px-4">
                    {b.comboShare.toFixed(1)}%
                  </td>
                ))}
                <td className="py-3.5 px-4">
                  {((records.filter(r => r.combo === 'Yes').reduce((a, b) => a + b.unitsSold, 0) / (totalUnits || 1)) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Top Geographic Hub</td>
                {brandMetrics.map(b => (
                  <td key={b.brand} className="py-3.5 px-4 capitalize font-semibold">
                    {b.topCity}
                  </td>
                ))}
                <td className="py-3.5 px-4 font-semibold">Pan-India Reach</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
