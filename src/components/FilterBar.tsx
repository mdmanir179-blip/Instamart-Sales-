import React, { useMemo, useState } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  MapPin, 
  Store, 
  Layers 
} from 'lucide-react';
import { SaleRecord, FilterState } from '../types';
import { getBrandTheme } from '../utils/brandColors';

interface FilterBarProps {
  records: SaleRecord[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  records,
  filters,
  setFilters,
  totalCount,
  filteredCount,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Extract unique options dynamically
  const uniqueOptions = useMemo(() => {
    const brands = Array.from(new Set(records.map(r => r.brand))).filter(Boolean).sort();
    const cities = Array.from(new Set(records.map(r => r.city))).filter(Boolean).sort();
    const areas = Array.from(new Set(records.map(r => r.areaName))).filter(Boolean).sort();
    const stores = Array.from(new Set(records.map(r => r.storeId))).filter(Boolean).sort();
    const l1s = Array.from(new Set(records.map(r => r.l1Category))).filter(Boolean).sort();
    const l2s = Array.from(new Set(records.map(r => r.l2Category))).filter(Boolean).sort();
    const l3s = Array.from(new Set(records.map(r => r.l3Category))).filter(Boolean).sort();
    const products = Array.from(new Set(records.map(r => r.productName))).filter(Boolean).sort();

    return { brands, cities, areas, stores, l1s, l2s, l3s, products };
  }, [records]);

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      brand: '',
      dateRange: { start: '', end: '' },
      city: '',
      areaName: '',
      storeId: '',
      l1Category: '',
      l2Category: '',
      l3Category: '',
      productName: '',
      combo: '',
    });
  };

  const setMonthPreset = (yearMonth: string) => {
    if (!yearMonth) {
      setFilters(prev => ({ ...prev, dateRange: { start: '', end: '' } }));
      return;
    }
    const [year, month] = yearMonth.split('-');
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    setFilters(prev => ({
      ...prev,
      dateRange: {
        start: `${yearMonth}-01`,
        end: `${yearMonth}-${lastDay < 10 ? '0' + lastDay : lastDay}`
      }
    }));
  };

  const hasActiveFilters = 
    Boolean(filters.searchQuery || 
    filters.brand || 
    filters.dateRange.start || 
    filters.dateRange.end || 
    filters.city || 
    filters.areaName || 
    filters.storeId || 
    filters.l1Category || 
    filters.l2Category || 
    filters.l3Category || 
    filters.productName || 
    filters.combo);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm mb-6 transition-colors">
      {/* Top Primary Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, SKU item codes, city, area name, or store ID..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          />
        </div>

        {/* Brand Selector */}
        <div className="w-full md:w-48">
          <select
            value={filters.brand}
            onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all capitalize"
          >
            <option value="">All Brands ({uniqueOptions.brands.length})</option>
            {uniqueOptions.brands.map(b => (
              <option key={b} value={b} className="capitalize">
                {b.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Date Month Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setMonthPreset('')}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              !filters.dateRange.start ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Dates
          </button>
          <button
            onClick={() => setMonthPreset('2026-08')}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filters.dateRange.start.startsWith('2026-08') ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            August 2026
          </button>
          <button
            onClick={() => setMonthPreset('2026-09')}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filters.dateRange.start.startsWith('2026-09') ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            September 2026
          </button>
          <button
            onClick={() => setMonthPreset('2026-10')}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filters.dateRange.start.startsWith('2026-10') ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            October 2026
          </button>
        </div>

        {/* Toggle Advanced Filters Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-3.5 py-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
            isExpanded || hasActiveFilters
              ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Advanced Filters</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-1 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Expanded Multi-Dimension Filter Grid */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          
          {/* Custom Date Start & End */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-indigo-500" /> Start Date
            </label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: e.target.value }
              }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-indigo-500" /> End Date
            </label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: e.target.value }
              }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-medium"
            />
          </div>

          {/* City Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-500" /> City
            </label>
            <select
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 capitalize font-medium"
            >
              <option value="">All Cities ({uniqueOptions.cities.length})</option>
              {uniqueOptions.cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Area Name Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-teal-500" /> Area Name
            </label>
            <select
              value={filters.areaName}
              onChange={(e) => setFilters(prev => ({ ...prev, areaName: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 capitalize font-medium"
            >
              <option value="">All Areas ({uniqueOptions.areas.length})</option>
              {uniqueOptions.areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Store ID Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Store className="w-3 h-3 text-amber-500" /> Store ID
            </label>
            <select
              value={filters.storeId}
              onChange={(e) => setFilters(prev => ({ ...prev, storeId: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-mono"
            >
              <option value="">All Stores ({uniqueOptions.stores.length})</option>
              {uniqueOptions.stores.map(s => (
                <option key={s} value={s}>#{s}</option>
              ))}
            </select>
          </div>

          {/* Combo Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-violet-500" /> Combo Pack?
            </label>
            <select
              value={filters.combo}
              onChange={(e) => setFilters(prev => ({ ...prev, combo: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="">All Products</option>
              <option value="Yes">Combo Packs Only</option>
              <option value="No">Single Items Only</option>
            </select>
          </div>

          {/* L1 Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-pink-500" /> L1 Category
            </label>
            <select
              value={filters.l1Category}
              onChange={(e) => setFilters(prev => ({ ...prev, l1Category: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 capitalize font-medium"
            >
              <option value="">All L1 ({uniqueOptions.l1s.length})</option>
              {uniqueOptions.l1s.map(l1 => (
                <option key={l1} value={l1}>{l1}</option>
              ))}
            </select>
          </div>

          {/* L2 Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-500" /> L2 Category
            </label>
            <select
              value={filters.l2Category}
              onChange={(e) => setFilters(prev => ({ ...prev, l2Category: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 capitalize font-medium"
            >
              <option value="">All L2 ({uniqueOptions.l2s.length})</option>
              {uniqueOptions.l2s.map(l2 => (
                <option key={l2} value={l2}>{l2}</option>
              ))}
            </select>
          </div>

          {/* L3 Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-purple-500" /> L3 Category
            </label>
            <select
              value={filters.l3Category}
              onChange={(e) => setFilters(prev => ({ ...prev, l3Category: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 capitalize font-medium"
            >
              <option value="">All L3 ({uniqueOptions.l3s.length})</option>
              {uniqueOptions.l3s.map(l3 => (
                <option key={l3} value={l3}>{l3}</option>
              ))}
            </select>
          </div>

          {/* Product Name Selector */}
          <div className="space-y-1 md:col-span-2 lg:col-span-3">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-indigo-500" /> Product Name
            </label>
            <select
              value={filters.productName}
              onChange={(e) => setFilters(prev => ({ ...prev, productName: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 truncate font-medium"
            >
              <option value="">All Products ({uniqueOptions.products.length})</option>
              {uniqueOptions.products.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

        </div>
      )}

      {/* Filter Status & Match Counter */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>
            Displaying <strong className="text-slate-900 dark:text-white font-bold">{filteredCount}</strong> of <span className="text-slate-400">{totalCount} total sales transactions</span>
          </span>
          {filteredCount < totalCount && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {((filteredCount / totalCount) * 100).toFixed(0)}% subset matched
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400">
            <span className="font-semibold">Active filters:</span>
            {filters.brand && <span className="font-bold underline uppercase">{filters.brand}</span>}
            {filters.city && <span className="font-bold underline capitalize">• {filters.city}</span>}
            {filters.dateRange.start && <span className="font-bold underline">• {filters.dateRange.start}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
