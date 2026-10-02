import React from 'react';
import { TrendingUp, Landmark, Shield, Rocket, ArrowRight, CheckCircle2, Lock, Clock, Coins } from 'lucide-react';

const SCHEME_DATA = [
  {
    id: "HDFC Flexi Cap Fund",
    name: "HDFC Flexi Cap Fund",
    category: "Equity • Flexi Cap",
    tag: "Multi-Cap Growth",
    icon: TrendingUp,
    accentColor: "from-emerald-500/25 to-teal-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
    topGradient: "from-emerald-400 via-teal-400 to-emerald-500",
    badgeBg: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    sparklineColor: "#00D09C",
    sparklinePath: "M 0 16 Q 20 14, 40 10 T 70 4",
    sparklineArea: "M 0 16 Q 20 14, 40 10 T 70 4 L 70 20 L 0 20 Z",
    minSip: "₹100",
    exitLoad: "1.00% (within 1 yr)",
    benchmark: "NIFTY 500 TRI",
    riskometer: "Very High Risk",
    sidDate: "Nov 2024 / Factsheet",
    sampleQuery: "What is the expense ratio and exit load of HDFC Flexi Cap Fund?",
    minSipQuery: "What is the minimum SIP amount for HDFC Flexi Cap Fund?",
    exitLoadQuery: "What is the exit load for HDFC Flexi Cap Fund?",
    benchmarkQuery: "What is the benchmark of HDFC Flexi Cap Fund?"
  },
  {
    id: "HDFC Large Cap Fund",
    name: "HDFC Large Cap Fund",
    category: "Equity • Large Cap",
    tag: "Formerly Top 100",
    icon: Landmark,
    accentColor: "from-sky-500/25 to-blue-500/10 border-sky-500/40 text-sky-600 dark:text-sky-400",
    topGradient: "from-sky-400 via-blue-400 to-indigo-500",
    badgeBg: "bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/30",
    sparklineColor: "#38bdf8",
    sparklinePath: "M 0 16 Q 25 12, 50 8 T 70 3",
    sparklineArea: "M 0 16 Q 25 12, 50 8 T 70 3 L 70 20 L 0 20 Z",
    minSip: "₹100",
    exitLoad: "1.00% (within 1 yr)",
    benchmark: "NIFTY 100 TRI",
    riskometer: "Very High Risk",
    sidDate: "Renamed Jan 1, 2025",
    sampleQuery: "What is the benchmark and minimum SIP for HDFC Large Cap Fund?",
    minSipQuery: "What is the minimum SIP amount for HDFC Large Cap Fund?",
    exitLoadQuery: "What is the exit load for HDFC Large Cap Fund?",
    benchmarkQuery: "What is the benchmark of HDFC Large Cap Fund?"
  },
  {
    id: "HDFC ELSS Tax Saver",
    name: "HDFC ELSS Tax Saver",
    category: "Equity • ELSS Tax Saving",
    tag: "Sec 80C Deductions",
    icon: Shield,
    accentColor: "from-indigo-500/25 to-purple-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400",
    topGradient: "from-indigo-400 via-purple-400 to-pink-500",
    badgeBg: "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30",
    sparklineColor: "#a5b4fc",
    sparklinePath: "M 0 16 Q 20 15, 45 9 T 70 4",
    sparklineArea: "M 0 16 Q 20 15, 45 9 T 70 4 L 70 20 L 0 20 Z",
    minSip: "₹500",
    exitLoad: "NIL (3-Yr Lock-in)",
    benchmark: "NIFTY 500 TRI",
    riskometer: "Very High Risk",
    sidDate: "3-Yr Statutory Lock-in",
    sampleQuery: "What is the mandatory lock-in period for HDFC ELSS Tax Saver?",
    minSipQuery: "What is the minimum SIP amount for HDFC ELSS Tax Saver?",
    exitLoadQuery: "What is the exit load policy for HDFC ELSS Tax Saver?",
    benchmarkQuery: "What is the benchmark of HDFC ELSS Tax Saver?"
  },
  {
    id: "HDFC Mid-Cap Opportunities Fund",
    name: "HDFC Mid-Cap Opportunities",
    category: "Equity • Mid Cap",
    tag: "High Growth Potential",
    icon: Rocket,
    accentColor: "from-amber-500/25 to-orange-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400",
    topGradient: "from-amber-400 via-orange-400 to-yellow-500",
    badgeBg: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
    sparklineColor: "#fbbf24",
    sparklinePath: "M 0 16 Q 18 13, 38 7 T 70 2",
    sparklineArea: "M 0 16 Q 18 13, 38 7 T 70 2 L 70 20 L 0 20 Z",
    minSip: "₹100",
    exitLoad: "1.00% (within 1 yr)",
    benchmark: "NIFTY Midcap 150 TRI",
    riskometer: "Very High Risk",
    sidDate: "SEBI Mid-Cap Categorized",
    sampleQuery: "What is the riskometer rating of HDFC Mid-Cap Opportunities Fund?",
    minSipQuery: "What is the minimum SIP amount for HDFC Mid-Cap Opportunities Fund?",
    exitLoadQuery: "What is the exit load for HDFC Mid-Cap Opportunities Fund?",
    benchmarkQuery: "What is the benchmark of HDFC Mid-Cap Opportunities Fund?"
  }
];

export default function SchemeCardsGrid({ selectedScheme, onSelectScheme, onAskQuestion, disabled }) {
  return (
    <div className="w-full shrink-0 my-0.5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00D09C] shadow-[0_0_8px_#00D09C] animate-pulse" />
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            HDFC Scheme Directory (4 Verified Schemes)
          </h2>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
          Click any card or metric to query SIDs
        </span>
      </div>

      {/* 4 WealthTech Cards Grid (2x2 Layout to ensure zero text truncation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SCHEME_DATA.map((scheme) => {
          const isSelected = selectedScheme === scheme.id;
          const Icon = scheme.icon;

          return (
            <div
              key={scheme.id}
              onClick={() => onSelectScheme(scheme.id)}
              className={`group relative rounded-2xl p-2.5 sm:p-3 border transition-all duration-150 ease-out flex flex-col justify-between cursor-pointer select-none overflow-hidden ${
                isSelected
                  ? 'border-[#00D09C] bg-white dark:bg-slate-900/95 shadow-md dark:shadow-[0_0_24px_rgba(0,208,156,0.22)] ring-1 ring-[#00D09C]/60 scale-[1.01]'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md active:scale-[0.98]'
              }`}
            >
              {/* Top Accent Gradient Line */}
              <div className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${scheme.topGradient}`} />

              {/* Card Top: Icon, Name & Tag */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-1 pt-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br ${scheme.accentColor} border shadow-xs group-hover:scale-105 transition-transform duration-150 shrink-0`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-[#00D09C] transition-colors duration-150 leading-tight truncate">
                      {scheme.name}
                    </h3>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${scheme.badgeBg}`}>
                    {scheme.tag}
                  </span>
                </div>

                {/* Category & Sparkline in 1 tight row */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    {scheme.category}
                  </p>
                  <svg viewBox="0 0 70 20" className="w-11 h-3 overflow-visible shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <path d={scheme.sparklineArea} fill={`${scheme.sparklineColor}25`} />
                    <path d={scheme.sparklinePath} fill="none" stroke={scheme.sparklineColor} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Key Verified Facts Grid */}
                <div className="grid grid-cols-2 gap-1 py-1 px-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 text-[10px] font-mono">
                  <div className="truncate">
                    <span className="text-slate-400 text-[9px] font-sans">SIP:</span> <strong className="text-slate-900 dark:text-slate-100 font-bold">{scheme.minSip}</strong>
                  </div>
                  <div className="truncate text-right">
                    <span className="text-slate-400 text-[9px] font-sans">Exit:</span> <strong className="text-slate-900 dark:text-slate-100">{scheme.exitLoad}</strong>
                  </div>
                </div>
              </div>

              {/* Card Footer: Benchmark & 1-Click Ask Button */}
              <div className="pt-1.5 mt-1 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 truncate max-w-[130px] font-mono" title={scheme.benchmark}>
                  {scheme.benchmark}
                </span>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectScheme(scheme.id);
                    onAskQuestion(scheme.sampleQuery);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#00D09C]/15 hover:bg-[#00D09C] text-emerald-700 dark:text-[#00D09C] hover:text-slate-950 border border-[#00D09C]/30 text-[10px] font-bold transition-all duration-100 ease-out active:scale-95 cursor-pointer shadow-xs shrink-0 disabled:opacity-40"
                  title="Query all facts for this scheme"
                >
                  <span>Query</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
