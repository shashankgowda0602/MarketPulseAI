import React, { useState } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Sliders,
  DollarSign,
  TrendingUp,
  Layers,
  Filter,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecommendationItem } from '../types';

export const RecommendationsPage: React.FC = () => {
  const {
    recommendations,
    handleApproveRecommendation,
    handleRejectRecommendation,
    setCurrentPage,
    formatMoney,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filtered = recommendations.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (filterPriority !== 'all' && r.priority !== filterPriority) return false;
    return true;
  });

  const pendingHumanApprovals = recommendations.filter(
    (r) => r.humanApprovalRequired && r.status === 'pending'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart Marketing Action Queue</h1>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
              {pendingHumanApprovals.length} Approvals Needed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized recommendations grounded in data evidence. High-budget shifts enforce human supervisor approval.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('forecasting')}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          <span>Simulate Outcome in Forecast</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 text-[11px] font-medium">Category:</span>
          {[
            { id: 'all', label: 'All Actions' },
            { id: 'budget', label: 'Budget Reallocation' },
            { id: 'landing_page', label: 'Landing Page' },
            { id: 'audience', label: 'Audience & Retention' },
            { id: 'sustainability', label: 'Ad Fatigue & Eco' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px] font-medium">Priority:</span>
          {['all', 'High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterPriority === p
                  ? 'bg-slate-200 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filtered.map((rec) => {
          const isApproved = rec.status === 'approved';
          const isRejected = rec.status === 'rejected';

          return (
            <div
              key={rec.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 shadow-xs ${
                isApproved
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isRejected
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header of card */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-indigo-600 font-bold text-xs">{rec.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rec.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : rec.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {rec.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {rec.estimatedImpact}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 pt-1">{rec.action}</h3>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {isApproved && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      <Check className="w-3.5 h-3.5" /> Approved by Supervisor
                    </span>
                  )}
                  {isRejected && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                      Archived
                    </span>
                  )}
                  {!isApproved && !isRejected && rec.humanApprovalRequired && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                      <UserCheck className="w-3.5 h-3.5" /> Human Approval Required
                    </span>
                  )}
                </div>
              </div>

              {/* Rationale and Evidence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    Evidence-Backed Rationale:
                  </div>
                  <p className="text-slate-600 leading-relaxed">{rec.why}</p>
                  <div className="text-[11px] text-indigo-700 pt-1">
                    <strong>Data Evidence:</strong> {rec.dataEvidence}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Expected Business Outcome:
                  </div>
                  <p className="text-slate-600 leading-relaxed">{rec.expectedBenefit}</p>
                  <div className="text-[11px] text-rose-700 pt-1">
                    <strong>Possible Risk:</strong> {rec.possibleRisk}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isApproved && !isRejected && (
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => handleRejectRecommendation(rec.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                  >
                    Archive / Dismiss
                  </button>
                  <button
                    onClick={() => handleApproveRecommendation(rec.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Apply Recommendation</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
