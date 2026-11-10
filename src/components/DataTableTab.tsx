import React, { useState, useMemo } from 'react';
import { Database, Download, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { SaleRecord } from '../types';
import { getBrandTheme } from '../utils/brandColors';

interface DataTableTabProps {
  records: SaleRecord[];
}

export const DataTableTab: React.FC<DataTableTabProps> = ({ records }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [sortField, setSortField] = useState<keyof SaleRecord>('orderedDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof SaleRecord) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return sortDir === 'asc' 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [records, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const exportToExcel = () => {
    const exportData = sortedRecords.map(r => ({
      BRAND: r.brand.toUpperCase(),
      ORDERED_DATE: r.orderedDate,
      CITY: r.city,
      AREA_NAME: r.areaName,
      STORE_ID: r.storeId,
      L1_CATEGORY: r.l1Category,
      L2_CATEGORY: r.l2Category,
      L3_CATEGORY: r.l3Category,
      PRODUCT_NAME: r.productName,
      VARIANT: r.variant,
      ITEM_CODE: r.itemCode,
      COMBO: r.combo,
      BASE_MRP: r.baseMrp,
      UNITS_SOLD: r.unitsSold,
      GMV: r.gmv
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Data');
    XLSX.writeFile(workbook, `IM02_Sales_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            Granular Sales Transaction Records
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {records.length} records available for granular inspection and spreadsheet export
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value={15}>15 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th onClick={() => handleSort('orderedDate')} className="py-3 px-3 cursor-pointer hover:text-indigo-500">
                <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th onClick={() => handleSort('brand')} className="py-3 px-3 cursor-pointer hover:text-indigo-500">
                <span className="flex items-center gap-1">Brand <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th className="py-3 px-3">Product Name</th>
              <th className="py-3 px-3">Variant / SKU</th>
              <th onClick={() => handleSort('city')} className="py-3 px-3 cursor-pointer hover:text-indigo-500">
                <span className="flex items-center gap-1">City &amp; Area <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th className="py-3 px-3">Store ID</th>
              <th className="py-3 px-3">Combo?</th>
              <th onClick={() => handleSort('baseMrp')} className="py-3 px-3 cursor-pointer hover:text-indigo-500">
                <span className="flex items-center gap-1">MRP <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th onClick={() => handleSort('unitsSold')} className="py-3 px-3 cursor-pointer hover:text-indigo-500">
                <span className="flex items-center gap-1">Qty <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th onClick={() => handleSort('gmv')} className="py-3 px-3 cursor-pointer hover:text-indigo-500">
                <span className="flex items-center gap-1">Total GMV <ArrowUpDown className="w-3 h-3" /></span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
            {paginatedRecords.map((r) => {
              const brandTheme = getBrandTheme(r.brand);
              return (
                <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                    {r.orderedDate}
                  </td>
                  <td className="py-2.5 px-3">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-white shadow-xs"
                      style={{ backgroundColor: brandTheme.hex }}
                    >
                      {r.brand}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 max-w-[240px] truncate font-semibold text-slate-900 dark:text-white" title={r.productName}>
                    {r.productName}
                  </td>
                  <td className="py-2.5 px-3">
                    <div>{r.variant}</div>
                    <div className="text-[10px] font-mono text-slate-400">{r.itemCode}</div>
                  </td>
                  <td className="py-2.5 px-3 capitalize">
                    <div>{r.city}</div>
                    <div className="text-[10px] text-slate-400">{r.areaName}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    #{r.storeId}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      r.combo === 'Yes' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'text-slate-400'
                    }`}>
                      {r.combo}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    ₹{r.baseMrp}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {r.unitsSold}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{Math.round(r.gmv).toLocaleString('en-IN')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing page <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> of <strong>{totalPages}</strong> ({sortedRecords.length} records)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 font-bold text-slate-700 dark:text-slate-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
