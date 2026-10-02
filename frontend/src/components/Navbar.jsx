import React from 'react';
import { Sun, Moon, ShieldCheck, Database, Zap, ZapOff, CheckCircle2, HelpCircle } from 'lucide-react';

export default function Navbar({
  isDark,
  setIsDark,
  reduceMotion,
  setReduceMotion,
  onOpenSources,
  onOpenGuide
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-sky-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full rounded-[15px] bg-[#0c1222] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0c1222]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Facts-Only MF
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Verified Sources
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 font-medium">
              <span>HDFC AMC</span>
              <span className="text-slate-600">•</span>
              <span>SEBI</span>
              <span className="text-slate-600">•</span>
              <span>AMFI Knowledge Center</span>
            </p>
          </div>
        </div>

        {/* Actions & Toggles */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Guide Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-all cursor-pointer shadow-sm"
            title="What questions can you ask?"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">What to Ask?</span>
          </button>

          {/* Sources Explorer Button */}
          <button
            onClick={onOpenSources}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-indigo-500/50 transition-all shadow-sm cursor-pointer"
            title="View all 24 verified sources"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Official Sources</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
              24
            </span>
          </button>

          {/* Reduce Motion Toggle */}
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              reduceMotion
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
            title={reduceMotion ? "Motion reduced (click to enable 3D animations)" : "Reduce motion for 3D Hero"}
            aria-label="Toggle reduced motion"
          >
            {reduceMotion ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
          </button>
        </div>
      </div>
    </header>
  );
}
