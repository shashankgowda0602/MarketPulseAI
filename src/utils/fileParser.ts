import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Campaign, PlatformType, DailyDataPoint } from '../types';

export interface ColumnMappingConfidence {
  field: keyof Campaign;
  mappedHeader: string | null;
  confidence: 'Exact' | 'Fuzzy' | 'Default' | 'None';
}

export interface TrajectoryPoint {
  period: string;
  spend: number;
  revenue: number;
  roas: number;
}

export interface ParsedFileReport {
  fileName: string;
  fileSize: number;
  fileSizeBytesText: string;
  format: 'CSV' | 'XLSX' | 'XLS' | 'JSON';
  totalRawRows: number;
  validCampaignRows: number;
  detectedHeaders: string[];
  fieldMappings: Record<string, string>;
  mappingConfidence: ColumnMappingConfidence[];
  cleaningActions: string[];
  qualityScore: number;
  totalSpend: number;
  totalRevenue: number;
  blendedRoas: number;
  winningCount: number;
  underperformingCount: number;
  parsedAt: string;
  trajectory?: TrajectoryPoint[];
}

// Synonyms dictionary for flexible column mapping
const HEADER_SYNONYMS: Record<string, string[]> = {
  name: ['campaign', 'campaign name', 'campaign_name', 'campaignname', 'ad set', 'adset', 'ad set name', 'ad name', 'ad_name', 'title', 'utm_campaign', 'name', 'campaign_title'],
  platform: ['platform', 'channel', 'source', 'utm_source', 'publisher', 'network', 'media', 'media type', 'ad network', 'placement'],
  campaignType: ['campaign type', 'type', 'campaigntype', 'objective', 'goal', 'funnel stage', 'strategy', 'ad format', 'format'],
  spend: ['spend', 'ad spend', 'adspend', 'cost', 'total cost', 'amount spent', 'investment', 'budget spent', 'spent', 'actual spend'],
  revenue: ['revenue', 'sales', 'conversion value', 'conv value', 'total revenue', 'income', 'value', 'gross sales', 'purchase value', 'returns', 'sales value'],
  impressions: ['impressions', 'impr', 'views', 'impressions count', 'exposures', 'ad impressions', 'total impressions'],
  reach: ['reach', 'unique users', 'unique impressions', 'unique audience', 'audience reach', 'people reached'],
  clicks: ['clicks', 'link clicks', 'ad clicks', 'total clicks', 'visits', 'sessions', 'website clicks'],
  conversions: ['conversions', 'conv', 'purchases', 'leads', 'orders', 'transactions', 'acquisitions', 'goals', 'results', 'total conversions', 'actions'],
  budget: ['budget', 'allocated budget', 'target budget', 'monthly budget', 'daily budget', 'planned spend', 'total budget'],
  startDate: ['start date', 'start_date', 'start', 'date', 'created_at', 'launch date', 'period start', 'from date', 'start day'],
  endDate: ['end date', 'end_date', 'end', 'until', 'close date', 'expiry', 'period end', 'to date', 'end day'],
  audience: ['audience', 'target audience', 'target', 'segment', 'demographic', 'persona', 'targeting', 'custom audience'],
  region: ['region', 'location', 'geo', 'geography', 'country', 'city', 'market', 'area', 'territory', 'target region'],
  id: ['id', 'campaign id', 'campaign_id', 'cid', 'code', 'identifier', 'ad_id'],
};

// Platform normalizer (normalizes standard ones and cleanly formats custom platforms)
export function normalizePlatform(raw: any): PlatformType {
  if (!raw) return 'Google Ads';
  const str = String(raw).trim();
  const lower = str.toLowerCase();
  if (lower.includes('google') || lower.includes('adwords') || lower.includes('gads') || lower.includes('search') || lower.includes('pmax')) {
    return 'Google Ads';
  }
  if (lower.includes('meta') || lower.includes('facebook') || lower.includes('fb')) {
    return 'Meta Ads';
  }
  if (lower.includes('instagram') || lower.includes('insta') || lower.includes('ig') || lower.includes('reels')) {
    return 'Instagram';
  }
  if (lower.includes('linkedin') || lower.includes('li') || lower.includes('b2b')) {
    return 'LinkedIn';
  }
  if (lower.includes('youtube') || lower.includes('yt') || lower.includes('video')) {
    return 'YouTube';
  }
  if (lower.includes('email') || lower.includes('newsletter') || lower.includes('klaviyo') || lower.includes('mailchimp')) {
    return 'Email';
  }
  if (lower.includes('tiktok') || lower.includes('tik tok')) {
    return 'TikTok';
  }
  if (lower.includes('pinterest') || lower.includes('pin')) {
    return 'Pinterest';
  }
  if (lower.includes('twitter') || lower === 'x' || lower.includes('x ads')) {
    return 'X / Twitter';
  }
  if (lower.includes('snapchat') || lower.includes('snap')) {
    return 'Snapchat';
  }
  if (lower.includes('amazon')) {
    return 'Amazon Ads';
  }
  // If unrecognized platform name, preserve clean capitalized string
  return (str.charAt(0).toUpperCase() + str.slice(1)) as PlatformType;
}

// Clean number strings (handles ₹, $, €, commas, spaces, parenthesis)
export function sanitizeNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return isNaN(value) ? defaultValue : value;
  
  const str = String(value).trim();
  if (str === '' || str.toLowerCase() === 'nan' || str.toLowerCase() === 'null') return defaultValue;
  
  // Remove currency signs, commas, spaces, %
  const cleaned = str.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? defaultValue : Math.max(0, parsed);
}

function findMatchingHeader(headers: string[], targetField: string): { header: string | null; confidence: 'Exact' | 'Fuzzy' | 'Default' | 'None' } {
  const normalizedTarget = targetField.toLowerCase();
  
  // 1. Exact match
  for (const h of headers) {
    const nh = h.trim().toLowerCase();
    if (nh === normalizedTarget) {
      return { header: h, confidence: 'Exact' };
    }
  }

  // 2. Synonyms match
  const synonyms = HEADER_SYNONYMS[targetField] || [];
  for (const syn of synonyms) {
    for (const h of headers) {
      const nh = h.trim().toLowerCase();
      if (nh === syn) {
        return { header: h, confidence: 'Exact' };
      }
    }
  }

  // 3. Partial inclusion match
  for (const syn of synonyms) {
    for (const h of headers) {
      const nh = h.trim().toLowerCase();
      if (nh.includes(syn) || syn.includes(nh)) {
        return { header: h, confidence: 'Fuzzy' };
      }
    }
  }

  return { header: null, confidence: 'None' };
}

// Generate realistic synthetic daily breakdown for time-series charts
function generateSyntheticDailyBreakdown(spend: number, revenue: number, impressions: number, clicks: number, conversions: number): DailyDataPoint[] {
  const days = 14;
  const history: DailyDataPoint[] = [];
  const baseDate = new Date(2026, 7, 15); // Aug 15 2026

  let remainingSpend = spend;
  let remainingRev = revenue;
  let remainingImp = impressions;
  let remainingClicks = clicks;
  let remainingConv = conversions;

  for (let d = 0; d < days; d++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + d);
    const dateStr = curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const isLast = d === days - 1;
    // Small natural variance factor between 0.8 and 1.2
    const factor = isLast ? 1 : 0.85 + Math.sin(d * 1.5) * 0.2 + (Math.random() * 0.1);
    const portion = isLast ? 1 : 1 / days;

    const daySpend = isLast ? Math.max(0, remainingSpend) : Math.round((spend * portion) * factor);
    const dayRev = isLast ? Math.max(0, remainingRev) : Math.round((revenue * portion) * factor * (1 + (d * 0.02)));
    const dayImp = isLast ? Math.max(0, remainingImp) : Math.round((impressions * portion) * factor);
    const dayClicks = isLast ? Math.max(0, remainingClicks) : Math.round((clicks * portion) * factor);
    const dayConv = isLast ? Math.max(0, remainingConv) : Math.round((conversions * portion) * factor);

    remainingSpend -= daySpend;
    remainingRev -= dayRev;
    remainingImp -= dayImp;
    remainingClicks -= dayClicks;
    remainingConv -= dayConv;

    history.push({
      date: dateStr,
      spend: Math.max(0, daySpend),
      revenue: Math.max(0, dayRev),
      impressions: Math.max(0, dayImp),
      clicks: Math.max(0, dayClicks),
      conversions: Math.max(0, dayConv),
    });
  }

  return history;
}

export function parseRawFileContent(
  content: string | ArrayBuffer,
  fileName: string,
  fileSize: number
): { campaigns: Campaign[]; report: ParsedFileReport } {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const cleaningActions: string[] = [];
  let rawRows: any[] = [];
  let detectedHeaders: string[] = [];
  let format: 'CSV' | 'XLSX' | 'XLS' | 'JSON' = 'CSV';

  // 1. Parse based on file type
  if (extension === 'json') {
    format = 'JSON';
    try {
      const text = typeof content === 'string' ? content : new TextDecoder().decode(content);
      const parsedJson = JSON.parse(text);
      if (Array.isArray(parsedJson)) {
        rawRows = parsedJson;
      } else if (parsedJson && typeof parsedJson === 'object') {
        // Find first array property
        const arrayKey = Object.keys(parsedJson).find((k) => Array.isArray(parsedJson[k]));
        if (arrayKey) {
          rawRows = parsedJson[arrayKey];
          cleaningActions.push(`Extracted array from JSON object property "${arrayKey}"`);
        } else {
          rawRows = [parsedJson];
        }
      }
      if (rawRows.length > 0) {
        detectedHeaders = Object.keys(rawRows[0] || {});
      }
    } catch (e: any) {
      throw new Error(`Invalid JSON file format: ${e?.message || 'Could not parse JSON'}`);
    }
  } else if (extension === 'xlsx' || extension === 'xls') {
    format = extension === 'xlsx' ? 'XLSX' : 'XLS';
    try {
      const data = typeof content === 'string' ? new TextEncoder().encode(content) : new Uint8Array(content);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      if (rawRows.length > 0) {
        detectedHeaders = Object.keys(rawRows[0] || {});
      }
      cleaningActions.push(`Extracted sheet "${firstSheetName}" with ${rawRows.length} rows`);
    } catch (e: any) {
      throw new Error(`Excel parsing error: ${e?.message || 'Invalid spreadsheet file'}`);
    }
  } else {
    // CSV / TSV / Delimited text
    format = 'CSV';
    const text = typeof content === 'string' ? content : new TextDecoder().decode(content);
    const parsedCsv = Papa.parse(text, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: false,
    });

    rawRows = parsedCsv.data as any[];
    detectedHeaders = parsedCsv.meta.fields || (rawRows[0] ? Object.keys(rawRows[0]) : []);
  }

  if (!rawRows || rawRows.length === 0) {
    throw new Error('No campaign rows could be detected in the uploaded file.');
  }

  // 2. Map fields dynamically
  const fieldKeys: (keyof Campaign)[] = [
    'id',
    'name',
    'platform',
    'campaignType',
    'spend',
    'revenue',
    'impressions',
    'reach',
    'clicks',
    'conversions',
    'budget',
    'startDate',
    'endDate',
    'audience',
    'region',
  ];

  const fieldMappings: Record<string, string> = {};
  const mappingConfidence: ColumnMappingConfidence[] = [];

  fieldKeys.forEach((fKey) => {
    const match = findMatchingHeader(detectedHeaders, fKey);
    if (match.header) {
      fieldMappings[fKey] = match.header;
      mappingConfidence.push({ field: fKey, mappedHeader: match.header, confidence: match.confidence });
    } else {
      mappingConfidence.push({ field: fKey, mappedHeader: null, confidence: 'Default' });
    }
  });

  // 3. Transform rows into canonical Campaign objects
  const parsedCampaigns: Campaign[] = [];
  let currencyStringSanitizedCount = 0;
  let idGeneratedCount = 0;

  rawRows.forEach((row, idx) => {
    const getVal = (fKey: string): any => {
      const header = fieldMappings[fKey];
      if (header && row[header] !== undefined) return row[header];
      return row[fKey];
    };

    const rawName = getVal('name');
    const name = rawName ? String(rawName).trim() : `Uploaded Campaign #${idx + 1}`;

    const rawPlatform = getVal('platform');
    const platform = normalizePlatform(rawPlatform);

    const rawSpend = getVal('spend');
    const rawRevenue = getVal('revenue');
    const rawImp = getVal('impressions');
    const rawClicks = getVal('clicks');
    const rawConv = getVal('conversions');
    const rawBudget = getVal('budget');
    const rawReach = getVal('reach');

    if (typeof rawSpend === 'string' && (rawSpend.includes('₹') || rawSpend.includes('$') || rawSpend.includes('€') || rawSpend.includes(','))) {
      currencyStringSanitizedCount++;
    }

    const spend = sanitizeNumber(rawSpend, 30000);
    const revenue = sanitizeNumber(rawRevenue, spend > 0 ? spend * 2.2 : 65000);
    const clicks = Math.round(sanitizeNumber(rawClicks, spend > 0 ? Math.round(spend / 4.5) : 5000));
    const impressions = Math.round(sanitizeNumber(rawImp, clicks > 0 ? clicks * 28 : 140000));
    const conversions = Math.round(sanitizeNumber(rawConv, clicks > 0 ? Math.max(1, Math.round(clicks * 0.035)) : 150));
    const reach = Math.round(sanitizeNumber(rawReach, Math.round(impressions * 0.78)));
    const budget = Math.round(sanitizeNumber(rawBudget, Math.round(spend * 1.2)));

    const rawId = getVal('id');
    let id = rawId ? String(rawId).trim() : '';
    if (!id || id === 'undefined' || id === 'null') {
      id = `UPL-${idx + 1}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      idGeneratedCount++;
    }

    const campaignType = getVal('campaignType') ? String(getVal('campaignType')).trim() : `${platform} Performance`;
    const startDate = getVal('startDate') ? String(getVal('startDate')).trim() : '2026-08-01';
    const endDate = getVal('endDate') ? String(getVal('endDate')).trim() : '2026-08-28';
    const audience = getVal('audience') ? String(getVal('audience')).trim() : 'Targeted Shoppers';
    const region = getVal('region') ? String(getVal('region')).trim() : 'Pan-India & Metros';

    const dailyHistory = generateSyntheticDailyBreakdown(spend, revenue, impressions, clicks, conversions);

    parsedCampaigns.push({
      id,
      name,
      platform,
      campaignType,
      startDate,
      endDate,
      budget,
      spend,
      impressions,
      reach,
      clicks,
      conversions,
      revenue,
      audience,
      region,
      lifecycleState: 'Active',
      dailyHistory,
    });
  });

  if (currencyStringSanitizedCount > 0) {
    cleaningActions.push(`Sanitized ${currencyStringSanitizedCount} formatted currency/number strings.`);
  }
  if (idGeneratedCount > 0) {
    cleaningActions.push(`Auto-generated ${idGeneratedCount} clean unique IDs for unindexed records.`);
  }

  // Calculate audit report
  const totalSpend = parsedCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = parsedCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const blendedRoas = totalSpend > 0 ? Number((totalRevenue / totalSpend).toFixed(2)) : 0;
  const winningCount = parsedCampaigns.filter((c) => (c.spend > 0 ? c.revenue / c.spend >= 2.5 : false)).length;
  const underperformingCount = parsedCampaigns.filter((c) => (c.spend > 0 ? c.revenue / c.spend < 1.8 : false)).length;

  const fileSizeBytesText =
    fileSize < 1024
      ? `${fileSize} B`
      : fileSize < 1024 * 1024
      ? `${(fileSize / 1024).toFixed(1)} KB`
      : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;

  const mappedCount = mappingConfidence.filter((m) => m.confidence === 'Exact' || m.confidence === 'Fuzzy').length;
  const qualityScore = Math.min(100, Math.max(60, Math.round((mappedCount / fieldKeys.length) * 40 + 60)));

  // Calculate time-series trajectory directly from parsed records
  const trajectory: TrajectoryPoint[] = [];
  const dailyDateMap = new Map<string, { spend: number; revenue: number }>();
  
  parsedCampaigns.forEach((c) => {
    if (c.dailyHistory && Array.isArray(c.dailyHistory)) {
      c.dailyHistory.forEach((dh) => {
        const cur = dailyDateMap.get(dh.date) || { spend: 0, revenue: 0 };
        cur.spend += dh.spend || 0;
        cur.revenue += dh.revenue || 0;
        dailyDateMap.set(dh.date, cur);
      });
    }
  });

  if (dailyDateMap.size >= 4) {
    const sorted = Array.from(dailyDateMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const bucketSize = Math.max(1, Math.floor(sorted.length / 4));
    for (let i = 0; i < sorted.length; i += bucketSize) {
      const slice = sorted.slice(i, i + bucketSize);
      const bSpend = Math.round(slice.reduce((acc, [_, d]) => acc + d.spend, 0));
      const bRevenue = Math.round(slice.reduce((acc, [_, d]) => acc + d.revenue, 0));
      const bRoas = bSpend > 0 ? Number((bRevenue / bSpend).toFixed(2)) : 0;
      const label = slice.length === 1 ? slice[0][0] : `${slice[0][0]} - ${slice[slice.length - 1][0]}`;
      trajectory.push({
        period: label,
        spend: bSpend,
        revenue: bRevenue,
        roas: bRoas,
      });
    }
  } else {
    // If no distinct multi-date history, build 4-phase audit timeline anchored strictly to file spend & revenue
    const phaseWeights = [0.20, 0.24, 0.28, 0.28];
    const roasMultipliers = [0.94, 0.98, 1.04, 1.02];
    for (let i = 0; i < 4; i++) {
      const pSpend = Math.round(totalSpend * phaseWeights[i]);
      const pRoas = Number((blendedRoas * roasMultipliers[i]).toFixed(2));
      const pRev = Math.round(pSpend * pRoas);
      trajectory.push({
        period: `Phase ${i + 1} (W${i + 1})`,
        spend: pSpend,
        revenue: pRev,
        roas: pRoas,
      });
    }
  }

  const report: ParsedFileReport = {
    fileName,
    fileSize,
    fileSizeBytesText,
    format,
    totalRawRows: rawRows.length,
    validCampaignRows: parsedCampaigns.length,
    detectedHeaders,
    fieldMappings,
    mappingConfidence,
    cleaningActions,
    qualityScore,
    totalSpend,
    totalRevenue,
    blendedRoas,
    winningCount,
    underperformingCount,
    parsedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    trajectory,
  };

  return { campaigns: parsedCampaigns, report };
}
