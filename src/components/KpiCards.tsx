import React from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Tag, 
  MapPin, 
  Layers, 
  Store,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { SaleRecord, BrandMetricSummary } from '../types';
import { getBrandTheme } from '../utils/brandColors';

interface KpiCardsProps {
  records: SaleRecord[];
  brandMetrics: BrandMetricSummary[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ records, brandMetrics }) => {
  const totalGmv = records.reduce((acc, r) => acc + r.gmv, 0);
  const totalUnits = records.reduce((acc, r) => acc + r.unitsSold, 0);
  const totalOrders = records.length;
  const asp = totalUnits > 0 ? totalGmv / totalUnits : 0;
  const aov = totalOrders > 0 ? totalGmv / totalOrders : 0;

  const uniqueCities = new Set(records.map(r => r.city)).size;
  const uniqueStores = new Set(records.map(r => r.storeId)).size;
  
  const comboUnits = records.filter(r => r.combo === 'Yes').reduce((acc, r) => acc + r.unitsSold, 0);
  const comboRatio = totalUnits > 0 ? (comboUnits / totalUnits) * 100 : 0;

  // Best brand
  const topBrand = brandMetrics.slice().sort((a, b) => b.totalGMV - a.totalGMV)[0];
  const topBrandTheme = topBrand ? getBrandTheme(topBrand.brand) : null;

  return (
    <div className="space-y-4 mb-6">
      {/* 4 Main Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Total GMV Card - Rich Indigo/Violet Gradient */}
        <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-xl shadow-indigo-500/20 border border-indigo-400/30 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-100 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-300" /> Total GMV Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <TrendingUp className="w-4.5 h-4.5 text-white" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black tracking-tight mb-1.5">
            ₹{Math.round(totalGmv).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-indigo-100/90 flex items-center justify-between font-semibold pt-1 border-t border-white/15">
            <span>{totalOrders.toLocaleString()} total orders</span>
            <span className="flex items-center text-amber-300">
              <Sparkles className="w-3 h-3 mr-1" /> Active
            </span>
          </div>
        </div>

        {/* 2. Units Sold Card - Emerald/Teal Gradient */}
        <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-xl shadow-emerald-500/20 border border-emerald-400/30 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-emerald-200" /> Units Volume Sold
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Package className="w-4.5 h-4.5 text-white" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black tracking-tight mb-1.5">
            {totalUnits.toLocaleString('en-IN')} <span className="text-base font-medium text-emerald-200">pcs</span>
          </div>
          <div className="text-xs text-emerald-100/90 flex items-center justify-between font-semibold pt-1 border-t border-white/15">
            <span>Avg Order Size: {(totalUnits / (totalOrders || 1)).toFixed(1)} pcs</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">Volume</span>
          </div>
        </div>

        {/* 3. ASP & AOV Card - Amber/Orange Gradient */}
        <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 text-white shadow-xl shadow-amber-500/20 border border-amber-400/30 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-amber-200" /> Average Pricing
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <ShoppingCart className="w-4.5 h-4.5 text-white" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black tracking-tight mb-1.5">
            ₹{Math.round(asp).toLocaleString('en-IN')} <span className="text-xs font-normal text-amber-200">ASP</span>
          </div>
          <div className="text-xs text-amber-100/90 flex items-center justify-between font-semibold pt-1 border-t border-white/15">
            <span>ASP per unit</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">AOV: ₹{Math.round(aov)}</span>
          </div>
        </div>

        {/* 4. Top Brand & Share - Electric Violet / Brand Gradient */}
        <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-900 text-white shadow-xl shadow-purple-500/20 border border-purple-400/30 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-100 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-200" /> Leading Brand
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Layers className="w-4.5 h-4.5 text-white" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black tracking-tight mb-1.5 uppercase">
            {topBrand ? topBrand.brand : 'N/A'}
          </div>
          <div className="text-xs text-purple-100/90 flex items-center justify-between font-semibold pt-1 border-t border-white/15">
            <span>₹{topBrand ? Math.round(topBrand.totalGMV).toLocaleString('en-IN') : 0}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
              {topBrand ? `${((topBrand.totalGMV / (totalGmv || 1)) * 100).toFixed(1)}% Share` : '0%'}
            </span>
          </div>
        </div>

      </div>

      {/* 4 Supporting Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        {/* Active Store Hubs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {uniqueStores}
            </div>
            <div className="text-xs font-medium text-slate-400">
              Active Store IDs
            </div>
          </div>
        </div>

        {/* Cities & Geographies */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {uniqueCities} <span className="text-xs font-normal text-slate-400">Cities</span>
            </div>
            <div className="text-xs font-medium text-slate-400">
              Geographic Coverage
            </div>
          </div>
        </div>

        {/* Combo Share */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {comboRatio.toFixed(1)}%
            </div>
            <div className="text-xs font-medium text-slate-400">
              Combo Sales Contribution
            </div>
          </div>
        </div>

        {/* Catalog SKUs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {new Set(records.map(r => r.itemCode)).size} <span className="text-xs font-normal text-slate-400">SKUs</span>
            </div>
            <div className="text-xs font-medium text-slate-400">
              Total Catalog Breadth
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
