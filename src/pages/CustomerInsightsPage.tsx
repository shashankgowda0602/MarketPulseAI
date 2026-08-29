import React, { useState } from 'react';
import {
  Users,
  Smile,
  Meh,
  Frown,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  MessageSquare,
  Lock,
  ThumbsUp,
  ThumbsDown,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomerFeedback } from '../types';

export const CustomerInsightsPage: React.FC = () => {
  const { customerFeedback, setCustomerFeedback, addNotification } = useApp();

  const [newComment, setNewComment] = useState('');
  const [newChannel, setNewChannel] = useState('Instagram Comments');
  const [newRating, setNewRating] = useState(5);

  const totalReviews = customerFeedback.length;
  const positiveCount = customerFeedback.filter((f) => f.sentiment === 'positive').length;
  const neutralCount = customerFeedback.filter((f) => f.sentiment === 'neutral').length;
  const negativeCount = customerFeedback.filter((f) => f.sentiment === 'negative').length;

  const positivePct = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;
  const neutralPct = totalReviews > 0 ? Math.round((neutralCount / totalReviews) * 100) : 0;
  const negativePct = totalReviews > 0 ? Math.round((negativeCount / totalReviews) * 100) : 0;

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    const textLower = newComment.toLowerCase();

    if (
      textLower.includes('love') ||
      textLower.includes('great') ||
      textLower.includes('fast') ||
      textLower.includes('good') ||
      textLower.includes('excellent') ||
      newRating >= 4
    ) {
      sentiment = 'positive';
    } else if (
      textLower.includes('slow') ||
      textLower.includes('broken') ||
      textLower.includes('too many') ||
      textLower.includes('bad') ||
      textLower.includes('annoying') ||
      newRating <= 2
    ) {
      sentiment = 'negative';
    }

    const newEntry: CustomerFeedback = {
      id: `FB-${Date.now().toString().slice(-4)}`,
      author: `User_${Math.floor(1000 + Math.random() * 9000)}`,
      anonymizedAuthor: `Customer_${Math.floor(1000 + Math.random() * 9000)}`,
      channel: newChannel,
      platform: newChannel,
      text: newComment,
      sentiment,
      sentimentScore: sentiment === 'positive' ? 0.85 : sentiment === 'negative' ? -0.7 : 0.0,
      theme: sentiment === 'positive' ? 'Product Quality / Delivery' : 'User Experience',
      topic: sentiment === 'positive' ? 'Product Quality / Delivery' : 'User Experience',
      date: new Date().toISOString().slice(0, 10),
      rating: newRating,
      isAnonymized: true,
    };

    setCustomerFeedback([newEntry, ...customerFeedback]);
    setNewComment('');
    addNotification(`Added anonymized customer review (${sentiment.toUpperCase()}).`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer & Public Sentiment Intelligence</h1>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              PII Anonymized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Synthesizes customer comments, reviews, and qualitative feedback to explain conversion friction without violating privacy.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 self-start md:self-auto">
          <Lock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Automatic Author Pseudonymization</span>
        </div>
      </div>

      {/* Sentiment Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Positive */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Positive Sentiment</span>
            <div className="text-2xl font-black text-emerald-600">{positivePct}%</div>
            <p className="text-[10px] text-slate-500">{positiveCount} reviews registered</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Smile className="w-6 h-6" />
          </div>
        </div>

        {/* Neutral */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Neutral / Inquiries</span>
            <div className="text-2xl font-black text-amber-600">{neutralPct}%</div>
            <p className="text-[10px] text-slate-500">{neutralCount} reviews registered</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Meh className="w-6 h-6" />
          </div>
        </div>

        {/* Negative */}
        <div className="p-5 rounded-2xl bg-white border border-rose-200 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Negative / Pain Points</span>
            <div className="text-2xl font-black text-rose-600">{negativePct}%</div>
            <p className="text-[10px] text-slate-500">{negativeCount} complaints flagged</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Frown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Top Liked Themes vs Top Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Liked */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <ThumbsUp className="w-4 h-4" />
            <span>Top Praised Customer Value Props</span>
          </div>
          <div className="space-y-2.5 text-xs">
            {[
              { theme: 'Fast 1-Day Metro Delivery', mentions: '42 mentions', impact: '+35% repeat order velocity' },
              { theme: 'Crisp Noise Cancellation Quality', mentions: '38 mentions', impact: 'Key conversion driver on Google Search' },
              { theme: 'VIP Loyalty Discount Codes', mentions: '29 mentions', impact: '10.5x ROAS on Email lifecycle campaigns' },
            ].map((t, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-slate-900">{t.theme}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.impact}</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                  {t.mentions}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Complaints */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <ThumbsDown className="w-4 h-4" />
            <span>Identified Customer Friction & Ad Fatigue</span>
          </div>
          <div className="space-y-2.5 text-xs">
            {[
              { theme: 'High Ad Frequency on Reels (5+ / day)', mentions: '19 mentions', action: 'Frequency cap recommended' },
              { theme: 'Promo Code Expired on Mobile Cart', mentions: '14 mentions', action: 'Fix discount code auto-apply' },
              { theme: 'Slow Checkout Page Load Speed', mentions: '11 mentions', action: 'Optimize mobile Core Web Vitals' },
            ].map((c, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-slate-900">{c.theme}</h4>
                  <p className="text-[10px] text-rose-700 mt-0.5">{c.action}</p>
                </div>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                  {c.mentions}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Feed Table & Add Feedback Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Anonymized Voice of Customer Feed ({customerFeedback.length})</span>
            </h2>
            <span className="text-[10px] text-slate-500">Real-time sentiment classification</span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
            {customerFeedback.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-700 font-semibold">{fb.anonymizedAuthor}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {fb.channel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        fb.sentiment === 'positive'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : fb.sentiment === 'negative'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {fb.sentiment.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed italic">"{fb.text}"</p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Topic: {fb.topic}</span>
                  <span>{fb.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Customer Review Form */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <form onSubmit={handleAddFeedback} className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Add Feedback / Comment</h3>
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Channel Source</label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="Instagram Comments">Instagram Comments</option>
                <option value="Google Reviews">Google Reviews</option>
                <option value="Customer Support Chat">Customer Support Chat</option>
                <option value="YouTube Feedback">YouTube Feedback</option>
                <option value="Website Survey">Website Survey</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Rating (1 to 5 Stars)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className={`flex-1 py-1.5 rounded-lg font-bold border transition-colors ${
                      newRating >= star
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Feedback Text</label>
              <textarea
                required
                rows={4}
                placeholder="Paste customer review or comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Analyze & Classify Sentiment
            </button>
          </form>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Customer names are scrubbed to uphold data privacy standards.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
