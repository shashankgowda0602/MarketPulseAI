import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BarChart3,
  Bot,
  ShieldCheck,
  TrendingUp,
  Leaf,
  Layers,
  Zap,
  CheckCircle2,
  AlertCircle,
  Database,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Check,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, campaigns, resetToDemoData, addNotification } = useApp();

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

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 border border-slate-200/80 p-6 sm:p-10 lg:p-14 shadow-xs">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload & Analyze Marketing Files in Seconds</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-['Space_Grotesk'] leading-tight">
            Upload Your Campaign Files <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
              Get Instant AI-Powered Analysis
            </span>
          </h1>

          {/* Plain English Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Easily upload your CSV or Excel files from Google Ads, Meta, Instagram, LinkedIn, YouTube, or Email.
            We automatically calculate your true return on ad spend (ROAS), find wasted spend, and give clear, beginner-friendly recommendations.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              id="btn-hero-upload-files"
              onClick={() => setCurrentPage('upload')}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Campaign Files</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-explore-demo"
              onClick={() => {
                resetToDemoData();
                setCurrentPage('dashboard');
              }}
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs sm:text-sm border border-slate-200 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Explore Demo ({campaigns.length} Campaigns)</span>
            </button>

            <button
              id="btn-hero-download-sample"
              onClick={handleDownloadSampleCSV}
              className="px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
              title="Download sample CSV to see the format"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download Sample CSV</span>
            </button>
          </div>

          {/* Quick Trust Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-2xs">
                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
              <span>100% Exact Math (No fake numbers)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-600 shadow-2xs">
                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
              <span>Supports CSV, Excel & JSON Files</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Marketing Questions Answered Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Intelligence Purpose</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              The 5 Questions We Answer For Your Marketing Team
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <span>Open Live Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Question 1 */}
          <div
            onClick={() => setCurrentPage('campaigns')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 cursor-pointer transition-all space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                1. Winning Campaigns
              </span>
              <h3 className="text-sm font-bold text-white">Which campaigns are working?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instantly isolates high-ROAS, profitable ad sets driving positive revenue margins.
              </p>
            </div>
            <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1 pt-2">
              <span>View Winners</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Question 2 */}
          <div
            onClick={() => setCurrentPage('campaigns')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400/50 hover:bg-white/10 cursor-pointer transition-all space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                2. Underperforming
              </span>
              <h3 className="text-sm font-bold text-white">Which campaigns are underperforming?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Highlights low-ROAS, unprofitable campaigns draining your ad budget.
              </p>
            </div>
            <span className="text-[11px] text-rose-300 font-semibold flex items-center gap-1 pt-2">
              <span>Audit Laggards</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Question 3 */}
          <div
            onClick={() => setCurrentPage('recommendations')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 cursor-pointer transition-all space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                3. Wasted Spend
              </span>
              <h3 className="text-sm font-bold text-white">Where is money getting wasted?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Quantifies ad fatigue, audience saturation, and low-conversion keyword waste.
              </p>
            </div>
            <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 pt-2">
              <span>Detect Waste</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Question 4 */}
          <div
            onClick={() => setCurrentPage('insights')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-white/10 cursor-pointer transition-all space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                4. Performance Drivers
              </span>
              <h3 className="text-sm font-bold text-white">Why is performance changing?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deep-dives into creative burnout, high CPMs, and landing page drop-offs.
              </p>
            </div>
            <span className="text-[11px] text-purple-300 font-semibold flex items-center gap-1 pt-2">
              <span>Inspect Causes</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Question 5 */}
          <div
            onClick={() => setCurrentPage('recommendations')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/50 hover:bg-white/10 cursor-pointer transition-all space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                5. Action Plan
              </span>
              <h3 className="text-sm font-bold text-white">What should the team do next?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provides prioritized, evidence-backed recommendations ready for supervisor execution.
              </p>
            </div>
            <span className="text-[11px] text-indigo-200 font-semibold flex items-center gap-1 pt-2">
              <span>Action Queue</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </section>

      {/* Simple 3-Step "How It Works" Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            How It Works
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Analyze Your Marketing in 3 Simple Steps
          </h2>
          <p className="text-xs text-slate-500">
            No complex setup required. Get actionable insights in less than a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                1
              </div>
              <UploadCloud className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm text-slate-900">Upload Your Campaign File</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drag and drop your exported CSV or Excel spreadsheet containing your ads, clicks, spend, and sales.
              </p>
            </div>
            <div className="pt-1 text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
              <span>Supports CSV, TXT & Excel</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                2
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm text-slate-900">Automatic Quality Check & Math</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our system instantly checks for missing columns, verifies numbers, and calculates exact ROAS and CPA.
              </p>
            </div>
            <div className="pt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>100% Verifiable & Audit-Ready</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                3
              </div>
              <Bot className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm text-slate-900">See AI Insights & Actions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review easy-to-understand charts, identify which ads make money, and follow step-by-step optimization tips.
              </p>
            </div>
            <div className="pt-1 text-[11px] text-purple-600 font-semibold flex items-center gap-1">
              <span>Clear, actionable recommendations</span>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Analyze Feature Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Explore Features
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Everything You Need to Understand Your Ads
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: BarChart3,
              title: 'Analytics Overview',
              desc: 'See total spend, revenue, net profit, and return on ad spend (ROAS) across all channels at a glance.',
              page: 'dashboard',
            },
            {
              icon: Layers,
              title: 'Campaigns League Table',
              desc: 'Search, filter, and compare winning vs underperforming ads across Google, Meta, IG, LinkedIn, and YouTube.',
              page: 'campaigns',
            },
            {
              icon: Bot,
              title: 'AI Insights & Root Cause',
              desc: 'Understand WHY an ad is succeeding or failing (e.g. ad creative fatigue vs landing page bounce rate).',
              page: 'insights',
            },
            {
              icon: Zap,
              title: 'Action Queue',
              desc: 'Get prioritized recommendations with estimated revenue impact and human approval controls.',
              page: 'recommendations',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setCurrentPage(item.page as any)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer group transition-all flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Beginner Marketing Glossary Helper */}
      <section className="p-6 sm:p-8 rounded-2xl bg-slate-100/70 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">New to Marketing Analytics? Quick Beginner Guide</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">ROAS (Return on Ad Spend)</span>
            <p className="text-slate-600">
              How much revenue you earned for every ₹1 spent. For example, <strong>3.0x ROAS</strong> means you earned ₹3 for every ₹1 spent.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">CPA (Cost Per Acquisition)</span>
            <p className="text-slate-600">
              The average cost to get one new paying customer or order. Lower CPA means higher efficiency.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">CTR (Click-Through Rate)</span>
            <p className="text-slate-600">
              The percentage of people who clicked your ad after seeing it. Higher CTR means engaging ad copy/creatives.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="p-8 rounded-3xl bg-indigo-600 text-center space-y-4 text-white shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Ready to Analyze Your Uploaded Campaign Data?
        </h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto">
          Upload your campaign file now or test our pre-loaded fleet to see full AI insights in action.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setCurrentPage('upload')}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-indigo-900 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs hover:scale-105 cursor-pointer"
          >
            Upload Campaign File
          </button>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all border border-indigo-500 cursor-pointer"
          >
            View Active Analytics
          </button>
        </div>
      </section>
    </div>
  );
};
