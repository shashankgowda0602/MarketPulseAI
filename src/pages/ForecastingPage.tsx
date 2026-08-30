import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sliders,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  Percent,
  FileCheck,
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
import { calculateDatasetSummary, calculatePlatformPerformance } from '../utils/analyticsEngine';

export const ForecastingPage: React.FC = () => {
  const { campaigns, formatMoney, uploadedFileInfo } = useApp();

  const [forecastHorizon, setForecastHorizon] = useState<'30D' | '60D' | '90D'>('30D');

  const platforms = React.useMemo(() => {
    const pSet = Array.from(new Set(campaigns.map((c) => c.platform || 'General Ads')));
    return pSet.length > 0 ? pSet : ['Google Ads', 'Meta Ads', 'LinkedIn', 'Email'];
  }, [campaigns]);

  // Dynamic Strategy Simulator Sliders (percent change from current allocation per channel)
  const [channelSliders, setChannelSliders] = useState<Record<string, number>>({});

  // Initialize sliders when platforms change
  useEffect(() => {
    const initial: Record<string, number> = {};
    platforms.forEach((p, idx) => {
      // Default subtle recommended adjustment based on channel position
      if (idx === 0) initial[p] = 10; // Top channel
      else if (idx === 1) initial[p] = -5;
      else if (idx === 2) initial[p] = 5;
      else initial[p] = 0;
    });
    setChannelSliders(initial);
  }, [platforms]);

  const handleSliderChange = (platform: string, val: number) => {
    setChannelSliders((prev) => ({ ...prev, [platform]: val }));
  };

  const resetSliders = () => {
    const reset: Record<string, number> = {};
    platforms.forEach((p) => {
      reset[p] = 0;
    });
    setChannelSliders(reset);
  };

  const forecastData = generateForecastData(campaigns);
  const summary = calculateDatasetSummary(campaigns);
  const simulation = calculateStrategySimulation(campaigns, channelSliders);

  // Find the cutoff date where historical data transitions to forecast
  const cutoffItem = forecastData.find((p) => !p.isHistorical) || forecastData[Math.floor(forecastData.length / 2)];
  const cutoffDate = cutoffItem ? cutoffItem.date : 'Today';

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
            {uploadedFileInfo && (
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                Live: {uploadedFileInfo.fileName}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Historical regression modeling with expanding uncertainty cones and scenario elasticity simulations anchored directly to your uploaded campaign dataset.
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
            <p className="text-xs text-slate-500">Historical performance transitioned to future forecast with expanding uncertainty band</p>
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
              <ReferenceLine x={cutoffDate} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Forecast Cutoff', fill: '#EF4444', fontSize: 10 }} />
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
            <strong className="text-slate-800">Declared Model Assumptions:</strong> Baseline projection dynamically calculates from {campaigns.length} uploaded campaigns with total spend of {formatMoney(summary.totalSpend)}. Macro consumer sentiment shocks and sudden competitor bidding escalations are excluded.
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
              <p className="text-xs text-slate-500">
                Adjust channel percentage shifts across all {platforms.length} channels in your uploaded dataset to simulate elasticity, revenue, and risk
              </p>
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
            {platforms.map((platform) => {
              const val = channelSliders[platform] || 0;
              const pCampaigns = campaigns.filter((c) => c.platform === platform);
              const pSpend = pCampaigns.reduce((s, c) => s + (c.spend || 0), 0);
              const pRoas = pSpend > 0 ? (pCampaigns.reduce((s, c) => s + (c.revenue || 0), 0) / pSpend).toFixed(2) : '0';

              return (
                <div key={platform} className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center font-semibold">
                    <div>
                      <span className="text-slate-900">{platform}</span>
                      <span className="text-[10px] text-slate-500 font-normal ml-2">
                        (Current: {formatMoney(pSpend)} · {pRoas}x ROAS)
                      </span>
                    </div>
                    <span className={`font-mono font-bold ${val >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {val >= 0 ? `+${val}%` : `${val}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="5"
                    value={val}
                    onChange={(e) => handleSliderChange(platform, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>-50% Cut</span>
                    <span>Baseline (0%)</span>
                    <span>+50% Scale</span>
                  </div>
                </div>
              );
            })}
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
