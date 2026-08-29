import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  PlusCircle,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  Download,
  HelpCircle,
  Check,
  FileCode,
  Table,
  Search,
  Filter,
  Trash2,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Zap,
  DollarSign,
  PieChart,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  History,
  Clock,
  FileText,
  X,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Campaign, PlatformType, UploadHistoryItem } from '../types';
import { INITIAL_DEMO_CAMPAIGNS } from '../data/demoCampaigns';
import { parseRawFileContent, ParsedFileReport } from '../utils/fileParser';
import { calculateCampaignMetrics, calculateDatasetSummary } from '../utils/analyticsEngine';
import * as XLSX from 'xlsx';

export const DataUploadPage: React.FC = () => {
  const {
    campaigns,
    qualityReport,
    handleCustomDataUpload,
    resetToDemoData,
    setCurrentPage,
    formatMoney,
    currencyConfig,
    uploadedFileInfo,
    uploadHistory,
    activeHistoryId,
    restoreHistoricalFile,
    removeHistoricalFile,
    clearAllHistory,
    addNotification,
  } = useApp();

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  
  // History State
  const [historySearch, setHistorySearch] = useState('');
  const [historyFormatFilter, setHistoryFormatFilter] = useState<'All' | 'CSV' | 'XLSX' | 'JSON'>('All');
  const [fileToDelete, setFileToDelete] = useState<UploadHistoryItem | null>(null);
  const [isClearHistoryConfirmOpen, setIsClearHistoryConfirmOpen] = useState(false);

  // Manual Add Form State
  const [manualForm, setManualForm] = useState<Partial<Campaign>>({
    name: '',
    platform: 'Google Ads',
    campaignType: 'Search High Intent',
    startDate: '2026-08-01',
    endDate: '2026-08-28',
    budget: 50000,
    spend: 42000,
    impressions: 400000,
    reach: 310000,
    clicks: 16000,
    conversions: 520,
    revenue: 185000,
    audience: 'Urban High-Intent Buyers',
    region: 'Pan India Metros',
  });

  const handleProcessFile = async (file: File) => {
    setIsParsing(true);
    setParseError(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let content: string | ArrayBuffer;

      if (ext === 'xlsx' || ext === 'xls') {
        content = await file.arrayBuffer();
      } else {
        content = await file.text();
      }

      const { campaigns: parsedCampaigns, report } = parseRawFileContent(content, file.name, file.size);

      if (parsedCampaigns.length === 0) {
        throw new Error('No valid marketing campaign rows could be detected in this file.');
      }

      handleCustomDataUpload(parsedCampaigns, report);
      addNotification(`Successfully analyzed "${file.name}" with ${parsedCampaigns.length} campaigns!`);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setParseError(err?.message || 'Failed to parse file. Please verify CSV, Excel, or JSON structure.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleProcessFile(file);
    // Reset file input so re-uploading the same file triggers change
    event.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleProcessFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Sample Datasets for 1-Click Instant Testing
  const handleLoadSampleDataset = (type: 'ecommerce_csv' | 'omnichannel_xlsx' | 'b2b_json') => {
    if (type === 'ecommerce_csv') {
      const sampleCsv = `id,campaign_name,platform,type,budget,spend,impressions,reach,clicks,conversions,revenue,audience,region
ECOM-01,Summer Footwear Flash Sale,Google Ads,Shopping,65000,58000,480000,380000,19200,640,245000,Shoe & Fashion Buyers,Metro Cities
ECOM-02,Monsoon Athleisure Reel Ads,Instagram,Video Ads,42000,40000,590000,450000,24000,510,132000,Gen-Z & Active Youth,Mumbai & Bangalore
ECOM-03,D2C Organic Skin Care Bundle,Meta Ads,Carousel,35000,34000,320000,240000,12500,410,128000,Skincare & Wellness,Tier 1 & 2
ECOM-04,Smart Gadgets Tech Week,YouTube,In-Stream Video,50000,48000,410000,310000,8200,120,59000,Tech Enthusiasts,Pan-India
ECOM-05,VIP Customer Loyalty Push,Email,Direct Mailer,15000,9000,88000,85000,10500,480,142000,Subscribers 60+ Days,Global
ECOM-06,Kitchen Appliances Mega Deal,Google Ads,Search,55000,52000,390000,290000,14800,490,210000,Home Owners (28-50),Tier 1 Cities
ECOM-07,Fitness Wear Clearance,Meta Ads,Story Ads,28000,27000,260000,190000,7400,140,32000,Gym Goers & Runners,Delhi NCR`;

      const { campaigns: parsed, report } = parseRawFileContent(sampleCsv, 'E-Commerce_Q3_Campaigns.csv', sampleCsv.length);
      handleCustomDataUpload(parsed, report);
      addNotification('Loaded E-Commerce Multi-Channel CSV dataset.');
    } else if (type === 'omnichannel_xlsx') {
      const rows = [
        { 'Campaign ID': 'XLS-101', 'Campaign Name': 'PMax Festive Luxury Electronics', 'Channel': 'Google Ads', 'Spend': 72000, 'Revenue': 310000, 'Impressions': 640000, 'Clicks': 23000, 'Conversions': 780, 'Budget': 80000, 'Audience': 'Affluent Buyers' },
        { 'Campaign ID': 'XLS-102', 'Campaign Name': 'Dynamic Retargeting Catalog', 'Channel': 'Meta Ads', 'Spend': 38000, 'Revenue': 165000, 'Impressions': 290000, 'Clicks': 14200, 'Conversions': 520, 'Budget': 40000, 'Audience': 'Cart Dropoffs' },
        { 'Campaign ID': 'XLS-103', 'Campaign Name': 'Influencer Unboxing Campaign', 'Channel': 'Instagram', 'Spend': 45000, 'Revenue': 92000, 'Impressions': 710000, 'Clicks': 21000, 'Conversions': 290, 'Budget': 48000, 'Audience': 'Tech Review Followers' },
        { 'Campaign ID': 'XLS-104', 'Campaign Name': 'B2B Procurement Direct Search', 'Channel': 'LinkedIn', 'Spend': 60000, 'Revenue': 285000, 'Impressions': 130000, 'Clicks': 4900, 'Conversions': 260, 'Budget': 65000, 'Audience': 'Enterprise Buyers' },
        { 'Campaign ID': 'XLS-105', 'Campaign Name': 'Brand Awareness Shorts Video', 'Channel': 'YouTube', 'Spend': 32000, 'Revenue': 29000, 'Impressions': 510000, 'Clicks': 6100, 'Conversions': 75, 'Budget': 35000, 'Audience': 'General Audience' },
      ];

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Campaign_Data');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const { campaigns: parsed, report } = parseRawFileContent(wbout, 'Omnichannel_Performance_2026.xlsx', wbout.byteLength);
      handleCustomDataUpload(parsed, report);
      addNotification('Loaded Omnichannel Excel (.XLSX) dataset.');
    } else {
      const jsonSample = [
        { id: 'SaaS-01', name: 'HR Tech Enterprise Lead Gen', platform: 'LinkedIn', spend: 85000, revenue: 420000, impressions: 160000, clicks: 5400, conversions: 380, budget: 90000, audience: 'VP HR & People Ops' },
        { id: 'SaaS-02', name: 'Developer Tools Self-Serve Trial', platform: 'Google Ads', spend: 62000, revenue: 260000, impressions: 430000, clicks: 18500, conversions: 620, budget: 65000, audience: 'DevOps Engineers & CTOs' },
        { id: 'SaaS-03', name: 'Product Update Webinar Blast', platform: 'Email', spend: 11000, revenue: 98000, impressions: 72000, clicks: 9200, conversions: 430, budget: 12000, audience: 'Active Trial Users' },
        { id: 'SaaS-04', name: 'Competitor Alternative Comparison', platform: 'Google Ads', spend: 48000, revenue: 195000, impressions: 280000, clicks: 11200, conversions: 390, budget: 50000, audience: 'High-Intent Switchers' },
        { id: 'SaaS-05', name: 'Brand Storytelling Discovery', platform: 'Meta Ads', spend: 29000, revenue: 31000, impressions: 310000, clicks: 5800, conversions: 90, budget: 30000, audience: 'Startup Founders' },
      ];
      const jsonStr = JSON.stringify(jsonSample, null, 2);
      const { campaigns: parsed, report } = parseRawFileContent(jsonStr, 'B2B_SaaS_Pipeline.json', jsonStr.length);
      handleCustomDataUpload(parsed, report);
      addNotification('Loaded B2B SaaS JSON dataset.');
    }
  };

  const handleDownloadSampleCSV = () => {
    const sampleHeaders = 'id,name,platform,campaignType,startDate,endDate,budget,spend,impressions,reach,clicks,conversions,revenue,audience,region';
    const sampleRows = [
      'CMP-001,Summer Search Promo,Google Ads,Search,2026-08-01,2026-08-28,50000,42000,400000,310000,16000,520,185000,High-Intent Buyers,Pan India Metros',
      'CMP-002,Retargeting Carousel,Meta Ads,Retargeting,2026-08-01,2026-08-28,35000,31000,280000,195000,11200,390,132000,Past 30-Day Visitors,Tier 1 & 2 Cities',
      'CMP-003,Influencer Reels Push,Instagram,Brand Video,2026-08-05,2026-08-28,45000,44000,620000,480000,18500,240,78000,Gen-Z Shoppers,Metro Youth',
      'CMP-004,B2B Decision Makers,LinkedIn,Sponsored Content,2026-08-01,2026-08-28,60000,56000,190000,140000,6400,180,240000,Founders & CMOs,India & Singapore',
      'CMP-005,Product Unboxing Video,YouTube,TrueView In-Stream,2026-08-10,2026-08-28,40000,38000,510000,390000,14200,210,89000,Tech Enthusiasts,Pan India',
      'CMP-006,VIP Customer Newsletter,Email,Direct Response,2026-08-01,2026-08-28,15000,12000,95000,90000,8900,420,165000,Existing Subscribers,Global',
    ];
    const csvData = [sampleHeaders, ...sampleRows].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Sample_Marketing_Campaigns.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Downloaded sample campaign CSV template.');
  };

  const handleExportCurrentDataCSV = () => {
    const headers = 'id,name,platform,campaignType,budget,spend,impressions,clicks,conversions,revenue,roas,cpa,ctr';
    const rows = campaigns.map((c) => {
      const m = calculateCampaignMetrics(c);
      return `"${c.id}","${c.name.replace(/"/g, '""')}","${c.platform}","${c.campaignType}",${c.budget},${c.spend},${c.impressions},${c.clicks},${c.conversions},${c.revenue},${m.roas},${m.cpa},${m.ctr}`;
    });
    const csvData = [headers, ...rows].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Analyzed_Campaigns_${uploadedFileInfo?.fileName || 'dataset'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Exported analyzed dataset.');
  };

  const handleAddManualRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name) return;

    const newCampaign: Campaign = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      name: manualForm.name || 'New Custom Campaign',
      platform: manualForm.platform as PlatformType,
      campaignType: manualForm.campaignType || 'Performance',
      startDate: manualForm.startDate || '2026-08-01',
      endDate: manualForm.endDate || '2026-08-28',
      budget: Number(manualForm.budget) || 10000,
      spend: Number(manualForm.spend) || 8000,
      impressions: Number(manualForm.impressions) || 100000,
      reach: Number(manualForm.reach) || 80000,
      clicks: Number(manualForm.clicks) || 4000,
      conversions: Number(manualForm.conversions) || 150,
      revenue: Number(manualForm.revenue) || 45000,
      audience: manualForm.audience || 'Target Audience',
      region: manualForm.region || 'Metros',
    };

    handleCustomDataUpload([newCampaign, ...campaigns]);
    setIsManualModalOpen(false);
    addNotification(`Added manual campaign "${newCampaign.name}".`);
  };

  const handleDeleteRow = (id: string) => {
    const updated = campaigns.filter((c) => c.id !== id);
    if (updated.length === 0) {
      alert('You cannot delete all campaigns. Resetting to demo data.');
      resetToDemoData();
      return;
    }
    handleCustomDataUpload(updated);
    addNotification(`Removed campaign #${id}.`);
  };

  const handleConfirmDeleteFile = () => {
    if (!fileToDelete) return;
    removeHistoricalFile(fileToDelete.id);
    setFileToDelete(null);
  };

  const handleExportHistoricalItem = (item: UploadHistoryItem) => {
    const headers = 'id,name,platform,campaignType,budget,spend,impressions,clicks,conversions,revenue,roas,cpa,ctr';
    const rows = item.campaigns.map((c) => {
      const m = calculateCampaignMetrics(c);
      return `"${c.id}","${c.name.replace(/"/g, '""')}","${c.platform}","${c.campaignType}",${c.budget},${c.spend},${c.impressions},${c.clicks},${c.conversions},${c.revenue},${m.roas},${m.cpa},${m.ctr}`;
    });
    const csvData = [headers, ...rows].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.fileName.replace(/\.[^/.]+$/, '')}_export.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification(`Exported "${item.fileName}" from history.`);
  };

  const handleRemoveActiveFile = () => {
    const activeName = uploadedFileInfo?.fileName || 'dataset';
    resetToDemoData();
    addNotification(`Unloaded "${activeName}". Restored default multi-channel demo dataset.`);
  };

  // History Filtering
  const filteredHistory = uploadHistory.filter((item) => {
    const matchesSearch =
      item.fileName.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.format.toLowerCase().includes(historySearch.toLowerCase());
    const matchesFormat = historyFormatFilter === 'All' || item.format === historyFormatFilter;
    return matchesSearch && matchesFormat;
  });

  // Instant Metrics for active dataset / uploaded file
  const summary = calculateDatasetSummary(campaigns);
  const winningCampaigns = campaigns.filter((c) => (c.spend > 0 ? c.revenue / c.spend >= 2.5 : false));
  const underperformingCampaigns = campaigns.filter((c) => (c.spend > 0 ? c.revenue / c.spend < 1.8 : false));
  const wastedCapitalEstimate = underperformingCampaigns.reduce(
    (sum, c) => sum + Math.max(0, c.spend - c.revenue / 2),
    0
  );

  // Filtered rows for table
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.platform.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesPlatform = selectedPlatform === 'All' || c.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Campaign Data Ingestion & Live File Analysis</h1>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
              CSV • Excel (.xlsx) • JSON
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Upload your marketing campaign files. All charts, ROAS metrics, AI root causes, and forecasting automatically adapt to your uploaded data.
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleDownloadSampleCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download blank sample CSV template"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Blank CSV Template</span>
          </button>
          <button
            onClick={resetToDemoData}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default multi-channel demo dataset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Reset Demo Data</span>
          </button>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Go to Analytics Dashboard</span>
          </button>
        </div>
      </div>

      {/* Active File Ingestion Quick Action Bar */}
      {uploadedFileInfo && (
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200 relative group">
          <div className="flex items-start sm:items-center gap-3 pr-8 md:pr-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              {uploadedFileInfo.format === 'JSON' ? (
                <FileCode className="w-5 h-5" />
              ) : uploadedFileInfo.format === 'XLSX' ? (
                <FileSpreadsheet className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-900 font-mono">{uploadedFileInfo.fileName}</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Active Ingested Dataset
                </span>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono">
                  .{uploadedFileInfo.format}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {uploadedFileInfo.fileSizeBytesText} • {campaigns.length} campaigns ingested • Quality score: <strong className="text-indigo-700">{uploadedFileInfo.qualityScore}%</strong> • Processed {uploadedFileInfo.parsedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={handleExportCurrentDataCSV}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleRemoveActiveFile}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Remove active file and restore default demo data"
            >
              <X className="w-3.5 h-3.5 text-rose-600" />
              <span>Remove File</span>
            </button>
          </div>

          {/* Quick Corner 'X' Close Button */}
          <button
            onClick={handleRemoveActiveFile}
            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100/80 rounded-lg transition-colors cursor-pointer"
            title="Remove this uploaded file"
            aria-label="Remove active file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`p-8 sm:p-12 rounded-3xl bg-white border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-4 shadow-xs relative ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-indigo-400'
        }`}
      >
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
          {isParsing ? <RefreshCw className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8" />}
        </div>

        <div className="max-w-md space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900">
            {uploadedFileInfo
              ? `Currently Analyzing: ${uploadedFileInfo.fileName}`
              : 'Drag & Drop Your Campaign Data File Here'}
          </h2>
          <p className="text-xs text-slate-500">
            Supports CSV, TSV, Microsoft Excel (.xlsx, .xls), and JSON exports from Google Ads, Meta, Instagram, LinkedIn, YouTube, and Email.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <label className="cursor-pointer px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-105 flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            <span>Choose File to Analyze</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json,.txt,.tsv"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-purple-600" />
            <span>Add Single Campaign</span>
          </button>
        </div>

        {parseError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 max-w-lg text-left">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <span>✓ CSV, XLSX & JSON</span>
          <span>•</span>
          <span>✓ Automatic Header & Currency Normalization</span>
          <span>•</span>
          <span>✓ 100% In-Browser Secure Analysis</span>
        </div>
      </div>

      {/* 1-Click Instant Test Datasets */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-900">Try Instant Sample Files (1-Click Analysis):</span>
          </div>
          <span className="text-[11px] text-slate-500">Test different file formats and schemas</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleLoadSampleDataset('ecommerce_csv')}
            className="p-3 bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">E-Commerce Q3 (CSV)</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">.CSV</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">7 Retail campaigns across Google, Meta, Instagram & Email</p>
          </button>

          <button
            onClick={() => handleLoadSampleDataset('omnichannel_xlsx')}
            className="p-3 bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Omnichannel Growth (.XLSX)</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">.XLSX</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Excel workbook with PMax, Retargeting & Influencers</p>
          </button>

          <button
            onClick={() => handleLoadSampleDataset('b2b_json')}
            className="p-3 bg-white hover:bg-purple-50/80 border border-slate-200 hover:border-purple-300 rounded-xl text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700">B2B SaaS Pipeline (.JSON)</span>
              <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-mono font-bold">.JSON</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">JSON array of enterprise LinkedIn & Search ad sets</p>
          </button>
        </div>
      </div>

      {/* Upload & Ingestion History Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Upload & Ingestion History</h3>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  {uploadHistory.length} {uploadHistory.length === 1 ? 'Upload' : 'Uploads'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch between previously parsed datasets, re-export historical files, or remove specific uploads from memory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search filter in history */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search history by name..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 w-44 sm:w-52"
              />
              {historySearch && (
                <button
                  onClick={() => setHistorySearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Format Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              {(['All', 'CSV', 'XLSX', 'JSON'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setHistoryFormatFilter(fmt)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                    historyFormatFilter === fmt
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Clear All History Button */}
            {uploadHistory.length > 0 && (
              <button
                onClick={() => setIsClearHistoryConfirmOpen(true)}
                className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear all saved upload history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* History List or Empty State */}
        {uploadHistory.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-50/70 border border-dashed border-slate-200 space-y-2">
            <History className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">No Past Uploads in History</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Any CSV, Excel, or JSON files you drag-and-drop or load will be saved here so you can quickly switch datasets or clean them up anytime.
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
            No history records match your search query "{historySearch}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredHistory.map((item) => {
              const isActive = activeHistoryId === item.id || uploadedFileInfo?.fileName === item.fileName;
              const itemSummary = calculateDatasetSummary(item.campaigns);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 relative ${
                    isActive
                      ? 'bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-mono text-[10px] font-bold shadow-2xs ${
                          item.format === 'JSON'
                            ? 'bg-purple-600'
                            : item.format === 'XLSX'
                            ? 'bg-emerald-600'
                            : 'bg-indigo-600'
                        }`}
                      >
                        .{item.format}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]" title={item.fileName}>
                            {item.fileName}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.uploadedAt}
                          </span>
                          <span>•</span>
                          <span>{item.fileSizeBytesText}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{item.campaignsCount} campaigns</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick 'X' remove button on each file */}
                    <button
                      onClick={() => setFileToDelete(item)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                      title={`Remove "${item.fileName}" from history`}
                      aria-label={`Remove file ${item.fileName}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Summary Metric Chips */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">Spend</span>
                      <span className="text-[11px] font-bold text-slate-800">{formatMoney(itemSummary.totalSpend)}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">Revenue</span>
                      <span className="text-[11px] font-bold text-emerald-600">{formatMoney(itemSummary.totalRevenue)}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">ROAS</span>
                      <span className="text-[11px] font-black text-indigo-600">{itemSummary.averageRoas}x</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">Health</span>
                      <span className="text-[11px] font-bold text-slate-700">{item.qualityScore}%</span>
                    </div>
                  </div>

                  {/* Actions for this history record */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => handleExportHistoricalItem(item)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Download file CSV"
                    >
                      <Download className="w-3 h-3 text-slate-500" />
                      <span>Download</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setFileToDelete(item)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title={`Remove "${item.fileName}"`}
                      >
                        <X className="w-3.5 h-3.5 text-rose-500" />
                        <span>Remove</span>
                      </button>

                      {isActive ? (
                        <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded-lg shadow-2xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Currently Loaded</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => restoreHistoricalFile(item.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg shadow-2xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Load Dataset</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LIVE FILE ANALYSIS RESULTS DASHBOARD */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {uploadedFileInfo ? `Analysis Results for "${uploadedFileInfo.fileName}"` : 'Live Dataset Performance Summary'}
              </h2>
              <p className="text-xs text-slate-500">
                Mathematical metrics computed directly from the active file ({campaigns.length} campaign rows)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCurrentDataCSV}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Analyzed CSV</span>
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore in Full Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6 Key Executive Metrics of Uploaded File */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Spend</span>
            <div className="text-base sm:text-lg font-black text-slate-900 mt-1">{formatMoney(summary.totalSpend)}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">{campaigns.length} total campaigns</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
            <div className="text-base sm:text-lg font-black text-emerald-600 mt-1">{formatMoney(summary.totalRevenue)}</div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
              +{formatMoney(summary.totalProfit)} net
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blended ROAS</span>
            <div className="text-base sm:text-lg font-black text-indigo-600 mt-1">{summary.averageRoas}x</div>
            <span className="text-[10px] text-indigo-600 font-semibold mt-0.5 block">Portfolio Return</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Conversions</span>
            <div className="text-base sm:text-lg font-black text-slate-900 mt-1">{summary.totalConversions.toLocaleString()}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Avg CPA {formatMoney(summary.averageCpa)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Top Channel</span>
            <div className="text-base font-bold text-slate-900 mt-1 truncate">{summary.topPlatform}</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Peak Channel ROAS</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Underperforming</span>
            <div className="text-base sm:text-lg font-black text-amber-600 mt-1">{underperformingCampaigns.length}</div>
            <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">
              ~{formatMoney(wastedCapitalEstimate)} drag
            </span>
          </div>
        </div>

        {/* 5 Core Intelligence Answers For This Uploaded File */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">5 Direct Purpose Answers for Uploaded Data</h3>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Verified Calculations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Which campaigns are working */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1. Which campaigns are working?</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                <strong className="text-emerald-900">{summary.topPerformingCampaignName}</strong> is your top performer delivering{' '}
                <strong className="text-emerald-900">{summary.topPerformingRoas}x ROAS</strong>. There are {winningCampaigns.length} campaigns operating above the 2.5x profitability benchmark.
              </p>
            </div>

            {/* 2. Which campaigns are underperforming */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>2. Which campaigns are underperforming?</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                <strong className="text-amber-900">{summary.lowestPerformingCampaignName}</strong> is struggling at{' '}
                <strong className="text-amber-900">{summary.lowestPerformingRoas}x ROAS</strong>. {underperformingCampaigns.length} campaigns are below the 1.8x minimum efficiency threshold.
              </p>
            </div>

            {/* 3. Where money is being wasted */}
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold">
                <DollarSign className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>3. Where is money getting wasted?</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Estimated capital leakage of <strong className="text-rose-900">{formatMoney(wastedCapitalEstimate)}</strong> across low-converting discovery ad sets with high CPC and saturated ad creative frequency.
              </p>
            </div>

            {/* 4. Why performance is changing */}
            <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200 space-y-2">
              <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>4. Why is performance changing?</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Channel divergence: High buyer intent in <strong className="text-sky-900">{summary.topPlatform}</strong> contrasts with audience fatigue in broad social channels where conversion rates drop below {summary.averageConvRate}%.
              </p>
            </div>

            {/* 5. What the team should do next */}
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2 md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-1.5 text-purple-800 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>5. What should the team do next?</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Reallocate 15-20% ad budget from <strong>{summary.lowestPerformingCampaignName}</strong> into <strong>{summary.topPerformingCampaignName}</strong>, pause fatigued video creatives, and review the pending action items in the Recommendations queue.
              </p>
            </div>
          </div>
        </div>

        {/* File Ingestion & Diagnostics Report */}
        {uploadedFileInfo && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">File Ingestion & Schema Mapping Diagnostics</h3>
                  <p className="text-xs text-slate-500">
                    Source: <span className="font-mono font-semibold">{uploadedFileInfo.fileName}</span> ({uploadedFileInfo.fileSizeBytesText}, {uploadedFileInfo.format}) • Processed at {uploadedFileInfo.parsedAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Health Score</span>
                  <span className="text-lg font-black text-indigo-600">{uploadedFileInfo.qualityScore}%</span>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl">
                  {uploadedFileInfo.qualityScore >= 80 ? 'Optimal Mapping' : 'Standard Ingestion'}
                </span>
              </div>
            </div>

            {/* Cleaning Actions Taken */}
            {uploadedFileInfo.cleaningActions.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">Automatic Sanitizations Applied:</span>
                {uploadedFileInfo.cleaningActions.map((act, i) => (
                  <div key={i} className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Interactive Campaign Data Table for Uploaded File */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Uploaded Records Breakdown ({filteredCampaigns.length} of {campaigns.length} campaigns)
              </h3>
            </div>

            {/* Search & Platform Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter campaign name or ID..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white w-48 sm:w-56"
                />
              </div>

              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700"
              >
                <option value="All">All Platforms</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Meta Ads">Meta Ads</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="YouTube">YouTube</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 text-xs custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">ID</th>
                  <th className="p-3 font-semibold">Campaign Name</th>
                  <th className="p-3 font-semibold">Platform</th>
                  <th className="p-3 font-semibold">Spend</th>
                  <th className="p-3 font-semibold">Revenue</th>
                  <th className="p-3 font-semibold">ROAS</th>
                  <th className="p-3 font-semibold">Conversions</th>
                  <th className="p-3 font-semibold">CPA</th>
                  <th className="p-3 font-semibold">CTR</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {filteredCampaigns.map((c) => {
                  const m = calculateCampaignMetrics(c);
                  const isWinning = m.roas >= 2.5;
                  const isUnderperforming = m.roas < 1.8;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono text-indigo-600 font-semibold">{c.id}</td>
                      <td className="p-3 font-semibold text-slate-900 max-w-[220px] truncate" title={c.name}>
                        {c.name}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          {c.platform}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-900">{formatMoney(c.spend)}</td>
                      <td className="p-3 font-semibold text-emerald-600">{formatMoney(c.revenue)}</td>
                      <td className="p-3 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            isWinning
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                              : isUnderperforming
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 font-bold'
                              : 'text-slate-800'
                          }`}
                        >
                          {m.roas}x
                        </span>
                      </td>
                      <td className="p-3 font-medium">{c.conversions.toLocaleString()}</td>
                      <td className="p-3 text-slate-600">{formatMoney(m.cpa)}</td>
                      <td className="p-3 text-slate-600">{m.ctr}%</td>
                      <td className="p-3">
                        {isWinning ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Winning
                          </span>
                        ) : isUnderperforming ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Underperforming
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            Stable
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteRow(c.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Remove this campaign from dataset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Entry Form Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-5 bg-white border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Add New Campaign Record</h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddManualRow} className="p-5 overflow-y-auto space-y-4 custom-scrollbar text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festive Search Promo"
                  value={manualForm.name}
                  onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Platform</label>
                  <select
                    value={manualForm.platform}
                    onChange={(e) => setManualForm({ ...manualForm, platform: e.target.value as PlatformType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Google Ads">Google Ads</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Campaign Type</label>
                  <input
                    type="text"
                    value={manualForm.campaignType}
                    onChange={(e) => setManualForm({ ...manualForm, campaignType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Spend</label>
                  <input
                    type="number"
                    value={manualForm.spend}
                    onChange={(e) => setManualForm({ ...manualForm, spend: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Revenue</label>
                  <input
                    type="number"
                    value={manualForm.revenue}
                    onChange={(e) => setManualForm({ ...manualForm, revenue: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Budget</label>
                  <input
                    type="number"
                    value={manualForm.budget}
                    onChange={(e) => setManualForm({ ...manualForm, budget: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Impressions</label>
                  <input
                    type="number"
                    value={manualForm.impressions}
                    onChange={(e) => setManualForm({ ...manualForm, impressions: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Clicks</label>
                  <input
                    type="number"
                    value={manualForm.clicks}
                    onChange={(e) => setManualForm({ ...manualForm, clicks: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Conversions</label>
                  <input
                    type="number"
                    value={manualForm.conversions}
                    onChange={(e) => setManualForm({ ...manualForm, conversions: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Add Campaign & Ingest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Specific Historical File Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Remove Uploaded File</h3>
                <p className="text-xs text-slate-500">Are you sure you want to remove this file from your history?</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">File Name:</span>
                <span className="font-semibold text-slate-900 font-mono">{fileToDelete.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Format & Size:</span>
                <span className="font-semibold text-slate-800">.{fileToDelete.format} ({fileToDelete.fileSizeBytesText})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Campaigns:</span>
                <span className="font-semibold text-indigo-600">{fileToDelete.campaignsCount} records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Ingested At:</span>
                <span className="text-slate-700">{fileToDelete.uploadedAt}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              {activeHistoryId === fileToDelete.id || uploadedFileInfo?.fileName === fileToDelete.fileName
                ? 'Note: This file is currently active. Deleting it will restore the default multi-channel demo dataset.'
                : 'This will remove the file record from local history. You can always re-upload it later.'}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteFile}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Remove File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All History Confirmation Modal */}
      {isClearHistoryConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Clear All Upload History</h3>
                <p className="text-xs text-slate-500">Remove all {uploadHistory.length} saved upload records from browser memory?</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will erase all saved historical datasets and reset the active view to the default demo data. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsClearHistoryConfirmOpen(false)}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllHistory();
                  setIsClearHistoryConfirmOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
