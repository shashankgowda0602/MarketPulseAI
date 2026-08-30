export type PlatformType =
  | 'Google Ads'
  | 'Meta Ads'
  | 'Instagram'
  | 'LinkedIn'
  | 'YouTube'
  | 'Email'
  | 'TikTok'
  | 'Pinterest'
  | 'X / Twitter'
  | 'Snapchat'
  | 'Amazon Ads'
  | (string & {});

export type CampaignStatus = 'winning' | 'needs_attention' | 'underperforming' | 'insufficient_data';

export type CampaignLifecycle = 'Active' | 'Paused' | 'Archived';

export interface DailyDataPoint {
  date: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface Campaign {
  id: string;
  name: string;
  platform: PlatformType;
  campaignType: string;
  startDate: string;
  endDate: string;
  budget: number;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  conversions: number;
  revenue: number;
  audience: string;
  region: string;
  lifecycleState?: CampaignLifecycle;
  status?: CampaignStatus;
  statusReason?: string;
  dailyHistory?: DailyDataPoint[];
}

export interface CalculatedMetrics {
  ctr: number; // Percentage
  conversionRate: number; // Percentage
  cpc: number; // Cost per click
  cpa: number; // Cost per acquisition
  roas: number; // Return on ad spend multiplier
  cpm: number; // Cost per mille impressions
  profit: number; // Revenue - Spend
  spendRatio: number; // Spend / Budget
}

export interface ClassificationThresholds {
  minClicksForReliability: number;
  minImpressionsForReliability: number;
  winningRoas: number;
  winningConvRate: number;
  underperformingRoas: number;
  underperformingCpa: number;
}

export interface DataQualityReport {
  score: number; // 0 - 100
  totalRows: number;
  validRows: number;
  missingRevenueCount: number;
  duplicateCount: number;
  zeroImpressionsCount: number;
  warnings: string[];
  errors: string[];
  qualityBand: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface AIInsightItem {
  id: string;
  type: 'verified' | 'hypothesis' | 'recommendation' | 'limitation';
  title: string;
  description: string;
  metrics?: { label: string; value: string | number }[];
  confidence: 'High' | 'Medium' | 'Low';
  priority?: 'High' | 'Medium' | 'Low';
  risk?: string;
  expectedOutcome?: string;
  humanApprovalRequired?: boolean;
  timestamp: string;
}

export interface RecommendationItem {
  id: string;
  action: string;
  why: string;
  dataEvidence: string;
  expectedBenefit: string;
  possibleRisk: string;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  priority: 'High' | 'Medium' | 'Low';
  category: 'budget' | 'audience' | 'creative' | 'landing_page' | 'sustainability';
  humanApprovalRequired: boolean;
  status: 'pending' | 'approved' | 'rejected';
  estimatedImpact: string;
  targetCampaignId?: string;
  targetCampaignName?: string;
}

export interface RootCauseInvestigation {
  id: string;
  patternType: 'Pattern 1: High Impressions + Low Clicks' | 'Pattern 2: High Clicks + Low Conversions' | 'Pattern 3: High Spend + Low ROAS';
  affectedCampaigns: string[];
  summary: string;
  hypotheses: string[];
  checklist: {
    id: string;
    label: string;
    completed: boolean;
  }[];
}

export interface ForecastPoint {
  date: string;
  isHistorical: boolean;
  spend: number;
  spendLower: number;
  spendUpper: number;
  revenue: number;
  revenueLower: number;
  revenueUpper: number;
  conversions: number;
  conversionsLower: number;
  conversionsUpper: number;
  roas: number;
}

export interface CustomerFeedback {
  id: string;
  author: string;
  anonymizedAuthor?: string;
  date: string;
  platform: PlatformType | 'Website' | 'App Store' | 'Google Review' | string;
  channel?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1
  rating: number; // 1 to 5
  text: string;
  theme: string;
  topic?: string;
  isAnonymized: boolean;
}

export interface SustainabilityMetrics {
  economicWasteSpend: number;
  economicWastePercentage: number;
  lowRoasCampaignsCount: number;
  hoursSavedPerWeek: number;
  manualDashboardsReplaced: number;
  adFatigueRiskCampaigns: number;
  averageFrequency: number;
  customerSatisfactionScore: number;
  co2DigitalEstimateKg: number;
}

export interface StrategyScenario {
  id: string;
  name: string;
  description: string;
  googleBudgetPercentChange: number;
  metaBudgetPercentChange: number;
  linkedinBudgetPercentChange: number;
  emailBudgetPercentChange: number;
  projectedSpend: number;
  projectedRevenue: number;
  projectedConversions: number;
  projectedRoas: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: 'High' | 'Medium' | 'Low';
  assumptions: string[];
}

export type PageId =
  | 'landing'
  | 'upload'
  | 'dashboard'
  | 'campaigns'
  | 'insights'
  | 'recommendations'
  | 'forecasting'
  | 'customer_insights'
  | 'sustainability'
  | 'settings';

export interface UploadHistoryItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileSizeBytesText: string;
  format: 'CSV' | 'XLSX' | 'XLS' | 'JSON';
  uploadedAt: string;
  timestamp: number;
  campaignsCount: number;
  totalSpend: number;
  totalRevenue: number;
  blendedRoas: number;
  winningCount: number;
  underperformingCount: number;
  qualityScore: number;
  campaigns: Campaign[];
  report?: any;
}
