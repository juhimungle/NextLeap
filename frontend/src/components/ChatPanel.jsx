import React, { useRef, useEffect, useState } from 'react';
import { ExternalLink, Copy, Check, ShieldAlert, Lock, Info, Sparkles, User, FileText } from 'lucide-react';

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
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      label: 'Verified Fact'
    },
    refusal: {
      borderColor: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: <ShieldAlert className="w-4 h-4 text-amber-400" />,
      label: 'Policy Refusal (No Advice)'
    },
    pii_warning: {
      borderColor: 'border-rose-500/50',
      badgeBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      icon: <Lock className="w-4 h-4 text-rose-400" />,
      label: 'Privacy Protection Alert'
    },
    unverified: {
      borderColor: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      icon: <Info className="w-4 h-4 text-sky-400" />,
      label: 'Unverified from Corpus'
    }
  };

  const cfg = typeConfig[msg.type] || typeConfig.answer;

  return (
    <div className={`w-full rounded-2xl glass-card p-4 sm:p-5 border ${cfg.borderColor} shadow-lg transition-all duration-300`}>
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.badgeBg}`}>
            {cfg.icon}
            {cfg.label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-700/50 transition-colors cursor-pointer"
          title="Copy answer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Answer Body */}
      <div className="text-sm leading-relaxed text-slate-100 font-normal mb-4">
        {msg.answer}
      </div>

      {/* Source Citation Block */}
      {msg.source_url && (
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
            <a
              href={msg.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-300 hover:text-indigo-200 underline underline-offset-2 truncate flex items-center gap-1"
              title={msg.source_title}
            >
              <span className="truncate">{msg.source_title || "Official Source Document"}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

          <div className="text-[11px] text-slate-400 font-mono shrink-0">
            Last updated from sources: {msg.last_updated || "2026-10-02"}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPanel({ messages, isLoading, error, onRetry }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto px-1 py-2 max-h-[520px]">
      {/* Empty State / Welcome line */}
      {messages.length === 0 && (
        <div className="p-5 rounded-2xl glass-card text-center my-auto">
          <h3 className="text-base font-semibold text-slate-200 mb-1">
            Welcome to the Facts-Only MF Assistant
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Ask factual questions regarding expense ratios, minimum SIP, exit loads, riskometer, benchmark, and statements for HDFC Mutual Fund schemes.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Strictly factual answers • Zero investment advice • Verified official citations
          </div>
        </div>
      )}

      {/* Message List */}
      {messages.map((m, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          {/* User Bubble (only shown if not a PII warning) */}
          {m.user && m.type !== "pii_warning" && (
            <div className="self-end max-w-[85%] sm:max-w-[75%] rounded-2xl bg-indigo-600/90 text-white px-4 py-2.5 text-sm shadow-md flex items-start gap-2">
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
        <div className="self-start rounded-2xl glass-card p-4 border border-indigo-500/30 flex items-center gap-3">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-slate-300 font-medium">
            Searching official sources & verifying facts...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded font-medium cursor-pointer"
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
