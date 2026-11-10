import React, { useState } from 'react';
import { 
  Zap, 
  Target, 
  DollarSign, 
  MousePointerClick, 
  Eye, 
  Percent, 
  TrendingUp, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  PieChart,
  FileDown,
  ListOrdered,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { CampaignData } from '../types';
import { getBrandTheme } from '../utils/brandColors';
import { soundEffects } from '../utils/audio';

interface AdsAnalyticsTabProps {
  totalGmv: number;
  totalOrders: number;
  onOpenPdfModal?: () => void;
}

export const AdsAnalyticsTab: React.FC<AdsAnalyticsTabProps> = ({
  totalGmv,
  totalOrders,
  onOpenPdfModal,
}) => {
  // Configurable Ad spend ratio (default 14.5% of GMV)
  const [adSpendPct, setAdSpendPct] = useState<number>(14.5);
  const [adSharePct, setAdSharePct] = useState<number>(42.0); // % of GMV driven by ads

  // Calculated Ads Metrics
  const totalSpend = Math.round(totalGmv * (adSpendPct / 100));
  const adGmv = Math.round(totalGmv * (adSharePct / 100));
  const organicGmv = Math.max(0, totalGmv - adGmv);

  const roas = totalSpend > 0 ? adGmv / totalSpend : 0;
  const blendedRoas = totalSpend > 0 ? totalGmv / totalSpend : 0;
  const acos = adGmv > 0 ? (totalSpend / adGmv) * 100 : 0;
  const tacos = totalGmv > 0 ? (totalSpend / totalGmv) * 100 : 0;

  // Estimated digital interactions
  const avgCpc = 7.40; // ₹7.40 CPC
  const clicks = Math.round(totalSpend / avgCpc);
  const impressions = Math.round(clicks * 32.5); // ~3.08% CTR
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  
  const adOrders = Math.round(totalOrders * (adSharePct / 100));
  const cvr = clicks > 0 ? (adOrders / clicks) * 100 : 0;
  const cpa = adOrders > 0 ? totalSpend / adOrders : 0;

  // Granular Campaign List
  const campaigns: CampaignData[] = [
    {
      campaignId: 'CMP-NAFA-01',
      campaignName: 'NAFA SnapX 360 Tripod Search & Display Blitz',
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
      campaignName: 'averX Pure Organic Neem Wood Comb Category Campaign',
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
      campaignName: 'averX Kitchen Chopper & Disposable Containers',
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

  return (
    <div className="space-y-6">
      
      {/* Overview Banner with Direct PDF Export Call to Action */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-6 h-6 text-amber-300" />
              <h2 className="text-xl font-black tracking-tight">
                Advertising &amp; ROAS Intelligence Engine
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                AI Diagnostic Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Multi-dimensional analysis of Ad Spend, ROAS, ACoS, TACoS, Conversion Funnels and Step-by-Step Optimization Roadmap for peak sales efficiency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
              <span className="text-[10px] text-indigo-200 uppercase font-semibold block">Attributed ROAS</span>
              <span className="text-2xl font-black text-emerald-400">{roas.toFixed(2)}x</span>
            </div>

            {onOpenPdfModal && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenPdfModal();
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span>Export Step-by-Step PDF Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Ads Metric Cards (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Ad Spend */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Ad Spend</span>
            <DollarSign className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-lg font-black text-rose-600 dark:text-rose-400">
            ₹{totalSpend.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400">{adSpendPct}% of Total GMV</span>
        </div>

        {/* Ad GMV */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ad Attributed GMV</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
            ₹{adGmv.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400">{adSharePct}% ad generated</span>
        </div>

        {/* ROAS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Direct ROAS</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
            {roas.toFixed(2)}x
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold">Ad Sales / Spend</span>
        </div>

        {/* ACoS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">ACoS</span>
            <Percent className="w-4 h-4 text-amber-500" />
          </div>
          <div className={`text-lg font-black ${acos <= 32 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
            {acos.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400">Spend / Ad GMV</span>
        </div>

        {/* TACoS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">TACoS</span>
            <Percent className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-lg font-black text-violet-600 dark:text-violet-400">
            {tacos.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400">Spend / Total GMV</span>
        </div>

        {/* Blended ROAS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Blended ROAS</span>
            <TrendingUp className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-lg font-black text-teal-600 dark:text-teal-400">
            {blendedRoas.toFixed(2)}x
          </div>
          <span className="text-[10px] text-slate-400">Total GMV / Spend</span>
        </div>

      </div>

      {/* Traffic & Conversion Performance Metrics (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
            <Eye className="w-3.5 h-3.5 text-blue-500" /> Ad Impressions
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {impressions.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">CPM: ₹{impressions > 0 ? ((totalSpend / impressions) * 1000).toFixed(1) : '0'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
            <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" /> Clicks &amp; CTR
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{clicks.toLocaleString()}</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {ctr.toFixed(2)}% CTR
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Avg CPC: ₹{avgCpc.toFixed(2)}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
            <Target className="w-3.5 h-3.5 text-emerald-500" /> Orders &amp; CVR
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{adOrders}</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {cvr.toFixed(2)}% CVR
            </span>
          </div>
          <span className="text-[11px] text-slate-400">CPA: ₹{cpa.toFixed(1)} / order</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
            <PieChart className="w-3.5 h-3.5 text-violet-500" /> Organic Revenue
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            ₹{Math.round(organicGmv).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400">{(100 - adSharePct).toFixed(0)}% Organic Sales</span>
        </div>
      </div>

      {/* Interactive Ads Sensitivity Simulator */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Interactive Ad Spend &amp; ROAS Sensitivity Simulator
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          {/* Slider 1: Ad Spend % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">
                Ad Spend Ratio (% of GMV):
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold">
                {adSpendPct}% (₹{totalSpend.toLocaleString('en-IN')})
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="0.5"
              value={adSpendPct}
              onChange={(e) => setAdSpendPct(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Conservative (5%)</span>
              <span>Balanced (15%)</span>
              <span>High Growth (35%)</span>
            </div>
          </div>

          {/* Slider 2: Ad Attributed Sales % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">
                Ad Attributed Sales Share:
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold">
                {adSharePct}% (₹{adGmv.toLocaleString('en-IN')})
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              step="1"
              value={adSharePct}
              onChange={(e) => setAdSharePct(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Low (15%)</span>
              <span>Typical (40%)</span>
              <span>High Ad Reliance (70%)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Target ROAS: {roas.toFixed(2)}x (Strong Profitability Index)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>ACoS Efficiency: {acos <= 30 ? 'Highly Efficient (<30%)' : 'Acceptable Range'}</span>
          </div>
        </div>
      </div>

      {/* STEP-BY-STEP STRATEGIC ACTION ROADMAP: BEST RESULTS BLUEPRINT */}
      <div className="bg-gradient-to-br from-indigo-900/10 via-slate-900/5 to-emerald-900/10 dark:from-indigo-950/40 dark:via-slate-900/40 dark:to-emerald-950/40 rounded-3xl border border-indigo-200/80 dark:border-indigo-800/60 p-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-indigo-100 dark:border-indigo-900/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Step-by-Step Strategic Action Roadmap for Best Results (সেরা ফলাফলের জন্য করণীয়)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prioritized execution blueprint designed to elevate ROAS from {roas.toFixed(2)}x to &gt;4.0x while cutting wasted spend by 15-20%.
            </p>
          </div>

          {onOpenPdfModal && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenPdfModal();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 shrink-0 self-start sm:self-auto"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF Action Plan</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                Step 1: Budget Rebalancing
              </span>
              <span className="text-[10px] font-bold text-rose-600">Immediate</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              Reallocate 30% Budget to Top Performers
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Shift spend from high-ACoS (&gt;35%) kitchen gadgets into Tripod &amp; 80W Cable campaigns. Set strict CPC bid caps during off-peak hours (12 AM - 7 AM).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Step 2: Negative Keywords
              </span>
              <span className="text-[10px] font-bold text-indigo-600">Cost Savings</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              Weekly Search Term Negative Audits
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Eliminate non-converting broad search terms with &gt;15 clicks and zero orders to reclaim 15-20% wasted spend. Isolate high-intent queries into exact match.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Step 3: CVR &amp; Combos
              </span>
              <span className="text-[10px] font-bold text-emerald-600">+35% AOV</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              Promote High-Value Combo Bundles
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Drive ads toward product combos (e.g. Tripod + Cable Duo). Multi-pack combos increase Average Order Value without extra CPC, instantly lowering ACoS.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                Step 4: TACoS Guardrail
              </span>
              <span className="text-[10px] font-bold text-sky-600">&lt;12% Target</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              Accelerate Organic Flywheel
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Cap total advertising spend at 10-12% of overall GMV. Use quick-commerce ad bursts to elevate shelf placement and trigger compounding organic reorders.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                Step 5: Dark-Store Geo
              </span>
              <span className="text-[10px] font-bold text-amber-600">Stock Sync</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              Align Ad Spend with Dark-Store Stock
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Pause ads in micro-locations with &lt;5 units of inventory to avoid unfulfillable clicks. Concentrate 65%+ ad spend in top GMV hubs (Bangalore, Mumbai, Delhi).
            </p>
          </div>

          {/* Target Matrix Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 block mb-1">
                30-Day Growth Objective
              </span>
              <h4 className="text-sm font-black mb-1">
                Target ROAS: 3.80x - 4.50x
              </h4>
              <p className="text-[11px] text-indigo-100/90 leading-relaxed">
                By executing these 5 steps, target ACoS drops from {acos.toFixed(1)}% to &lt;24%, adding substantial net profits to the bottom line.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-bold">
              <span>All 5 steps printed in PDF</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
          </div>

        </div>
      </div>

      {/* Granular Campaign Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Active Campaign Performance Breakdown &amp; Action Matrix
          </h3>
          <span className="text-xs text-slate-400">
            {campaigns.length} campaigns audited against target ACoS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Campaign Name &amp; ID</th>
                <th className="py-3 px-3">Brand</th>
                <th className="py-3 px-3">Ad Spend</th>
                <th className="py-3 px-3">Ad GMV</th>
                <th className="py-3 px-3">ROAS</th>
                <th className="py-3 px-3">ACoS vs Target</th>
                <th className="py-3 px-3">Orders &amp; CVR</th>
                <th className="py-3 px-3">Clicks &amp; CTR</th>
                <th className="py-3 px-3">Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {campaigns.map((c) => {
                const cmpRoas = c.spend > 0 ? (c.adSales / c.spend).toFixed(2) : '0';
                const cmpAcos = c.adSales > 0 ? ((c.spend / c.adSales) * 100).toFixed(1) : '0';
                const cmpCtr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : '0';
                const cmpCvr = c.clicks > 0 ? ((c.adOrders / c.clicks) * 100).toFixed(2) : '0';
                const brandTheme = getBrandTheme(c.brand);
                const isUnderTarget = Number(cmpAcos) <= c.targetAcos;

                return (
                  <tr key={c.campaignId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{c.campaignName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.campaignId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-white shadow-xs"
                        style={{ backgroundColor: brandTheme.hex }}
                      >
                        {c.brand}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-rose-600 dark:text-rose-400">
                      ₹{c.spend.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{c.adSales.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 font-black text-indigo-600 dark:text-indigo-400">
                      {cmpRoas}x
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isUnderTarget ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}>
                        {cmpAcos}% (Goal {c.targetAcos}%)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      <div>{c.adOrders} orders</div>
                      <div className="text-[10px] text-slate-400">{cmpCvr}% CVR</div>
                    </td>
                    <td className="py-3 px-3">
                      <div>{c.clicks.toLocaleString()} clicks</div>
                      <div className="text-[10px] text-slate-400">{cmpCtr}% CTR</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold block text-center ${
                        c.status?.includes('Scale') 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : c.status?.includes('Maintain')
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {c.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
