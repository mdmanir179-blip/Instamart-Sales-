import { SaleRecord } from '../types';

export function parseCSV(csvText: string): SaleRecord[] {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const records: SaleRecord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.startsWith(',,,,')) continue;
    
    // Regex to parse comma-separated fields with quoted values
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    
    while ((match = regex.exec(line)) !== null) {
      let val = match[1] ?? '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val.trim());
      if (regex.lastIndex === line.length) break;
    }

    if (matches.length >= 14) {
      const brand = (matches[0] || 'Unknown').toLowerCase();
      const orderedDate = matches[1] || '2026-08-01';
      const city = (matches[2] || 'Unknown').toLowerCase();
      const areaName = (matches[3] || 'Unknown').toLowerCase();
      const storeId = matches[4] || 'N/A';
      const l1Category = (matches[5] || 'General').toLowerCase();
      const l2Category = (matches[6] || 'General').toLowerCase();
      const l3Category = (matches[7] || 'General').toLowerCase();
      const productName = matches[8] || 'Product';
      const variant = matches[9] || 'Standard';
      const itemCode = matches[10] || 'SKU';
      const combo = matches[11] || 'No';
      const baseMrp = parseFloat(matches[12]) || 0;
      const unitsSold = parseInt(matches[13], 10) || 1;
      const gmv = parseFloat(matches[14]) || (baseMrp * unitsSold);

      records.push({
        id: `rec-${i}-${Date.now().toString(36)}`,
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
        combo: combo.toLowerCase() === 'yes' ? 'Yes' : 'No',
        baseMrp,
        unitsSold,
        gmv
      });
    }
  }

  return records;
}

// Initial state is empty as requested ("excel sheet ar demo data gulo remove koro")
export const INITIAL_SALES_DATA: SaleRecord[] = [];

export function getSampleRecords(): SaleRecord[] {
  const records: SaleRecord[] = [];
  const cities = [
    { city: 'bangalore', areas: ['koramangala', 'indiranagar', 'hsr layout', 'whitefield'] },
    { city: 'mumbai', areas: ['andheri west', 'bandra', 'powai', 'malad'] },
    { city: 'delhi', areas: ['saket', 'connaught place', 'south extension', 'rohini'] },
    { city: 'hyderabad', areas: ['hitech city', 'jubilee hills', 'gachibowli', 'kondapur'] },
    { city: 'kolkata', areas: ['salt lake', 'new town', 'ballygunge', 'alipore'] },
    { city: 'pune', areas: ['kothrud', 'viman nagar', 'baner', 'hinjewadi'] }
  ];

  const products = [
    { brand: 'nafa', name: 'NAFA SnapX 360 Tripod & Stand', code: 'NF-TRI-01', l1: 'Electronics', l2: 'Mobile Accessories', l3: 'Tripods', mrp: 999, combo: 'No' },
    { brand: 'nafa', name: 'NAFA 6A 80W Type-C SuperFast Cable', code: 'NF-CAB-80', l1: 'Electronics', l2: 'Cables & Chargers', l3: 'Type C Cables', mrp: 349, combo: 'No' },
    { brand: 'nafa', name: 'NAFA MagGrip Magnetic Car Mount', code: 'NF-CAR-02', l1: 'Electronics', l2: 'Car Accessories', l3: 'Phone Mounts', mrp: 799, combo: 'No' },
    { brand: 'nafa', name: 'NAFA Dual Port 20W PD Charger', code: 'NF-CHG-20', l1: 'Electronics', l2: 'Cables & Chargers', l3: 'Fast Chargers', mrp: 699, combo: 'No' },
    { brand: 'nafa', name: 'NAFA SnapX Tripod + Dual Cable Combo', code: 'NF-CMB-01', l1: 'Electronics', l2: 'Value Combos', l3: 'Combos', mrp: 1399, combo: 'Yes' },
    { brand: 'averx', name: 'averX Pure Organic Neem Wood Comb', code: 'AV-COMB-01', l1: 'Personal Care', l2: 'Hair Grooming', l3: 'Wooden Combs', mrp: 249, combo: 'No' },
    { brand: 'averx', name: 'averX 900ml Rapid Kitchen Chopper', code: 'AV-CHOP-01', l1: 'Home & Kitchen', l2: 'Kitchen Tools', l3: 'Manual Choppers', mrp: 499, combo: 'No' },
    { brand: 'averx', name: 'averX Biodegradable Meal Trays 25-Pack', code: 'AV-TRAY-25', l1: 'Home & Kitchen', l2: 'Disposables', l3: 'Food Containers', mrp: 329, combo: 'No' },
    { brand: 'averx', name: 'averX Silicone Spatula 3-Piece Set', code: 'AV-SPAT-03', l1: 'Home & Kitchen', l2: 'Cookware Utensils', l3: 'Spatulas', mrp: 399, combo: 'No' },
    { brand: 'averx', name: 'averX Neem Comb + Bamboo Toothbrush Duo', code: 'AV-CMB-02', l1: 'Personal Care', l2: 'Eco Bundles', l3: 'Combos', mrp: 429, combo: 'Yes' }
  ];

  let idCounter = 1;
  const dates = ['2026-08-05', '2026-08-12', '2026-08-18', '2026-08-25', '2026-09-02', '2026-09-10', '2026-09-18', '2026-09-28', '2026-10-05', '2026-10-14', '2026-10-22', '2026-11-02'];

  for (const date of dates) {
    for (const prod of products) {
      for (let cIdx = 0; cIdx < 3; cIdx++) {
        const cityObj = cities[(idCounter + cIdx) % cities.length];
        const area = cityObj.areas[idCounter % cityObj.areas.length];
        const storeId = `STR-${cityObj.city.substring(0, 3).toUpperCase()}-${101 + (idCounter % 8)}`;
        const unitsSold = 1 + ((idCounter * 7) % 8);
        const gmv = unitsSold * prod.mrp;

        records.push({
          id: `sample-${idCounter}`,
          brand: prod.brand,
          orderedDate: date,
          city: cityObj.city,
          areaName: area,
          storeId,
          l1Category: prod.l1.toLowerCase(),
          l2Category: prod.l2.toLowerCase(),
          l3Category: prod.l3.toLowerCase(),
          productName: prod.name,
          variant: 'Standard Retail Pack',
          itemCode: prod.code,
          combo: prod.combo as 'Yes' | 'No',
          baseMrp: prod.mrp,
          unitsSold,
          gmv
        });
        idCounter++;
      }
    }
  }

  return records;
}

