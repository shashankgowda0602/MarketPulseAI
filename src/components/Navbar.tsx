import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bot,
  ShieldCheck,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  ChevronDown,
  Upload,
  X,
} from 'lucide-react';
import { useApp, CurrencyType, CURRENCIES } from '../context/AppContext';
import { calculateDatasetSummary } from '../utils/analyticsEngine';

export const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const {
    currentPage,
    setCurrentPage,
    campaigns,
    qualityReport,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
    resetToDemoData,
    setIsChatOpen,
    setIsResponsibleAIPanelOpen,
    recommendations,
    uploadedFileInfo,
    addNotification,
  } = useApp();

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const pendingApprovals = recommendations.filter((r) => r.status === 'pending' && r.humanApprovalRequired).length;
  const summary = calculateDatasetSummary(campaigns);

  const handleExportCSV = () => {
    const headers = [
      'Campaign ID',
      'Name',
      'Platform',
      'Type',
      'Budget',
      'Spend',
      'Impressions',
      'Reach',
      'Clicks',
      'Conversions',
      'Revenue',
      'ROAS',
      'CPA',
      'CTR',
      'Status',
    ];

    const rows = campaigns.map((c) => {
      const roas = c.spend > 0 ? (c.revenue / c.spend).toFixed(2) : '0';
      const cpa = c.conversions > 0 ? (c.spend / c.conversions).toFixed(2) : '0';
      const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : '0';
      return [
        `"${c.id}"`,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.platform}"`,
        `"${c.campaignType}"`,
        c.budget,
        c.spend,
        c.impressions,
        c.reach,
        c.clicks,
        c.conversions,
        c.revenue,
        roas,
        cpa,
        ctr,
        `"${c.status || 'needs_attention'}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MarketPulse_AI_Campaign_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Exported full campaign performance report (CSV).');
    setIsExportDropdownOpen(false);
  };

  const handleExportJSON = () => {
    const exportData = {
      generatedAt: new Date().toISOString(),
      platform: 'MarketPulse AI – Marketing Campaign Intelligence Agent',
      summary,
      qualityReport,
      campaigns,
    };
    const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MarketPulse_AI_Intelligence_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Exported intelligence dataset (JSON).');
    setIsExportDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left: Sidebar toggle + Global Context Title */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Upload Files Shortcut */}
        <button
          id="btn-nav-upload-files"
          onClick={() => setCurrentPage('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentPage === 'upload'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
          }`}
          title="Upload campaign CSV or spreadsheet to analyze"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Files</span>
          <span className="text-[10px] opacity-75 hidden sm:inline">to Analyze</span>
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">Analyzing:</span>
          {uploadedFileInfo ? (
            <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-lg overflow-hidden group">
              <button
                onClick={() => setCurrentPage('upload')}
                className="text-xs text-indigo-700 hover:bg-indigo-100 px-2 py-0.5 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title={`Source File: ${uploadedFileInfo.fileName} (${uploadedFileInfo.fileSizeBytesText}) - Click to view upload studio`}
              >
                <FileSpreadsheet className="w-3 h-3 text-indigo-600" />
                <span className="max-w-[130px] truncate">{uploadedFileInfo.fileName}</span>
                <span className="text-[10px] text-indigo-500">({campaigns.length})</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetToDemoData();
                  addNotification(`Removed "${uploadedFileInfo.fileName}". Restored demo dataset.`);
                }}
                className="px-1.5 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100/80 border-l border-indigo-200 transition-colors cursor-pointer"
                title={`Remove "${uploadedFileInfo.fileName}" and restore demo data`}
                aria-label="Remove uploaded file"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold">
              {campaigns.length} Campaigns
            </span>
          )}
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="nav-search-input"
            type="text"
            placeholder="Search campaigns, platforms, audience..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentPage !== 'campaigns' && e.target.value.trim().length > 0) {
                setCurrentPage('campaigns');
              }
            }}
            className="w-full bg-slate-100/90 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Switcher */}
        <div className="relative">
          <button
            id="btn-currency-dropdown"
            onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            title="Switch Dashboard Display Currency"
          >
            <span className="font-bold text-indigo-600">{CURRENCIES[currency].symbol.trim()}</span>
            <span>{currency}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isCurrencyDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Select Display Currency
              </div>
              {(Object.keys(CURRENCIES) as CurrencyType[]).map((currKey) => {
                const isSelected = currency === currKey;
                return (
                  <button
                    key={currKey}
                    id={`btn-currency-select-${currKey}`}
                    onClick={() => {
                      setCurrency(currKey);
                      setIsCurrencyDropdownOpen(false);
                      addNotification(`Display currency switched to ${CURRENCIES[currKey].name}. All metrics updated.`);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${
                      isSelected ? 'text-indigo-600 font-bold bg-indigo-50/70' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-center font-bold text-slate-900">{CURRENCIES[currKey].symbol.trim()}</span>
                      <span>{currKey}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal truncate max-w-[90px]">
                      {CURRENCIES[currKey].name.split('(')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Responsible AI Gate Pill */}
        <button
          id="btn-nav-responsible-ai"
          onClick={() => setIsResponsibleAIPanelOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/70 text-emerald-700 border border-emerald-200 text-xs font-medium transition-colors cursor-pointer"
          title="Inspect Responsible AI Transparency Audit"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden lg:inline">Trust Score</span>
          <span className="font-bold">{qualityReport.score}%</span>
        </button>

        {/* Export Report Dropdown */}
        <div className="relative">
          <button
            id="btn-export-dropdown"
            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Export</span>
          </button>

          {isExportDropdownOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
              <button
                onClick={handleExportCSV}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV Report</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export JSON Dataset</span>
              </button>
            </div>
          )}
        </div>

        {/* Ask Pulse AI Floating Button Header Shortcut */}
        <button
          id="btn-header-ask-pulse"
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer hover:scale-105"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>
    </header>
  );
};
