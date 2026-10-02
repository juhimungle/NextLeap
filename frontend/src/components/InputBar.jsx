import React, { useState, useRef } from 'react';
import { Send, Trash2, CornerDownLeft, Sparkles, Search } from 'lucide-react';

const QUICK_PROMPTS = [
  { label: "💰 Expense Ratio", query: "What is the expense ratio of HDFC Flexi Cap Fund?" },
  { label: "📅 Minimum SIP", query: "What is the minimum SIP amount for HDFC Flexi Cap Fund?" },
  { label: "🚪 Exit Load", query: "What is the exit load for HDFC Flexi Cap Fund?" },
  { label: "⚖️ Riskometer", query: "What is the riskometer of HDFC Large Cap Fund?" },
  { label: "🎯 Benchmark", query: "What is the benchmark of HDFC Flexi Cap Fund?" },
  { label: "🔒 ELSS Lock-in", query: "What is the lock-in period for HDFC ELSS Tax Saver?" },
  { label: "📑 CAS Statement", query: "How to download capital-gains statement or CAS?" },
  { label: "🛡️ Test Advice Refusal", query: "Should I buy HDFC Flexi Cap Fund right now?" }
];

export default function InputBar({ onSendMessage, isLoading, onClearChat, hasMessages }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  const maxLength = 500;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickPrompt = (query) => {
    if (isLoading) return;
    onSendMessage(query);
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Prominent Search & Chat Box */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-indigo-500/40 hover:border-indigo-400 focus-within:border-[#00D09C] focus-within:ring-3 focus-within:ring-[#00D09C]/20 transition-all duration-200 p-3 shadow-xs dark:shadow-[0_0_35px_rgba(99,102,241,0.2)]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Search className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            </div>

            <div className="flex-1">
              <textarea
                ref={textareaRef}
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, maxLength))}
                onKeyDown={handleKeyDown}
                placeholder="Ask any factual question (e.g. 'What is the exit load of HDFC Flexi Cap Fund?')..."
                disabled={isLoading}
                className="w-full bg-transparent resize-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none scrollbar-none font-sans leading-relaxed"
              />

              <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-200 dark:border-white/10 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-mono font-medium ${
                    text.length > 450 ? 'text-amber-500 font-bold' : 'text-slate-400'
                  }`}>
                    {text.length}/{maxLength}
                  </span>

                  {hasMessages && (
                    <button
                      type="button"
                      onClick={onClearChat}
                      className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors duration-150 active:scale-95 cursor-pointer font-medium"
                      title="Clear conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Chat</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <span>Press</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-semibold inline-flex items-center gap-0.5">
                      <span>Enter</span>
                      <CornerDownLeft className="w-2.5 h-2.5" />
                    </kbd>
                  </span>

                  <button
                    type="submit"
                    disabled={!text.trim() || isLoading}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-[#00D09C] to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                  >
                    <span className="hidden sm:inline">{isLoading ? 'Verifying...' : 'Ask Assistant'}</span>
                    <span className="sm:hidden">{isLoading ? 'Wait...' : 'Ask'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* 1-Click Quick Prompt Chips */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1 pl-1 font-mono">
          <Sparkles className="w-3 h-3 text-[#00D09C]" />
          <span>Quick Ask:</span>
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickPrompt(qp.query)}
            className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-emerald-500/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-emerald-300 border border-slate-200 dark:border-white/10 transition-all duration-100 ease-out active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none shadow-xs"
            title={qp.query}
          >
            {qp.label}
          </button>
        ))}
      </div>
    </div>
  );
}
