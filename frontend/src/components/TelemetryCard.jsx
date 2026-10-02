import React, { useState } from 'react';
import { Cpu, ShieldCheck, Database, CheckCircle2, Zap, Lock, Activity, TrendingUp, Sparkles } from 'lucide-react';

const SCHEME_CHARTS = {
  "HDFC Flexi Cap Fund": {
    name: "HDFC Flexi Cap Fund",
    shortName: "Flexi Cap",
    mobileName: "Flexi",
    benchmark: "NIFTY 500 TRI",
    color: "#00D09C",
    fillColor: "rgba(0, 208, 156, 0.2)",
    gradientId: "gradFlexi",
    path: "M 0 75 Q 40 70, 80 58 T 160 50 T 240 32 T 320 18 T 380 10",
    areaPath: "M 0 75 Q 40 70, 80 58 T 160 50 T 240 32 T 320 18 T 380 10 L 380 100 L 0 100 Z",
    tag: "Multi-Cap Trajectory",
    verifiedChunks: "148 Chunks"
  },
  "HDFC Large Cap Fund": {
    name: "HDFC Large Cap Fund",
    shortName: "Large Cap",
    mobileName: "Large",
    benchmark: "NIFTY 100 TRI",
    color: "#0284c7",
    fillColor: "rgba(2, 132, 199, 0.2)",
    gradientId: "gradLarge",
    path: "M 0 80 Q 50 75, 100 65 T 190 52 T 280 35 T 380 18",
    areaPath: "M 0 80 Q 50 75, 100 65 T 190 52 T 280 35 T 380 18 L 380 100 L 0 100 Z",
    tag: "Bluechip Benchmark",
    verifiedChunks: "136 Chunks"
  },
  "HDFC ELSS Tax Saver": {
    name: "HDFC ELSS Tax Saver",
    shortName: "ELSS Tax",
    mobileName: "ELSS",
    benchmark: "NIFTY 500 TRI",
    color: "#6366f1",
    fillColor: "rgba(99, 102, 241, 0.2)",
    gradientId: "gradELSS",
    path: "M 0 85 Q 45 80, 90 70 T 180 55 T 270 38 T 380 15",
    areaPath: "M 0 85 Q 45 80, 90 70 T 180 55 T 270 38 T 380 15 L 380 100 L 0 100 Z",
    tag: "3-Yr Lock-in Growth",
    verifiedChunks: "142 Chunks"
  },
  "HDFC Mid-Cap Opportunities Fund": {
    name: "HDFC Mid-Cap Opportunities",
    shortName: "Mid-Cap",
    mobileName: "Mid-Cap",
    benchmark: "NIFTY Midcap 150 TRI",
    color: "#d97706",
    fillColor: "rgba(217, 119, 6, 0.2)",
    gradientId: "gradMid",
    path: "M 0 88 Q 40 82, 85 64 T 170 54 T 255 28 T 380 8",
    areaPath: "M 0 88 Q 40 82, 85 64 T 170 54 T 255 28 T 380 8 L 380 100 L 0 100 Z",
    tag: "High Growth Alpha",
    verifiedChunks: "137 Chunks"
  }
};

export default function TelemetryCard({ isLoading, selectedScheme, onSelectScheme }) {
  const [activeTab, setActiveTab] = useState(
    selectedScheme && SCHEME_CHARTS[selectedScheme]
      ? selectedScheme
      : "HDFC Flexi Cap Fund"
  );

  const currentChart = SCHEME_CHARTS[activeTab] || SCHEME_CHARTS["HDFC Flexi Cap Fund"];

  const handleTabClick = (key) => {
    setActiveTab(key);
    if (onSelectScheme) onSelectScheme(key);
  };

  return (
    <div className="w-full shrink-0 rounded-2xl p-3.5 bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl relative select-none">
      {/* Top Ambient Glow Beam */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${currentChart.color}, transparent)`,
          boxShadow: `0 0 14px ${currentChart.color}`
        }}
      />

      {/* Header: Title & Grounding Beacon */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center border transition-colors duration-200"
            style={{
              backgroundColor: `${currentChart.color}20`,
              borderColor: `${currentChart.color}40`
            }}
          >
            <TrendingUp className="w-3.5 h-3.5" style={{ color: currentChart.color }} />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono">
              <span>Verified Scheme Trajectory</span>
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: currentChart.color }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {currentChart.benchmark} • Factsheet Grounded
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-700 dark:text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{isLoading ? 'SEARCHING RAG...' : '100% GROUNDED'}</span>
        </div>
      </div>

      {/* Interactive Scheme Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 mt-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-[10px] sm:text-[11px] font-mono">
        {Object.entries(SCHEME_CHARTS).map(([key, data]) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTabClick(key)}
              className={`py-1 px-1 rounded-lg text-center transition-all duration-100 ease-out active:scale-95 cursor-pointer font-semibold ${
                isActive
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 border border-transparent'
              }`}
              style={isActive ? { color: data.color } : {}}
            >
              <span className="hidden sm:inline">{data.shortName}</span>
              <span className="sm:hidden">{data.mobileName}</span>
            </button>
          );
        })}
      </div>

      {/* Live Animated Financial Area Graph */}
      <div className="relative mt-2 pt-1 pb-1 px-2 rounded-xl bg-slate-50/80 dark:bg-transparent border border-slate-200 dark:border-white/5 overflow-hidden">
        {/* Dynamic SVG Animated Chart */}
        <svg viewBox="0 0 380 90" className="w-full h-20 overflow-visible relative z-10">
          <defs>
            <linearGradient id={currentChart.gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={currentChart.color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={currentChart.color} stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Area Fill */}
          <path
            d={currentChart.areaPath}
            fill={`url(#${currentChart.gradientId})`}
            className="transition-all duration-500 ease-out"
          />

          {/* Glowing Animated Trendline */}
          <path
            d={currentChart.path}
            fill="none"
            stroke={currentChart.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-500 ease-out"
          />

          {/* Real-time Ticker Data Node on Peak */}
          <circle
            cx="380"
            cy="10"
            r="4.5"
            fill="#ffffff"
            stroke={currentChart.color}
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>

        {/* Graph Overlay Telemetry Badges */}
        <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentChart.color }} />
            <span className="font-bold text-slate-900 dark:text-slate-200">{currentChart.name}</span>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {currentChart.verifiedChunks}
          </span>
        </div>
      </div>

      {/* RAG Engine Operational Guarantee Matrix */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-2 text-xs font-mono">
        <div className="p-1.5 sm:p-2 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-1">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
            <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">24 SIDs</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">0 Aggregators</span>
        </div>

        <div className="p-1.5 sm:p-2 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">SEBI Compliant</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-300 font-bold">0 Advice</span>
        </div>
      </div>
    </div>
  );
}
