import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Music, 
  Sparkles,
  Volume2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { SaleRecord } from '../types';
import { soundEffects } from '../utils/audio';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (newRecords: SaleRecord[], sourceName: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ count: number; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessInfo(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!jsonData || jsonData.length === 0) {
        throw new Error('The uploaded file contains no data rows.');
      }

      // Map fields flexibly
      const parsedRecords: SaleRecord[] = jsonData.map((row, idx) => {
        const getVal = (keys: string[]): any => {
          for (const k of keys) {
            const rowKeys = Object.keys(row);
            const found = rowKeys.find(rk => rk.toLowerCase().replace(/[^a-z0-9]/g, '') === k.toLowerCase().replace(/[^a-z0-9]/g, ''));
            if (found && row[found] !== undefined && row[found] !== '') {
              return row[found];
            }
          }
          return '';
        };

        const brand = String(getVal(['brand']) || 'Unknown').trim().toLowerCase();
        const orderedDate = String(getVal(['ordereddate', 'date', 'orderdate']) || new Date().toISOString().split('T')[0]).trim();
        const city = String(getVal(['city']) || 'Unknown').trim().toLowerCase();
        const areaName = String(getVal(['areaname', 'area']) || 'Unknown').trim().toLowerCase();
        const storeId = String(getVal(['storeid', 'store']) || 'N/A').trim();
        const l1Category = String(getVal(['l1category', 'category1', 'l1']) || 'General').trim().toLowerCase();
        const l2Category = String(getVal(['l2category', 'category2', 'l2']) || 'General').trim().toLowerCase();
        const l3Category = String(getVal(['l3category', 'category3', 'l3']) || 'General').trim().toLowerCase();
        const productName = String(getVal(['productname', 'product', 'itemname']) || `Product ${idx + 1}`).trim();
        const variant = String(getVal(['variant', 'size', 'pack']) || 'Standard').trim();
        const itemCode = String(getVal(['itemcode', 'sku', 'code']) || `SKU-${idx + 1}`).trim();
        const comboVal = String(getVal(['combo', 'iscombo']) || 'No').trim();
        const baseMrp = parseFloat(String(getVal(['basemrp', 'mrp', 'price']) || 0)) || 0;
        const unitsSold = parseInt(String(getVal(['unitssold', 'units', 'quantity', 'qty']) || 1), 10) || 1;
        const gmvVal = parseFloat(String(getVal(['gmv', 'revenue', 'totalsales']) || 0));
        const gmv = gmvVal > 0 ? gmvVal : (baseMrp * unitsSold);

        return {
          id: `upload-${idx}-${Date.now().toString(36)}`,
          brand,
          orderedDate,
          city,
          areaName,
          storeId,
          l1Category,
          l2Category,
          l3Category,
          productName,
          variant,
          itemCode,
          combo: comboVal.toLowerCase() === 'yes' ? 'Yes' : 'No',
          baseMrp,
          unitsSold,
          gmv
        };
      });

      const validRecords = parsedRecords.filter(r => r.gmv > 0 || r.unitsSold > 0);

      if (validRecords.length === 0) {
        throw new Error('Could not identify valid sales rows. Please ensure columns include BRAND, PRODUCT_NAME, UNITS_SOLD, GMV.');
      }

      // Play victory music chime
      soundEffects.playVictoryChime();

      setSuccessInfo({
        count: validRecords.length,
        name: file.name
      });

      setTimeout(() => {
        onDataLoaded(validRecords, file.name);
        onClose();
      }, 1200);

    } catch (err: any) {
      console.error('File parsing error:', err);
      setErrorMsg(err.message || 'Failed to parse Excel file. Please verify file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const testMusicChime = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playVictoryChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Upload Sales Report (Excel / CSV)
            </h3>
            <p className="text-xs text-slate-400">
              Upload .xlsx, .xls or .csv to update entire dashboard and trigger music chime
            </p>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
              : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
            Click to browse or drag &amp; drop spreadsheet here
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Supports Microsoft Excel (.xlsx, .xls) and CSV format
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60">
            <Music className="w-3.5 h-3.5" />
            <span>Celebratory music chime plays automatically on completion</span>
            <button 
              onClick={testMusicChime}
              className="ml-1 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-colors"
            >
              Test Music
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {isProcessing && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Processing and calculating report metrics...</span>
          </div>
        )}

        {successInfo && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <span>Successfully imported {successInfo.count} rows from {successInfo.name}!</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Expected Format Tip */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">Expected Header Columns:</span>
          <p className="font-mono text-[10px] text-slate-600 dark:text-slate-400 break-words">
            BRAND, ORDERED DATE, CITY, AREA NAME, STORE ID, L1 CATEGORY, L2 CATEGORY, L3 CATEGORY, PRODUCT NAME, VARIANT, ITEM CODE, COMBO, BASE_MRP, UNITS_SOLD, GMV
          </p>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium">
            Ready to parse and calculate metrics
          </span>

          <button
            onClick={testMusicChime}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Sound Check</span>
          </button>
        </div>

      </div>
    </div>
  );
};
