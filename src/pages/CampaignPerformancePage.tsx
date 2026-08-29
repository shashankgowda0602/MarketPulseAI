import React, { useState } from 'react';
import {
  Target,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Archive,
  RotateCcw,
  Activity,
  Layers,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Campaign, CampaignStatus, CampaignLifecycle, PlatformType } from '../types';
import { calculateCampaignMetrics } from '../utils/analyticsEngine';

export const CampaignPerformancePage: React.FC = () => {
  const {
    campaigns,
    formatMoney,
    selectedPlatformFilter,
    setSelectedPlatformFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    selectedLifecycleFilter,
    setSelectedLifecycleFilter,
    updateCampaignLifecycleState,
    searchQuery,
    setSearchQuery,
    comparisonCampaignIds,
    toggleCampaignForComparison,
    setIsCompareModalOpen,
    setCurrentPage,
  } = useApp();

  const [sortBy, setSortBy] = useState<'roas' | 'spend' | 'revenue' | 'cpa' | 'ctr' | 'conversions'>('roas');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
  const [activeMenuCampaignId, setActiveMenuCampaignId] = useState<string | null>(null);

  // Compute counts for quick lifecycle filter bar
  const totalCount = campaigns.length;
  const activeCount = campaigns.filter((c) => (c.lifecycleState || 'Active') === 'Active').length;
  const pausedCount = campaigns.filter((c) => c.lifecycleState === 'Paused').length;
  const archivedCount = campaigns.filter((c) => c.lifecycleState === 'Archived').length;

  // Filter campaigns
  const filtered = campaigns.filter((c) => {
    const campaignLifecycle = c.lifecycleState || 'Active';
    // Lifecycle state filter (Active / Paused / Archived / All)
    if (selectedLifecycleFilter !== 'All' && campaignLifecycle !== selectedLifecycleFilter) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.platform.toLowerCase().includes(q) ||
        c.campaignType.toLowerCase().includes(q) ||
        c.audience.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q);
      if (!match) return false;
    }
    // Platform match
    if (selectedPlatformFilter !== 'All' && c.platform !== selectedPlatformFilter) {
      return false;
    }
    // Status match (classification)
    if (selectedStatusFilter !== 'All' && c.status !== selectedStatusFilter) {
      return false;
    }
    return true;
  });

  // Sort campaigns
  const sorted = [...filtered].sort((a, b) => {
    const mA = calculateCampaignMetrics(a);
    const mB = calculateCampaignMetrics(b);
    let valA = 0;
    let valB = 0;

    switch (sortBy) {
      case 'roas':
        valA = mA.roas;
        valB = mB.roas;
        break;
      case 'spend':
        valA = a.spend;
        valB = b.spend;
        break;
      case 'revenue':
        valA = a.revenue;
        valB = b.revenue;
        break;
      case 'cpa':
        valA = mA.cpa;
        valB = mB.cpa;
        break;
      case 'ctr':
        valA = mA.ctr;
        valB = mB.ctr;
        break;
      case 'conversions':
        valA = a.conversions;
        valB = b.conversions;
        break;
    }

    if (sortOrder === 'desc') {
      return valB - valA;
    }
    return valA - valB;
  });

  const getStatusBadge = (status?: CampaignStatus) => {
    switch (status) {
      case 'winning':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Winning
          </span>
        );
      case 'needs_attention':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> Needs Attention
          </span>
        );
      case 'underperforming':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Underperforming
          </span>
        );
      case 'insufficient_data':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            <HelpCircle className="w-3 h-3" /> Insufficient Data
          </span>
        );
    }
  };

  const getLifecycleBadge = (lifecycle?: CampaignLifecycle) => {
    const state = lifecycle || 'Active';
    switch (state) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active
          </span>
        );
      case 'Paused':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Pause className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
            Paused
          </span>
        );
      case 'Archived':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            <Archive className="w-2.5 h-2.5 text-slate-500" />
            Archived
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Campaign Performance & Classification</h1>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              Multi-Metric Evaluator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic classification evaluates ROAS, CPA, conversion rates, and sample size reliability.
          </p>
        </div>

        {/* Action: Compare selected */}
        <div className="flex items-center gap-3">
          {comparisonCampaignIds.length > 0 && (
            <button
              id="btn-compare-selected"
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Selected ({comparisonCampaignIds.length}/3)</span>
            </button>
          )}
        </div>
      </div>

      {/* QUICK FILTER BAR: Active, Paused, Archived One-Click Toggles */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              Quick Lifecycle Filter:
            </span>
            <span className="text-[11px] text-slate-500">
              Showing {sorted.length} of {totalCount} campaigns
            </span>
          </div>

          {selectedLifecycleFilter !== 'All' && (
            <button
              onClick={() => setSelectedLifecycleFilter('All')}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Lifecycle Filter
            </button>
          )}
        </div>

        {/* Quick Filter Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* ALL CAMPAIGNS */}
          <button
            id="filter-toggle-all"
            onClick={() => setSelectedLifecycleFilter('All')}
            className={`p-3 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer ${
              selectedLifecycleFilter === 'All'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/10'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  selectedLifecycleFilter === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold leading-none">All Campaigns</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    selectedLifecycleFilter === 'All' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Full Directory
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black ${
                selectedLifecycleFilter === 'All' ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-800'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* ACTIVE CAMPAIGNS */}
          <button
            id="filter-toggle-active"
            onClick={() => setSelectedLifecycleFilter('Active')}
            className={`p-3 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer ${
              selectedLifecycleFilter === 'Active'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                : 'bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  selectedLifecycleFilter === 'Active' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold leading-none flex items-center gap-1.5">
                  <span>Active</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    selectedLifecycleFilter === 'Active' ? 'text-emerald-100' : 'text-emerald-600'
                  }`}
                >
                  Running Live
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black ${
                selectedLifecycleFilter === 'Active' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {activeCount}
            </span>
          </button>

          {/* PAUSED CAMPAIGNS */}
          <button
            id="filter-toggle-paused"
            onClick={() => setSelectedLifecycleFilter('Paused')}
            className={`p-3 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer ${
              selectedLifecycleFilter === 'Paused'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-500/20'
                : 'bg-amber-50/50 hover:bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  selectedLifecycleFilter === 'Paused' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold leading-none">Paused</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    selectedLifecycleFilter === 'Paused' ? 'text-amber-100' : 'text-amber-600'
                  }`}
                >
                  On Hold / Rework
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black ${
                selectedLifecycleFilter === 'Paused' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {pausedCount}
            </span>
          </button>

          {/* ARCHIVED CAMPAIGNS */}
          <button
            id="filter-toggle-archived"
            onClick={() => setSelectedLifecycleFilter('Archived')}
            className={`p-3 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer ${
              selectedLifecycleFilter === 'Archived'
                ? 'bg-slate-700 text-white border-slate-700 shadow-sm ring-2 ring-slate-700/20'
                : 'bg-slate-100/70 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  selectedLifecycleFilter === 'Archived' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold leading-none">Archived</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    selectedLifecycleFilter === 'Archived' ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  Completed Flights
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black ${
                selectedLifecycleFilter === 'Archived' ? 'bg-white text-slate-800' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {archivedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Sorting Control Ribbon */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name, platform, audience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Classification Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px] font-medium">Evaluation:</span>
          {(['All', 'winning', 'needs_attention', 'underperforming'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                selectedStatusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70'
              }`}
            >
              {st === 'All' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px] font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="roas">ROAS (Return on Ad Spend)</option>
            <option value="revenue">Total Revenue</option>
            <option value="spend">Total Spend</option>
            <option value="conversions">Conversions</option>
            <option value="cpa">Cost Per Acquisition (CPA)</option>
            <option value="ctr">Click-Through Rate (CTR)</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="Toggle sort ascending / descending"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Campaigns League Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {sorted.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No campaigns match your current filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {selectedLifecycleFilter !== 'All'
                ? `There are no campaigns currently in '${selectedLifecycleFilter}' status with the selected filters.`
                : 'Try adjusting your search query or status criteria.'}
            </p>
            <div className="pt-2 flex justify-center gap-2">
              {selectedLifecycleFilter !== 'All' && (
                <button
                  onClick={() => setSelectedLifecycleFilter('All')}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  View All Campaigns ({totalCount})
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5 w-10 text-center font-semibold">Compare</th>
                  <th className="p-3.5 font-semibold">Campaign Name</th>
                  <th className="p-3.5 font-semibold">Lifecycle</th>
                  <th className="p-3.5 font-semibold">Platform</th>
                  <th className="p-3.5 font-semibold">Spend</th>
                  <th className="p-3.5 font-semibold">Revenue</th>
                  <th className="p-3.5 font-semibold">ROAS</th>
                  <th className="p-3.5 font-semibold">CPA</th>
                  <th className="p-3.5 font-semibold">CTR</th>
                  <th className="p-3.5 font-semibold">Conversions</th>
                  <th className="p-3.5 font-semibold">Classification</th>
                  <th className="p-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {sorted.map((c) => {
                  const metrics = calculateCampaignMetrics(c);
                  const isSelected = comparisonCampaignIds.includes(c.id);
                  const isExpanded = expandedCampaignId === c.id;
                  const currentLifecycle = c.lifecycleState || 'Active';

                  return (
                    <React.Fragment key={c.id}>
                      <tr className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-indigo-50/60' : ''}`}>
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCampaignForComparison(c.id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 max-w-[220px] truncate">{c.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {c.id} • {c.campaignType}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="relative inline-block">
                            <button
                              onClick={() =>
                                setActiveMenuCampaignId(activeMenuCampaignId === c.id ? null : c.id)
                              }
                              className="cursor-pointer transition-transform hover:scale-105"
                              title="Click to toggle lifecycle state (Active, Paused, Archived)"
                            >
                              {getLifecycleBadge(c.lifecycleState)}
                            </button>

                            {/* Dropdown to change lifecycle state */}
                            {activeMenuCampaignId === c.id && (
                              <div
                                className="absolute left-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Change State:
                                </div>
                                <button
                                  onClick={() => {
                                    updateCampaignLifecycleState(c.id, 'Active');
                                    setActiveMenuCampaignId(null);
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                                    currentLifecycle === 'Active'
                                      ? 'text-emerald-700 font-bold bg-emerald-50/50'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  <span className="flex items-center gap-1.5">
                                    <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" /> Active
                                  </span>
                                  {currentLifecycle === 'Active' && <Check className="w-3 h-3 text-emerald-600" />}
                                </button>
                                <button
                                  onClick={() => {
                                    updateCampaignLifecycleState(c.id, 'Paused');
                                    setActiveMenuCampaignId(null);
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                                    currentLifecycle === 'Paused'
                                      ? 'text-amber-700 font-bold bg-amber-50/50'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  <span className="flex items-center gap-1.5">
                                    <Pause className="w-3 h-3 text-amber-600 fill-amber-600" /> Paused
                                  </span>
                                  {currentLifecycle === 'Paused' && <Check className="w-3 h-3 text-amber-600" />}
                                </button>
                                <button
                                  onClick={() => {
                                    updateCampaignLifecycleState(c.id, 'Archived');
                                    setActiveMenuCampaignId(null);
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                                    currentLifecycle === 'Archived'
                                      ? 'text-slate-900 font-bold bg-slate-100'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  <span className="flex items-center gap-1.5">
                                    <Archive className="w-3 h-3 text-slate-500" /> Archived
                                  </span>
                                  {currentLifecycle === 'Archived' && <Check className="w-3 h-3 text-slate-600" />}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                            {c.platform}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-900">{formatMoney(c.spend)}</td>
                        <td className="p-3.5 font-bold text-emerald-600">{formatMoney(c.revenue)}</td>
                        <td className="p-3.5">
                          <span
                            className={`font-black text-sm ${
                              metrics.roas >= 3.0
                                ? 'text-emerald-600'
                                : metrics.roas < 1.8
                                ? 'text-rose-600'
                                : 'text-slate-800'
                            }`}
                          >
                            {metrics.roas}x
                          </span>
                        </td>
                        <td className="p-3.5">{formatMoney(metrics.cpa)}</td>
                        <td className="p-3.5">{metrics.ctr}%</td>
                        <td className="p-3.5 font-medium">{c.conversions.toLocaleString()}</td>
                        <td className="p-3.5">{getStatusBadge(c.status)}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setExpandedCampaignId(isExpanded ? null : c.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                            title="Expand campaign breakdown"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Explanation Panel */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 border-b border-slate-200">
                          <td colSpan={12} className="p-5 text-xs space-y-3">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="space-y-2 flex-1">
                                <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                                  Classification Reason & Mathematical Evidence:
                                </div>
                                <p className="text-slate-700 leading-relaxed text-xs">
                                  {c.statusReason ||
                                    'Multi-metric benchmark comparison verified based on ROAS and cost efficiency.'}
                                </p>

                                <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-slate-500">
                                  <span>
                                    Audience: <strong className="text-slate-800">{c.audience}</strong>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Target Region: <strong className="text-slate-800">{c.region}</strong>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Impressions:{' '}
                                    <strong className="text-slate-800">{c.impressions.toLocaleString()}</strong>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Reach: <strong className="text-slate-800">{c.reach.toLocaleString()}</strong>
                                  </span>
                                </div>
                              </div>

                              {/* State switch buttons and root cause link */}
                              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                                  <span className="text-[10px] font-semibold text-slate-400 px-1.5">State:</span>
                                  <button
                                    onClick={() => updateCampaignLifecycleState(c.id, 'Active')}
                                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                      currentLifecycle === 'Active'
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Active
                                  </button>
                                  <button
                                    onClick={() => updateCampaignLifecycleState(c.id, 'Paused')}
                                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                      currentLifecycle === 'Paused'
                                        ? 'bg-amber-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Pause
                                  </button>
                                  <button
                                    onClick={() => updateCampaignLifecycleState(c.id, 'Archived')}
                                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                      currentLifecycle === 'Archived'
                                        ? 'bg-slate-700 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Archive
                                  </button>
                                </div>

                                <button
                                  onClick={() => setCurrentPage('insights')}
                                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>View Root Cause Analysis</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
