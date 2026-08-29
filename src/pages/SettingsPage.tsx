import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Save,
  Lock,
  Layers,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useApp, CURRENCIES, CurrencyType } from '../context/AppContext';
import { DEFAULT_CLASSIFICATION_THRESHOLDS } from '../utils/classificationEngine';

export const SettingsPage: React.FC = () => {
  const {
    thresholds,
    setThresholds,
    currency,
    setCurrency,
    addNotification,
  } = useApp();

  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setThresholds(localThresholds);
    setIsSaved(true);
    addNotification('Updated marketing classification thresholds and governance rules.');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    setLocalThresholds(DEFAULT_CLASSIFICATION_THRESHOLDS);
    setThresholds(DEFAULT_CLASSIFICATION_THRESHOLDS);
    addNotification('Reset classification thresholds to default system baselines.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings & Algorithmic Guardrails</h1>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              Deterministic Rules
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure classification thresholds, currency unit economics, sample size protections, and human-in-the-loop triggers.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors self-start md:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          <span>Reset System Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Classification Thresholds */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Campaign Status Classification Thresholds</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* Winning ROAS */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="text-slate-700 font-semibold flex items-center justify-between">
                <span>Winning ROAS Minimum (x)</span>
                <span className="text-emerald-700 font-mono font-bold">{localThresholds.winningRoas}x</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="10.0"
                value={localThresholds.winningRoas}
                onChange={(e) => setLocalThresholds({ ...localThresholds, winningRoas: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500">Campaigns above this return are tagged as Winning.</p>
            </div>

            {/* Winning Conv Rate */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="text-slate-700 font-semibold flex items-center justify-between">
                <span>Winning Conv. Rate (%)</span>
                <span className="text-emerald-700 font-mono font-bold">{localThresholds.winningConvRate}%</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="20.0"
                value={localThresholds.winningConvRate}
                onChange={(e) => setLocalThresholds({ ...localThresholds, winningConvRate: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500">Conversion efficiency floor for top performers.</p>
            </div>

            {/* Underperforming ROAS */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="text-slate-700 font-semibold flex items-center justify-between">
                <span>Underperforming ROAS Cutoff (x)</span>
                <span className="text-rose-700 font-mono font-bold">{localThresholds.underperformingRoas}x</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="3.0"
                value={localThresholds.underperformingRoas}
                onChange={(e) => setLocalThresholds({ ...localThresholds, underperformingRoas: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500">Below this cutoff triggers underperformance warning.</p>
            </div>

            {/* Min Clicks for sample reliability */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="text-slate-700 font-semibold flex items-center justify-between">
                <span>Min Clicks for Reliability</span>
                <span className="text-indigo-700 font-mono font-bold">{localThresholds.minClicksForReliability.toLocaleString()}</span>
              </label>
              <input
                type="number"
                step="100"
                min="100"
                max="50000"
                value={localThresholds.minClicksForReliability}
                onChange={(e) => setLocalThresholds({ ...localThresholds, minClicksForReliability: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500">Protects small-sample test campaigns from unfair scoring.</p>
            </div>

            {/* Min Impressions for sample reliability */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="text-slate-700 font-semibold flex items-center justify-between">
                <span>Min Impressions for Reliability</span>
                <span className="text-indigo-700 font-mono font-bold">{localThresholds.minImpressionsForReliability.toLocaleString()}</span>
              </label>
              <input
                type="number"
                step="5000"
                min="5000"
                max="500000"
                value={localThresholds.minImpressionsForReliability}
                onChange={(e) => setLocalThresholds({ ...localThresholds, minImpressionsForReliability: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500">Upper-funnel sample size threshold.</p>
            </div>

            {/* Currency Unit Selection */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="text-slate-700 font-semibold flex items-center justify-between">
                <span>Display Currency</span>
                <span className="text-amber-700 font-mono font-bold">{currency} ({CURRENCIES[currency].symbol})</span>
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyType)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="INR">Indian Rupee (₹ INR)</option>
                <option value="USD">US Dollar ($ USD)</option>
                <option value="EUR">Euro (€ EUR)</option>
                <option value="GBP">British Pound (£ GBP)</option>
              </select>
              <p className="text-[10px] text-slate-500">Automatically scales all dashboard and KPI values.</p>
            </div>
          </div>
        </div>

        {/* Responsible AI Governance Matrix */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Responsible AI Governance Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Enforce Human Supervisor Approval</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Require explicit approval before applying budget shifts &gt; 10%</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                Locked Enabled
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Deterministic Arithmetic Mode</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Calculate all ROAS, CPA, CTR mathematically with zero LLM estimation</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                100% Enforced
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Customer PII Pseudonymization</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Scrub customer names and identifiers from public sentiment reviews</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Sample Size Guardrails</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Prevent marking early-stage campaigns as underperforming prematurely</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex justify-between items-center text-xs">
          <div className="text-slate-500">
            {isSaved ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Changes successfully saved & applied to classification engine!
              </span>
            ) : (
              <span>Modifying thresholds immediately re-evaluates all active campaigns.</span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
