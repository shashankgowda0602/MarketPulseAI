import { describe, it, expect } from 'vitest';
import {
  calculateCampaignMetrics,
  calculateDatasetSummary,
  calculatePlatformPerformance,
  calculateConversionFunnel,
  validateDatasetQuality,
  generateDailyTimeline,
} from '../analyticsEngine';
import { Campaign } from '../../types';

describe('Analytics Engine - Canonical Mathematical Formulas', () => {
  const canonicalCampaign: Campaign = {
    id: 'CAN-001',
    name: 'Canonical Google Search Campaign',
    platform: 'Google Ads',
    campaignType: 'Search',
    startDate: '2026-08-01',
    endDate: '2026-08-28',
    budget: 15000,
    spend: 10000,
    impressions: 100000,
    reach: 80000,
    clicks: 5000,
    conversions: 250,
    revenue: 40000,
    audience: 'Shoppers',
    region: 'India',
    lifecycleState: 'Active',
  };

  it('calculates CTR correctly: Clicks / Impressions * 100', () => {
    const metrics = calculateCampaignMetrics(canonicalCampaign);
    expect(metrics.ctr).toBe(5.0); // 5,000 / 100,000 * 100
  });

  it('calculates Conversion Rate correctly: Conversions / Clicks * 100', () => {
    const metrics = calculateCampaignMetrics(canonicalCampaign);
    expect(metrics.conversionRate).toBe(5.0); // 250 / 5,000 * 100
  });

  it('calculates CPC correctly: Spend / Clicks', () => {
    const metrics = calculateCampaignMetrics(canonicalCampaign);
    expect(metrics.cpc).toBe(2.0); // 10,000 / 5,000
  });

  it('calculates CPA correctly: Spend / Conversions', () => {
    const metrics = calculateCampaignMetrics(canonicalCampaign);
    expect(metrics.cpa).toBe(40.0); // 10,000 / 250
  });

  it('calculates ROAS correctly: Revenue / Spend', () => {
    const metrics = calculateCampaignMetrics(canonicalCampaign);
    expect(metrics.roas).toBe(4.0); // 40,000 / 10,000
  });

  it('calculates CPM correctly: (Spend / Impressions) * 1000', () => {
    const metrics = calculateCampaignMetrics(canonicalCampaign);
    expect(metrics.cpm).toBe(100.0); // (10,000 / 100,000) * 1000
  });

  it('calculates Profit correctly: Revenue - Spend', () => {
    const metrics = calculateCampaignMetrics(canonicalCampaign);
    expect(metrics.profit).toBe(30000); // 40,000 - 10,000
  });

  it('calculates Spend Ratio correctly: Spend / Budget', () => {
    const metrics = calculateCampaignMetrics(canonicalCampaign);
    expect(metrics.spendRatio).toBe(0.67); // 10,000 / 15,000
  });
});

describe('Analytics Engine - Zero Division & Edge Cases', () => {
  it('handles zero impressions without NaN or Infinity for CTR and CPM', () => {
    const zeroImp: Campaign = {
      id: 'Z-1',
      name: 'Zero Impressions Campaign',
      platform: 'Meta Ads',
      campaignType: 'Feed',
      startDate: '2026-08-01',
      endDate: '2026-08-28',
      budget: 5000,
      spend: 5000,
      impressions: 0,
      reach: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      audience: '',
      region: '',
      lifecycleState: 'Active',
    };

    const metrics = calculateCampaignMetrics(zeroImp);
    expect(metrics.ctr).toBe(0);
    expect(metrics.cpm).toBe(0);
    expect(Number.isNaN(metrics.ctr)).toBe(false);
    expect(Number.isFinite(metrics.ctr)).toBe(true);
  });

  it('handles zero clicks without NaN or Infinity for Conversion Rate and CPC', () => {
    const zeroClicks: Campaign = {
      id: 'Z-2',
      name: 'Zero Clicks Campaign',
      platform: 'Meta Ads',
      campaignType: 'Feed',
      startDate: '2026-08-01',
      endDate: '2026-08-28',
      budget: 5000,
      spend: 5000,
      impressions: 10000,
      reach: 8000,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      audience: '',
      region: '',
      lifecycleState: 'Active',
    };

    const metrics = calculateCampaignMetrics(zeroClicks);
    expect(metrics.conversionRate).toBe(0);
    expect(metrics.cpc).toBe(0);
  });

  it('handles zero conversions without NaN or Infinity for CPA', () => {
    const zeroConv: Campaign = {
      id: 'Z-3',
      name: 'Zero Conversions Campaign',
      platform: 'Meta Ads',
      campaignType: 'Feed',
      startDate: '2026-08-01',
      endDate: '2026-08-28',
      budget: 5000,
      spend: 5000,
      impressions: 10000,
      reach: 8000,
      clicks: 200,
      conversions: 0,
      revenue: 0,
      audience: '',
      region: '',
      lifecycleState: 'Active',
    };

    const metrics = calculateCampaignMetrics(zeroConv);
    expect(metrics.cpa).toBe(0);
  });

  it('handles zero spend without Infinity or NaN for ROAS and CPC', () => {
    const zeroSpend: Campaign = {
      id: 'Z-4',
      name: 'Zero Spend Organic/Email Campaign',
      platform: 'Email',
      campaignType: 'Newsletter',
      startDate: '2026-08-01',
      endDate: '2026-08-28',
      budget: 0,
      spend: 0,
      impressions: 5000,
      reach: 4000,
      clicks: 300,
      conversions: 20,
      revenue: 15000,
      audience: 'Subscribers',
      region: 'India',
      lifecycleState: 'Active',
    };

    const metrics = calculateCampaignMetrics(zeroSpend);
    expect(metrics.roas).toBe(0);
    expect(metrics.cpc).toBe(0);
    expect(metrics.cpa).toBe(0);
    expect(metrics.profit).toBe(15000);
  });

  it('handles campaign with all zeros gracefully', () => {
    const allZero: Campaign = {
      id: 'Z-5',
      name: 'All Zero Campaign',
      platform: 'Google Ads',
      campaignType: 'Search',
      startDate: '',
      endDate: '',
      budget: 0,
      spend: 0,
      impressions: 0,
      reach: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      audience: '',
      region: '',
      lifecycleState: 'Paused',
    };

    const metrics = calculateCampaignMetrics(allZero);
    expect(metrics.ctr).toBe(0);
    expect(metrics.conversionRate).toBe(0);
    expect(metrics.cpc).toBe(0);
    expect(metrics.cpa).toBe(0);
    expect(metrics.roas).toBe(0);
    expect(metrics.cpm).toBe(0);
    expect(metrics.profit).toBe(0);
    expect(metrics.spendRatio).toBe(0);
  });
});

describe('Analytics Engine - Null, Undefined & Malformed Inputs', () => {
  it('handles null campaign parameter safely', () => {
    const metrics = calculateCampaignMetrics(null as any);
    expect(metrics).toBeDefined();
    expect(metrics.ctr).toBe(0);
    expect(metrics.roas).toBe(0);
    expect(metrics.profit).toBe(0);
  });

  it('handles undefined campaign parameter safely', () => {
    const metrics = calculateCampaignMetrics(undefined as any);
    expect(metrics).toBeDefined();
    expect(metrics.ctr).toBe(0);
    expect(metrics.roas).toBe(0);
  });

  it('handles empty object safely', () => {
    const metrics = calculateCampaignMetrics({} as any);
    expect(metrics.ctr).toBe(0);
    expect(metrics.roas).toBe(0);
  });

  it('sanitizes negative values to 0 without causing negative impressions/spend anomalies', () => {
    const negativeCamp: Campaign = {
      id: 'NEG-1',
      name: 'Negative Numbers Campaign',
      platform: 'Google Ads',
      campaignType: 'Search',
      startDate: '',
      endDate: '',
      budget: -2000,
      spend: -5000,
      impressions: -10000,
      reach: -8000,
      clicks: -500,
      conversions: -20,
      revenue: -10000,
      audience: '',
      region: '',
      lifecycleState: 'Active',
    };

    const metrics = calculateCampaignMetrics(negativeCamp);
    expect(metrics.ctr).toBe(0);
    expect(metrics.roas).toBe(0);
    expect(metrics.profit).toBe(0);
  });

  it('handles non-numeric string values and NaN in numeric fields safely', () => {
    const nanCamp: any = {
      id: 'NAN-1',
      name: 'Corrupted Data Campaign',
      spend: NaN,
      impressions: 'invalid_string',
      clicks: undefined,
      conversions: null,
      revenue: 'abc',
    };

    const metrics = calculateCampaignMetrics(nanCamp);
    expect(metrics.ctr).toBe(0);
    expect(metrics.roas).toBe(0);
    expect(metrics.cpc).toBe(0);
  });
});

describe('Analytics Engine - Dataset Aggregations & Summaries', () => {
  const sampleFleet: Campaign[] = [
    {
      id: 'C-1',
      name: 'Google Search Alpha',
      platform: 'Google Ads',
      campaignType: 'Search',
      startDate: '2026-08-01',
      endDate: '2026-08-28',
      budget: 20000,
      spend: 15000,
      impressions: 150000,
      reach: 120000,
      clicks: 7500,
      conversions: 375,
      revenue: 60000,
      audience: 'Tech',
      region: 'India',
      lifecycleState: 'Active',
    },
    {
      id: 'C-2',
      name: 'Meta Retargeting Beta',
      platform: 'Meta Ads',
      campaignType: 'Feed',
      startDate: '2026-08-01',
      endDate: '2026-08-28',
      budget: 10000,
      spend: 8000,
      impressions: 80000,
      reach: 60000,
      clicks: 3200,
      conversions: 120,
      revenue: 16000,
      audience: 'Visitors',
      region: 'India',
      lifecycleState: 'Active',
    },
    {
      id: 'C-3',
      name: 'YouTube Brand Video Gamma',
      platform: 'YouTube',
      campaignType: 'In-Stream',
      startDate: '2026-08-01',
      endDate: '2026-08-28',
      budget: 15000,
      spend: 12000,
      impressions: 200000,
      reach: 150000,
      clicks: 2000,
      conversions: 40,
      revenue: 12000,
      audience: 'Gamers',
      region: 'India',
      lifecycleState: 'Active',
    },
  ];

  it('aggregates total spend, revenue, profit, clicks, conversions, and impressions', () => {
    const summary = calculateDatasetSummary(sampleFleet);
    expect(summary.totalSpend).toBe(35000); // 15k + 8k + 12k
    expect(summary.totalRevenue).toBe(88000); // 60k + 16k + 12k
    expect(summary.totalProfit).toBe(53000); // 88k - 35k
    expect(summary.totalConversions).toBe(535); // 375 + 120 + 40
    expect(summary.totalClicks).toBe(12700); // 7.5k + 3.2k + 2k
    expect(summary.totalImpressions).toBe(430000); // 150k + 80k + 200k
  });

  it('calculates blended average ROAS and CTR correctly', () => {
    const summary = calculateDatasetSummary(sampleFleet);
    expect(summary.averageRoas).toBe(2.51); // 88,000 / 35,000
    expect(summary.averageCtr).toBe(2.95); // 12,700 / 430,000 * 100
    expect(summary.averageConvRate).toBe(4.21); // 535 / 12,700 * 100
  });

  it('accurately identifies top-performing and lowest-performing campaigns', () => {
    const summary = calculateDatasetSummary(sampleFleet);
    expect(summary.topPerformingCampaignName).toBe('Google Search Alpha');
    expect(summary.topPerformingRoas).toBe(4.0); // 60,000 / 15,000
    expect(summary.lowestPerformingCampaignName).toBe('YouTube Brand Video Gamma');
    expect(summary.lowestPerformingRoas).toBe(1.0); // 12,000 / 12,000
  });

  it('handles empty dataset without throwing and sets N/A markers', () => {
    const summary = calculateDatasetSummary([]);
    expect(summary.totalCampaigns).toBe(0);
    expect(summary.totalSpend).toBe(0);
    expect(summary.averageRoas).toBe(0);
    expect(summary.topPerformingCampaignName).toBe('N/A');
    expect(summary.lowestPerformingCampaignName).toBe('N/A');
  });

  it('handles null/undefined dataset arrays safely', () => {
    const summaryNull = calculateDatasetSummary(null as any);
    expect(summaryNull.totalCampaigns).toBe(0);

    const summaryUndef = calculateDatasetSummary(undefined as any);
    expect(summaryUndef.totalCampaigns).toBe(0);
  });
});

describe('Analytics Engine - Platform Breakdown & Conversion Funnel', () => {
  const mixedCampaigns: Campaign[] = [
    {
      id: 'P-1',
      name: 'Google Ads Search',
      platform: 'Google Ads',
      campaignType: 'Search',
      startDate: '',
      endDate: '',
      budget: 10000,
      spend: 10000,
      impressions: 100000,
      reach: 80000,
      clicks: 5000,
      conversions: 250,
      revenue: 40000,
      audience: '',
      region: '',
      lifecycleState: 'Active',
    },
    {
      id: 'P-2',
      name: 'Instagram Video Reels',
      platform: 'Instagram',
      campaignType: 'Reels',
      startDate: '',
      endDate: '',
      budget: 8000,
      spend: 8000,
      impressions: 60000,
      reach: 45000,
      clicks: 3000,
      conversions: 90,
      revenue: 16000,
      audience: '',
      region: '',
      lifecycleState: 'Active',
    },
  ];

  it('generates metrics for all 6 supported platforms', () => {
    const platforms = calculatePlatformPerformance(mixedCampaigns);
    expect(platforms.length).toBe(6);

    const google = platforms.find((p) => p.platform === 'Google Ads');
    expect(google?.campaignsCount).toBe(1);
    expect(google?.spend).toBe(10000);
    expect(google?.roas).toBe(4.0);

    const linkedin = platforms.find((p) => p.platform === 'LinkedIn');
    expect(linkedin?.campaignsCount).toBe(0);
    expect(linkedin?.spend).toBe(0);
    expect(linkedin?.roas).toBe(0);
  });

  it('calculates multi-stage conversion funnel without NaN dropoff rates', () => {
    const funnel = calculateConversionFunnel(mixedCampaigns);
    expect(funnel.length).toBe(4);
    expect(funnel[0].stage).toBe('Impressions');
    expect(funnel[0].count).toBe(160000);
    expect(funnel[1].stage).toBe('Reach');
    expect(funnel[1].count).toBe(125000);
    expect(funnel[2].stage).toBe('Clicks');
    expect(funnel[2].count).toBe(8000);
    expect(funnel[3].stage).toBe('Conversions');
    expect(funnel[3].count).toBe(340);

    funnel.forEach((f) => {
      expect(Number.isNaN(f.dropoffRate)).toBe(false);
      expect(Number.isNaN(f.percentageOfTop)).toBe(false);
    });
  });

  it('handles conversion funnel with empty campaign list safely', () => {
    const funnel = calculateConversionFunnel([]);
    expect(funnel.length).toBe(4);
    expect(funnel[0].count).toBe(0);
    expect(funnel[0].percentageOfTop).toBe(0);
  });
});

describe('Analytics Engine - Data Quality Validation', () => {
  it('assigns high score (>=90%) to fully populated valid rows', () => {
    const validRows = [
      { id: '1', name: 'Valid 1', spend: 100, revenue: 300, impressions: 1000 },
      { id: '2', name: 'Valid 2', spend: 200, revenue: 500, impressions: 2000 },
    ];
    const report = validateDatasetQuality(validRows);
    expect(report.score).toBeGreaterThanOrEqual(90);
    expect(report.qualityBand).toBe('Excellent');
    expect(report.validRows).toBe(2);
  });

  it('flags duplicate campaign IDs and names', () => {
    const duplicateRows = [
      { id: 'DUP-1', name: 'Same Name', spend: 100, revenue: 300, impressions: 1000 },
      { id: 'DUP-1', name: 'Same Name', spend: 100, revenue: 300, impressions: 1000 },
    ];
    const report = validateDatasetQuality(duplicateRows);
    expect(report.duplicateCount).toBeGreaterThan(0);
  });

  it('identifies missing revenue and zero impression anomalies', () => {
    const anomalyRows = [
      { id: '1', name: 'No Revenue Campaign', spend: 100, impressions: 0 },
      { id: '2', name: 'No Impression Campaign', spend: 200, revenue: 400, impressions: 0 },
    ];
    const report = validateDatasetQuality(anomalyRows);
    expect(report.missingRevenueCount).toBe(1);
    expect(report.zeroImpressionsCount).toBe(2);
    expect(report.warnings.length).toBeGreaterThan(0);
  });

  it('handles empty dataset quality validation safely', () => {
    const report = validateDatasetQuality([]);
    expect(report.score).toBe(0);
    expect(report.qualityBand).toBe('Poor');
  });
});

describe('Analytics Engine - Large Dataset & Stress Testing', () => {
  function generateLargeFleet(count: number): Campaign[] {
    const platforms = ['Google Ads', 'Meta Ads', 'Instagram', 'LinkedIn', 'YouTube', 'Email'] as const;
    const fleet: Campaign[] = [];
    for (let i = 1; i <= count; i++) {
      const spend = 1000 + ((i * 137) % 50000);
      const roas = 0.5 + ((i * 31) % 500) / 100;
      const revenue = Math.round(spend * roas);
      const impressions = spend * 15;
      const clicks = Math.round(impressions * 0.04);
      const conversions = Math.round(clicks * 0.03);

      fleet.push({
        id: `STRESS-${i}`,
        name: `High-Load Campaign #${i}`,
        platform: platforms[i % platforms.length],
        campaignType: 'Conversion',
        startDate: '2026-08-01',
        endDate: '2026-08-28',
        budget: Math.round(spend * 1.2),
        spend,
        revenue,
        impressions,
        reach: Math.round(impressions * 0.8),
        clicks,
        conversions,
        audience: 'Target Segment',
        region: 'Pan-India',
        lifecycleState: 'Active',
      });
    }
    return fleet;
  }

  it('processes 1,000 campaigns in under 30ms', () => {
    const fleet1k = generateLargeFleet(1000);
    const start = performance.now();
    const summary = calculateDatasetSummary(fleet1k);
    const elapsed = performance.now() - start;

    expect(summary.totalCampaigns).toBe(1000);
    expect(summary.totalSpend).toBeGreaterThan(0);
    expect(summary.averageRoas).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(30);
  });

  it('processes 10,000 campaigns in under 120ms', () => {
    const fleet10k = generateLargeFleet(10000);
    const start = performance.now();
    const summary = calculateDatasetSummary(fleet10k);
    const elapsed = performance.now() - start;

    expect(summary.totalCampaigns).toBe(10000);
    expect(summary.totalSpend).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(120);
  });

  it('processes 50,000 campaigns without stack overflow or memory crash', () => {
    const fleet50k = generateLargeFleet(50000);
    const start = performance.now();
    const summary = calculateDatasetSummary(fleet50k);
    const elapsed = performance.now() - start;

    expect(summary.totalCampaigns).toBe(50000);
    expect(Number.isFinite(summary.averageRoas)).toBe(true);
    expect(elapsed).toBeLessThan(600);
  });
});
