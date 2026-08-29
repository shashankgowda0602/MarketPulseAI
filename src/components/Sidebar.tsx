import React, { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  Bot,
  Lightbulb,
  TrendingUp,
  Users,
  Leaf,
  Settings,
  Upload,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  FileSpreadsheet,
  FileCode,
  X,
  History,
  Trash2,
} from 'lucide-react';
import { PageId } from '../types';
import { useApp } from '../context/AppContext';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC<{ isOpen: boolean; onCloseMobile?: () => void }> = ({
  isOpen,
  onCloseMobile,
}) => {
  const {
    currentPage,
    setCurrentPage,
    qualityReport,
    campaigns,
    setIsResponsibleAIPanelOpen,
    uploadedFileInfo,
    uploadHistory,
    resetToDemoData,
    removeHistoricalFile,
    restoreHistoricalFile,
    activeHistoryId,
    addNotification,
  } = useApp();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistoryList, setShowHistoryList] = useState(false);

  // Main beginner-friendly core nav items (Easy to understand and access)
  const primaryNavItems: NavItem[] = [
    { id: 'landing', label: 'Home & Quick Start', icon: Sparkles },
    {
      id: 'upload',
      label: 'Upload Files to Analyze',
      icon: Upload,
      badge: `${campaigns.length} Active`,
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      highlight: true,
    },
    { id: 'dashboard', label: 'Analytics Overview', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns List', icon: Target },
    { id: 'insights', label: 'AI Insights & Root Cause', icon: Bot },
    { id: 'recommendations', label: 'AI Action Queue', icon: Lightbulb, badge: '5 Ready', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  ];

  // Secondary/Advanced tools cleanly grouped so beginners aren't overwhelmed
  const advancedNavItems: NavItem[] = [
    { id: 'forecasting', label: 'Forecast Simulator', icon: TrendingUp },
    { id: 'customer_insights', label: 'Customer Reviews', icon: Users },
    { id: 'sustainability', label: 'Ad Fatigue & Eco', icon: Leaf },
    { id: 'settings', label: 'Settings & Rules', icon: Settings },
  ];

  const handleNavClick = (id: PageId) => {
    setCurrentPage(id);
    if (onCloseMobile) onCloseMobile();
  };

  const isAdvancedActive = advancedNavItems.some((item) => item.id === currentPage);

  return (
    <>
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-xs ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 bg-white">
          <div
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 font-['Space_Grotesk'] block">
                MarketPulseAI
              </span>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
                Easy Campaign Analyzer
              </p>
            </div>
          </div>
        </div>

        {/* Primary Navigation - Simple & Accessible */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 flex items-center justify-between text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span>Main Menu</span>
            <span className="text-emerald-600 font-normal capitalize">Beginner friendly</span>
          </div>

          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 shadow-xs'
                    : item.highlight
                    ? 'bg-indigo-50/50 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 border border-indigo-100/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-indigo-600'
                        : item.highlight
                        ? 'text-indigo-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      item.badgeColor ||
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Collapsible Advanced Section to avoid overwhelming beginners */}
          <div className="pt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>More Analytical Tools</span>
                {isAdvancedActive && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </div>
              {showAdvanced || isAdvancedActive ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {(showAdvanced || isAdvancedActive) && (
              <div className="mt-1 pl-2 space-y-1 border-l-2 border-slate-100 ml-3">
                {advancedNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Uploaded File & History Section */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
          {uploadedFileInfo ? (
            <div
              id="sidebar-active-file-box"
              onClick={() => handleNavClick('upload')}
              className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100/70 transition-colors cursor-pointer flex items-center justify-between gap-2 relative group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  {uploadedFileInfo.format === 'JSON' ? (
                    <FileCode className="w-3.5 h-3.5" />
                  ) : (
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className="text-[11px] font-bold text-indigo-950 truncate" title={uploadedFileInfo.fileName}>
                    {uploadedFileInfo.fileName}
                  </div>
                  <div className="text-[10px] text-indigo-700 flex items-center gap-1">
                    <span className="font-semibold">.{uploadedFileInfo.format}</span>
                    <span>•</span>
                    <span>{campaigns.length} campaigns</span>
                  </div>
                </div>
              </div>

              {/* Remove button 'X' at right side */}
              <button
                type="button"
                id="sidebar-remove-active-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  resetToDemoData();
                  addNotification(`Removed "${uploadedFileInfo.fileName}". Restored demo dataset.`);
                }}
                className="w-6 h-6 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/80 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title={`Remove "${uploadedFileInfo.fileName}" and restore demo data`}
                aria-label="Remove uploaded file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              id="sidebar-upload-cta-box"
              onClick={() => handleNavClick('upload')}
              className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100/70 transition-colors cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] font-bold text-indigo-950 truncate">Upload Campaign File</div>
                  <div className="text-[10px] text-indigo-700 truncate">Analyze CSV / Excel</div>
                </div>
              </div>
            </div>
          )}

          {/* Upload History items list in Sidebar */}
          {uploadHistory.length > 0 && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowHistoryList(!showHistoryList)}
                className="w-full flex items-center justify-between px-1.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <History className="w-3 h-3 text-slate-400" />
                  <span>File History ({uploadHistory.length})</span>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform ${showHistoryList ? 'rotate-180' : ''}`} />
              </button>

              {showHistoryList && (
                <div className="mt-1 space-y-1 max-h-36 overflow-y-auto pr-0.5">
                  {uploadHistory.map((item) => {
                    const isItemActive = activeHistoryId === item.id || uploadedFileInfo?.fileName === item.fileName;
                    return (
                      <div
                        key={item.id}
                        id={`sidebar-history-item-${item.id}`}
                        onClick={() => restoreHistoricalFile(item.id)}
                        className={`p-1.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isItemActive
                            ? 'bg-indigo-50/90 border-indigo-300 text-indigo-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                        title={`Click to load "${item.fileName}"`}
                      >
                        <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                            .{item.format}
                          </span>
                          <span className="text-[11px] truncate max-w-[110px]" title={item.fileName}>
                            {item.fileName}
                          </span>
                        </div>

                        {/* Remove 'X' button on each uploaded file at right side */}
                        <button
                          type="button"
                          id={`sidebar-remove-history-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHistoricalFile(item.id);
                          }}
                          className="w-5 h-5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                          title={`Remove "${item.fileName}" from history`}
                          aria-label={`Remove file ${item.fileName}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Responsible AI & Data Quality Card */}
          <div
            onClick={() => setIsResponsibleAIPanelOpen(true)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Data Quality</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                {qualityReport.score}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
              <div
                className="bg-emerald-500 h-1 rounded-full"
                style={{ width: `${qualityReport.score}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}
    </>
  );
};
