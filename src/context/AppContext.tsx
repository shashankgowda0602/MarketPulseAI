import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Campaign,
  ClassificationThresholds,
  DataQualityReport,
  PageId,
  PlatformType,
  CampaignStatus,
  CampaignLifecycle,
  RecommendationItem,
  CustomerFeedback,
  RootCauseInvestigation,
  UploadHistoryItem,
} from '../types';
import { INITIAL_DEMO_CAMPAIGNS, DEMO_CUSTOMER_FEEDBACK } from '../data/demoCampaigns';
import { classifyAllCampaigns, DEFAULT_CLASSIFICATION_THRESHOLDS } from '../utils/classificationEngine';
import { validateDatasetQuality, calculateDatasetSummary } from '../utils/analyticsEngine';
import {
  generateActionableRecommendations,
  generateRootCauseInvestigations,
} from '../utils/insightsEngine';
import { ParsedFileReport } from '../utils/fileParser';

export type CurrencyType = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'CAD' | 'AUD' | 'SGD' | 'JPY';

export interface CurrencyConfig {
  symbol: string;
  code: CurrencyType;
  name: string;
  rateFromInr: number;
  locale: string;
}

export const CURRENCIES: Record<CurrencyType, CurrencyConfig> = {
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee (₹)', rateFromInr: 1, locale: 'en-IN' },
  USD: { symbol: '$', code: 'USD', name: 'US Dollar ($)', rateFromInr: 0.012, locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro (€)', rateFromInr: 0.011, locale: 'de-DE' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound (£)', rateFromInr: 0.0094, locale: 'en-GB' },
  AED: { symbol: 'AED ', code: 'AED', name: 'UAE Dirham (AED)', rateFromInr: 0.044, locale: 'en-AE' },
  CAD: { symbol: 'CA$', code: 'CAD', name: 'Canadian Dollar (CA$)', rateFromInr: 0.016, locale: 'en-CA' },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar (A$)', rateFromInr: 0.018, locale: 'en-AU' },
  SGD: { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar (S$)', rateFromInr: 0.016, locale: 'en-SG' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen (¥)', rateFromInr: 1.8, locale: 'ja-JP' },
};

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[]) => void;
  rawCampaigns: Campaign[];
  setRawCampaigns: (campaigns: Campaign[]) => void;
  thresholds: ClassificationThresholds;
  setThresholds: React.Dispatch<React.SetStateAction<ClassificationThresholds>>;
  qualityReport: DataQualityReport;
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  currencyConfig: CurrencyConfig;
  formatMoney: (amount: number, options?: { compact?: boolean; decimals?: number }) => string;
  convertMoney: (amount: number) => number;
  recommendations: RecommendationItem[];
  handleApproveRecommendation: (id: string) => void;
  handleRejectRecommendation: (id: string) => void;
  customerFeedback: CustomerFeedback[];
  setCustomerFeedback: (fb: CustomerFeedback[]) => void;
  rootCauses: RootCauseInvestigation[];
  toggleChecklistTask: (patternId: string, taskId: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isResponsibleAIPanelOpen: boolean;
  setIsResponsibleAIPanelOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPlatformFilter: PlatformType | 'All';
  setSelectedPlatformFilter: (plat: PlatformType | 'All') => void;
  selectedStatusFilter: CampaignStatus | 'All';
  setSelectedStatusFilter: (status: CampaignStatus | 'All') => void;
  selectedLifecycleFilter: CampaignLifecycle | 'All';
  setSelectedLifecycleFilter: (filter: CampaignLifecycle | 'All') => void;
  updateCampaignLifecycleState: (id: string, state: CampaignLifecycle) => void;
  comparisonCampaignIds: string[];
  toggleCampaignForComparison: (id: string) => void;
  clearComparison: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  activeRootCauseModalId: string | null;
  setActiveRootCauseModalId: (id: string | null) => void;
  resetToDemoData: () => void;
  uploadedFileInfo: ParsedFileReport | null;
  setUploadedFileInfo: (info: ParsedFileReport | null) => void;
  handleCustomDataUpload: (uploadedRows: Campaign[], report?: ParsedFileReport) => void;
  uploadHistory: UploadHistoryItem[];
  activeHistoryId: string | null;
  restoreHistoricalFile: (historyId: string) => void;
  removeHistoricalFile: (historyId: string) => void;
  clearAllHistory: () => void;
  notifications: string[];
  addNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_HISTORY_KEY = 'pulse_marketing_upload_history_v1';

const INITIAL_DEMO_HISTORY: UploadHistoryItem[] = [
  {
    id: 'HIST-SAMPLE-01',
    fileName: 'E-Commerce_Q3_Campaigns.csv',
    fileSize: 42800,
    fileSizeBytesText: '41.8 KB',
    format: 'CSV',
    uploadedAt: 'Today, 08:30 AM',
    timestamp: Date.now() - 3600000 * 3,
    campaignsCount: 7,
    totalSpend: 281000,
    totalRevenue: 850000,
    blendedRoas: 3.02,
    winningCount: 4,
    underperformingCount: 1,
    qualityScore: 98,
    campaigns: INITIAL_DEMO_CAMPAIGNS.slice(0, 7),
  },
  {
    id: 'HIST-SAMPLE-02',
    fileName: 'Omnichannel_Performance_2026.xlsx',
    fileSize: 68400,
    fileSizeBytesText: '66.8 KB',
    format: 'XLSX',
    uploadedAt: 'Yesterday, 04:15 PM',
    timestamp: Date.now() - 3600000 * 24,
    campaignsCount: 5,
    totalSpend: 247000,
    totalRevenue: 881000,
    blendedRoas: 3.57,
    winningCount: 3,
    underperformingCount: 1,
    qualityScore: 96,
    campaigns: INITIAL_DEMO_CAMPAIGNS.slice(7, 12),
  },
  {
    id: 'HIST-SAMPLE-03',
    fileName: 'B2B_SaaS_Pipeline.json',
    fileSize: 31200,
    fileSizeBytesText: '30.5 KB',
    format: 'JSON',
    uploadedAt: '2 days ago',
    timestamp: Date.now() - 3600000 * 48,
    campaignsCount: 5,
    totalSpend: 235000,
    totalRevenue: 1004000,
    blendedRoas: 4.27,
    winningCount: 4,
    underperformingCount: 1,
    qualityScore: 99,
    campaigns: INITIAL_DEMO_CAMPAIGNS.slice(12, 17),
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [rawCampaigns, setRawCampaigns] = useState<Campaign[]>(INITIAL_DEMO_CAMPAIGNS);
  const [thresholds, setThresholds] = useState<ClassificationThresholds>(DEFAULT_CLASSIFICATION_THRESHOLDS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(() =>
    classifyAllCampaigns(INITIAL_DEMO_CAMPAIGNS, DEFAULT_CLASSIFICATION_THRESHOLDS)
  );
  const [qualityReport, setQualityReport] = useState<DataQualityReport>(() =>
    validateDatasetQuality(INITIAL_DEMO_CAMPAIGNS)
  );
  const [currency, setCurrency] = useState<CurrencyType>('INR');
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(() =>
    generateActionableRecommendations(INITIAL_DEMO_CAMPAIGNS)
  );
  const [customerFeedback, setCustomerFeedback] = useState<CustomerFeedback[]>(DEMO_CUSTOMER_FEEDBACK);
  const [rootCauses, setRootCauses] = useState<RootCauseInvestigation[]>(() =>
    generateRootCauseInvestigations(INITIAL_DEMO_CAMPAIGNS)
  );
  const [uploadedFileInfo, setUploadedFileInfo] = useState<ParsedFileReport | null>(null);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  // Upload History from localStorage
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn('Failed to load upload history from localStorage', err);
    }
    return INITIAL_DEMO_HISTORY;
  });

  // Sync upload history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(uploadHistory));
    } catch (err) {
      console.warn('Failed to save upload history to localStorage', err);
    }
  }, [uploadHistory]);

  // Modals & Floating Drawers
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isResponsibleAIPanelOpen, setIsResponsibleAIPanelOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [activeRootCauseModalId, setActiveRootCauseModalId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<PlatformType | 'All'>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<CampaignStatus | 'All'>('All');
  const [selectedLifecycleFilter, setSelectedLifecycleFilter] = useState<CampaignLifecycle | 'All'>('All');
  const [comparisonCampaignIds, setComparisonCampaignIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([
    'Dataset loaded with 22 campaigns across 6 channels.',
    '3 high-impact recommendations require human approval.',
  ]);

  const addNotification = (msg: string) => {
    setNotifications((prev) => [msg, ...prev.slice(0, 7)]);
  };

  const updateCampaignLifecycleState = (id: string, newState: CampaignLifecycle) => {
    setRawCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, lifecycleState: newState } : c))
    );
    addNotification(`Campaign ${id} updated to ${newState}.`);
  };

  // Re-classify campaigns when rawCampaigns or thresholds change
  useEffect(() => {
    const classified = classifyAllCampaigns(rawCampaigns, thresholds);
    setCampaigns(classified);
    setQualityReport(validateDatasetQuality(rawCampaigns));
    setRootCauses(generateRootCauseInvestigations(classified));
  }, [rawCampaigns, thresholds]);

  const currencyConfig = CURRENCIES[currency] || CURRENCIES.INR;

  const convertMoney = (inrAmount: number): number => {
    const rate = currencyConfig.rateFromInr || 1;
    return inrAmount * rate;
  };

  const formatMoney = (inrAmount: number, options?: { compact?: boolean; decimals?: number }): string => {
    const converted = convertMoney(inrAmount);
    const sym = currencyConfig.symbol;
    const decimals = options?.decimals !== undefined ? options.decimals : (Math.abs(converted) < 10 && converted !== 0 ? 2 : 0);

    if (options?.compact) {
      if (Math.abs(converted) >= 1_000_000) {
        return `${sym}${(converted / 1_000_000).toFixed(1)}M`;
      }
      if (Math.abs(converted) >= 1_000) {
        return `${sym}${(converted / 1_000).toFixed(1)}k`;
      }
    }

    try {
      const formattedNumber = converted.toLocaleString(currencyConfig.locale || 'en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      return `${sym}${formattedNumber}`;
    } catch {
      return `${sym}${converted.toFixed(decimals)}`;
    }
  };

  const handleApproveRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'approved' } : rec))
    );
    addNotification(`Recommendation #${id} approved by human supervisor.`);
  };

  const handleRejectRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'rejected' } : rec))
    );
    addNotification(`Recommendation #${id} archived.`);
  };

  const toggleChecklistTask = (patternId: string, taskId: string) => {
    setRootCauses((prev) =>
      prev.map((rc) => {
        if (rc.id === patternId) {
          return {
            ...rc,
            checklist: rc.checklist.map((item) =>
              item.id === taskId ? { ...item, completed: !item.completed } : item
            ),
          };
        }
        return rc;
      })
    );
  };

  const toggleCampaignForComparison = (id: string) => {
    setComparisonCampaignIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const clearComparison = () => {
    setComparisonCampaignIds([]);
    setIsCompareModalOpen(false);
  };

  const resetToDemoData = () => {
    setUploadedFileInfo(null);
    setActiveHistoryId(null);
    setRawCampaigns(INITIAL_DEMO_CAMPAIGNS);
    setRecommendations(generateActionableRecommendations(INITIAL_DEMO_CAMPAIGNS));
    setCustomerFeedback(DEMO_CUSTOMER_FEEDBACK);
    addNotification('Reset to standard multi-channel demo dataset.');
  };

  const handleCustomDataUpload = (uploadedRows: Campaign[], report?: ParsedFileReport) => {
    const finalReport: ParsedFileReport = report || {
      fileName: 'custom_dataset.csv',
      fileSize: uploadedRows.length * 128,
      fileSizeBytesText: `${(uploadedRows.length * 0.12).toFixed(1)} KB`,
      format: 'CSV',
      totalRawRows: uploadedRows.length,
      validCampaignRows: uploadedRows.length,
      detectedHeaders: ['name', 'platform', 'spend', 'revenue', 'impressions', 'clicks', 'conversions'],
      fieldMappings: {},
      mappingConfidence: [],
      cleaningActions: ['Direct campaign import'],
      qualityScore: 95,
      totalSpend: uploadedRows.reduce((s, c) => s + c.spend, 0),
      totalRevenue: uploadedRows.reduce((s, c) => s + c.revenue, 0),
      blendedRoas: Number(
        (
          uploadedRows.reduce((s, c) => s + c.revenue, 0) /
          Math.max(1, uploadedRows.reduce((s, c) => s + c.spend, 0))
        ).toFixed(2)
      ),
      winningCount: uploadedRows.filter((c) => c.spend > 0 && c.revenue / c.spend >= 2.5).length,
      underperformingCount: uploadedRows.filter((c) => c.spend > 0 && c.revenue / c.spend < 1.8).length,
      parsedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setUploadedFileInfo(finalReport);
    setRawCampaigns(uploadedRows);
    setRecommendations(generateActionableRecommendations(uploadedRows));

    // Create & append to upload history record
    const historyId = `HIST-${Date.now()}`;
    const newHistoryItem: UploadHistoryItem = {
      id: historyId,
      fileName: finalReport.fileName,
      fileSize: finalReport.fileSize,
      fileSizeBytesText: finalReport.fileSizeBytesText,
      format: finalReport.format,
      uploadedAt: `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      timestamp: Date.now(),
      campaignsCount: uploadedRows.length,
      totalSpend: finalReport.totalSpend,
      totalRevenue: finalReport.totalRevenue,
      blendedRoas: finalReport.blendedRoas,
      winningCount: finalReport.winningCount,
      underperformingCount: finalReport.underperformingCount,
      qualityScore: finalReport.qualityScore,
      campaigns: uploadedRows,
      report: finalReport,
    };

    setActiveHistoryId(historyId);
    setUploadHistory((prev) => [
      newHistoryItem,
      ...prev.filter((p) => p.fileName !== finalReport.fileName || Math.abs(p.timestamp - newHistoryItem.timestamp) > 2000),
    ].slice(0, 25));

    // Adapt customer feedback to mention uploaded campaigns
    if (uploadedRows.length > 0) {
      const topCamp = uploadedRows[0].name;
      const secondCamp = uploadedRows[1]?.name || uploadedRows[0].name;
      const adaptedFeedback: CustomerFeedback[] = [
        {
          id: 'UPL-FB-01',
          author: 'Verified Buyer #1029',
          date: '2026-08-28',
          platform: 'Google Review',
          sentiment: 'positive',
          sentimentScore: 0.94,
          rating: 5,
          text: `Purchased through "${topCamp}". Seamless onboarding and the delivery arrived ahead of schedule!`,
          theme: 'High Intent Purchase Satisfaction',
          isAnonymized: true,
        },
        {
          id: 'UPL-FB-02',
          author: 'User #8841',
          date: '2026-08-27',
          platform: 'Website',
          sentiment: 'positive',
          sentimentScore: 0.86,
          rating: 5,
          text: `Great discount clarity on "${topCamp}". Checkout was instant and invoice was sent right away.`,
          theme: 'Transparent Pricing & Fast Checkout',
          isAnonymized: true,
        },
        {
          id: 'UPL-FB-03',
          author: 'Customer #4190',
          date: '2026-08-26',
          platform: 'Instagram',
          sentiment: 'negative',
          sentimentScore: -0.62,
          rating: 2,
          text: `Saw the ad for "${secondCamp}", but the mobile landing page had slow image load and broken button.`,
          theme: 'Mobile Landing Page Friction',
          isAnonymized: true,
        },
        {
          id: 'UPL-FB-04',
          author: 'Customer #7712',
          date: '2026-08-25',
          platform: 'Website',
          sentiment: 'neutral',
          sentimentScore: 0.05,
          rating: 3,
          text: `Ad frequency for "${secondCamp}" is too high. Seen this same banner 4 times today.`,
          theme: 'Ad Fatigue & Over-Frequency',
          isAnonymized: true,
        },
      ];
      setCustomerFeedback(adaptedFeedback);
    }

    addNotification(`Successfully analyzed "${finalReport.fileName}" with ${uploadedRows.length} campaign rows!`);
  };

  const restoreHistoricalFile = (historyId: string) => {
    const item = uploadHistory.find((h) => h.id === historyId);
    if (!item) return;

    setActiveHistoryId(item.id);
    const rep: ParsedFileReport = item.report || {
      fileName: item.fileName,
      fileSize: item.fileSize,
      fileSizeBytesText: item.fileSizeBytesText,
      format: item.format,
      totalRawRows: item.campaignsCount,
      validCampaignRows: item.campaignsCount,
      detectedHeaders: ['name', 'platform', 'spend', 'revenue', 'impressions', 'clicks', 'conversions'],
      fieldMappings: {},
      mappingConfidence: [],
      cleaningActions: ['Restored from Ingestion History'],
      qualityScore: item.qualityScore,
      totalSpend: item.totalSpend,
      totalRevenue: item.totalRevenue,
      blendedRoas: item.blendedRoas,
      winningCount: item.winningCount,
      underperformingCount: item.underperformingCount,
      parsedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setUploadedFileInfo(rep);
    setRawCampaigns(item.campaigns);
    setRecommendations(generateActionableRecommendations(item.campaigns));
    addNotification(`Restored historical file "${item.fileName}" into active analysis.`);
  };

  const removeHistoricalFile = (historyId: string) => {
    const target = uploadHistory.find((h) => h.id === historyId);
    setUploadHistory((prev) => prev.filter((h) => h.id !== historyId));

    if (activeHistoryId === historyId) {
      resetToDemoData();
      addNotification(`Removed active file "${target?.fileName || 'dataset'}" and restored default demo data.`);
    } else {
      addNotification(`Removed "${target?.fileName || 'dataset'}" from upload history.`);
    }
  };

  const clearAllHistory = () => {
    setUploadHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    } catch (e) {
      console.error(e);
    }
    if (uploadedFileInfo) {
      resetToDemoData();
    }
    addNotification('Cleared all upload history records.');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        campaigns,
        setCampaigns,
        rawCampaigns,
        setRawCampaigns,
        thresholds,
        setThresholds,
        qualityReport,
        currency,
        setCurrency,
        currencyConfig,
        formatMoney,
        convertMoney,
        recommendations,
        handleApproveRecommendation,
        handleRejectRecommendation,
        customerFeedback,
        setCustomerFeedback,
        rootCauses,
        toggleChecklistTask,
        isChatOpen,
        setIsChatOpen,
        isResponsibleAIPanelOpen,
        setIsResponsibleAIPanelOpen,
        searchQuery,
        setSearchQuery,
        selectedPlatformFilter,
        setSelectedPlatformFilter,
        selectedStatusFilter,
        setSelectedStatusFilter,
        selectedLifecycleFilter,
        setSelectedLifecycleFilter,
        updateCampaignLifecycleState,
        comparisonCampaignIds,
        toggleCampaignForComparison,
        clearComparison,
        isCompareModalOpen,
        setIsCompareModalOpen,
        activeRootCauseModalId,
        setActiveRootCauseModalId,
        resetToDemoData,
        uploadedFileInfo,
        setUploadedFileInfo,
        handleCustomDataUpload,
        uploadHistory,
        activeHistoryId,
        restoreHistoricalFile,
        removeHistoricalFile,
        clearAllHistory,
        notifications,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
