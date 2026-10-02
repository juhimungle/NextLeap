import React from 'react';
import { Sun, Moon, ShieldCheck, Database, CheckCircle2, HelpCircle, Activity } from 'lucide-react';

export default function Navbar({
  isDark,
  setIsDark,
  onOpenSources,
  onOpenGuide
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/10 transition-colors duration-300 bg-white/85 dark:bg-[#0c1222]/85 backdrop-blur-xl relative">
      {/* Top Animated Neon Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 shadow-[0_0_12px_rgba(0,208,156,0.6)]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity & Regulatory Proof */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-[#00D09C] to-indigo-600 p-[1.5px] shadow-lg shadow-emerald-500/20 shrink-0 group cursor-default">
            <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0c1222] flex items-center justify-center transition-colors">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-[#00D09C] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c1222] animate-pulse" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-sm sm:text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Facts-Only <span className="text-emerald-600 dark:text-[#00D09C]">MF</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Verified SIDs
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1.5 font-medium">
              <span>HDFC AMC</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>SEBI Mandated</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>Zero Advice</span>
            </p>
          </div>
        </div>

        {/* Center: Live Grounding Telemetry Ticker (Desktop only) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 text-xs font-mono backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Deterministic RAG</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-600 dark:text-slate-400 text-[11px]">24 SIDs Grounded • 0 Speculation</span>
        </div>

        {/* Right: Action Controls (Optimized for Desktop & Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Guide Modal Trigger */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 border border-sky-200 dark:border-sky-500/30 transition-all duration-150 cursor-pointer shadow-xs active:scale-95"
            title="What questions can you ask?"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">What to Ask?</span>
            <span className="sm:hidden text-[11px] font-medium">Guide</span>
          </button>

          {/* Sources Explorer Trigger */}
          <button
            onClick={onOpenSources}
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-150 shadow-xs cursor-pointer active:scale-95"
            title="View all 24 verified sources"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">Official Sources</span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
              24
            </span>
          </button>

          {/* Animated Sun / Moon Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-xs group"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
