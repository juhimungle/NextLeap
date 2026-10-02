import React from 'react';
import { TrendingUp, Landmark, Shield, Rocket, ArrowRight, CheckCircle2, Lock, Clock, Coins } from 'lucide-react';

const SCHEME_DATA = [
  {
    id: "HDFC Flexi Cap Fund",
    name: "HDFC Flexi Cap Fund",
    category: "Equity • Flexi Cap",
    tag: "Multi-Cap Growth",
    icon: TrendingUp,
    accentColor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    minSip: "₹100",
    exitLoad: "1.00% (within 1 yr)",
    benchmark: "NIFTY 500 TRI",
    riskometer: "Very High Risk",
    sidDate: "Nov 2024 / Monthly Factsheet",
    sampleQuery: "What is the expense ratio and exit load of HDFC Flexi Cap Fund?"
  },
  {
    id: "HDFC Large Cap Fund",
    name: "HDFC Large Cap Fund",
    category: "Equity • Large Cap",
    tag: "Formerly Top 100",
    icon: Landmark,
    accentColor: "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400",
    badgeBg: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    minSip: "₹100",
    exitLoad: "1.00% (within 1 yr)",
    benchmark: "NIFTY 100 TRI",
    riskometer: "Very High Risk",
    sidDate: "Renamed Jan 1, 2025 Addendum",
    sampleQuery: "What is the benchmark and minimum SIP for HDFC Large Cap Fund?"
  },
  {
    id: "HDFC ELSS Tax Saver",
    name: "HDFC ELSS Tax Saver",
    category: "Equity • ELSS Tax Saving",
    tag: "Sec 80C Deductions",
    icon: Shield,
    accentColor: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400",
    badgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    minSip: "₹500",
    exitLoad: "NIL (3-Yr Lock-in)",
    benchmark: "NIFTY 500 TRI",
    riskometer: "Very High Risk",
    sidDate: "3-Year Statutory Lock-in",
    sampleQuery: "What is the mandatory lock-in period for HDFC ELSS Tax Saver?"
  },
  {
    id: "HDFC Mid-Cap Opportunities Fund",
    name: "HDFC Mid-Cap Opportunities",
    category: "Equity • Mid Cap",
    tag: "High Growth Potential",
    icon: Rocket,
    accentColor: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    minSip: "₹100",
    exitLoad: "1.00% (within 1 yr)",
    benchmark: "NIFTY Midcap 150 TRI",
    riskometer: "Very High Risk",
    sidDate: "SEBI Mid-Cap Categorized",
    sampleQuery: "What is the riskometer rating of HDFC Mid-Cap Opportunities Fund?"
  }
];

export default function SchemeCardsGrid({ selectedScheme, onSelectScheme, onAskQuestion, disabled }) {
  return (
    <div className="w-full my-3">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse" />
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-200">
            HDFC Mutual Fund Scheme Directory (4 Verified Schemes)
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Click any scheme or metric to query official AMC SIDs
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
              className={`group relative rounded-2xl p-4 glass-card border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-[#00D09C] bg-slate-900/90 shadow-[0_0_20px_rgba(0,208,156,0.15)] ring-1 ring-[#00D09C]/40'
                  : 'border-white/10 hover:border-slate-500/60 hover:bg-slate-900/80 hover:-translate-y-1 hover:shadow-xl'
              }`}
            >
              {/* Card Top: Icon & Tags */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${scheme.accentColor} border shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scheme.badgeBg}`}>
                    {scheme.tag}
                  </span>
                </div>

                {/* Scheme Title & Category */}
                <h3 className="text-sm font-bold text-white group-hover:text-[#00D09C] transition-colors leading-tight mb-1">
                  {scheme.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mb-3">
                  {scheme.category}
                </p>

                {/* Key Verified Facts Grid */}
                <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-white/5 text-[11px] font-mono">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                      <Coins className="w-2.5 h-2.5 text-slate-400" />
                      Min SIP
                    </span>
                    <span className="font-bold text-slate-200">{scheme.minSip}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      Exit Load
                    </span>
                    <span className="font-bold text-slate-200 truncate">{scheme.exitLoad}</span>
                  </div>

                  <div className="flex flex-col col-span-2 pt-1 border-t border-white/5">
                    <span className="text-[10px] text-slate-400 font-sans">Benchmark</span>
                    <span className="font-semibold text-slate-300 truncate text-[10px]">{scheme.benchmark}</span>
                  </div>
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00D09C]/15 hover:bg-[#00D09C] text-[#00D09C] hover:text-[#060b14] border border-[#00D09C]/30 text-[11px] font-bold transition-all cursor-pointer shadow-sm disabled:opacity-40"
                  title="Query facts for this scheme"
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
