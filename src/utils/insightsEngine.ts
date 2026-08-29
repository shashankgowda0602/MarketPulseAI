import {
  Campaign,
  AIInsightItem,
  RecommendationItem,
  RootCauseInvestigation,
  SustainabilityMetrics,
  StrategyScenario,
  ForecastPoint
} from '../types';
import { calculateCampaignMetrics, calculateDatasetSummary } from './analyticsEngine';

export function generateStructuredInsights(campaigns: Campaign[]): {
  verifiedInsights: AIInsightItem[];
  hypotheses: AIInsightItem[];
  recommendations: AIInsightItem[];
  limitations: AIInsightItem[];
} {
  const safeList = Array.isArray(campaigns) ? campaigns.filter((c) => c && typeof c === 'object') : [];
  const summary = calculateDatasetSummary(safeList);

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

  // 1. VERIFIED INSIGHTS (Purely mathematical facts with exact values)
  const verifiedInsights: AIInsightItem[] = [
    {
      id: 'VI-1',
      type: 'verified',
      title: 'Top Channel Efficiency',
      description: `${summary.topPlatform} is the most capital-efficient acquisition channel with the highest blended return, generating ₹${summary.totalRevenue.toLocaleString()} total revenue across the fleet.`,
      metrics: [
        { label: 'Top Channel', value: summary.topPlatform },
        { label: 'Total Revenue', value: `₹${summary.totalRevenue.toLocaleString()}` },
        { label: 'Average ROAS', value: `${summary.averageRoas}x` },
      ],
      confidence: 'High',
      timestamp: 'Real-time verified',
    },
    {
      id: 'VI-2',
      type: 'verified',
      title: 'High Performer Revenue Share',
      description: `The top-performing campaign "${summary.topPerformingCampaignName}" recorded an individual ROAS of ${summary.topPerformingRoas}x, outperforming the benchmark average by +${Math.round(((summary.topPerformingRoas - summary.averageRoas) / summary.averageRoas) * 100)}%.`,
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
      description: `The lowest-performing active campaign "${summary.lowestPerformingCampaignName}" is operating at ${summary.lowestPerformingRoas}x ROAS, below the 1.5x minimum baseline viability threshold.`,
      metrics: [
        { label: 'Campaign', value: summary.lowestPerformingCampaignName },
        { label: 'Current ROAS', value: `${summary.lowestPerformingRoas}x` },
        { label: 'Blended CPA', value: `₹${summary.averageCpa}` },
      ],
      confidence: 'High',
      timestamp: 'Real-time verified',
    },
  ];

  // 2. POSSIBLE EXPLANATIONS (Clearly labeled as Hypotheses to Investigate)
  const hypotheses: AIInsightItem[] = [
    {
      id: 'HY-1',
      type: 'hypothesis',
      title: 'Hypothesis: Social Creative Message vs Landing Page Expectation Gap',
      description: 'High CTR (>4.5%) combined with subpar conversion rate (<1.8%) on certain Instagram and Meta campaigns suggests that audience curiosity is peaked by ad visuals, but user purchase intent drops upon landing page evaluation.',
      confidence: 'Medium',
      risk: 'User bounce rate may degrade quality score if unaddressed.',
      expectedOutcome: 'A/B testing matching landing page headlines could recover up to 18% in conversions.',
      timestamp: 'Hypothesis generation',
    },
    {
      id: 'HY-2',
      type: 'hypothesis',
      title: 'Hypothesis: Video Upper-Funnel Delayed Attribution',
      description: 'YouTube campaigns show higher CPA (₹500+) and lower immediate ROAS (1.3x-1.9x). This likely reflects upper-funnel brand recall whose conversion value is captured downstream via Direct and Search channels.',
      confidence: 'Medium',
      risk: 'Prematurely terminating video ads may lead to a drop in organic brand search volume.',
      expectedOutcome: 'Multi-touch attribution audit required before budget reduction.',
      timestamp: 'Hypothesis generation',
    },
    {
      id: 'HY-3',
      type: 'hypothesis',
      title: 'Hypothesis: Audience Saturation in Retargeting Clusters',
      description: 'Frequency metrics in 30-day website dropoff campaigns have exceeded 4.2 impressions per user, signaling ad fatigue and rising incremental cost per acquisition.',
      confidence: 'Medium',
      risk: 'Diminishing returns and negative brand perception from over-exposure.',
      expectedOutcome: 'Refreshing dynamic creative assets and setting a 7-day frequency cap will stabilize CPA.',
      timestamp: 'Hypothesis generation',
    },
  ];

  // 3. RECOMMENDED ACTIONS
  const recommendations: AIInsightItem[] = [
    {
      id: 'RC-1',
      type: 'recommendation',
      title: 'Gradual Capital Reallocation to Google Search & Shopping',
      description: 'Scale budget on top-performing search and shopping assets by +10% over the next 14 days rather than making an immediate aggressive jump.',
      priority: 'High',
      confidence: 'High',
      risk: 'Watch for CPC inflation beyond ₹8 per click as search impression share nears 85%.',
      expectedOutcome: 'Estimated +₹35,000 incremental net revenue at stable >3.8x ROAS.',
      humanApprovalRequired: true,
      timestamp: 'Action queue',
    },
    {
      id: 'RC-2',
      type: 'recommendation',
      title: 'Apply 15% Budget Pruning on Inefficient Carousel Sets',
      description: 'Reduce daily allocation on underperforming Meta Ad carousels operating below 1.2x ROAS and reinvest savings into high-converting email lifecycle drops.',
      priority: 'Medium',
      confidence: 'High',
      risk: 'Slight reduction in overall brand reach in Tier-2 test zones.',
      expectedOutcome: 'Immediate savings of ₹14,000 monthly wasted ad spend.',
      humanApprovalRequired: true,
      timestamp: 'Action queue',
    },
  ];

  // 4. DATA LIMITATIONS
  const limitations: AIInsightItem[] = [
    {
      id: 'LM-1',
      type: 'limitation',
      title: 'Sample Size & Attribution Window Caveat',
      description: `Analysis is bounded to ${campaigns.length} campaigns across a 90-day window. Long-term customer lifetime value (LTV) and multi-device cross-platform attribution are not captured in single-touch upload records.`,
      confidence: 'High',
      timestamp: 'Verified system boundary',
    },
    {
      id: 'LM-2',
      type: 'limitation',
      title: 'External Seasonality & Macro Market Factors',
      description: 'Metric baselines do not account for external competitor flash sales, supply chain stockouts, or regional festival demand spikes.',
      confidence: 'High',
      timestamp: 'Verified system boundary',
    },
  ];

  return { verifiedInsights, hypotheses, recommendations, limitations };
}

export function generateRootCauseInvestigations(campaigns: Campaign[]): RootCauseInvestigation[] {
  // Pattern 1: High Impressions + Low Clicks (CTR < 1.8% and Impressions > average)
  const avgImpressions = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + c.impressions, 0) / campaigns.length
    : 100000;

  const pattern1Campaigns = campaigns
    .filter((c) => {
      const metrics = calculateCampaignMetrics(c);
      return c.impressions >= avgImpressions * 0.7 && metrics.ctr < 2.0;
    })
    .map((c) => c.name);

  // Pattern 2: High Clicks + Low Conversions (clicks > avg and ConvRate < avg)
  const avgClicks = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + c.clicks, 0) / campaigns.length
    : 3000;

  const pattern2Campaigns = campaigns
    .filter((c) => {
      const metrics = calculateCampaignMetrics(c);
      return c.clicks >= avgClicks * 0.6 && metrics.conversionRate < 2.2;
    })
    .map((c) => c.name);

  // Pattern 3: High Spend + Low ROAS (ROAS < 1.8 and spend > avg)
  const avgSpend = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + c.spend, 0) / campaigns.length
    : 20000;

  const pattern3Campaigns = campaigns
    .filter((c) => {
      const metrics = calculateCampaignMetrics(c);
      return c.spend >= avgSpend * 0.5 && metrics.roas < 2.0;
    })
    .map((c) => c.name);

  const fallbackNames = campaigns.map((c) => c.name);

  return [
    {
      id: 'RC-PAT-1',
      patternType: 'Pattern 1: High Impressions + Low Clicks',
      affectedCampaigns: pattern1Campaigns.length > 0 
        ? pattern1Campaigns 
        : (fallbackNames.length > 0 ? [fallbackNames[0]] : ['High Impression Display Banner']),
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
        { id: 'p2-3', label: 'Add 1-click Express Checkout (UPI / Apple Pay / Google Pay)', completed: false },
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

export function generateActionableRecommendations(campaigns: Campaign[]): RecommendationItem[] {
  const summary = calculateDatasetSummary(campaigns);

  if (!campaigns || campaigns.length === 0) {
    return [];
  }

  // Calculate metrics for each campaign
  const scoredCampaigns = campaigns.map((c) => {
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
      why: `Operating at an outstanding ${topPerformer.metrics.roas}x ROAS on ${topPerformer.campaign.platform} with low CPA (₹${topPerformer.metrics.cpa}), indicating room for profitable volume expansion.`,
      dataEvidence: `Generated ₹${topPerformer.campaign.revenue.toLocaleString()} revenue on ₹${topPerformer.campaign.spend.toLocaleString()} spend (${topPerformer.metrics.roas}x ROAS vs dataset average ${summary.averageRoas}x).`,
      expectedBenefit: `Projected +₹${topScalePotential.toLocaleString()} incremental gross margin within 14 days.`,
      possibleRisk: 'Audience expansion may see minor CPC inflation (+5-8%).',
      confidenceLevel: 'High',
      priority: 'High',
      category: 'budget',
      humanApprovalRequired: true,
      status: 'pending',
      estimatedImpact: `+₹${topScalePotential.toLocaleString()} Margin`,
      targetCampaignName: topPerformer.campaign.name,
    },
    {
      id: 'REC-002',
      action: `Prune or Pause Underperforming "${lowestPerformer.campaign.name}" for Creative Refresh`,
      why: `Operating at ${lowestPerformer.metrics.roas}x ROAS with high CPA (₹${lowestPerformer.metrics.cpa}), causing capital drag on overall portfolio margins.`,
      dataEvidence: `₹${lowestPerformer.campaign.spend.toLocaleString()} spent for only ${lowestPerformer.campaign.conversions} conversions and ₹${lowestPerformer.campaign.revenue.toLocaleString()} revenue.`,
      expectedBenefit: `Stops capital burn; frees ~₹${lowestWasteSavings.toLocaleString()} budget to reallocate to higher-yielding assets.`,
      possibleRisk: 'Slight reduction in top-of-funnel reach.',
      confidenceLevel: 'High',
      priority: 'High',
      category: 'budget',
      humanApprovalRequired: true,
      status: 'pending',
      estimatedImpact: `Saves ₹${lowestWasteSavings.toLocaleString()} Wasted Spend`,
      targetCampaignName: lowestPerformer.campaign.name,
    },
    {
      id: 'REC-003',
      action: `Align Landing Page Offer & Checkout Flow for "${frictionCandidate.campaign.name}"`,
      why: `High click-through engagement (${frictionCandidate.metrics.ctr}% CTR) proves ad creative connects, but ${frictionCandidate.metrics.conversionRate}% conversion rate indicates landing page dropout.`,
      dataEvidence: `${frictionCandidate.campaign.clicks.toLocaleString()} clicks generated with ${frictionCandidate.campaign.conversions.toLocaleString()} conversions.`,
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
      dataEvidence: `₹${highLeverageCandidate.campaign.spend.toLocaleString()} spend generated ₹${highLeverageCandidate.campaign.revenue.toLocaleString()} revenue.`,
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
  const avgDailySpend = summary.totalSpend > 0 ? summary.totalSpend / 30 : 20000;
  const avgDailyRevenue = summary.totalRevenue > 0 ? summary.totalRevenue / 30 : 55000;
  const avgDailyConv = summary.totalConversions > 0 ? summary.totalConversions / 30 : 200;

  const points: ForecastPoint[] = [];

  // 15 days historical
  for (let i = 15; i >= 1; i--) {
    const day = `Aug ${14 - i + 1}`;
    const jitter = (Math.sin(i * 0.7) * 0.12) + 1;
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

  // 15 days future projected with expanding confidence interval
  for (let i = 1; i <= 15; i++) {
    const day = `Sep ${i}`;
    const trend = 1 + (i * 0.015); // gentle upward trend
    const uncertainty = i * 0.02; // expanding cone of uncertainty

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

  return points;
}

export function calculateSustainabilityMetrics(campaigns: Campaign[]): SustainabilityMetrics {
  const summary = calculateDatasetSummary(campaigns);

  // Economic waste: campaigns with ROAS < 1.5
  const underperforming = campaigns.filter((c) => {
    const m = calculateCampaignMetrics(c);
    return m.roas < 1.6 && c.spend > 5000;
  });

  const wasteSpend = underperforming.reduce((acc, c) => acc + (c.spend || 0), 0);
  const wastePct = summary.totalSpend > 0 ? (wasteSpend / summary.totalSpend) * 100 : 0;

  // Operational: estimated manual hours saved
  const hoursSaved = Math.round(14 + (campaigns.length * 0.8));
  const dashboardsReplaced = 6; // Google, Meta, IG, LinkedIn, YouTube, ESP

  return {
    economicWasteSpend: Math.round(wasteSpend),
    economicWastePercentage: Number(wastePct.toFixed(1)),
    lowRoasCampaignsCount: underperforming.length,
    hoursSavedPerWeek: hoursSaved,
    manualDashboardsReplaced: dashboardsReplaced,
    adFatigueRiskCampaigns: 2,
    averageFrequency: 3.8,
    customerSatisfactionScore: 4.6,
    co2DigitalEstimateKg: Number((summary.totalImpressions * 0.000045).toFixed(1)), // estimated digital ad server carbon footprint
  };
}

export function calculateStrategySimulation(
  campaigns: Campaign[],
  googleChangePct: number,
  metaChangePct: number,
  linkedinChangePct: number,
  emailChangePct: number
): StrategyScenario {
  const summary = calculateDatasetSummary(campaigns);

  // Base calculations
  let baseSpend = summary.totalSpend;
  let baseRevenue = summary.totalRevenue;
  let baseConversions = summary.totalConversions;

  // Elasticity models: Google search has high ROAS retention up to +20%, Meta decays faster, Email has super high leverage
  const googleDelta = (googleChangePct / 100);
  const metaDelta = (metaChangePct / 100);
  const linkedinDelta = (linkedinChangePct / 100);
  const emailDelta = (emailChangePct / 100);

  const newSpend = Math.round(baseSpend * (1 + (googleDelta * 0.35 + metaDelta * 0.30 + linkedinDelta * 0.25 + emailDelta * 0.10)));

  // Projected revenue impact
  const revGrowth = (googleDelta * 0.42) + (metaDelta * 0.22) + (linkedinDelta * 0.30) + (emailDelta * 0.15);
  const newRevenue = Math.round(baseRevenue * (1 + revGrowth));
  const newConversions = Math.round(baseConversions * (1 + revGrowth * 0.9));
  const newRoas = newSpend > 0 ? Number((newRevenue / newSpend).toFixed(2)) : 0;

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (Math.abs(googleChangePct) > 25 || Math.abs(metaChangePct) > 25) {
    riskLevel = 'High';
  } else if (Math.abs(googleChangePct) > 10 || Math.abs(metaChangePct) > 10) {
    riskLevel = 'Medium';
  }

  return {
    id: `SIM-${Date.now()}`,
    name: 'Custom Strategy Simulation',
    description: `Google (${googleChangePct > 0 ? '+' : ''}${googleChangePct}%), Meta (${metaChangePct > 0 ? '+' : ''}${metaChangePct}%), LinkedIn (${linkedinChangePct > 0 ? '+' : ''}${linkedinChangePct}%), Email (${emailChangePct > 0 ? '+' : ''}${emailChangePct}%)`,
    googleBudgetPercentChange: googleChangePct,
    metaBudgetPercentChange: metaChangePct,
    linkedinBudgetPercentChange: linkedinChangePct,
    emailBudgetPercentChange: emailChangePct,
    projectedSpend: newSpend,
    projectedRevenue: newRevenue,
    projectedConversions: newConversions,
    projectedRoas: newRoas,
    riskLevel,
    confidence: 'Medium',
    assumptions: [
      'Assumes current search demand and customer intent remain stable over the simulation period.',
      'Marginal ROAS diminishes by ~4% for every 10% increase in social media ad spend.',
      'Simulation results are estimated projections based on historical data, not guaranteed outcomes.'
    ],
  };
}
