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
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
      label: 'Verified Official Fact'
    },
    refusal: {
      borderColor: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
      label: 'Policy Refusal (Zero Advice / Speculation)'
    },
    pii_warning: {
      borderColor: 'border-rose-500/50',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      icon: <Lock className="w-3.5 h-3.5 text-rose-400" />,
      label: 'Privacy Guardrail Triggered'
    },
    unverified: {
      borderColor: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      icon: <Info className="w-3.5 h-3.5 text-sky-400" />,
      label: 'Unverified from Official Corpus'
    }
  };

  const cfg = typeConfig[msg.type] || typeConfig.answer;

  return (
    <div className={`w-full rounded-2xl glass-card p-4 sm:p-5 border ${cfg.borderColor} shadow-xl transition-all duration-300 hover:shadow-2xl`}>
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${cfg.badgeBg}`}>
            {cfg.icon}
            <span>{cfg.label}</span>
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-700/60 border border-transparent hover:border-slate-600/40 transition-all cursor-pointer font-medium"
          title="Copy answer to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Answer Body */}
      <div className="text-sm leading-relaxed text-slate-100 font-normal mb-4 font-sans tracking-normal selection:bg-indigo-500/30">
        {msg.answer}
      </div>

      {/* Source Citation Block */}
      {msg.source_url && (
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <a
              href={msg.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-300 hover:text-indigo-200 underline underline-offset-2 truncate flex items-center gap-1"
              title={msg.source_title}
            >
              <span className="truncate">{msg.source_title || "Official Source Document"}</span>
              <ExternalLink className="w-3 h-3 shrink-0 opacity-80" />
            </a>
          </div>

          <div className="text-[11px] text-slate-400 font-mono shrink-0 bg-slate-900/60 px-2 py-0.5 rounded-md border border-white/5">
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
    <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto px-1 py-2 min-h-[300px] max-h-[520px]">
      {/* Empty State / Welcome Showcase */}
      {messages.length === 0 && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card text-center my-auto border border-white/10 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-[1px] mx-auto mb-3 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full rounded-[15px] bg-[#0c1222] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1.5">
            Welcome to the Facts-Only MF Assistant
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-4">
            Directly interrogates official scheme information documents (SIDs), key information memoranda (KIMs), and SEBI/AMFI regulatory guidelines for factual certainty.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto text-left">
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex items-start gap-2">
              <DatabaseZap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-slate-200">24 Official Sources</div>
                <div className="text-[10px] text-slate-400">Zero third-party aggregators</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-slate-200">Zero Return Guesses</div>
                <div className="text-[10px] text-slate-400">Strict refusal of speculation</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex items-start gap-2">
              <Lock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-slate-200">PII Redaction</div>
                <div className="text-[10px] text-slate-400">PAN, OTP, phone filtered</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message List */}
      {messages.map((m, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          {/* User Bubble */}
          {m.user && m.type !== "pii_warning" && (
            <div className="self-end max-w-[85%] sm:max-w-[75%] rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2.5 text-sm shadow-lg shadow-indigo-600/20 flex items-start gap-2 font-medium">
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
        <div className="self-start rounded-2xl glass-card p-4 border border-indigo-500/40 flex items-center gap-3 shadow-lg shadow-indigo-500/10">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-slate-200 font-semibold tracking-wide">
            Retrieving official chunks & verifying grounding...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between shadow-lg">
          <span>{error}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg font-semibold cursor-pointer transition-colors"
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
