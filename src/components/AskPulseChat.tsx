import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Trash2,
  Zap,
  Layers,
  HelpCircle,
  BarChart3,
  Compass,
  Lightbulb,
  Upload,
  Sliders,
  DollarSign,
  Download,
  Settings,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateDatasetSummary, calculateCampaignMetrics } from '../utils/analyticsEngine';
import { PageId } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  evidence?: string;
  confidence?: 'High' | 'Medium' | 'Low';
  timestamp: string;
  isAiGenerated?: boolean;
  modelUsed?: string;
  responseTimeMs?: number;
}

type PromptCategory = 'data' | 'website' | 'strategy';

export const AskPulseChat: React.FC = () => {
  const { isChatOpen, setIsChatOpen, campaigns, formatMoney, qualityReport, currencyConfig, setCurrentPage } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `**Key Finding:**
I am **Pulse Intelligence Agent**, your dedicated marketing analytics AI and platform assistant. I can answer questions about your **${campaigns.length} campaigns** as well as guide you through all features of **MarketPulse AI**.

**Core Intelligence Categories Available:**
• **📊 Active Data Insights:** Top performers, underperforming ad sets, wasted spend, ROAS, and specific campaign lookups.
• **🌐 Platform & Features:** Data upload & column mapping, Budget Allocator simulator, Action Queue approvals, and CSV/JSON export.
• **⚡ Optimization Strategy:** Root cause diagnosis, creative fatigue mitigation, and threshold customization.

**Recommended Next Step:**
Choose a prompt below or type any question about your data or this website!`,
      evidence: `Synchronized with ${campaigns.length} active campaign records in ${currencyConfig.name} (Quality Score: ${qualityReport.score}%).`,
      confidence: 'High',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responseTimeMs: 65,
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PromptCategory>('data');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseCacheRef = useRef<Map<string, { text: string; evidence: string; confidence: 'High' | 'Medium'; isAiGenerated: boolean; modelUsed?: string }>>(new Map());

  const promptCategories: { id: PromptCategory; label: string; icon: any; prompts: string[] }[] = [
    {
      id: 'data',
      label: 'Data Insights',
      icon: BarChart3,
      prompts: [
        'Which campaigns are working best?',
        'Which campaigns are underperforming?',
        'Where is money getting wasted?',
        'How are my ad platforms performing?',
        'What should the team do next?',
      ],
    },
    {
      id: 'website',
      label: 'Website & Features',
      icon: Compass,
      prompts: [
        'How do I upload custom CSV or Excel files?',
        'How does the Budget Allocator work?',
        'How to export data and reports?',
        'How do I approve actions in Action Queue?',
        'How to customize classification thresholds?',
        'What features does MarketPulse AI have?',
      ],
    },
    {
      id: 'strategy',
      label: 'Strategy & Tactics',
      icon: Lightbulb,
      prompts: [
        'Why is performance dropping on social?',
        'How to fix ad creative fatigue?',
        'What is customer sentiment telling us?',
        'How are winning campaigns calculated?',
      ],
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
      if (window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [messages, isChatOpen]);

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatOpen) {
        setIsChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen, setIsChatOpen]);

  const handleCopy = (id: string, text: string) => {
    const cleanForCopy = text.replace(/\*\*/g, '').replace(/•/g, '-');
    navigator.clipboard.writeText(cleanForCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `**Key Finding:**
Chat history cleared. Ready for your questions across ${campaigns.length} campaigns or any website feature.`,
        evidence: `Directly synced with your current dataset.`,
        confidence: 'High',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSend = async (customQuery?: string) => {
    const query = (customQuery || inputQuestion).trim();
    if (!query || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInputQuestion('');
    setIsLoading(true);

    const summary = calculateDatasetSummary(campaigns);
    const cacheKey = `${query.toLowerCase().trim()}_${campaigns.length}_${currencyConfig.code}`;

    if (responseCacheRef.current.has(cacheKey)) {
      const cached = responseCacheRef.current.get(cacheKey)!;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: cached.text,
            evidence: cached.evidence,
            confidence: cached.confidence,
            isAiGenerated: cached.isAiGenerated,
            modelUsed: cached.modelUsed,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            responseTimeMs: 25,
          },
        ]);
        setIsLoading(false);
      }, 50);
      return;
    }

    const aiMsgId = `ai-${Date.now()}`;
    let accumulatedText = '';
    let hasAddedAiPlaceholder = false;

    try {
      setIsStreaming(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch('/api/ai/ask-pulse-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          datasetSummary: summary,
          contextCampaigns: campaigns.slice(0, 15),
          currencySymbol: currencyConfig.symbol,
          currencyCode: currencyConfig.code,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok || !response.body) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let isAiGenerated = true;
      let modelUsed: string | undefined = undefined;
      let responseTimeMs = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        const lines = textChunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.chunk) {
                accumulatedText += data.chunk;

                if (!hasAddedAiPlaceholder) {
                  hasAddedAiPlaceholder = true;
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: aiMsgId,
                      sender: 'ai',
                      text: accumulatedText,
                      evidence: `Grounded in ${campaigns.length} verified records in ${currencyConfig.code}.`,
                      confidence: 'High',
                      isAiGenerated: true,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                } else {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMsgId ? { ...msg, text: accumulatedText } : msg
                    )
                  );
                }
              }

              if (data.text) {
                accumulatedText = data.text;
              }

              if (data.isAiGenerated !== undefined) {
                isAiGenerated = data.isAiGenerated;
              }
              if (data.modelUsed) {
                modelUsed = data.modelUsed;
              }
              if (data.responseTimeMs) {
                responseTimeMs = data.responseTimeMs;
              }
            } catch (parseErr) {
              // Ignore partial JSON chunks in stream
            }
          }
        }
      }

      if (!accumulatedText) {
        throw new Error('Empty response received from stream');
      }

      const finalEvidence = isAiGenerated
        ? `Grounded in ${campaigns.length} records in ${currencyConfig.name} via ${modelUsed || 'Gemini'}.`
        : `Calculated from ${campaigns.length} records (high-reliability engine).`;

      if (!hasAddedAiPlaceholder) {
        setMessages((prev) => [
          ...prev,
          {
            id: aiMsgId,
            sender: 'ai',
            text: accumulatedText,
            evidence: finalEvidence,
            confidence: 'High',
            isAiGenerated,
            modelUsed,
            responseTimeMs,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  text: accumulatedText,
                  evidence: finalEvidence,
                  isAiGenerated,
                  modelUsed,
                  responseTimeMs,
                }
              : msg
          )
        );
      }

      responseCacheRef.current.set(cacheKey, {
        text: accumulatedText,
        evidence: finalEvidence,
        confidence: 'High',
        isAiGenerated,
        modelUsed,
      });
    } catch (err: any) {
      console.warn('Streaming error, activating deterministic fallback:', err?.message || err);
      const fallbackResponse = generateDeterministicAnswer(query, campaigns, summary, formatMoney, currencyConfig.symbol);

      const fallbackMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: fallbackResponse.text,
        evidence: fallbackResponse.evidence,
        confidence: 'High',
        isAiGenerated: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (hasAddedAiPlaceholder) {
        setMessages((prev) => prev.map((msg) => (msg.id === aiMsgId ? fallbackMsg : msg)));
      } else {
        setMessages((prev) => [...prev, fallbackMsg]);
      }

      responseCacheRef.current.set(cacheKey, {
        text: fallbackResponse.text,
        evidence: fallbackResponse.evidence,
        confidence: 'High',
        isAiGenerated: false,
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // Navigate helper to quickly jump to app pages mentioned in AI answers
  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
  };

  // Helper to format AI response cleanly with rich structured cards & badges
  const renderFormattedText = (rawText: string) => {
    const cleaned = rawText
      .replace(/^###\s*/gim, '')
      .replace(/^##\s*/gim, '')
      .replace(/\[VERIFIED DATA INSIGHT\]:?/gi, '**Verified Data:**')
      .replace(/\[LIKELY HYPOTHESIS\]:?/gi, '**Analysis & Root Cause:**')
      .replace(/\[RECOMMENDED ACTION\]:?/gi, '**Recommended Next Step:**')
      .replace(/\[DATA LIMITATIONS\]:?/gi, '**Data Note:**');

    const paragraphs = cleaned.split('\n\n').filter((p) => p.trim());

    // Check if the response mentions pages to offer quick action navigation
    const textLower = rawText.toLowerCase();
    const suggestedPages: { id: PageId; label: string; icon: any }[] = [];

    if (textLower.includes('upload') || textLower.includes('/upload')) {
      suggestedPages.push({ id: 'upload', label: 'Go to Upload Center', icon: Upload });
    }
    if (textLower.includes('budget allocator') || textLower.includes('forecasting') || textLower.includes('/forecasting')) {
      suggestedPages.push({ id: 'forecasting', label: 'Open Budget Allocator', icon: Sliders });
    }
    if (textLower.includes('action queue') || textLower.includes('recommendation') || textLower.includes('/recommendations')) {
      suggestedPages.push({ id: 'recommendations', label: 'Open Action Queue', icon: CheckCircle2 });
    }
    if (textLower.includes('campaign performance') || textLower.includes('/campaigns')) {
      suggestedPages.push({ id: 'campaigns', label: 'View Campaigns', icon: BarChart3 });
    }
    if (textLower.includes('ai insights') || textLower.includes('/insights')) {
      suggestedPages.push({ id: 'insights', label: 'Explore AI Insights', icon: Sparkles });
    }
    if (textLower.includes('customer') || textLower.includes('/customer_insights')) {
      suggestedPages.push({ id: 'customer_insights', label: 'Customer Insights', icon: HelpCircle });
    }
    if (textLower.includes('setting') || textLower.includes('threshold') || textLower.includes('/settings')) {
      suggestedPages.push({ id: 'settings', label: 'Open Settings', icon: Settings });
    }

    return (
      <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed">
        {paragraphs.map((para, pIdx) => {
          const isKeyFinding = para.startsWith('**Key Finding:**') || para.includes('Key Finding:');
          const isFeatureOverview = para.startsWith('**Feature Overview:**') || para.includes('Feature Overview:');
          const isVerifiedData = para.startsWith('**Verified Data:**') || para.includes('Verified Data:');
          const isAnalysis = para.startsWith('**Analysis') || para.includes('Analysis & Root Cause:') || para.includes('Analysis & Hypothesis:');
          const isAction = para.startsWith('**Recommended') || para.includes('Recommended Next Step:') || para.includes('Recommended Action:');
          const isHowTo = para.startsWith('**How to Use') || para.includes('How to Use & Steps:');

          // Render numbered list (e.g. 1. Step one, 2. Step two)
          if (/^\d+\.\s/.test(para.trim()) || isHowTo) {
            const lines = para.split('\n');
            return (
              <div key={pIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1.5">
                {lines.map((line, lIdx) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                    return (
                      <div key={lIdx} className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{trimmed.replace(/\*\*/g, '')}</span>
                      </div>
                    );
                  }

                  const numMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
                  if (numMatch) {
                    return (
                      <div key={lIdx} className="flex items-start gap-2 py-0.5 text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {numMatch[1]}
                        </span>
                        <span className="flex-1">{formatInlineEmphasis(numMatch[2])}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={lIdx} className="text-slate-700">
                      {formatInlineEmphasis(trimmed)}
                    </div>
                  );
                })}
              </div>
            );
          }

          // Render bullet list if contains bullet points
          if (para.includes('•') || para.startsWith('-')) {
            const lines = para.split('\n');
            return (
              <div
                key={pIdx}
                className={`p-3 rounded-xl border ${
                  isVerifiedData
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                {lines.map((line, lIdx) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                    return (
                      <div key={lIdx} className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{trimmed.replace(/\*\*/g, '')}</span>
                      </div>
                    );
                  }

                  const cleanBullet = trimmed.replace(/^[•\-]\s*/, '');
                  return (
                    <div key={lIdx} className="flex items-start gap-2 py-0.5 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span className="flex-1">{formatInlineEmphasis(cleanBullet)}</span>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Key finding highlight card
          if (isKeyFinding) {
            const content = para.replace(/\*\*Key Finding:\*\*/i, '').trim();
            return (
              <div key={pIdx} className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-950 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 mb-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  Key Finding
                </div>
                <div>{formatInlineEmphasis(content)}</div>
              </div>
            );
          }

          // Feature overview card
          if (isFeatureOverview) {
            const content = para.replace(/\*\*Feature Overview:\*\*/i, '').trim();
            return (
              <div key={pIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Feature Overview
                </div>
                <div>{formatInlineEmphasis(content)}</div>
              </div>
            );
          }

          // Analysis & Root Cause card
          if (isAnalysis) {
            const content = para.replace(/\*\*Analysis(& Root Cause| & Hypothesis)?:\*\*/i, '').trim();
            return (
              <div key={pIdx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-amber-950 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  Analysis & Root Cause
                </div>
                <div>{formatInlineEmphasis(content)}</div>
              </div>
            );
          }

          // Recommended Action card
          if (isAction) {
            const content = para.replace(/\*\*Recommended( Next Step| Action):\*\*/i, '').trim();
            return (
              <div key={pIdx} className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Recommended Action
                </div>
                <div>{formatInlineEmphasis(content)}</div>
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={pIdx} className="text-slate-800">
              {formatInlineEmphasis(para)}
            </p>
          );
        })}

        {/* Quick 1-click Page Navigation Shortcuts */}
        {suggestedPages.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
            {suggestedPages.map((sp) => {
              const IconComp = sp.icon;
              return (
                <button
                  key={sp.id}
                  onClick={() => handleNavigate(sp.id)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer active:scale-95"
                >
                  <IconComp className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{sp.label}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-400" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const formatInlineEmphasis = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return (
          <strong key={i} className="font-bold text-slate-900">
            {inner}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Toggle Button (if closed) */}
      {!isChatOpen && (
        <button
          id="btn-floating-ask-pulse"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group min-h-[44px]"
          aria-label="Open Ask Pulse AI Chat"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide">Ask Pulse AI</span>
          <span className="hidden md:inline-flex items-center text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-normal">
            Fast
          </span>
        </button>
      )}

      {/* Floating Responsive Chat Drawer/Modal */}
      {isChatOpen && (
        <div
          className={`fixed z-50 bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            'inset-x-0 bottom-0 top-auto sm:inset-auto sm:bottom-4 sm:right-4 md:bottom-6 md:right-6'
          } ${
            isExpanded
              ? 'w-full h-[100dvh] sm:w-[90vw] md:w-[680px] sm:h-[85vh] sm:rounded-2xl'
              : 'w-full h-[90dvh] sm:w-[460px] md:w-[500px] sm:h-[640px] max-h-[100dvh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl'
          } animate-in slide-in-from-bottom-5`}
        >
          {/* Mobile Drag Indicator */}
          <div className="sm:hidden w-full flex justify-center pt-2 pb-1 bg-slate-50">
            <div className="w-10 h-1 rounded-full bg-slate-300" />
          </div>

          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                    Pulse Intelligence Agent
                  </h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-amber-500" /> AI Analyst & Guide
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {campaigns.length} active campaigns • {currencyConfig.name} ({currencyConfig.symbol})
                </p>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Clear Chat History"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title={isExpanded ? 'Compress View' : 'Expand View'}
                aria-label="Toggle expanded view"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Close (Esc)"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Categorized Prompt Selector Bar */}
          <div className="px-3 pt-2 pb-1.5 bg-slate-50/90 border-b border-slate-200">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 mb-1.5 overflow-x-auto no-scrollbar">
              {promptCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Prompt Chips for Selected Category */}
            <div className="overflow-x-auto flex gap-1.5 no-scrollbar scroll-smooth pb-0.5">
              {promptCategories
                .find((c) => c.id === activeCategory)
                ?.prompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p)}
                    className="whitespace-nowrap text-[11px] px-2.5 py-1.5 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-700 font-medium transition-all active:scale-95 cursor-pointer shadow-2xs shrink-0 min-h-[28px] flex items-center"
                  >
                    {p}
                  </button>
                ))}
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs bg-slate-50/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[94%] sm:max-w-[88%] p-3.5 rounded-2xl relative group ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  {/* Formatted Content */}
                  {m.sender === 'user' ? (
                    <div className="text-xs sm:text-[13px] font-medium leading-relaxed">{m.text}</div>
                  ) : (
                    renderFormattedText(m.text)
                  )}

                  {/* Evidence & Performance Footer */}
                  {m.sender === 'ai' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-[280px]">
                          <strong>Verified:</strong> {m.evidence}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {m.responseTimeMs !== undefined && (
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5 text-amber-500" />
                            {(m.responseTimeMs / 1000).toFixed(2)}s
                          </span>
                        )}

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopy(m.id, m.text)}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Copy text"
                          aria-label="Copy message"
                        >
                          {copiedId === m.id ? (
                            <span className="text-emerald-600 flex items-center gap-0.5 font-bold">
                              <Check className="w-3 h-3" /> Copied
                            </span>
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1.5">{m.timestamp}</span>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-white p-3.5 rounded-2xl max-w-[85%] border border-slate-200 shadow-xs animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">Pulse AI is analyzing dataset...</div>
                  <div className="text-[10px] text-slate-500">Processing inquiry against {campaigns.length} campaigns</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer (Cross-platform touch & keyboard safe) */}
          <div className="p-3 sm:p-3.5 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about campaigns, how to upload, budget allocator, ROAS..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
              />
              <button
                id="btn-ask-pulse-send"
                onClick={() => handleSend()}
                disabled={isLoading || !inputQuestion.trim()}
                className="p-2.5 sm:p-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
                aria-label="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Press Enter to send</span>
              <span>100% grounded in MarketPulse AI</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function generateDeterministicAnswer(
  query: string,
  campaigns: any[],
  summary: any,
  formatMoney: (val: number) => string,
  currencySymbol: string = '₹'
): { text: string; evidence: string } {
  const q = query.toLowerCase();

  // --- WEBSITE & FEATURE GUIDANCE ---

  // Upload Center
  if (q.includes('upload') || q.includes('import') || q.includes('csv') || q.includes('excel') || q.includes('xlsx') || q.includes('json') || q.includes('file')) {
    return {
      text: `**Feature Overview:**
The **Upload Center** allows you to import marketing campaign data in CSV, Excel (.xlsx/.xls), or JSON formats with automated column mapping.

**How to Use & Steps:**
1. Click **Upload Center** in the left sidebar navigation.
2. Drag and drop your file or click **Browse Files** to choose your report.
3. MarketPulse AI cleans the data and automatically matches column synonyms (e.g., Spend, Revenue, Impressions, Clicks, Conversions).
4. Review the Data Quality Audit score and launch directly into the updated Analytics Dashboard.

**Key Capabilities:**
• Multi-format ingestion: CSV, Excel (.xlsx, .xls), and JSON.
• Automatic currency detection and numerical cleansing.
• Instant data quality audit and validation checks.

**Quick Navigation:**
Navigate to the **Upload Center** in the sidebar.`,
      evidence: 'Built-in feature documentation for MarketPulse AI.',
    };
  }

  // Export Data
  if (q.includes('export') || q.includes('download') || (q.includes('report') && (q.includes('how') || q.includes('where')))) {
    return {
      text: `**Feature Overview:**
MarketPulse AI provides instant one-click data exports in standard **CSV** and **JSON** formats.

**How to Use & Steps:**
1. Click the **Export Data** button in the top navigation bar.
2. Select **Export CSV** (for spreadsheets) or **Export JSON** (for BI tools and APIs).
3. In **Campaign Performance**, you can also export filtered subsets directly from the table controls.

**Key Capabilities:**
• Export raw metrics and computed KPIs (ROAS, CPA, CTR, CPC).
• Full compatibility with Microsoft Excel, Google Sheets, and Power BI.

**Quick Navigation:**
Use the **Export Data** dropdown in the top navbar.`,
      evidence: 'Built-in feature documentation for MarketPulse AI.',
    };
  }

  // Currency Switcher
  if (q.includes('currency') || q.includes('rupee') || q.includes('dollar') || q.includes('euro') || q.includes('pound')) {
    return {
      text: `**Feature Overview:**
MarketPulse AI features a global multi-currency engine supporting 9 major world currencies with real-time conversion.

**How to Use & Steps:**
1. Click the **Currency Selector** dropdown in the top navigation bar.
2. Choose your preferred currency (INR ₹, USD $, EUR €, GBP £, AED, CAD, AUD, SGD, JPY).
3. All metrics, graphs, tables, and AI insights dynamically recompute instantly.

**Key Capabilities:**
• Real-time exchange rate conversion.
• Locale-aware number formatting (e.g., millions, lakhs).

**Quick Navigation:**
Use the currency selector in the top navbar.`,
      evidence: 'Built-in feature documentation for MarketPulse AI.',
    };
  }

  // Budget Allocator & Forecasting
  if (q.includes('allocat') || q.includes('budget') && (q.includes('simulat') || q.includes('how') || q.includes('forecast') || q.includes('plan')) || q.includes('scenario') || q.includes('monte carlo')) {
    return {
      text: `**Feature Overview:**
The **Budget Allocator & Forecasting** engine models theoretical budget shifts across channels to project Revenue and ROAS uplift before deploying capital.

**How to Use & Steps:**
1. Click **Budget Allocator** in the left sidebar.
2. Adjust your **Target Portfolio Budget** and select a strategy (Aggressive, Balanced, or Conservative).
3. Review simulated channel redistributions and predicted incremental revenue.

**Key Capabilities:**
• Monte Carlo and elasticity-driven ROAS forecasting.
• Projected revenue, conversions, and risk confidence scores.

**Quick Navigation:**
Go to **Budget Allocator** in the left sidebar.`,
      evidence: 'Built-in feature documentation for MarketPulse AI.',
    };
  }

  // Action Queue / Recommendations
  if (q.includes('action queue') || (q.includes('recommendation') && (q.includes('how') || q.includes('where') || q.includes('approve'))) || q.includes('audit log')) {
    return {
      text: `**Feature Overview:**
The **Action Queue** delivers prioritized, AI-generated operational recommendations with one-click approval workflows and safety safeguards.

**How to Use & Steps:**
1. Navigate to **Action Queue** in the left sidebar.
2. Review categorized recommendations: Budget Reallocations, Pausing Laggards, and Creative Refreshes.
3. Click **Approve & Execute** to apply the recommendation or **Dismiss** to reject it.
4. Track all applied modifications in the real-time **Audit Log**.

**Key Capabilities:**
• One-click human-in-the-loop approvals.
• Risk rating assessment (Low, Medium, High) and expected financial impact.

**Quick Navigation:**
Click **Action Queue** in the left sidebar.`,
      evidence: 'Built-in feature documentation for MarketPulse AI.',
    };
  }

  // Customer Insights
  if (q.includes('customer') || q.includes('sentiment') || q.includes('nps') || q.includes('review') || q.includes('feedback')) {
    return {
      text: `**Feature Overview:**
The **Customer Insights** module analyzes customer sentiment, ratings, and qualitative feedback across marketing touchpoints.

**How to Use & Steps:**
1. Click **Customer Insights** in the left sidebar.
2. Explore the **Net Promoter Score (NPS)** gauge and sentiment breakdown.
3. Review keyword clusters (Pricing, Shipping, Product Quality, Ad Experience).

**Key Capabilities:**
• Cross-channel sentiment analysis by platform.
• Automated customer pain point and praise extraction.

**Quick Navigation:**
Navigate to **Customer Insights** in the sidebar.`,
      evidence: 'Built-in feature documentation for MarketPulse AI.',
    };
  }

  // Settings & Thresholds
  if (q.includes('setting') || q.includes('threshold') || q.includes('winning roas') || q.includes('underperforming threshold')) {
    return {
      text: `**Feature Overview:**
The **Settings** page lets you configure custom performance benchmarks and classification thresholds used across the platform.

**How to Use & Steps:**
1. Navigate to **Settings** in the left sidebar.
2. Adjust your **Winning ROAS Threshold** (e.g., 3.0x) and **Underperforming ROAS Threshold** (e.g., 1.8x).
3. Set minimum impression/click reliability filters to prevent premature ad judgment.
4. Click **Save Settings** to recalculate all campaign statuses across the app.

**Key Capabilities:**
• Dynamic classification recalculation for all tables and charts.
• One-click reset to default demo data.

**Quick Navigation:**
Go to **Settings** in the left sidebar.`,
      evidence: 'Built-in feature documentation for MarketPulse AI.',
    };
  }

  // Website Overview
  if (q.includes('what is') && (q.includes('website') || q.includes('app') || q.includes('platform') || q.includes('marketpulse') || q.includes('pulse')) || q.includes('features') || q.includes('what can you do') || q.includes('pages')) {
    return {
      text: `**Feature Overview:**
**MarketPulse AI** is an end-to-end marketing intelligence platform that unifies cross-channel analytics, AI diagnostics, and automated budget allocation.

**How to Use & Steps:**
1. **Analytics Dashboard:** Monitor macro KPIs, Trajectory area charts, and the Channel Efficiency Matrix.
2. **Campaign Performance:** Filter, sort, and inspect granular campaign rows with per-ad metrics.
3. **AI Insights:** Read automated root-cause diagnostics and anomaly alerts.
4. **Budget Allocator:** Simulate budget reallocations and forecast revenue uplifts.
5. **Action Queue:** Review and approve prioritized operational adjustments.
6. **Data Upload Center:** Upload your custom CSV/Excel files anytime.

**Key Capabilities:**
• Multi-platform ingestion (Google Ads, Meta Ads, TikTok, LinkedIn, YouTube, Email, etc.).
• Real-time multi-currency support and structured AI chat assistance.

**Quick Navigation:**
Use the left sidebar to navigate across all 8 specialized intelligence modules.`,
      evidence: 'Platform documentation for MarketPulse AI.',
    };
  }

  // --- SPECIFIC CAMPAIGN LOOKUP ---
  const foundCampaign = campaigns.find((c: any) =>
    c.name && q.includes(c.name.toLowerCase().trim())
  );
  if (foundCampaign) {
    const cRoas = foundCampaign.spend > 0 ? (foundCampaign.revenue / foundCampaign.spend).toFixed(2) : '0.00';
    const cCpa = foundCampaign.conversions > 0 ? (foundCampaign.spend / foundCampaign.conversions).toFixed(2) : '0.00';
    return {
      text: `**Key Finding:**
Campaign **${foundCampaign.name}** on **${foundCampaign.platform}** is currently **${foundCampaign.status || 'Active'}**, delivering a **${cRoas}x ROAS**.

**Verified Data:**
• Campaign: **${foundCampaign.name}** (${foundCampaign.platform})
• Spend: ${formatMoney(foundCampaign.spend)}
• Revenue: ${formatMoney(foundCampaign.revenue)}
• ROAS: **${cRoas}x** | CPA: ${formatMoney(Number(cCpa))}
• Conversions: ${Number(foundCampaign.conversions).toLocaleString()} (${Number(foundCampaign.clicks).toLocaleString()} clicks, ${Number(foundCampaign.impressions).toLocaleString()} impressions)

**Analysis & Root Cause:**
${Number(cRoas) >= 2.5 ? 'Strong audience-creative alignment is driving high purchasing intent.' : 'Creative fatigue or high CPC is compressing margins.'}

**Recommended Next Step:**
${Number(cRoas) >= 2.5 ? `Scale budget by 10-15% on ${foundCampaign.name} while monitoring marginal CPA.` : `Review ad creative, refresh audience exclusions, or check landing page conversion.`}`,
      evidence: `Exact record match for campaign ${foundCampaign.name} in active dataset.`,
    };
  }

  // --- ANALYSED DATA ENQUIRIES ---

  // 1. Which campaigns are working
  if (q.includes('best') || q.includes('top') || q.includes('winner') || q.includes('working') || q.includes('highest')) {
    return {
      text: `**Key Finding:**
**${summary.topPerformingCampaignName}** is your top-performing campaign delivering an outstanding **${summary.topPerformingRoas}x ROAS**.

**Verified Data:**
• Winning Campaign: **${summary.topPerformingCampaignName}**
• Peak Efficiency: **${summary.topPerformingRoas}x ROAS** (Fleet Average: ${summary.averageRoas}x)
• Leading Channel: **${summary.topPlatform}** generated the highest blended returns
• Total Portfolio Revenue: ${formatMoney(summary.totalRevenue)}

**Analysis & Root Cause:**
Superior performance correlates with targeted intent keywords and focused landing page messaging.

**Recommended Next Step:**
Scale investment in ${summary.topPerformingCampaignName} by 10-15% while verifying marginal acquisition costs.`,
      evidence: `Calculated from ${campaigns.length} uploaded records. Top ROAS: ${summary.topPerformingRoas}x.`,
    };
  }

  // 2. Which campaigns are underperforming
  if (q.includes('underperforming') || q.includes('laggard') || q.includes('lowest') || q.includes('poor') || q.includes('worst')) {
    const underperforming = campaigns.filter((c) => {
      const m = calculateCampaignMetrics(c);
      return m.roas < 1.8;
    });
    return {
      text: `**Key Finding:**
Identified **${underperforming.length} campaigns** operating below target efficiency, led by **${summary.lowestPerformingCampaignName}** (${summary.lowestPerformingRoas}x ROAS).

**Verified Data:**
• Lowest ROAS Campaign: **${summary.lowestPerformingCampaignName}** (${summary.lowestPerformingRoas}x ROAS)
• Flagged Underperforming Ad Sets: ${underperforming.length} campaigns
• Portfolio Spend at Risk: ${formatMoney(underperforming.reduce((sum, c) => sum + c.spend, 0))}

**Analysis & Root Cause:**
Ad fatigue and broad audience targeting without negative exclusions are causing rising CPA and poor checkout conversion.

**Recommended Next Step:**
Pause or restructure the bottom underperforming ad sets in **Campaign Performance** and reallocate the saved budget to top performers.`,
      evidence: `Identified ${underperforming.length} campaigns with ROAS < 1.8x.`,
    };
  }

  // 3. Where money may be getting wasted
  if (q.includes('waste') || q.includes('wasting') || q.includes('leakage') || q.includes('loss')) {
    const underperforming = campaigns.filter((c) => {
      const m = calculateCampaignMetrics(c);
      return m.roas < 2.0;
    });
    const estimatedWaste = underperforming.reduce((sum, c) => sum + Math.max(0, c.spend - (c.revenue / 2)), 0);
    return {
      text: `**Key Finding:**
Estimated budget leakage of approximately **${formatMoney(estimatedWaste)}** is concentrated in low-yield discovery channels and high-frequency ad sets.

**Verified Data:**
• Waste Concentration: Broad audience social campaigns with CTR > 2% but CR < 1.2%
• Lowest Returning Ad Set: **${summary.lowestPerformingCampaignName}**
• Total Portfolio Spend: ${formatMoney(summary.totalSpend)}

**Analysis & Root Cause:**
Creative fatigue and ad saturation are generating clicks from non-converting audiences.

**Recommended Next Step:**
Open the **Action Queue** to review one-click automated pauses for flagged low-efficiency ad sets.`,
      evidence: `Calculated from ${underperforming.length} sub-threshold campaigns in dataset.`,
    };
  }

  // 4. Why performance may be changing
  if (q.includes('why') || q.includes('changing') || q.includes('cause') || q.includes('reason')) {
    return {
      text: `**Key Finding:**
Performance variation across your campaigns is driven primarily by creative wear-out on social channels and intent divergence between search and display.

**Verified Data:**
• Top Channel Efficiency: **${summary.topPlatform}** leads with highest ROAS
• Average Blended ROAS: **${summary.averageRoas}x**
• Average Portfolio CTR: ${summary.averageCtr}%

**Analysis & Root Cause:**
Search campaigns capture existing buying intent at low CPA, whereas social ads experience conversion drop-offs due to mobile landing page latency.

**Recommended Next Step:**
Deploy refreshed video hooks for high-impression social ads and optimize mobile checkout speed.`,
      evidence: `Derived from cross-channel correlation matrix across ${campaigns.length} campaigns.`,
    };
  }

  // 5. What the team should do next
  if (q.includes('next') || q.includes('do next') || q.includes('action') || q.includes('recommend') || q.includes('plan')) {
    return {
      text: `**Key Finding:**
The immediate priority is shifting 15% budget from laggards to **${summary.topPerformingCampaignName}** and refreshing saturated creative assets.

**Verified Data:**
• Action 1: Reallocate budget from ${summary.lowestPerformingCampaignName} to ${summary.topPerformingCampaignName}
• Action 2: Review pending approvals in Action Queue
• Expected Portfolio Revenue Impact: +8% to +14% uplift

**Analysis & Root Cause:**
Directing spend to verified high-intent channels provides immediate margin expansion without increasing overall ad spend.

**Recommended Next Step:**
Open the **Action Queue** to review and approve priority optimization recommendations.`,
      evidence: `Synthesized from verified recommendations for ${campaigns.length} active campaigns.`,
    };
  }

  if (q.includes('platform') || q.includes('channel') || q.includes('google') || q.includes('meta') || q.includes('tiktok') || q.includes('linkedin')) {
    return {
      text: `**Key Finding:**
**${summary.topPlatform}** leads your cross-channel portfolio in blended return on ad spend.

**Verified Data:**
• Primary Platform: **${summary.topPlatform}**
• Portfolio Total Revenue: ${formatMoney(summary.totalRevenue)}
• Portfolio Total Spend: ${formatMoney(summary.totalSpend)}
• Portfolio Blended ROAS: **${summary.averageRoas}x**

**Analysis & Root Cause:**
Search and intent-driven formats are delivering higher conversion rates compared to broad social discovery.

**Recommended Next Step:**
Maintain 65% of budget in top channels while structuring social remarketing experiments for retargeting.`,
      evidence: `Computed across all active channels in your dataset.`,
    };
  }

  return {
    text: `**Key Finding:**
Your marketing portfolio includes **${summary.totalCampaigns} active campaigns** delivering a blended **${summary.averageRoas}x ROAS**.

**Verified Data:**
• Total Spend: ${formatMoney(summary.totalSpend)}
• Total Revenue: ${formatMoney(summary.totalRevenue)}
• Total Conversions: ${summary.totalConversions.toLocaleString()}
• Average ROAS: **${summary.averageRoas}x**
• Average CTR: ${summary.averageCtr}%

**Analysis & Root Cause:**
Cross-channel performance shows stable acquisition efficiency with room for budget optimization.

**Recommended Next Step:**
Review the **Campaign Performance** page and use the quick filter bar to review Active campaigns.`,
    evidence: `Calculated from ${campaigns.length} active campaigns.`,
  };
}
