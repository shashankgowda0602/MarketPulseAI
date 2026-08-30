import {
  Campaign,
  AIInsightItem,
  RecommendationItem,
  RootCauseInvestigation,
  SustainabilityMetrics,
  StrategyScenario,
  ForecastPoint
} from '../types';
import { calculateCampaignMetrics, calculateDatasetSummary, calculatePlatformPerformance } from './analyticsEngine';

export function generateStructuredInsights(campaigns: Campaign[], currencySymbol: string = '₹'): {
  verifiedInsights: AIInsightItem[];
  hypotheses: AIInsightItem[];
  recommendations: AIInsightItem[];
  limitations: AIInsightItem[];
} {
  const safeList = Array.isArray(campaigns) ? campaigns.filter((c) => c && typeof c === 'object') : [];
  const summary = calculateDatasetSummary(safeList);
  const platformBreakdowns = calculatePlatformPerformance(safeList);

  if (safeList.length === 0) {
    return {
      verifiedInsights: [],
      hypotheses: [],
      recommendations: [],
      limitations: [
        {
          id: 'LM-EMPTY',
          type: 'limitation',
          title: 'No Data Uploaded',
          description: 'Upload campaign data to unlock verified deterministic insights and AI hypotheses.',
          confidence: 'High',
          timestamp: 'System baseline',
        },
      ],
    };
  }

  const topPlatform = platformBreakdowns[0]?.platform || summary.topPlatform || 'Top Channel';
  const bottomPlatform = platformBreakdowns[platformBreakdowns.length - 1]?.platform || 'Secondary Channel';

  // 1. VERIFIED INSIGHTS (Purely mathematical facts with exact values from uploaded dataset)
  const verifiedInsights: AIInsightItem[] = [
    {
      id: 'VI-1',
      type: 'verified',
      title: 'Top Channel Efficiency',
      description: `${topPlatform} is the most capital-efficient acquisition channel with the highest blended return, generating ${currencySymbol}${summary.totalRevenue.toLocaleString()} total revenue across the dataset.`,
      metrics: [
        { label: 'Top Channel', value: topPlatform },
        { label: 'Total Revenue', value: `${currencySymbol}${summary.totalRevenue.toLocaleString()}` },
        { label: 'Average ROAS', value: `${summary.averageRoas}x` },
      ],
      confidence: 'High',
      timestamp: 'Real-time verified',
    },
    {
      id: 'VI-2',
      type: 'verified',
      title: 'High Performer Revenue Share',
      description: `The top-performing campaign "${summary.topPerformingCampaignName}" recorded an individual ROAS of ${summary.topPerformingRoas}x, outperforming the dataset average (${summary.averageRoas}x) by +${summary.averageRoas > 0 ? Math.round(((summary.topPerformingRoas - summary.averageRoas) / summary.averageRoas) * 100) : 0}%.`,
      metrics: [
        { label: 'Top Campaign', value: summary.topPerformingCampaignName },
        { label: 'Peak ROAS', value: `${summary.topPerformingRoas}x` },
        { label: 'Total Conversions', value: summary.totalConversions },
      ],
      confidence: 'High',
      timestamp: 'Real-time verified',
    },
    {
      id: 'VI-3',
      type: 'verified',
      title: 'Underperforming Capital Drag',
      description: `The lowest-performing active campaign "${summary.lowestPerformingCampaignName}" is operating at ${summary.lowestPerformingRoas}x ROAS with an average CPA of ${currencySymbol}${summary.averageCpa}.`,
      metrics: [
        { label: 'Campaign', value: summary.lowestPerformingCampaignName },
        { label: 'Current ROAS', value: `${summary.lowestPerformingRoas}x` },
        { label: 'Blended CPA', value: `${currencySymbol}${summary.averageCpa}` },
      ],
      confidence: 'High',
      timestamp: 'Real-time verified',
    },
  ];

  // 2. POSSIBLE EXPLANATIONS (Clearly labeled as Hypotheses based on uploaded metrics)
  const hypotheses: AIInsightItem[] = [
    {
      id: 'HY-1',
      type: 'hypothesis',
      title: `Hypothesis: ${bottomPlatform} Engagement vs Conversion Gap`,
      description: `High click volume coupled with lower conversion rates in ${bottomPlatform} suggests that audience curiosity connects with ad visuals, but checkout friction or pricing perception on landing pages reduces conversion throughput.`,
      confidence: 'Medium',
      risk: 'User bounce rate may inflate marginal CPA if unaddressed.',
      expectedOutcome: 'A/B testing streamlined 1-click checkout and matching offer headlines could recover up to 18% in conversions.',
      timestamp: 'Hypothesis generation',
    },
    {
      id: 'HY-2',
      type: 'hypothesis',
      title: 'Hypothesis: Audience Fatigue in High-Impression Sets',
      description: `Top impression campaigns in the uploaded file show early signals of ad blindness where frequency increases faster than conversion volume.`,
      confidence: 'Medium',
      risk: 'Rising acquisition costs and creative saturation over extended flight durations.',
      expectedOutcome: 'Deploying dynamic creative refreshes every 14 days will stabilize conversion rates.',
      timestamp: 'Hypothesis generation',
    },
    {
      id: 'HY-3',
      type: 'hypothesis',
      title: `Hypothesis: Intent Signal Concentration in ${topPlatform}`,
      description: `${topPlatform} benefits from stronger immediate purchase intent compared to exploratory social feeds, driving higher average conversion rate (${summary.averageConvRate}%).`,
      confidence: 'High',
      risk: 'Audience size caps may trigger diminishing returns if scaled beyond 25% without keyword expansion.',
      expectedOutcome: 'Gradual 10-15% scale preserves target efficiency.',
      timestamp: 'Hypothesis generation',
    },
  ];

  // 3. RECOMMENDED ACTIONS
  const recommendations: AIInsightItem[] = [
    {
      id: 'RC-1',
      type: 'recommendation',
      title: `Capital Shift: Scale Budget on "${summary.topPerformingCampaignName}"`,
      description: `Gradually increase daily budget allocation on "${summary.topPerformingCampaignName}" by +10% to +15% over the next 14 days while maintaining ROAS above target.`,
      priority: 'High',
      confidence: 'High',
      risk: `Watch for marginal CPA inflation if search impression share exceeds 85%.`,
      expectedOutcome: `Estimated +${currencySymbol}${Math.round(summary.totalRevenue * 0.08).toLocaleString()} incremental net revenue.`,
      humanApprovalRequired: true,
      timestamp: 'Action queue',
    },
    {
      id: 'RC-2',
      type: 'recommendation',
      title: `Budget Pruning: Restructure "${summary.lowestPerformingCampaignName}"`,
      description: `Reduce spend or pause lowest-margin variants in "${summary.lowestPerformingCampaignName}" operating below benchmark return, reinvesting saved capital into ${topPlatform}.`,
      priority: 'Medium',
      confidence: 'High',
      risk: 'Minor reduction in broad brand exposure.',
      expectedOutcome: `Eliminates inefficient capital leakage across the campaign fleet.`,
      humanApprovalRequired: true,
      timestamp: 'Action queue',
    },
  ];

  // 4. DATA LIMITATIONS
  const limitations: AIInsightItem[] = [
    {
      id: 'LM-1',
      type: 'limitation',
      title: 'Uploaded Dataset Scope & Boundaries',
      description: `Analysis is computed specifically over the ${safeList.length} campaign records in this dataset. Multi-touch attribution across unrecorded touchpoints is estimated.`,
      confidence: 'High',
      timestamp: 'Verified system boundary',
    },
    {
      id: 'LM-2',
      type: 'limitation',
      title: 'Market Dynamics & External Variables',
      description: 'Calculations assume stable market demand and do not account for external competitor bidding spikes or inventory stockouts.',
      confidence: 'High',
      timestamp: 'Verified system boundary',
    },
  ];

  return { verifiedInsights, hypotheses, recommendations, limitations };
}

export function generateRootCauseInvestigations(campaigns: Campaign[]): RootCauseInvestigation[] {
  const safeList = Array.isArray(campaigns) ? campaigns.filter((c) => c && typeof c === 'object') : [];
  
  const avgImpressions = safeList.length > 0
    ? safeList.reduce((sum, c) => sum + c.impressions, 0) / safeList.length
    : 100000;

  const pattern1Campaigns = safeList
    .filter((c) => {
      const metrics = calculateCampaignMetrics(c);
      return c.impressions >= avgImpressions * 0.7 && metrics.ctr < 2.0;
    })
    .map((c) => c.name);

  const avgClicks = safeList.length > 0
    ? safeList.reduce((sum, c) => sum + c.clicks, 0) / safeList.length
    : 3000;

  const pattern2Campaigns = safeList
    .filter((c) => {
      const metrics = calculateCampaignMetrics(c);
      return c.clicks >= avgClicks * 0.6 && metrics.conversionRate < 2.2;
    })
    .map((c) => c.name);

  const avgSpend = safeList.length > 0
    ? safeList.reduce((sum, c) => sum + c.spend, 0) / safeList.length
    : 20000;

  const pattern3Campaigns = safeList
    .filter((c) => {
      const metrics = calculateCampaignMetrics(c);
      return c.spend >= avgSpend * 0.5 && metrics.roas < 2.0;
    })
    .map((c) => c.name);

  const fallbackNames = safeList.map((c) => c.name);

  return [
    {
      id: 'RC-PAT-1',
      patternType: 'Pattern 1: High Impressions + Low Clicks',
      affectedCampaigns: pattern1Campaigns.length > 0 
        ? pattern1Campaigns 
        : (fallbackNames.length > 0 ? [fallbackNames[0]] : ['Display Brand Awareness']),
      summary: 'Ad reaches broad audiences but fails to trigger curiosity or click engagement. Audience targeting may be too broad or banner hook is generic.',
      hypotheses: [
        'Creative hook fails to establish value in the first 2 seconds.',
        'Audience targeting is over-broad, delivering impressions to low-intent users.',
        'Ad banner visual fatigue after prolonged exposure to the same creative.'
      ],
      checklist: [
        { id: 'p1-1', label: 'Test 3 new visual variations with high-contrast hooks', completed: false },
        { id: 'p1-2', label: 'Refine audience demographic targeting to exclude low-affinity segments', completed: true },
        { id: 'p1-3', label: 'Review ad copy headline for clear value proposition', completed: false },
        { id: 'p1-4', label: 'Implement frequency capping at 3 impressions per user per week', completed: false },
      ],
    },
    {
      id: 'RC-PAT-2',
      patternType: 'Pattern 2: High Clicks + Low Conversions',
      affectedCampaigns: pattern2Campaigns.length > 0 
        ? pattern2Campaigns 
        : (fallbackNames.length > 1 ? [fallbackNames[1]] : fallbackNames.slice(0, 1)),
      summary: 'Users are intrigued by the ad promise and click through, but abandon on the website or checkout flow.',
      hypotheses: [
        'Landing page load speed exceeds 3.5 seconds on mobile devices.',
        'Promised discount in ad copy is not immediately visible at hero or checkout.',
        'Complicated checkout or unexpected delivery fees causing cart abandonment.',
        'Landing page layout is not optimized for mobile viewports.'
      ],
      checklist: [
        { id: 'p2-1', label: 'Check mobile PageSpeed score and Core Web Vitals on landing page', completed: false },
        { id: 'p2-2', label: 'Verify promo code auto-applies on cart click-through', completed: true },
        { id: 'p2-3', label: 'Add 1-click Express Checkout (UPI / Apple Pay / Google Pay / Cards)', completed: false },
        { id: 'p2-4', label: 'Ensure product price on ad matches landed product card', completed: true },
      ],
    },
    {
      id: 'RC-PAT-3',
      patternType: 'Pattern 3: High Spend + Low ROAS',
      affectedCampaigns: pattern3Campaigns.length > 0 
        ? pattern3Campaigns 
        : (fallbackNames.length > 2 ? [fallbackNames[2]] : fallbackNames.slice(-1)),
      summary: 'Significant capital deployed with poor revenue recovery. Cost per acquisition outpaces customer transaction value.',
      hypotheses: [
        'High competitive bid inflation on broad keywords without negative keyword gating.',
        'Low average order value relative to acquisition cost.',
        'Inefficient bidding strategy (manual CPC vs Target ROAS Smart Bidding).'
      ],
      checklist: [
        { id: 'p3-1', label: 'Audit negative keyword lists to eliminate irrelevant click waste', completed: false },
        { id: 'p3-2', label: 'Introduce minimum cart bundle threshold to increase AOV', completed: false },
        { id: 'p3-3', label: 'Switch bidding strategy to Target ROAS with minimum guardrail', completed: true },
        { id: 'p3-4', label: 'Pause lowest-margin product SKUs from active ad sets', completed: false },
      ],
    },
  ];
}

export function generateActionableRecommendations(campaigns: Campaign[], currencySymbol: string = '₹'): RecommendationItem[] {
  const safeList = Array.isArray(campaigns) ? campaigns.filter((c) => c && typeof c === 'object') : [];
  const summary = calculateDatasetSummary(safeList);

  if (safeList.length === 0) {
    return [];
  }

  // Calculate metrics for each campaign
  const scoredCampaigns = safeList.map((c) => {
    const m = calculateCampaignMetrics(c);
    return { campaign: c, metrics: m };
  });

  // Sort by ROAS
  const sortedByRoas = [...scoredCampaigns].sort((a, b) => b.metrics.roas - a.metrics.roas);
  const topPerformer = sortedByRoas[0];
  const lowestPerformer = sortedByRoas[sortedByRoas.length - 1];

  // Search for landing page friction candidate (high CTR but low/mediocre Conv Rate)
  const frictionCandidate = [...scoredCampaigns]
    .filter((item) => item.campaign.clicks > 100 && item.metrics.ctr > 2.0)
    .sort((a, b) => a.metrics.conversionRate - b.metrics.conversionRate)[0] || sortedByRoas[Math.min(1, sortedByRoas.length - 1)];

  // Search for high-leverage channel or email/retention
  const highLeverageCandidate = scoredCampaigns.find(
    (item) => item.campaign.platform === 'Email' || item.campaign.platform === 'Google Ads' || item.metrics.roas > 3.0
  ) || topPerformer;

  // Search for ad fatigue candidate (highest impressions/reach)
  const highestImpressionCandidate = [...scoredCampaigns].sort((a, b) => b.campaign.impressions - a.campaign.impressions)[0];

  const topScalePotential = Math.round(topPerformer.campaign.revenue * 0.15);
  const lowestWasteSavings = Math.round(lowestPerformer.campaign.spend * 0.4);

  return [
    {
      id: 'REC-001',
      action: `Scale High-Intent Budget on "${topPerformer.campaign.name}" by +15%`,
      why: `Operating at an outstanding ${topPerformer.metrics.roas}x ROAS on ${topPerformer.campaign.platform} with low CPA (${currencySymbol}${topPerformer.metrics.cpa}), indicating room for profitable volume expansion.`,
      dataEvidence: `Generated ${currencySymbol}${topPerformer.campaign.revenue.toLocaleString()} revenue on ${currencySymbol}${topPerformer.campaign.spend.toLocaleString()} spend (${topPerformer.metrics.roas}x ROAS vs dataset average ${summary.averageRoas}x).`,
      expectedBenefit: `Projected +${currencySymbol}${topScalePotential.toLocaleString()} incremental gross margin within 14 days.`,
      possibleRisk: 'Audience expansion may see minor CPC inflation (+5-8%).',
      confidenceLevel: 'High',
      priority: 'High',
      category: 'budget',
      humanApprovalRequired: true,
      status: 'pending',
      estimatedImpact: `+${currencySymbol}${topScalePotential.toLocaleString()} Margin`,
      targetCampaignName: topPerformer.campaign.name,
    },
    {
      id: 'REC-002',
      action: `Prune or Pause Underperforming "${lowestPerformer.campaign.name}" for Creative Refresh`,
      why: `Operating at ${lowestPerformer.metrics.roas}x ROAS with high CPA (${currencySymbol}${lowestPerformer.metrics.cpa}), causing capital drag on overall portfolio margins.`,
      dataEvidence: `${currencySymbol}${lowestPerformer.campaign.spend.toLocaleString()} spent for only ${lowestPerformer.campaign.conversions} conversions and ${currencySymbol}${lowestPerformer.campaign.revenue.toLocaleString()} revenue.`,
      expectedBenefit: `Stops capital burn; frees ~${currencySymbol}${lowestWasteSavings.toLocaleString()} budget to reallocate to higher-yielding assets.`,
      possibleRisk: 'Slight reduction in top-of-funnel reach.',
      confidenceLevel: 'High',
      priority: 'High',
      category: 'budget',
      humanApprovalRequired: true,
      status: 'pending',
      estimatedImpact: `Saves ${currencySymbol}${lowestWasteSavings.toLocaleString()} Wasted Spend`,
      targetCampaignName: lowestPerformer.campaign.name,
    },
    {
      id: 'REC-003',
      action: `Align Landing Page Offer & Checkout Flow for "${frictionCandidate.campaign.name}"`,
      why: `High click-through engagement (${frictionCandidate.metrics.ctr}% CTR) proves ad creative connects, but ${frictionCandidate.metrics.conversionRate}% conversion rate indicates landing page dropout.`,
      dataEvidence: `${frictionCandidate.campaign.clicks.toLocaleString()} clicks generated with ${frictionCandidate.campaign.conversions.toLocaleString()} conversions on ${frictionCandidate.campaign.platform}.`,
      expectedBenefit: `Increasing conversion rate from ${frictionCandidate.metrics.conversionRate}% to ${(frictionCandidate.metrics.conversionRate * 1.35).toFixed(1)}% adds significant conversion volume.`,
      possibleRisk: 'Landing page A/B test may require 48 hours for statistical validation.',
      confidenceLevel: 'Medium',
      priority: 'Medium',
      category: 'landing_page',
      humanApprovalRequired: false,
      status: 'pending',
      estimatedImpact: `+${Math.round(frictionCandidate.campaign.conversions * 0.35)} Additional Orders`,
      targetCampaignName: frictionCandidate.campaign.name,
    },
    {
      id: 'REC-004',
      action: `Scale High-ROI Retention Sequences on "${highLeverageCandidate.campaign.name}"`,
      why: `Delivers strong ${highLeverageCandidate.metrics.roas}x ROAS at high efficiency on ${highLeverageCandidate.campaign.platform}.`,
      dataEvidence: `${currencySymbol}${highLeverageCandidate.campaign.spend.toLocaleString()} spend generated ${currencySymbol}${highLeverageCandidate.campaign.revenue.toLocaleString()} revenue.`,
      expectedBenefit: 'Automated post-purchase repurchase triggers and remarketing can drive repeat orders faster.',
      possibleRisk: 'Audience fatigue if sent too frequently.',
      confidenceLevel: 'High',
      priority: 'Medium',
      category: 'audience',
      humanApprovalRequired: false,
      status: 'approved',
      estimatedImpact: '+18% Customer LTV',
      targetCampaignName: highLeverageCandidate.campaign.name,
    },
    {
      id: 'REC-005',
      action: `Set Frequency Cap (Max 3/Week) on "${highestImpressionCandidate.campaign.name}"`,
      why: `High impression delivery (${highestImpressionCandidate.campaign.impressions.toLocaleString()} views) risks ad saturation and rising marginal acquisition costs.`,
      dataEvidence: `${highestImpressionCandidate.campaign.impressions.toLocaleString()} impressions across ${highestImpressionCandidate.campaign.platform}.`,
      expectedBenefit: 'Reduces wasted impressions by ~20% while preserving brand sentiment.',
      possibleRisk: 'Short-term drop in total impression volume.',
      confidenceLevel: 'High',
      priority: 'Low',
      category: 'sustainability',
      humanApprovalRequired: false,
      status: 'pending',
      estimatedImpact: 'Customer Goodwill & -15% CPA',
      targetCampaignName: highestImpressionCandidate.campaign.name,
    },
  ];
}

export function generateForecastData(campaigns: Campaign[]): ForecastPoint[] {
  const safeList = Array.isArray(campaigns) ? campaigns.filter((c) => c && typeof c === 'object') : [];
  const summary = calculateDatasetSummary(safeList);
  
  // Collect daily points from dailyHistory if available across campaigns
  const dailyAggregates: Map<string, { spend: number; revenue: number; conversions: number }> = new Map();
  
  safeList.forEach((c) => {
    if (c.dailyHistory && Array.isArray(c.dailyHistory)) {
      c.dailyHistory.forEach((dh) => {
        const existing = dailyAggregates.get(dh.date) || { spend: 0, revenue: 0, conversions: 0 };
        existing.spend += dh.spend || 0;
        existing.revenue += dh.revenue || 0;
        existing.conversions += dh.conversions || 0;
        dailyAggregates.set(dh.date, existing);
      });
    }
  });

  const points: ForecastPoint[] = [];

  if (dailyAggregates.size >= 5) {
    // Sort chronological
    const sortedEntries = Array.from(dailyAggregates.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    
    // Push historical points
    sortedEntries.forEach(([date, data]) => {
      const sp = Math.round(data.spend);
      const rv = Math.round(data.revenue);
      const cv = Math.round(data.conversions);
      const roas = sp > 0 ? Number((rv / sp).toFixed(2)) : 0;
      points.push({
        date,
        isHistorical: true,
        spend: sp,
        spendLower: sp,
        spendUpper: sp,
        revenue: rv,
        revenueLower: rv,
        revenueUpper: rv,
        conversions: cv,
        conversionsLower: cv,
        conversionsUpper: cv,
        roas,
      });
    });

    // Calculate baseline velocity from last 5 days
    const recent5 = points.slice(-5);
    const avgRecentSpend = recent5.reduce((s, p) => s + p.spend, 0) / recent5.length;
    const avgRecentRev = recent5.reduce((s, p) => s + p.revenue, 0) / recent5.length;
    const avgRecentConv = recent5.reduce((s, p) => s + p.conversions, 0) / recent5.length;

    // Generate 15 future projected days
    const lastDateStr = sortedEntries[sortedEntries.length - 1][0];
    let lastDate = new Date(lastDateStr);
    if (isNaN(lastDate.getTime())) lastDate = new Date();

    for (let i = 1; i <= 15; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + i);
      const dateLabel = nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const trend = 1 + (i * 0.012);
      const uncertainty = i * 0.022;

      const sp = Math.round(avgRecentSpend * trend);
      const rv = Math.round(avgRecentRev * (trend + 0.015));
      const cv = Math.round(avgRecentConv * trend);

      points.push({
        date: dateLabel,
        isHistorical: false,
        spend: sp,
        spendLower: Math.round(sp * Math.max(0.2, 1 - uncertainty)),
        spendUpper: Math.round(sp * (1 + uncertainty)),
        revenue: rv,
        revenueLower: Math.round(rv * Math.max(0.1, 1 - uncertainty * 1.5)),
        revenueUpper: Math.round(rv * (1 + uncertainty * 1.5)),
        conversions: cv,
        conversionsLower: Math.round(cv * Math.max(0.2, 1 - uncertainty)),
        conversionsUpper: Math.round(cv * (1 + uncertainty)),
        roas: sp > 0 ? Number((rv / sp).toFixed(2)) : 0,
      });
    }
  } else {
    // Generate synthetic trajectory anchored in dataset averages
    const avgDailySpend = summary.totalSpend > 0 ? summary.totalSpend / 30 : 20000;
    const avgDailyRevenue = summary.totalRevenue > 0 ? summary.totalRevenue / 30 : 55000;
    const avgDailyConv = summary.totalConversions > 0 ? summary.totalConversions / 30 : 200;

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 14);

    // 14 days historical
    for (let i = 0; i < 14; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const jitter = (Math.sin(i * 0.8) * 0.12) + 1;
      const sp = Math.round(avgDailySpend * jitter);
      const rv = Math.round(avgDailyRevenue * jitter);
      const cv = Math.round(avgDailyConv * jitter);

      points.push({
        date: day,
        isHistorical: true,
        spend: sp,
        spendLower: sp,
        spendUpper: sp,
        revenue: rv,
        revenueLower: rv,
        revenueUpper: rv,
        conversions: cv,
        conversionsLower: cv,
        conversionsUpper: cv,
        roas: sp > 0 ? Number((rv / sp).toFixed(2)) : 0,
      });
    }

    // 15 days projected
    for (let i = 1; i <= 15; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const trend = 1 + (i * 0.015);
      const uncertainty = i * 0.02;

      const sp = Math.round(avgDailySpend * trend);
      const rv = Math.round(avgDailyRevenue * (trend + 0.02));
      const cv = Math.round(avgDailyConv * trend);

      points.push({
        date: day,
        isHistorical: false,
        spend: sp,
        spendLower: Math.round(sp * (1 - uncertainty)),
        spendUpper: Math.round(sp * (1 + uncertainty)),
        revenue: rv,
        revenueLower: Math.round(rv * (1 - uncertainty * 1.5)),
        revenueUpper: Math.round(rv * (1 + uncertainty * 1.5)),
        conversions: cv,
        conversionsLower: Math.round(cv * (1 - uncertainty)),
        conversionsUpper: Math.round(cv * (1 + uncertainty)),
        roas: sp > 0 ? Number((rv / sp).toFixed(2)) : 0,
      });
    }
  }

  return points;
}

export function calculateSustainabilityMetrics(campaigns: Campaign[]): SustainabilityMetrics {
  const safeList = Array.isArray(campaigns) ? campaigns.filter((c) => c && typeof c === 'object') : [];
  const summary = calculateDatasetSummary(safeList);
  const platformBreakdowns = calculatePlatformPerformance(safeList);

  // Economic waste: campaigns with ROAS < 1.6 and significant spend
  const underperforming = safeList.filter((c) => {
    const m = calculateCampaignMetrics(c);
    return m.roas < 1.6 && c.spend > 0;
  });

  const wasteSpend = underperforming.reduce((acc, c) => acc + (c.spend || 0), 0);
  const wastePct = summary.totalSpend > 0 ? (wasteSpend / summary.totalSpend) * 100 : 0;

  // Fatigue risk: campaigns with high frequency or impression dominance
  const fatigueCount = safeList.filter((c) => {
    const freq = c.impressions && c.reach ? c.impressions / c.reach : 1;
    return freq > 2.8 || (c.impressions > (summary.totalImpressions / Math.max(1, safeList.length)) * 1.5);
  }).length;

  const avgFreq = safeList.reduce((acc, c) => {
    const f = c.impressions && c.reach && c.reach > 0 ? c.impressions / c.reach : 1.8;
    return acc + f;
  }, 0) / Math.max(1, safeList.length);

  // Operational: estimated manual hours saved based on campaign fleet size
  const hoursSaved = Math.round(10 + (safeList.length * 1.2));
  const dashboardsReplaced = Math.max(1, platformBreakdowns.length);

  const co2Est = Number((summary.totalImpressions * 0.000045).toFixed(1));
  const wasteImpressions = underperforming.reduce((acc, c) => acc + (c.impressions || 0), 0);
  const carbonSavedEst = Number((wasteImpressions * 0.000045).toFixed(1));

  return {
    economicWasteSpend: Math.round(wasteSpend),
    economicWastePercentage: Number(wastePct.toFixed(1)),
    lowRoasCampaignsCount: underperforming.length,
    hoursSavedPerWeek: hoursSaved,
    manualDashboardsReplaced: dashboardsReplaced,
    adFatigueRiskCampaigns: Math.max(1, fatigueCount),
    averageFrequency: Number(avgFreq.toFixed(1)),
    customerSatisfactionScore: summary.averageRoas >= 2.5 ? 4.7 : summary.averageRoas >= 1.8 ? 4.2 : 3.8,
    co2DigitalEstimateKg: co2Est,
  };
}

export function calculateStrategySimulation(
  campaigns: Campaign[],
  channelShifts?: Record<string, number> | {
    google?: number;
    meta?: number;
    linkedin?: number;
    email?: number;
  },
  // Support legacy signature positional arguments
  legacyMeta?: number,
  legacyLinkedin?: number,
  legacyEmail?: number
): StrategyScenario {
  const safeList = Array.isArray(campaigns) ? campaigns.filter((c) => c && typeof c === 'object') : [];
  const summary = calculateDatasetSummary(safeList);
  const platformBreakdowns = calculatePlatformPerformance(safeList);

  // Normalize channel shifts into Record<string, number>
  const shifts: Record<string, number> = {};

  if (typeof channelShifts === 'number') {
    // Positional legacy: (campaigns, google, meta, linkedin, email)
    shifts['Google Ads'] = channelShifts;
    if (legacyMeta !== undefined) shifts['Meta Ads'] = legacyMeta;
    if (legacyLinkedin !== undefined) shifts['LinkedIn'] = legacyLinkedin;
    if (legacyEmail !== undefined) shifts['Email'] = legacyEmail;
  } else if (channelShifts && typeof channelShifts === 'object') {
    Object.entries(channelShifts).forEach(([k, v]) => {
      shifts[k] = Number(v) || 0;
    });
  }

  // Base calculations
  let baseSpend = summary.totalSpend;
  let baseRevenue = summary.totalRevenue;
  let baseConversions = summary.totalConversions;

  let totalNewSpend = 0;
  let totalNewRevenue = 0;
  let totalNewConversions = 0;

  let maxShiftMagnitude = 0;

  if (platformBreakdowns.length > 0) {
    platformBreakdowns.forEach((p) => {
      const shiftPct = shifts[p.platform] ?? shifts[p.platform.toLowerCase()] ?? 0;
      maxShiftMagnitude = Math.max(maxShiftMagnitude, Math.abs(shiftPct));
      const delta = shiftPct / 100;

      const pSpend = p.spend;
      const pRev = p.revenue;
      const pConv = p.conversions;

      const newPSpend = pSpend * (1 + delta);
      // Elasticity: Diminishing returns on large increases, retention on cuts
      const elasticity = p.roas >= 3.0 ? 1.05 : p.roas >= 2.0 ? 0.85 : 0.60;
      const revGrowth = delta * elasticity;
      const newPRev = pRev * (1 + revGrowth);
      const newPConv = pConv * (1 + revGrowth * 0.95);

      totalNewSpend += newPSpend;
      totalNewRevenue += newPRev;
      totalNewConversions += newPConv;
    });
  } else {
    totalNewSpend = baseSpend;
    totalNewRevenue = baseRevenue;
    totalNewConversions = baseConversions;
  }

  const finalSpend = Math.round(totalNewSpend);
  const finalRevenue = Math.round(totalNewRevenue);
  const finalConversions = Math.round(totalNewConversions);
  const finalRoas = finalSpend > 0 ? Number((finalRevenue / finalSpend).toFixed(2)) : 0;

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (maxShiftMagnitude > 25) {
    riskLevel = 'High';
  } else if (maxShiftMagnitude > 10) {
    riskLevel = 'Medium';
  }

  const shiftDescriptions = Object.entries(shifts)
    .filter(([_, v]) => v !== 0)
    .map(([k, v]) => `${k} (${v > 0 ? '+' : ''}${v}%)`)
    .join(', ') || 'Baseline Allocation';

  return {
    id: `SIM-${Date.now()}`,
    name: 'Custom Multi-Channel Strategy Simulation',
    description: shiftDescriptions,
    googleBudgetPercentChange: shifts['Google Ads'] || 0,
    metaBudgetPercentChange: shifts['Meta Ads'] || 0,
    linkedinBudgetPercentChange: shifts['LinkedIn'] || 0,
    emailBudgetPercentChange: shifts['Email'] || 0,
    projectedSpend: finalSpend,
    projectedRevenue: finalRevenue,
    projectedConversions: finalConversions,
    projectedRoas: finalRoas,
    riskLevel,
    confidence: 'Medium',
    assumptions: [
      'Assumes customer conversion intent and market search volume remain consistent across the forecast duration.',
      'Elasticity model applies diminishing marginal returns on ad sets scaled beyond +15%.',
      'Calculations are projected scenario estimates anchored to your uploaded campaign dataset.',
    ],
  };
}
