import React, { useMemo, useState } from 'react';
import { MapPin, Store, Building2 } from 'lucide-react';
import { SaleRecord } from '../types';

interface GeoAndStoreTabProps {
  records: SaleRecord[];
}

export const GeoAndStoreTab: React.FC<GeoAndStoreTabProps> = ({ records }) => {
  const [activeSubTab, setActiveSubTab] = useState<'cities' | 'stores' | 'areas'>('cities');

  // Aggregations
  const cityData = useMemo(() => {
    const map = new Map<string, { city: string; gmv: number; units: number; orders: number; topArea: string }>();
    const areaCounts = new Map<string, Map<string, number>>();

    records.forEach(r => {
      const c = r.city;
      const curr = map.get(c) || { city: c, gmv: 0, units: 0, orders: 0, topArea: '' };
      curr.gmv += r.gmv;
      curr.units += r.unitsSold;
      curr.orders += 1;
      map.set(c, curr);

      if (!areaCounts.has(c)) areaCounts.set(c, new Map());
      const cAreas = areaCounts.get(c)!;
      cAreas.set(r.areaName, (cAreas.get(r.areaName) || 0) + r.gmv);
    });

    // Find top area per city
    map.forEach((val, city) => {
      const areas = areaCounts.get(city);
      if (areas) {
        let maxA = '';
        let maxV = -1;
        areas.forEach((gmv, area) => {
          if (gmv > maxV) {
            maxV = gmv;
            maxA = area;
          }
        });
        val.topArea = maxA;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.gmv - a.gmv);
  }, [records]);

  const storeData = useMemo(() => {
    const map = new Map<string, { storeId: string; city: string; areaName: string; gmv: number; units: number; orders: number }>();
    records.forEach(r => {
      const curr = map.get(r.storeId) || { storeId: r.storeId, city: r.city, areaName: r.areaName, gmv: 0, units: 0, orders: 0 };
      curr.gmv += r.gmv;
      curr.units += r.unitsSold;
      curr.orders += 1;
      map.set(r.storeId, curr);
    });
    return Array.from(map.values()).sort((a, b) => b.gmv - a.gmv);
  }, [records]);

  const areaData = useMemo(() => {
    const map = new Map<string, { areaName: string; city: string; gmv: number; units: number; orders: number }>();
    records.forEach(r => {
      const key = `${r.city}__${r.areaName}`;
      const curr = map.get(key) || { areaName: r.areaName, city: r.city, gmv: 0, units: 0, orders: 0 };
      curr.gmv += r.gmv;
      curr.units += r.unitsSold;
      curr.orders += 1;
      map.set(key, curr);
    });
    return Array.from(map.values()).sort((a, b) => b.gmv - a.gmv);
  }, [records]);

  const totalGmv = records.reduce((acc, r) => acc + r.gmv, 0);

  return (
    <div className="space-y-6">
      {/* Subtab selection */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('cities')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'cities'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>City Leaderboard ({cityData.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('areas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'areas'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Top Performing Areas ({areaData.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stores')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'stores'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Store ID Analytics ({storeData.length})</span>
        </button>
      </div>

      {/* Content based on subtab */}
      {activeSubTab === 'cities' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            Geographic City Sales &amp; Revenue Ranking
          </h3>

          <div className="space-y-4">
            {cityData.map((c, idx) => {
              const pct = ((c.gmv / (totalGmv || 1)) * 100).toFixed(1);
              const maxCityGmv = cityData[0]?.gmv || 1;
              const barWidth = Math.max(Math.round((c.gmv / maxCityGmv) * 100), 5);

              return (
                <div key={c.city} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                          {c.city}
                        </h4>
                        <span className="text-[11px] text-slate-400 capitalize">
                          Top Hub: {c.topArea}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-sm font-black text-slate-900 dark:text-white">
                        ₹{Math.round(c.gmv).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {c.units} units ({pct}% of total)
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'areas' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" />
            Area-wise Performance Analysis
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Area Name</th>
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3">Units Sold</th>
                  <th className="py-3 px-3">Total GMV</th>
                  <th className="py-3 px-3">Orders</th>
                  <th className="py-3 px-3">GMV Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
                {areaData.slice(0, 30).map((a) => (
                  <tr key={`${a.city}-${a.areaName}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white capitalize">
                      {a.areaName}
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-500">{a.city}</td>
                    <td className="py-3 px-3">{a.units} pcs</td>
                    <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{Math.round(a.gmv).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">{a.orders}</td>
                    <td className="py-3 px-3 text-indigo-600 font-bold">
                      {((a.gmv / (totalGmv || 1)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'stores' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-500" />
            Store ID Revenue &amp; Order Leaderboard
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Store ID</th>
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3">Area Name</th>
                  <th className="py-3 px-3">Units Sold</th>
                  <th className="py-3 px-3">Total GMV</th>
                  <th className="py-3 px-3">Order Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
                {storeData.slice(0, 35).map((s) => (
                  <tr key={s.storeId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      #{s.storeId}
                    </td>
                    <td className="py-3 px-3 capitalize">{s.city}</td>
                    <td className="py-3 px-3 capitalize text-slate-500">{s.areaName}</td>
                    <td className="py-3 px-3 font-semibold">{s.units} pcs</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      ₹{Math.round(s.gmv).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">{s.orders} transactions</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
