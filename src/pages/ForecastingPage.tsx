import React, { useState } from 'react';
import {
  TrendingUp,
  Sliders,
  DollarSign,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { generateForecastData, calculateStrategySimulation } from '../utils/insightsEngine';
import { calculateDatasetSummary } from '../utils/analyticsEngine';

export const ForecastingPage: React.FC = () => {
  const { campaigns, formatMoney } = useApp();

  const [forecastHorizon, setForecastHorizon] = useState<'30D' | '60D' | '90D'>('30D');

  // Strategy Simulator Sliders (percent change from current allocation)
  const [googleSlider, setGoogleSlider] = useState<number>(12);
  const [metaSlider, setMetaSlider] = useState<number>(-10);
  const [linkedinSlider, setLinkedinSlider] = useState<number>(5);
  const [emailSlider, setEmailSlider] = useState<number>(20);

  const forecastData = generateForecastData(campaigns);
  const summary = calculateDatasetSummary(campaigns);
  const simulation = calculateStrategySimulation(
    campaigns,
    googleSlider,
    metaSlider,
    linkedinSlider,
    emailSlider
  );

  const resetSliders = () => {
    setGoogleSlider(0);
    setMetaSlider(0);
    setLinkedinSlider(0);
    setEmailSlider(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Predictive Forecasting & Strategy Simulator</h1>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
              Confidence Interval Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Historical regression modeling with expanding uncertainty cones and scenario elasticity simulations.
          </p>
        </div>

        {/* Horizon Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          {(['30D', '60D', '90D'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setForecastHorizon(h)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                forecastHorizon === h
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {h} Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Forecast Chart with Expanding Confidence Band */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Projected Revenue Trajectory & Confidence Bounds</span>
            </h2>
            <p className="text-xs text-slate-500">Historical performance (solid) transitioned to future forecast (expanding band)</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Projected Revenue
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-100 border border-purple-300" /> Confidence Range
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => formatMoney(v, { compact: true })} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: any, name: any) => [formatMoney(Number(val)), name]}
              />
              <ReferenceLine x="Aug 14" stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Forecast Cutoff', fill: '#EF4444', fontSize: 10 }} />
              <Area type="monotone" dataKey="revenueUpper" stroke="none" fill="url(#colorUpper)" fillOpacity={1} name="Upper Bound (+15%)" />
              <Area type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2.5} fill="none" name="Projected Revenue" />
              <Area type="monotone" dataKey="revenueLower" stroke="none" fill="#ffffff" fillOpacity={1} name="Lower Bound (-15%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Assumptions Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Declared Model Assumptions:</strong> Baseline projection assumes stable cost per click and seasonal search demand. Macro consumer sentiment shocks and competitor bidding escalations are excluded.
          </div>
        </div>
      </div>

      {/* Interactive Strategy Simulator */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Interactive Budget Strategy Simulator</h2>
              <p className="text-xs text-slate-500">Adjust channel percentage shifts to simulate elasticity, revenue, and risk</p>
            </div>
          </div>
          <button
            onClick={resetSliders}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sliders Form */}
          <div className="space-y-5 text-xs">
            {/* Google Ads */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-800">Google Ads (Search & Shopping)</span>
                <span className={`font-mono font-bold ${googleSlider >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {googleSlider >= 0 ? `+${googleSlider}%` : `${googleSlider}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={googleSlider}
                onChange={(e) => setGoogleSlider(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-50% Cut</span>
                <span>Baseline (0%)</span>
                <span>+50% Scale</span>
              </div>
            </div>

            {/* Meta Ads */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-800">Meta Ads (Facebook & Reels)</span>
                <span className={`font-mono font-bold ${metaSlider >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {metaSlider >= 0 ? `+${metaSlider}%` : `${metaSlider}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={metaSlider}
                onChange={(e) => setMetaSlider(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-50% Cut</span>
                <span>Baseline (0%)</span>
                <span>+50% Scale</span>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-800">LinkedIn Ads (B2B Sponsored Content)</span>
                <span className={`font-mono font-bold ${linkedinSlider >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {linkedinSlider >= 0 ? `+${linkedinSlider}%` : `${linkedinSlider}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={linkedinSlider}
                onChange={(e) => setLinkedinSlider(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-50% Cut</span>
                <span>Baseline (0%)</span>
                <span>+50% Scale</span>
              </div>
            </div>

            {/* Email Marketing */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-800">Email Marketing & Lifecycle Drops</span>
                <span className={`font-mono font-bold ${emailSlider >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {emailSlider >= 0 ? `+${emailSlider}%` : `${emailSlider}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={emailSlider}
                onChange={(e) => setEmailSlider(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-50% Cut</span>
                <span>Baseline (0%)</span>
                <span>+50% Scale</span>
              </div>
            </div>
          </div>

          {/* Real-time Projected Outcome Panel */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Simulated 30-Day Financial Outcome
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    simulation.riskLevel === 'Low'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : simulation.riskLevel === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {simulation.riskLevel} Volatility Risk
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 text-[11px]">Projected Media Spend</span>
                  <div className="text-base font-bold text-slate-900 mt-1">{formatMoney(simulation.projectedSpend)}</div>
                  <span className="text-[10px] text-slate-500">Baseline: {formatMoney(summary.totalSpend)}</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 text-[11px]">Projected Gross Revenue</span>
                  <div className="text-base font-bold text-emerald-600 mt-1">{formatMoney(simulation.projectedRevenue)}</div>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Delta: {simulation.projectedRevenue >= summary.totalRevenue ? '+' : ''}
                    {formatMoney(simulation.projectedRevenue - summary.totalRevenue)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 text-[11px]">Projected Blended ROAS</span>
                  <div className="text-base font-bold text-purple-700 mt-1">{simulation.projectedRoas}x</div>
                  <span className="text-[10px] text-slate-500">Current: {summary.averageRoas}x</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 text-[11px]">Projected Total Orders</span>
                  <div className="text-base font-bold text-indigo-700 mt-1">{simulation.projectedConversions.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-500">Current: {summary.totalConversions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
              {simulation.assumptions.map((assump, idx) => (
                <p key={idx}>• {assump}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
