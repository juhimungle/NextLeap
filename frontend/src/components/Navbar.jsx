import React from 'react';
import { Sun, Moon, ShieldCheck, Database, Zap, ZapOff } from 'lucide-react';

export default function Navbar({
  isDark,
  setIsDark,
  reduceMotion,
  setReduceMotion,
  onOpenSources
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-100 dark:text-white">
                Facts-Only MF
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              HDFC AMC • SEBI • AMFI Official Sources
            </p>
          </div>
        </div>

        {/* Actions & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sources Explorer Button */}
          <button
            onClick={onOpenSources}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 dark:text-slate-200 hover:text-white bg-slate-800/60 dark:bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all cursor-pointer"
            title="View all 24 verified sources"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xs:inline">Sources (24)</span>
          </button>

          {/* Reduce Motion Toggle */}
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              reduceMotion
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
            title={reduceMotion ? "Motion reduced (click to enable 3D animations)" : "Reduce motion"}
            aria-label="Toggle reduced motion"
          >
            {reduceMotion ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-slate-800/60 dark:bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer"
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
