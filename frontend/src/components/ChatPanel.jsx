import React, { useRef, useEffect, useState } from 'react';
import { ExternalLink, Copy, Check, ShieldAlert, Lock, Info, Sparkles, User, FileText, CheckCircle2, ShieldCheck, DatabaseZap } from 'lucide-react';

function AssistantCard({ msg }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color schemes and icons based on response type
  const typeConfig = {
    answer: {
      borderColor: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />,
      label: 'Verified Official Fact'
    },
    refusal: {
      borderColor: 'border-amber-500/40',
      badgeBg: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />,
      label: 'Policy Refusal (Zero Advice / Speculation)'
    },
    pii_warning: {
      borderColor: 'border-rose-500/50',
      badgeBg: 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
      icon: <Lock className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />,
      label: 'Privacy Guardrail Triggered'
    },
    unverified: {
      borderColor: 'border-sky-500/40',
      badgeBg: 'bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/30',
      icon: <Info className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />,
      label: 'Unverified from Official Corpus'
    }
  };

  const cfg = typeConfig[msg.type] || typeConfig.answer;

  return (
    <div className={`w-full rounded-2xl bg-white dark:bg-slate-900/80 p-4 sm:p-5 border ${cfg.borderColor} shadow-xs dark:shadow-xl transition-all duration-300`}>
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${cfg.badgeBg}`}>
            {cfg.icon}
            <span>{cfg.label}</span>
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-600/40 transition-all cursor-pointer font-medium"
          title="Copy answer to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Answer Body */}
      <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-100 font-normal mb-4 font-sans tracking-normal selection:bg-indigo-500/30">
        {msg.answer}
      </div>

      {/* Source Citation Block */}
      {msg.source_url && (
        <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <a
              href={msg.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 underline underline-offset-2 truncate flex items-center gap-1"
              title={msg.source_title}
            >
              <span className="truncate">{msg.source_title || "Official Source Document"}</span>
              <ExternalLink className="w-3 h-3 shrink-0 opacity-80" />
            </a>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0 bg-slate-100 dark:bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/5">
            Last updated from sources: {msg.last_updated || "2026-10-02"}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPanel({ messages, isLoading, error, onRetry, onSelectQuestion }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const FEATURED_PROMPTS = [
    {
      category: "Scheme Facts",
      query: "What is the expense ratio and exit load of HDFC Flexi Cap Fund?",
      icon: "📊"
    },
    {
      category: "Statutory & Tax",
      query: "What is the mandatory 3-year lock-in rule for HDFC ELSS Tax Saver?",
      icon: "🔒"
    },
    {
      category: "SEBI Compliance",
      query: "Should I buy HDFC Mid-Cap Opportunities Fund right now?",
      icon: "🛡️"
    },
    {
      category: "Scheme Rebranding",
      query: "What was HDFC Large Cap Fund named before January 1, 2025?",
      icon: "🏛️"
    }
  ];

  return (
    <div className="w-full flex flex-col gap-3 py-1">
      {/* Empty State / Welcome Showcase */}
      {messages.length === 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 text-center my-auto">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-sky-500 to-indigo-600 p-[1px] mx-auto mb-2 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full rounded-[15px] bg-white dark:bg-[#0c1222] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            HDFC Mutual Fund Fact Intelligence
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed mb-3">
            Interrogates verified official SIDs, KIMs, and SEBI/AMFI regulatory guidelines with deterministic grounding.
          </p>

          {/* 3 Core Trust Safeguards */}
          <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto text-left mb-3.5 font-mono text-[10px]">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 flex flex-col">
              <span className="text-sky-600 dark:text-sky-400 font-bold">24 SIDs</span>
              <span className="text-slate-500 dark:text-slate-400">0 Aggregators</span>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 flex flex-col">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">0% Guesses</span>
              <span className="text-slate-500 dark:text-slate-400">No Advice</span>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 flex flex-col">
              <span className="text-amber-600 dark:text-amber-400 font-bold">PII Shield</span>
              <span className="text-slate-500 dark:text-slate-400">Auto Filtered</span>
            </div>
          </div>

          {/* Clickable Suggested Inquiries */}
          <div className="text-left">
            <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Popular Official Inquiries (Click to Ask):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FEATURED_PROMPTS.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectQuestion && onSelectQuestion(item.query)}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-white/5 hover:border-emerald-400 dark:hover:border-emerald-500/40 text-left transition-all duration-100 ease-out active:scale-95 cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mb-0.5">
                    <span>{item.icon}</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white leading-tight font-medium">
                    {item.query}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message List */}
      {messages.map((m, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          {/* User Bubble */}
          {m.user && m.type !== "pii_warning" && (
            <div className="self-end max-w-[85%] sm:max-w-[75%] rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 text-sm shadow-md flex items-start gap-2 font-medium">
              <span className="leading-relaxed">{m.user}</span>
              <User className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
            </div>
          )}

          {/* Assistant Card */}
          <div className="self-start w-full">
            <AssistantCard msg={m} />
          </div>
        </div>
      ))}

      {/* Thinking / Loading Animation */}
      {isLoading && (
        <div className="self-start rounded-2xl bg-white dark:bg-slate-900/80 p-3.5 border border-indigo-200 dark:border-indigo-500/40 flex items-center gap-3 shadow-sm">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold tracking-wide">
            Retrieving official chunks & verifying grounding...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between shadow-xs">
          <span>{error}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/30 rounded-lg font-semibold cursor-pointer transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
