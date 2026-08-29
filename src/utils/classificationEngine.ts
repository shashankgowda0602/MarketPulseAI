import { Campaign, CampaignStatus, ClassificationThresholds } from '../types';
import { calculateCampaignMetrics, calculateDatasetSummary } from './analyticsEngine';

export const DEFAULT_CLASSIFICATION_THRESHOLDS: ClassificationThresholds = {
  minClicksForReliability: 1000,
  minImpressionsForReliability: 50000,
  winningRoas: 2.8,
  winningConvRate: 2.5,
  underperformingRoas: 1.5,
  underperformingCpa: 120, // ₹120 or currency equivalent
};

export interface ClassifiedCampaignResult {
  campaign: Campaign;
  status: CampaignStatus;
  statusLabel: string;
  reasons: string[];
  score: number; // 0 - 100 overall composite score
  isReliableSample: boolean;
}

export function classifyCampaign(
  campaign: Campaign,
  campaignsList: Campaign[],
  thresholds: ClassificationThresholds = DEFAULT_CLASSIFICATION_THRESHOLDS
): ClassifiedCampaignResult {
  if (!campaign || typeof campaign !== 'object') {
    return {
      campaign: {
        id: 'UNKNOWN',
        name: 'Unnamed Campaign',
        platform: 'Google Ads',
        campaignType: 'Unknown',
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
        status: 'insufficient_data',
      },
      status: 'insufficient_data',
      statusLabel: 'Insufficient Data',
      reasons: ['Invalid or empty campaign object.'],
      score: 0,
      isReliableSample: false,
    };
  }

  const metrics = calculateCampaignMetrics(campaign);
  const datasetSummary = calculateDatasetSummary(campaignsList || []);

  const clicks = Math.max(0, Number(campaign.clicks) || 0);
  const impressions = Math.max(0, Number(campaign.impressions) || 0);
  const spend = Math.max(0, Number(campaign.spend) || 0);
  const reasons: string[] = [];

  // Check sample size constraint first
  if (clicks < thresholds.minClicksForReliability || impressions < thresholds.minImpressionsForReliability || spend <= 0) {
    reasons.push(
      `Sample size is below reliable threshold (${clicks.toLocaleString()} clicks < ${thresholds.minClicksForReliability.toLocaleString()} required, ${impressions.toLocaleString()} impressions).`
    );
    return {
      campaign: { ...campaign, status: 'insufficient_data', statusReason: reasons[0] },
      status: 'insufficient_data',
      statusLabel: 'Insufficient Data',
      reasons,
      score: 50,
      isReliableSample: false,
    };
  }

  let compositeScore = 50;

  // 1. ROAS comparison
  const avgRoas = datasetSummary.averageRoas || 2.5;
  if (metrics.roas >= thresholds.winningRoas && metrics.roas > avgRoas * 1.15) {
    compositeScore += 25;
    reasons.push(`High ROAS (${metrics.roas}x) exceeds winning threshold (${thresholds.winningRoas}x) and is +${Math.round(((metrics.roas - avgRoas) / avgRoas) * 100)}% vs dataset average.`);
  } else if (metrics.roas < thresholds.underperformingRoas) {
    compositeScore -= 25;
    reasons.push(`ROAS (${metrics.roas}x) is below minimum viability threshold of ${thresholds.underperformingRoas}x.`);
  }

  // 2. Conversion Rate
  const avgConv = datasetSummary.averageConvRate || 2.0;
  if (metrics.conversionRate >= thresholds.winningConvRate) {
    compositeScore += 15;
    reasons.push(`Conversion rate of ${metrics.conversionRate}% indicates strong audience-to-offer alignment.`);
  } else if (metrics.conversionRate < 1.0) {
    compositeScore -= 15;
    reasons.push(`Low conversion rate of ${metrics.conversionRate}% indicates funnel friction or checkout drop-off.`);
  }

  // 3. CPA Efficiency
  const avgCpa = datasetSummary.averageCpa || 100;
  if (metrics.cpa > 0 && metrics.cpa < avgCpa * 0.8) {
    compositeScore += 10;
    reasons.push(`Efficient CPA of ₹${metrics.cpa} (-${Math.round(((avgCpa - metrics.cpa) / avgCpa) * 100)}% lower than average).`);
  } else if (metrics.cpa > thresholds.underperformingCpa || (avgCpa > 0 && metrics.cpa > avgCpa * 1.35)) {
    compositeScore -= 15;
    reasons.push(`High acquisition cost of ₹${metrics.cpa} per conversion.`);
  }

  // 4. CTR vs Conversion Rate Discrepancy (Pattern 2 indicator)
  if (metrics.ctr > 4.0 && metrics.conversionRate < 1.2) {
    compositeScore -= 10;
    reasons.push(`High CTR (${metrics.ctr}%) with low conversion (${metrics.conversionRate}%) signals high ad interest but landing page dropoff.`);
  }

  // Determine final status
  let status: CampaignStatus = 'needs_attention';
  let statusLabel = 'Needs Attention';

  if (compositeScore >= 70 && metrics.roas >= thresholds.winningRoas) {
    status = 'winning';
    statusLabel = 'Winning';
  } else if (compositeScore <= 35 || metrics.roas < thresholds.underperformingRoas) {
    status = 'underperforming';
    statusLabel = 'Underperforming';
  } else {
    status = 'needs_attention';
    statusLabel = 'Needs Attention';
  }

  return {
    campaign: { ...campaign, status, statusReason: reasons.join(' ') },
    status,
    statusLabel,
    reasons,
    score: Math.max(0, Math.min(100, compositeScore)),
    isReliableSample: true,
  };
}

export function classifyAllCampaigns(
  campaigns: Campaign[],
  thresholds: ClassificationThresholds = DEFAULT_CLASSIFICATION_THRESHOLDS
): Campaign[] {
  return campaigns.map((c) => {
    const result = classifyCampaign(c, campaigns, thresholds);
    return result.campaign;
  });
}
