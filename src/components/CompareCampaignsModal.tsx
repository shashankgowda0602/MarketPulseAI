import React from 'react';
import { X, Scale, ArrowUpRight, ArrowDownRight, Layers, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateCampaignMetrics } from '../utils/analyticsEngine';

export const CompareCampaignsModal: React.FC = () => {
  const {
    isCompareModalOpen,
    setIsCompareModalOpen,
    comparisonCampaignIds,
    clearComparison,
    campaigns,
    formatMoney,
  } = useApp();

  if (!isCompareModalOpen || comparisonCampaignIds.length === 0) return null;

  const selectedCampaigns = campaigns.filter((c) => comparisonCampaignIds.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Campaign Variance & Side-by-Side Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Comparing {selectedCampaigns.length} marketing campaigns across efficiency and unit economics.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearComparison}
              className="text-xs text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Clear Selection
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedCampaigns.map((camp) => {
              const metrics = calculateCampaignMetrics(camp);
              return (
                <div
                  key={camp.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4"
                >
                  {/* Top Badge */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-mono text-indigo-700 font-semibold">{camp.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 font-medium border border-slate-200">
                        {camp.platform}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{camp.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{camp.campaignType}</p>
                  </div>

                  {/* Primary Return */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                    <div className="text-[11px] text-slate-500">Return on Ad Spend (ROAS)</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{metrics.roas}x</span>
                      <span className={`text-[10px] font-bold ${metrics.roas >= 2.5 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {metrics.roas >= 2.5 ? 'Profitable' : 'Below Target'}
                      </span>
                    </div>
                  </div>

                  {/* Key Metric Breakdown */}
                  <div className="space-y-2 text-[11px] bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Total Spend</span>
                      <span className="font-semibold text-slate-900">{formatMoney(camp.spend)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Revenue Generated</span>
                      <span className="font-semibold text-emerald-600">{formatMoney(camp.revenue)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Net Profit</span>
                      <span className="font-semibold text-slate-900">{formatMoney(metrics.profit)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Conversions</span>
                      <span className="font-semibold text-slate-900">{camp.conversions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Cost Per Acquisition (CPA)</span>
                      <span className="font-semibold text-slate-900">{formatMoney(metrics.cpa)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Click-Through Rate (CTR)</span>
                      <span className="font-semibold text-slate-900">{metrics.ctr}%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Conversion Rate</span>
                      <span className="font-semibold text-slate-900">{metrics.conversionRate}%</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="pt-2 border-t border-slate-200">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                        camp.status === 'winning'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : camp.status === 'underperforming'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {camp.status?.toUpperCase() || 'NEEDS ATTENTION'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>All variance differences are derived from actual click and conversion transactions.</span>
          <button
            onClick={() => setIsCompareModalOpen(false)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl transition-colors font-medium cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
