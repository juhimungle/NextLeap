import React from 'react';
import { HelpCircle, ArrowUpRight } from 'lucide-react';

const EXAMPLES = [
  {
    title: "Expense Ratio",
    question: "What is the expense ratio of HDFC Flexi Cap Fund?",
    tag: "Fees"
  },
  {
    title: "Minimum SIP",
    question: "What is the minimum SIP amount for HDFC Flexi Cap Fund?",
    tag: "Investment"
  },
  {
    title: "Exit Load",
    question: "What is the exit load for HDFC Flexi Cap Fund?",
    tag: "Redemption"
  }
];

export default function ExampleQuestions({ onSelectQuestion, disabled }) {
  return (
    <div className="w-full my-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2 px-1 flex items-center gap-1.5">
        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
        <span>Try Example Factual Questions</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {EXAMPLES.map((ex, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelectQuestion(ex.question)}
            className="group relative flex flex-col items-start justify-between p-3 rounded-xl glass-card text-left transition-all duration-200 hover:border-indigo-500/50 hover:bg-slate-800/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-full flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {ex.tag}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-xs font-medium text-slate-200 line-clamp-2">
              "{ex.question}"
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
