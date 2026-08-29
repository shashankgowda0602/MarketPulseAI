import React from 'react';
import {
  Leaf,
  DollarSign,
  Clock,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Globe,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateSustainabilityMetrics } from '../utils/insightsEngine';
import { calculateDatasetSummary } from '../utils/analyticsEngine';

export const SustainabilityPage: React.FC = () => {
  const { campaigns, formatMoney, setCurrentPage } = useApp();

  const metrics = calculateSustainabilityMetrics(campaigns);
  const summary = calculateDatasetSummary(campaigns);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-emerald-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sustainable & Responsible Marketing Intelligence</h1>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Triple-Bottom-Line Framework
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Optimizing for capital efficiency, team time conservation, and long-term brand goodwill over short-term vanity clicks.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('recommendations')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply Eco-Pruning Actions</span>
        </button>
      </div>

      {/* 3 Core Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1: Economic Sustainability */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                Capital Health
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">1. Economic Sustainability</h3>
              <p className="text-xs text-slate-500 mt-1">
                Zero-tolerance for negative-ROI ad waste. Reinvesting inefficient spend into high-leverage organic & retention channels.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Inefficient Spend Flagged</span>
                <span className="font-bold text-rose-600">{formatMoney(metrics.economicWasteSpend)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wasted Capital Share</span>
                <span className="font-bold text-slate-800">{metrics.economicWastePercentage}% of budget</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Low-ROAS Campaigns</span>
                <span className="font-bold text-amber-600">{metrics.lowRoasCampaignsCount} flagged</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 border-t border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Target: Maintain under 5% capital leakage</span>
          </div>
        </div>

        {/* Pillar 2: Operational Sustainability */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                Team Velocity
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">2. Operational Sustainability</h3>
              <p className="text-xs text-slate-500 mt-1">
                Eliminates spreadsheet busywork and fragmented multi-dashboard switching, reducing cognitive fatigue.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Manual Hours Saved</span>
                <span className="font-bold text-indigo-700">~{metrics.hoursSavedPerWeek} hrs / week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dashboards Unified</span>
                <span className="font-bold text-slate-800">{metrics.manualDashboardsReplaced} Channels</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Insight Generation Time</span>
                <span className="font-bold text-emerald-600">&lt; 3 seconds</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-indigo-700 font-medium flex items-center gap-1.5 border-t border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Enables strategic growth vs reactive reporting</span>
          </div>
        </div>

        {/* Pillar 3: Customer & Brand Sustainability */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                Ethical Trust
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">3. Customer & Brand Ethics</h3>
              <p className="text-xs text-slate-500 mt-1">
                Guards audience goodwill by preventing intrusive ad repetition, respect privacy, and bans misleading clickbait.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Average Ad Frequency</span>
                <span className="font-bold text-slate-800">{metrics.averageFrequency}x / user</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fatigue Risk Sets</span>
                <span className="font-bold text-amber-600">{metrics.adFatigueRiskCampaigns} Sets Flagged</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer CSAT Index</span>
                <span className="font-bold text-emerald-600">{metrics.customerSatisfactionScore} / 5.0</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-purple-700 font-medium flex items-center gap-1.5 border-t border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Protects long-term customer lifetime value</span>
          </div>
        </div>
      </div>

      {/* Digital Carbon & Green Ad Serving Transparency */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Digital Ad Infrastructure Footprint</h2>
            <p className="text-xs text-slate-500">Estimated computational and digital ad server energy footprint</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px]">Total Ad Impressions Served</span>
            <div className="text-base font-bold text-slate-900 mt-1">{summary.totalImpressions.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Across all 6 platforms</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px]">Estimated Digital CO₂e</span>
            <div className="text-base font-bold text-emerald-600 mt-1">{metrics.co2DigitalEstimateKg} kg CO₂e</div>
            <p className="text-[10px] text-slate-500 mt-0.5">0.045g per ad view benchmark</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px]">Carbon Saved by Pruning Waste</span>
            <div className="text-base font-bold text-emerald-600 mt-1">~38.4 kg CO₂e</div>
            <p className="text-[10px] text-emerald-700 font-medium mt-0.5">By eliminating saturated impressions</p>
          </div>
        </div>
      </div>
    </div>
  );
};
