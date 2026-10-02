import React from 'react';
import { TrendingUp, Landmark, Shield, Rocket, ArrowRight, CheckCircle2, Lock, Clock, Coins } from 'lucide-react';

const SCHEME_DATA = [
  {
    id: "HDFC Flexi Cap Fund",
    name: "HDFC Flexi Cap Fund",
    category: "Equity • Flexi Cap",
    tag: "Multi-Cap Growth",
    icon: TrendingUp,
    accentColor: "from-emerald-500/25 to-teal-500/10 border-emerald-500/40 text-emerald-400",
    topGradient: "from-emerald-400 via-teal-400 to-emerald-500",
    badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
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
    accentColor: "from-sky-500/25 to-blue-500/10 border-sky-500/40 text-sky-400",
    topGradient: "from-sky-400 via-blue-400 to-indigo-500",
    badgeBg: "bg-sky-500/15 text-sky-300 border-sky-500/30",
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
    accentColor: "from-indigo-500/25 to-purple-500/10 border-indigo-500/40 text-indigo-400",
    topGradient: "from-indigo-400 via-purple-400 to-pink-500",
    badgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
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
    accentColor: "from-amber-500/25 to-orange-500/10 border-amber-500/40 text-amber-400",
    topGradient: "from-amber-400 via-orange-400 to-yellow-500",
    badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
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
    <div className="w-full my-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00D09C] shadow-[0_0_8px_#00D09C] animate-pulse" />
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-200">
            HDFC Mutual Fund Scheme Directory (4 Verified Schemes)
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Click any scheme card or metric to query official AMC SIDs instantly
        </span>
      </div>

      {/* 4 WealthTech Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SCHEME_DATA.map((scheme) => {
          const isSelected = selectedScheme === scheme.id;
          const Icon = scheme.icon;

          return (
            <div
              key={scheme.id}
              onClick={() => onSelectScheme(scheme.id)}
              className={`group relative rounded-2xl p-4 glass-card border transition-all duration-150 ease-out flex flex-col justify-between cursor-pointer select-none overflow-hidden ${
                isSelected
                  ? 'border-[#00D09C] bg-slate-900/95 shadow-[0_0_24px_rgba(0,208,156,0.22)] ring-1 ring-[#00D09C]/60 scale-[1.01]'
                  : 'border-white/10 hover:border-slate-400/50 hover:bg-slate-900/85 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]'
              }`}
            >
              {/* Top Accent Gradient Line */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${scheme.topGradient}`} />

              {/* Card Top: Icon & Tags */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2 pt-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${scheme.accentColor} border shadow-md group-hover:scale-105 transition-transform duration-150`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scheme.badgeBg}`}>
                    {scheme.tag}
                  </span>
                </div>

                {/* Scheme Title & Category */}
                <h3 className="text-sm font-bold text-white group-hover:text-[#00D09C] transition-colors duration-150 leading-tight mb-1">
                  {scheme.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mb-3">
                  {scheme.category}
                </p>

                {/* Key Verified Facts Grid with 1-Click Metric Queries */}
                <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-white/5 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectScheme(scheme.id);
                      onAskQuestion(scheme.minSipQuery);
                    }}
                    title={`Click to query Min SIP for ${scheme.name}`}
                    className="flex flex-col text-left p-1 rounded hover:bg-white/5 transition-colors cursor-pointer group/metric"
                  >
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-sans group-hover/metric:text-emerald-400">
                      <Coins className="w-2.5 h-2.5" />
                      Min SIP
                    </span>
                    <span className="font-bold text-slate-200 group-hover/metric:text-[#00D09C]">{scheme.minSip}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectScheme(scheme.id);
                      onAskQuestion(scheme.exitLoadQuery);
                    }}
                    title={`Click to query Exit Load for ${scheme.name}`}
                    className="flex flex-col text-left p-1 rounded hover:bg-white/5 transition-colors cursor-pointer group/metric"
                  >
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-sans group-hover/metric:text-emerald-400">
                      <Clock className="w-2.5 h-2.5" />
                      Exit Load
                    </span>
                    <span className="font-bold text-slate-200 truncate group-hover/metric:text-[#00D09C]">{scheme.exitLoad}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectScheme(scheme.id);
                      onAskQuestion(scheme.benchmarkQuery);
                    }}
                    title={`Click to query Benchmark for ${scheme.name}`}
                    className="flex flex-col col-span-2 pt-1.5 border-t border-white/5 text-left p-1 rounded hover:bg-white/5 transition-colors cursor-pointer group/metric"
                  >
                    <span className="text-[10px] text-slate-400 font-sans group-hover/metric:text-emerald-400">Benchmark</span>
                    <span className="font-semibold text-slate-300 truncate text-[10px] group-hover/metric:text-[#00D09C]">{scheme.benchmark}</span>
                  </button>
                </div>
              </div>

              {/* Card Footer: 1-Click Ask Button */}
              <div className="pt-3 mt-1 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#00D09C]" />
                  <span>SID Grounded</span>
                </span>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectScheme(scheme.id);
                    onAskQuestion(scheme.sampleQuery);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#00D09C]/15 hover:bg-[#00D09C] text-[#00D09C] hover:text-[#060b14] border border-[#00D09C]/30 text-[11px] font-bold transition-all duration-100 ease-out active:scale-95 cursor-pointer shadow-sm disabled:opacity-40"
                  title="Query all facts for this scheme"
                >
                  <span>Query</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
