export interface SaleRecord {
  id: string;
  brand: string;
  orderedDate: string; // YYYY-MM-DD
  city: string;
  areaName: string;
  storeId: string;
  l1Category: string;
  l2Category: string;
  l3Category: string;
  productName: string;
  variant: string;
  itemCode: string;
  combo: string; // 'Yes' | 'No'
  baseMrp: number;
  unitsSold: number;
  gmv: number;
}

export interface FilterState {
  searchQuery: string;
  brand: string; // '' for all
  dateRange: {
    start: string;
    end: string;
  };
  city: string;
  areaName: string;
  storeId: string;
  l1Category: string;
  l2Category: string;
  l3Category: string;
  productName: string;
  combo: string; // '' | 'Yes' | 'No'
  minMrp?: number;
  maxMrp?: number;
}

export interface BrandMetricSummary {
  brand: string;
  totalGMV: number;
  totalUnits: number;
  ordersCount: number;
  asp: number; // Average Selling Price (GMV / Units)
  aov: number; // Average Order Value (GMV / Orders)
  comboUnits: number;
  comboShare: number; // Percentage
  topCity: string;
  topProduct: string;
  color: string;
  momGrowth?: number; // Month-over-month growth %
}

export interface AdsMetricsSummary {
  totalSpend: number;
  adGmv: number;
  organicGmv: number;
  roas: number; // adGmv / totalSpend
  blendedRoas: number; // totalGmv / totalSpend
  acos: number; // (totalSpend / adGmv) * 100
  tacos: number; // (totalSpend / totalGmv) * 100
  impressions: number;
  clicks: number;
  ctr: number; // (clicks / impressions) * 100
  cpc: number; // totalSpend / clicks
  adOrders: number;
  cvr: number; // (adOrders / clicks) * 100
  cpa?: number; // totalSpend / adOrders
  adSpendPct?: number;
  adSharePct?: number;
  campaigns?: CampaignData[];
}

export interface CampaignData {
  campaignId: string;
  campaignName: string;
  brand: string;
  spend: number;
  impressions: number;
  clicks: number;
  adSales: number;
  adOrders: number;
  targetAcos: number;
  status?: string;
  cpc?: number;
  ctr?: number;
  roas?: number;
  acos?: number;
  cvr?: number;
  cpa?: number;
}
