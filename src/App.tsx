/**
 * IM02 - Enterprise Sales & Brand Analytics Platform
 * High-performance, executive dark-mode supported analytics suite.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Award, 
  Zap, 
  Package, 
  MapPin, 
  Database,
  UploadCloud,
  FileSpreadsheet,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SaleRecord, FilterState, BrandMetricSummary } from './types';
import { INITIAL_SALES_DATA, getSampleRecords } from './data/initialData';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { SalesTrendChart } from './components/SalesTrendChart';
import { ProductPerformance } from './components/ProductPerformance';
import { BrandMetricsTab } from './components/BrandMetricsTab';
import { AdsAnalyticsTab } from './components/AdsAnalyticsTab';
import { GeoAndStoreTab } from './components/GeoAndStoreTab';
import { DataTableTab } from './components/DataTableTab';
import { UploadModal } from './components/UploadModal';
import { PdfExportModal } from './components/PdfExportModal';
import { auth, testConnection } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  // Theme state with instant DOM sync
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('im02_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Active Main Navigation Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'brand_metrics' | 'ads' | 'products' | 'geo' | 'data'>('dashboard');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Authentication & Reporter Info
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const userEmail = currentUser?.email || 'mdmanir179@gmail.com';

  // Sales Dataset State - Starts completely clean without demo data ("excel sheet ar demo data gulo remove koro")
  const [records, setRecords] = useState<SaleRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('im02_custom_records');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Exclude old mock demo data
            const isOldDemo = parsed.some((p: SaleRecord) => p.id && p.id.startsWith('rec-'));
            if (!isOldDemo) {
              return parsed;
            } else {
              localStorage.removeItem('im02_custom_records');
            }
          }
        } catch {
          // ignore
        }
      }
    }
    return [];
  });

  // Multi-Dimension Filter State
  const [filters, setFilters] = useState<FilterState>({
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

  // Sync Dark mode to document element and body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('im02_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('im02_theme', 'light');
    }
  }, [darkMode]);

  // Firebase auth & connection test
  useEffect(() => {
    testConnection().catch(() => {});
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Handle uploaded data
  const handleDataLoaded = (newRecords: SaleRecord[], sourceName: string) => {
    setRecords(newRecords);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('im02_custom_records', JSON.stringify(newRecords));
      } catch (e) {
        console.warn('LocalStorage quota reached:', e);
      }
    }
  };

  // Filtered dataset logic
  const filteredRecords = useMemo(() => {
    if (!records.length) return [];

    return records.filter((r) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matches = 
          r.productName.toLowerCase().includes(query) ||
          r.itemCode.toLowerCase().includes(query) ||
          r.city.toLowerCase().includes(query) ||
          r.areaName.toLowerCase().includes(query) ||
          r.storeId.toLowerCase().includes(query) ||
          r.brand.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Brand
      if (filters.brand && r.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }

      // Date Range
      if (filters.dateRange.start && r.orderedDate < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && r.orderedDate > filters.dateRange.end) {
        return false;
      }

      // City
      if (filters.city && r.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // Area
      if (filters.areaName && r.areaName.toLowerCase() !== filters.areaName.toLowerCase()) {
        return false;
      }

      // Store ID
      if (filters.storeId && r.storeId !== filters.storeId) {
        return false;
      }

      // Categories
      if (filters.l1Category && r.l1Category.toLowerCase() !== filters.l1Category.toLowerCase()) {
        return false;
      }
      if (filters.l2Category && r.l2Category.toLowerCase() !== filters.l2Category.toLowerCase()) {
        return false;
      }
      if (filters.l3Category && r.l3Category.toLowerCase() !== filters.l3Category.toLowerCase()) {
        return false;
      }

      // Specific Product
      if (filters.productName && r.productName !== filters.productName) {
        return false;
      }

      // Combo
      if (filters.combo && r.combo !== filters.combo) {
        return false;
      }

      return true;
    });
  }, [records, filters]);

  // Brand Metrics calculation
  const brandMetrics = useMemo<BrandMetricSummary[]>(() => {
    if (!filteredRecords.length) return [];

    const map = new Map<string, {
      totalGMV: number;
      totalUnits: number;
      ordersCount: number;
      comboUnits: number;
      cities: Map<string, number>;
      products: Map<string, number>;
    }>();

    filteredRecords.forEach((r) => {
      const b = r.brand.toLowerCase();
      const curr = map.get(b) || {
        totalGMV: 0,
        totalUnits: 0,
        ordersCount: 0,
        comboUnits: 0,
        cities: new Map(),
        products: new Map(),
      };

      curr.totalGMV += r.gmv;
      curr.totalUnits += r.unitsSold;
      curr.ordersCount += 1;
      if (r.combo === 'Yes') {
        curr.comboUnits += r.unitsSold;
      }

      curr.cities.set(r.city, (curr.cities.get(r.city) || 0) + r.gmv);
      curr.products.set(r.productName, (curr.products.get(r.productName) || 0) + r.unitsSold);

      map.set(b, curr);
    });

    return Array.from(map.entries()).map(([brand, data]) => {
      let topCity = 'N/A';
      let maxCityGmv = -1;
      data.cities.forEach((gmv, city) => {
        if (gmv > maxCityGmv) {
          maxCityGmv = gmv;
          topCity = city;
        }
      });

      let topProduct = 'N/A';
      let maxProdUnits = -1;
      data.products.forEach((units, prod) => {
        if (units > maxProdUnits) {
          maxProdUnits = units;
          topProduct = prod;
        }
      });

      const asp = data.totalUnits > 0 ? data.totalGMV / data.totalUnits : 0;
      const aov = data.ordersCount > 0 ? data.totalGMV / data.ordersCount : 0;
      const comboShare = data.totalUnits > 0 ? (data.comboUnits / data.totalUnits) * 100 : 0;

      return {
        brand,
        totalGMV: data.totalGMV,
        totalUnits: data.totalUnits,
        ordersCount: data.ordersCount,
        asp,
        aov,
        comboUnits: data.comboUnits,
        comboShare,
        topCity,
        topProduct,
        color: brand === 'averx' ? '#10b981' : '#7c3aed'
      };
    });
  }, [filteredRecords]);

  const totalFilteredGmv = useMemo(() => {
    return filteredRecords.reduce((acc, r) => acc + r.gmv, 0);
  }, [filteredRecords]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      
      {/* App Header with Live Clock, Theme Toggle & Logout */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        userEmail={userEmail}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('brand_metrics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'brand_metrics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Brand Metrics</span>
            {brandMetrics.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20">
                {brandMetrics.length} Brands
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'ads'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Ads &amp; ROAS Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Performance</span>
          </button>

          <button
            onClick={() => setActiveTab('geo')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'geo'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Cities &amp; Stores</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'data'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Raw Data Explorer</span>
          </button>
        </div>

        {/* Global Multi-Dimension Filter Bar (Active when records exist) */}
        {records.length > 0 && (
          <FilterBar
            records={records}
            filters={filters}
            setFilters={setFilters}
            totalCount={records.length}
            filteredCount={filteredRecords.length}
          />
        )}

        {/* Empty Onboarding State if no records uploaded */}
        {records.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-sm mb-6 transition-colors">
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/25">
              <UploadCloud className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Welcome to TBC analysis
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-6">
              Upload your sales report Excel file (.xlsx, .xls) or CSV to instantly generate Sales Velocity, Brand Intelligence, ROAS, and PDF reporting.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Upload Sales Report Excel</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => handleDataLoaded(getSampleRecords(), 'Sample Instamart Sales')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold text-sm shadow-xs active:scale-95 transition-all"
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                <span>Load Sample Instamart Dataset</span>
              </button>
            </div>

            {/* Expected columns helper box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-left">
              <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                Expected Column Headers in Your Excel/CSV:
              </span>
              <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                BRAND, ORDERED DATE, CITY, AREA NAME, STORE ID, L1 CATEGORY, L2 CATEGORY, L3 CATEGORY, PRODUCT NAME, VARIANT, ITEM CODE, COMBO, BASE_MRP, UNITS_SOLD, GMV
              </p>
            </div>
          </div>
        )}

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && records.length > 0 && (
          <div className="space-y-6">
            {/* Colorful Executive KPI Cards */}
            <KpiCards
              records={filteredRecords}
              brandMetrics={brandMetrics}
            />

            {/* Sales Trend Bar / Daily GMV Velocity Chart */}
            <SalesTrendChart
              records={filteredRecords}
              onOpenUpload={() => setIsUploadOpen(true)}
            />

            {/* Product Performance Brand-Coded Color Bars */}
            <ProductPerformance
              records={filteredRecords}
            />
          </div>
        )}

        {/* Tab 2: Dedicated Brand Metrics Tab */}
        {activeTab === 'brand_metrics' && records.length > 0 && (
          <BrandMetricsTab
            records={filteredRecords}
            brandMetrics={brandMetrics}
          />
        )}

        {/* Tab 3: Dedicated Ads Analytics Tab */}
        {activeTab === 'ads' && records.length > 0 && (
          <AdsAnalyticsTab
            totalGmv={totalFilteredGmv}
            totalOrders={filteredRecords.length}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
          />
        )}

        {/* Tab 4: Product Performance Breakdown */}
        {activeTab === 'products' && records.length > 0 && (
          <ProductPerformance
            records={filteredRecords}
          />
        )}

        {/* Tab 5: Geo and Store Analytics */}
        {activeTab === 'geo' && records.length > 0 && (
          <GeoAndStoreTab
            records={filteredRecords}
          />
        )}

        {/* Tab 6: Raw Data Explorer & Export */}
        {activeTab === 'data' && records.length > 0 && (
          <DataTableTab
            records={filteredRecords}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-5 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-center text-xs text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-600 dark:text-slate-400">TBC analysis • Enterprise Sales &amp; Brand Analytics Suite</span>
          <span>Reporter Author: <strong className="text-slate-700 dark:text-slate-200 font-bold">{userEmail}</strong></span>
        </div>
      </footer>

      {/* Upload Modal with Victory Chime */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleDataLoaded}
      />

      {/* PDF Export Modal with Email Stamping */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        defaultEmail={userEmail}
        records={filteredRecords}
        brandMetrics={brandMetrics}
        activeBrand={filters.brand}
        dateRangeStr={filters.dateRange.start ? `${filters.dateRange.start} to ${filters.dateRange.end || 'Now'}` : 'Complete Dataset'}
      />

    </div>
  );
}
