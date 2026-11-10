import React, { useMemo, useState } from 'react';
import { Package, ArrowUpDown, Tag, Sparkles } from 'lucide-react';
import { SaleRecord } from '../types';
import { getBrandTheme } from '../utils/brandColors';

interface ProductPerformanceProps {
  records: SaleRecord[];
}

export const ProductPerformance: React.FC<ProductPerformanceProps> = ({ records }) => {
  const [sortBy, setSortBy] = useState<'gmv' | 'units'>('gmv');

  const productsList = useMemo(() => {
    const map = new Map<string, {
      productName: string;
      brand: string;
      itemCode: string;
      variant: string;
      category: string;
      baseMrp: number;
      unitsSold: number;
      gmv: number;
      ordersCount: number;
    }>();

    records.forEach(r => {
      const key = `${r.brand}___${r.productName}`;
      const existing = map.get(key) || {
        productName: r.productName,
        brand: r.brand,
        itemCode: r.itemCode,
        variant: r.variant,
        category: `${r.l1Category} > ${r.l3Category}`,
        baseMrp: r.baseMrp,
        unitsSold: 0,
        gmv: 0,
        ordersCount: 0,
      };

      existing.unitsSold += r.unitsSold;
      existing.gmv += r.gmv;
      existing.ordersCount += 1;
      map.set(key, existing);
    });

    const arr = Array.from(map.values());
    arr.sort((a, b) => (sortBy === 'gmv' ? b.gmv - a.gmv : b.unitsSold - a.unitsSold));
    return arr;
  }, [records, sortBy]);

  const maxVal = useMemo(() => {
    if (!productsList.length) return 1;
    return sortBy === 'gmv' ? productsList[0].gmv : productsList[0].unitsSold;
  }, [productsList, sortBy]);

  const totalGmv = records.reduce((acc, r) => acc + r.gmv, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Package className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Product Performance &amp; Brand-Coded Color Bar Analysis
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {productsList.length} Active SKUs
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sold quantities and revenue contribution colored by each brand's signature identity
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          <button
            onClick={() => setSortBy('gmv')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              sortBy === 'gmv'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            GMV (₹)
          </button>
          <button
            onClick={() => setSortBy('units')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              sortBy === 'units'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Units Sold (Pcs)
          </button>
        </div>
      </div>

      {/* Brand Color Legend */}
      <div className="flex flex-wrap items-center gap-3 p-3 mb-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs font-semibold">
        <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">Brand Color Codes:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-violet-600" />
          <span className="text-slate-700 dark:text-slate-200 uppercase">NAFA (Electric Violet)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-600" />
          <span className="text-slate-700 dark:text-slate-200 uppercase">averX (Emerald Green)</span>
        </div>
        <span className="text-slate-400 text-[11px]">• Additional brands receive distinct deterministic colors automatically</span>
      </div>

      {/* Product List with Color Bars */}
      <div className="space-y-4">
        {productsList.map((prod, index) => {
          const brandTheme = getBrandTheme(prod.brand);
          const pct = Math.max(Math.round(((sortBy === 'gmv' ? prod.gmv : prod.unitsSold) / maxVal) * 100), 5);
          const shareOfTotal = ((prod.gmv / (totalGmv || 1)) * 100).toFixed(1);

          return (
            <div 
              key={`${prod.brand}-${prod.productName}-${index}`}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 transition-all group"
            >
              {/* Product Info Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                <div className="flex items-start gap-3">
                  {/* Brand Tag - Distinct Color */}
                  <span 
                    className="mt-0.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-xs shrink-0"
                    style={{ backgroundColor: brandTheme.hex }}
                  >
                    {prod.brand}
                  </span>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {prod.productName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>SKU: <strong className="font-mono text-slate-700 dark:text-slate-300">{prod.itemCode}</strong></span>
                      <span>•</span>
                      <span>Variant: {prod.variant}</span>
                      <span>•</span>
                      <span className="capitalize">{prod.category}</span>
                      <span>•</span>
                      <span>MRP: ₹{prod.baseMrp}</span>
                    </div>
                  </div>
                </div>

                {/* Sold Quantity & GMV Badges */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <span className="block text-sm font-black text-slate-900 dark:text-white">
                      ₹{Math.round(prod.gmv).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {shareOfTotal}% GMV contribution
                    </span>
                  </div>

                  {/* Quantity Sold Badge */}
                  <div 
                    className="px-3.5 py-1.5 rounded-xl border shadow-xs text-right"
                    style={{ 
                      borderColor: `${brandTheme.hex}40`,
                      backgroundColor: `${brandTheme.hex}15`
                    }}
                  >
                    <span 
                      className="block text-sm font-black"
                      style={{ color: brandTheme.hex }}
                    >
                      {prod.unitsSold} pcs
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      Sold Qty
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Bar styled strictly by brand */}
              <div className="w-full h-3 rounded-full bg-slate-200/80 dark:bg-slate-700/80 overflow-hidden relative">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${pct}%`,
                    backgroundColor: brandTheme.hex,
                    backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)',
                    backgroundSize: '1rem 1rem'
                  }}
                />
              </div>

              {/* Metrics footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
                <span>Transactions count: {prod.ordersCount} orders</span>
                <span>Average Selling Price: ₹{Math.round(prod.gmv / prod.unitsSold)} / pc</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
