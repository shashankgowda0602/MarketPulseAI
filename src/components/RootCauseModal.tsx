import React from 'react';
import {
  X,
  Stethoscope,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RootCauseModal: React.FC = () => {
  const {
    activeRootCauseModalId,
    setActiveRootCauseModalId,
    rootCauses,
    toggleChecklistTask,
  } = useApp();

  if (!activeRootCauseModalId) return null;

  const currentPattern = rootCauses.find((rc) => rc.id === activeRootCauseModalId);
  if (!currentPattern) return null;

  const completedCount = currentPattern.checklist.filter((item) => item.completed).length;
  const progressPct = Math.round((completedCount / currentPattern.checklist.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Root Cause Diagnostic Matrix
                </h2>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                  Hypothesis Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentPattern.patternType}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveRootCauseModalId(null)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
          {/* Summary Banner */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
            <h3 className="font-semibold text-slate-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Pattern Diagnostic Summary</span>
            </h3>
            <p className="text-slate-700 leading-relaxed text-[11px]">{currentPattern.summary}</p>
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-500">Affected Campaigns:</span>
              {currentPattern.affectedCampaigns.map((name, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-white text-indigo-700 text-[10px] font-medium border border-slate-200"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Hypotheses to Investigate */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Hypotheses to Investigate (Not Confirmed Facts)</span>
              <span className="text-[10px] font-normal text-amber-600 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Requires Validation
              </span>
            </h3>
            <div className="space-y-2">
              {currentPattern.hypotheses.map((hypo, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px] flex gap-2.5 items-start"
                >
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{hypo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Marketer Action Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Marketer Remediation Checklist
              </h3>
              <span className="text-[11px] text-indigo-600 font-semibold">
                {completedCount}/{currentPattern.checklist.length} Completed ({progressPct}%)
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="space-y-2 pt-1">
              {currentPattern.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistTask(currentPattern.id, item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={`text-xs ${item.completed ? 'line-through text-slate-500' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.completed ? 'Resolved' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">Marketer actions persist in local campaign workspace.</span>
          <button
            onClick={() => setActiveRootCauseModalId(null)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            Done & Save Progress
          </button>
        </div>
      </div>
    </div>
  );
};
