import React from 'react';
import { HelpCircle, ArrowUpRight, Coins, Wallet, Clock } from 'lucide-react';

const EXAMPLES = [
  {
    title: "Expense Ratio",
    question: "What is the expense ratio of HDFC Flexi Cap Fund?",
    tag: "Fees & TER",
    icon: Coins,
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/25 group-hover:border-amber-500/50"
  },
  {
    title: "Minimum SIP",
    question: "What is the minimum SIP amount for HDFC Flexi Cap Fund?",
    tag: "Investment Limits",
    icon: Wallet,
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 group-hover:border-emerald-500/50"
  },
  {
    title: "Exit Load",
    question: "What is the exit load for HDFC Flexi Cap Fund?",
    tag: "Redemption Rules",
    icon: Clock,
    tagColor: "bg-sky-500/10 text-sky-400 border-sky-500/25 group-hover:border-sky-500/50"
  }
];

export default function ExampleQuestions({ onSelectQuestion, disabled }) {
  return (
    <div className="w-full my-2">
      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2 px-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Recommended Factual Prompts</span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium lowercase">
          click to test instant rag retrieval
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {EXAMPLES.map((ex, idx) => {
          const Icon = ex.icon;
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelectQuestion(ex.question)}
              className="group relative flex flex-col justify-between p-3.5 rounded-2xl glass-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-slate-800/90 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-white/5"
            >
              <div className="w-full flex items-center justify-between mb-2">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${ex.tagColor} transition-colors`}>
                  <Icon className="w-3 h-3" />
                  {ex.tag}
                </span>
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-white leading-snug">
                "{ex.question}"
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
