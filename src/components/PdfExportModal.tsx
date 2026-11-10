import React, { useState } from 'react';
import { 
  X, 
  FileDown, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp, 
  Sliders,
  ListOrdered,
  Award
} from 'lucide-react';
import { SaleRecord, BrandMetricSummary, AdsMetricsSummary, CampaignData } from '../types';
import { generatePdfReport } from '../utils/pdfGenerator';
import { soundEffects } from '../utils/audio';
import { getSampleRecords } from '../data/initialData';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail: string;
  records: SaleRecord[];
  brandMetrics: BrandMetricSummary[];
  activeBrand?: string;
  dateRangeStr?: string;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  defaultEmail,
  records,
  brandMetrics,
  activeBrand,
  dateRangeStr,
}) => {
  const [reporterEmail, setReporterEmail] = useState<string>(defaultEmail || 'mdmanir179@gmail.com');
  const [adSpendPct, setAdSpendPct] = useState<number>(14.5);
  const [adSharePct, setAdSharePct] = useState<number>(42.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Use provided records or realistic fallback records if dataset is currently unpopulated
  const effectiveRecords = records.length > 0 ? records : getSampleRecords();

  const totalGmv = effectiveRecords.reduce((acc, r) => acc + r.gmv, 0);
  const totalOrders = effectiveRecords.length;
  const totalSpend = Math.round(totalGmv * (adSpendPct / 100));
  const adGmv = Math.round(totalGmv * (adSharePct / 100));
  const organicGmv = Math.max(0, totalGmv - adGmv);

  const roas = totalSpend > 0 ? adGmv / totalSpend : 0;
  const blendedRoas = totalSpend > 0 ? totalGmv / totalSpend : 0;
  const acos = adGmv > 0 ? (totalSpend / adGmv) * 100 : 0;
  const tacos = totalGmv > 0 ? (totalSpend / totalGmv) * 100 : 0;

  const avgCpc = 7.40;
  const clicks = Math.round(totalSpend / avgCpc);
  const impressions = Math.round(clicks * 32.5);
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const adOrders = Math.round(totalOrders * (adSharePct / 100));
  const cvr = clicks > 0 ? (adOrders / clicks) * 100 : 0;
  const cpa = adOrders > 0 ? totalSpend / adOrders : 0;

  const campaigns: CampaignData[] = [
    {
      campaignId: 'CMP-NAFA-01',
      campaignName: 'NAFA SnapX 360 Tripod Search & Display Ads',
      brand: 'nafa',
      spend: Math.round(totalSpend * 0.44),
      impressions: Math.round(impressions * 0.43),
      clicks: Math.round(clicks * 0.45),
      adSales: Math.round(adGmv * 0.49),
      adOrders: Math.round(adOrders * 0.47),
      targetAcos: 25.0,
      status: 'Top Performer - Scale'
    },
    {
      campaignId: 'CMP-NAFA-02',
      campaignName: 'NAFA 6A 80W Type-C Cables Quick Commerce Ads',
      brand: 'nafa',
      spend: Math.round(totalSpend * 0.26),
      impressions: Math.round(impressions * 0.28),
      clicks: Math.round(clicks * 0.26),
      adSales: Math.round(adGmv * 0.23),
      adOrders: Math.round(adOrders * 0.25),
      targetAcos: 28.0,
      status: 'Profitable - Maintain'
    },
    {
      campaignId: 'CMP-AVRX-01',
      campaignName: 'averX Pure Organic Neem Wood Comb Grooming Ads',
      brand: 'averx',
      spend: Math.round(totalSpend * 0.18),
      impressions: Math.round(impressions * 0.17),
      clicks: Math.round(clicks * 0.17),
      adSales: Math.round(adGmv * 0.17),
      adOrders: Math.round(adOrders * 0.16),
      targetAcos: 30.0,
      status: 'Stable - Target Optimization'
    },
    {
      campaignId: 'CMP-AVRX-02',
      campaignName: 'averX 900ml Kitchen Chopper & Tray Promotions',
      brand: 'averx',
      spend: Math.round(totalSpend * 0.12),
      impressions: Math.round(impressions * 0.12),
      clicks: Math.round(clicks * 0.12),
      adSales: Math.round(adGmv * 0.11),
      adOrders: Math.round(adOrders * 0.12),
      targetAcos: 28.0,
      status: 'Optimize - High ACoS Risk'
    }
  ];

  const adsMetrics: AdsMetricsSummary = {
    totalSpend,
    adGmv,
    organicGmv,
    roas,
    blendedRoas,
    acos,
    tacos,
    impressions,
    clicks,
    ctr,
    cpc: avgCpc,
    adOrders,
    cvr,
    cpa,
    adSpendPct,
    adSharePct,
    campaigns
  };

  const handleDownload = () => {
    soundEffects.playClick();
    setIsGenerating(true);
    setSuccess(false);

    try {
      generatePdfReport({
        userEmail: reporterEmail.trim() || 'mdmanir179@gmail.com',
        brandMetrics,
        adsMetrics,
        records: effectiveRecords,
        activeBrandFilter: activeBrand,
        dateRangeStr,
        adSpendPct,
        adSharePct
      });
      setSuccess(true);
      setTimeout(() => {
        setIsGenerating(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('PDF generation error:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <FileDown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Executive Ads Analysis &amp; Sales PDF Report</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Step-by-Step Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Generates an executive 3-page PDF with comprehensive funnel diagnosis, campaign audit, and actionable strategic roadmap.
            </p>
          </div>
        </div>

        {/* Step-by-Step Sections Included (Requirement 1 & 2) */}
        <div className="mt-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 text-xs font-bold mb-2">
            <ListOrdered className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>5-Step Sequential Report Structure (প্রতিটি স্টেপ বিস্তারিত উল্লেখিত থাকবে):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
              <span><strong>Step 1 &amp; 2:</strong> Macro Ads ROAS &amp; Full-Funnel Diagnostics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-violet-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
              <span><strong>Complete Catalog:</strong> 100% of NAFA &amp; averX Products (All SKUs)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
              <span><strong>Step 3 &amp; 4:</strong> Active Campaigns &amp; Brand Attribution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
              <span><strong>Step 5:</strong> Strategic Optimization Roadmap (সেরা ফলাফলের করণীয়)</span>
            </div>
          </div>
        </div>

        {/* Live Ads Calculation Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Ad Spend</span>
            <span className="text-sm font-black text-rose-600 dark:text-rose-400">₹{totalSpend.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block">{adSpendPct}% of GMV</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Ad Attributed Sales</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{adGmv.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block">{adSharePct}% ad share</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Projected ROAS</span>
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{roas.toFixed(2)}x</span>
            <span className="text-[10px] text-emerald-500 font-semibold block">Blended: {blendedRoas.toFixed(2)}x</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">ACoS / TACoS</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{acos.toFixed(1)}%</span>
            <span className="text-[10px] text-slate-400 block">TACoS: {tacos.toFixed(1)}%</span>
          </div>
        </div>

        {/* Ad Spend & Revenue Share Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 mb-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Ad Spend Ratio:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{adSpendPct}% of GMV</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="0.5"
              value={adSpendPct}
              onChange={(e) => setAdSpendPct(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Ad Attributed Sales:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{adSharePct}% of GMV</span>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              step="1"
              value={adSharePct}
              onChange={(e) => setAdSharePct(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-1.5"
            />
          </div>
        </div>

        {/* Reporter Email Input */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 mb-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>Verified Author / Reporter Email (Stamped onto all pages):</span>
          </label>
          <input
            type="email"
            value={reporterEmail}
            onChange={(e) => setReporterEmail(e.target.value)}
            placeholder="e.g. bizdev06.tbc@gmail.com"
            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Dataset status banner */}
        {records.length === 0 && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Award className="w-4 h-4 shrink-0" />
            <span>Generating report using validated Instamart sample catalog benchmark data (upload your Excel anytime to reflect custom transaction rows).</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Compiling Step-by-Step PDF Report...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Generate Step-by-Step PDF Report</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
