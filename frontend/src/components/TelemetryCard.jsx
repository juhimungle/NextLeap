import React, { useState } from 'react';
import { Cpu, ShieldCheck, Database, CheckCircle2, Zap, Lock, Activity, TrendingUp, Sparkles, PieChart } from 'lucide-react';

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
    verifiedChunks: "148 Chunks",
    allocation: [
      { name: "Large Cap", pct: 71.2, color: "#00D09C" },
      { name: "Mid Cap", pct: 17.8, color: "#38bdf8" },
      { name: "Small Cap", pct: 7.5, color: "#818cf8" },
      { name: "Cash & Debt", pct: 3.5, color: "#fbbf24" }
    ],
    dominantCap: "71.2% Large"
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
    verifiedChunks: "136 Chunks",
    allocation: [
      { name: "Large Cap", pct: 87.5, color: "#0284c7" },
      { name: "Mid Cap", pct: 8.9, color: "#38bdf8" },
      { name: "Small Cap", pct: 0.8, color: "#818cf8" },
      { name: "Cash & Debt", pct: 2.8, color: "#fbbf24" }
    ],
    dominantCap: "87.5% Large"
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
    verifiedChunks: "142 Chunks",
    allocation: [
      { name: "Large Cap", pct: 64.8, color: "#6366f1" },
      { name: "Mid Cap", pct: 21.4, color: "#38bdf8" },
      { name: "Small Cap", pct: 9.6, color: "#c084fc" },
      { name: "Cash & Debt", pct: 4.2, color: "#fbbf24" }
    ],
    dominantCap: "64.8% Large"
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
    verifiedChunks: "137 Chunks",
    allocation: [
      { name: "Mid Cap", pct: 67.4, color: "#d97706" },
      { name: "Small Cap", pct: 17.1, color: "#fb923c" },
      { name: "Large Cap", pct: 11.2, color: "#38bdf8" },
      { name: "Cash & Debt", pct: 4.3, color: "#10b981" }
    ],
    dominantCap: "67.4% Mid"
  }
};

export default function TelemetryCard({ isLoading, selectedScheme, onSelectScheme }) {
  const [activeTab, setActiveTab] = useState(
    selectedScheme && SCHEME_CHARTS[selectedScheme]
      ? selectedScheme
      : "HDFC Flexi Cap Fund"
  );
  const [viewMode, setViewMode] = useState('trajectory'); // 'trajectory' | 'allocation'

  const currentChart = SCHEME_CHARTS[activeTab] || SCHEME_CHARTS["HDFC Flexi Cap Fund"];

  const handleTabClick = (key) => {
    setActiveTab(key);
    if (onSelectScheme) onSelectScheme(key);
  };

  // Circumference for Donut (R = 26)
  const donutCircumference = 2 * Math.PI * 26; // ~163.36
  let cumulativeOffset = 0;

  return (
    <div className="w-full shrink-0 rounded-2xl p-2.5 sm:p-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-white/5 relative select-none">
      {/* Dynamic Fund Color Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${currentChart.color}, transparent)`,
          boxShadow: `0 0 14px ${currentChart.color}`
        }}
      />

      {/* Header: Title & Grounding Beacon */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-white/10 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center border transition-colors duration-200 shrink-0"
            style={{
              backgroundColor: `${currentChart.color}20`,
              borderColor: `${currentChart.color}40`
            }}
          >
            {viewMode === 'trajectory' ? (
              <TrendingUp className="w-3.5 h-3.5" style={{ color: currentChart.color }} />
            ) : (
              <PieChart className="w-3.5 h-3.5" style={{ color: currentChart.color }} />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono truncate">
              <span>{viewMode === 'trajectory' ? 'Verified Trajectory' : 'Asset Allocation'}</span>
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
                style={{ backgroundColor: currentChart.color }}
              />
            </div>
            <div className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
              {currentChart.benchmark} • Factsheet Grounded
            </div>
          </div>
        </div>

        {/* View Switcher Pill (Trajectory vs Donut) */}
        <div className="flex p-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-[9px] font-mono shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('trajectory')}
            className={`px-2 py-0.5 rounded-md font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer ${
              viewMode === 'trajectory'
                ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="View animated NAV growth trajectory"
          >
            <TrendingUp className="w-2.5 h-2.5 text-[#00D09C]" />
            <span>Curve</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('allocation')}
            className={`px-2 py-0.5 rounded-md font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer ${
              viewMode === 'allocation'
                ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="View official factsheet asset allocation donut"
          >
            <PieChart className="w-2.5 h-2.5 text-sky-400" />
            <span>Donut</span>
          </button>
        </div>
      </div>

      {/* Interactive Scheme Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 mt-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-[10px] sm:text-[11px] font-mono">
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

      {/* Visualization Canvas: Trajectory Curve vs Asset Allocation Donut */}
      <div className="relative mt-1.5 pt-0.5 pb-0.5 px-2 rounded-xl bg-slate-50/80 dark:bg-transparent border border-slate-200 dark:border-white/5 overflow-hidden">
        {viewMode === 'trajectory' ? (
          /* Live Animated Financial Area Graph */
          <svg viewBox="0 0 380 90" className="w-full h-14 sm:h-16 overflow-visible relative z-10">
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
        ) : (
          /* Fully Animated Asset Allocation Donut & Progress Bars */
          <div className="w-full h-14 sm:h-16 flex items-center justify-between gap-3 py-0.5">
            {/* SVG Animated Donut */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90 transform">
                {currentChart.allocation.map((item) => {
                  const dashArray = `${(item.pct / 100) * donutCircumference} ${donutCircumference}`;
                  const strokeOffset = -((cumulativeOffset / 100) * donutCircumference);
                  cumulativeOffset += item.pct;

                  return (
                    <circle
                      key={item.name}
                      cx="36"
                      cy="36"
                      r="26"
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth="9"
                      strokeDasharray={dashArray}
                      strokeDashoffset={strokeOffset}
                      className="transition-all duration-700 ease-out"
                    />
                  );
                })}
              </svg>
              {/* Donut Center Core Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-black font-mono leading-none text-slate-900 dark:text-white">
                  {currentChart.allocation[0].pct}%
                </span>
                <span className="text-[6.5px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase leading-none mt-0.5">
                  Top Cap
                </span>
              </div>
            </div>

            {/* 4 Animated Micro Progress Bars */}
            <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
              {currentChart.allocation.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-[9px] sm:text-[9.5px] font-mono leading-none">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-300 w-16 sm:w-20 truncate font-medium">
                    {item.name}
                  </span>
                  <div className="flex-1 h-1 sm:h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="text-slate-900 dark:text-slate-100 font-bold shrink-0 text-right w-8">
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Canvas Footer Grounding Ticker */}
        <div className="flex items-center justify-between text-[10px] font-mono pt-0.5 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentChart.color }} />
            <span className="font-bold text-slate-900 dark:text-slate-200 truncate">{currentChart.name}</span>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            {currentChart.verifiedChunks}
          </span>
        </div>
      </div>

      {/* RAG Engine Operational Guarantee Matrix */}
      <div className="grid grid-cols-2 gap-1 mt-1.5 text-xs font-mono">
        <div className="p-1 sm:p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-sky-500 dark:text-sky-400 shrink-0" />
            <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">24 SIDs</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">0 Aggregators</span>
        </div>

        <div className="p-1 sm:p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">SEBI Compliant</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-300 font-bold">0 Advice</span>
        </div>
      </div>
    </div>
  );
}
