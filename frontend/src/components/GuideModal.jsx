import React from 'react';
import { X, CheckCircle2, ShieldAlert, Lock, Sparkles, ArrowRight } from 'lucide-react';

const ALLOWED_EXAMPLES = [
  { topic: "Expense Ratio (TER)", query: "What is the expense ratio of HDFC Flexi Cap Fund?" },
  { topic: "Minimum SIP Amount", query: "What is the minimum SIP amount for HDFC Flexi Cap Fund?" },
  { topic: "Exit Load & Redemption", query: "What is the exit load for HDFC Flexi Cap Fund?" },
  { topic: "Riskometer Category", query: "What is the riskometer of HDFC Large Cap Fund?" },
  { topic: "Benchmark Index", query: "What is the benchmark of HDFC Flexi Cap Fund?" },
  { topic: "Tax Saving Lock-in", query: "What is the lock-in period for HDFC ELSS Tax Saver?" },
  { topic: "Statement Downloads", query: "How to download capital-gains statement or CAS?" }
];

const REFUSED_EXAMPLES = [
  { query: "Should I buy HDFC Flexi Cap Fund right now?", reason: "Investment advice / recommendation" },
  { query: "Which fund is best for highest returns?", reason: "Fund ranking & performance speculation" },
  { query: "How much profit will I get in 5 years?", reason: "Return prediction / CAGR calculation" }
];

export default function GuideModal({ isOpen, onClose, onSelectQuestion }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl glass-panel border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                What Can I Ask? (User Guide)
              </h3>
              <p className="text-xs text-slate-400">
                Ground rules and factual scope for the NextLeap Milestone 4 Assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Section 1: Allowed Questions */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>What You CAN Ask (Click to Test Live)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALLOWED_EXAMPLES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectQuestion(item.query);
                    onClose();
                  }}
                  className="group flex flex-col items-start p-2.5 rounded-xl bg-slate-900/70 hover:bg-indigo-600/20 border border-slate-700/60 hover:border-indigo-400/50 text-left transition-all cursor-pointer"
                >
                  <span className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wide flex items-center justify-between w-full">
                    <span>{item.topic}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-xs text-slate-200 group-hover:text-white mt-0.5 font-medium line-clamp-2">
                    "{item.query}"
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Refused Questions */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
              <ShieldAlert className="w-4 h-4" />
              <span>What is Strictly Refused (Policy Guardrails)</span>
            </div>
            <div className="space-y-2">
              {REFUSED_EXAMPLES.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                >
                  <span className="text-slate-200 font-medium">"{item.query}"</span>
                  <span className="text-[11px] font-semibold text-amber-400 shrink-0">
                    Refused: {item.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Privacy Filter */}
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
            <Lock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <div className="font-bold text-rose-300 mb-0.5">Strict Privacy & PII Filter</div>
              Never enter PAN, Aadhaar, account numbers, passwords, or OTPs. Our regex filter will instantly block the prompt without storing or logging personal data.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
