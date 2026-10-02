import React from 'react';
import { Cpu, ShieldCheck, Database, CheckCircle2, Zap, Lock, Activity } from 'lucide-react';

export default function TelemetryCard({ isLoading }) {
  return (
    <div className="w-full md:w-[420px] lg:w-[460px] rounded-2xl p-4 glass-card border border-white/10 shadow-2xl relative overflow-hidden select-none">
      {/* Top Ambient Glow Beam */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 shadow-[0_0_12px_#10b981]" />

      {/* Card Header: Engine Status */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-100 flex items-center gap-1.5 font-mono">
              <span>RAG Engine Telemetry</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              HDFC AMC • SEBI Verified Pipeline
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{isLoading ? 'EXECUTING RAG' : '100% GROUNDED'}</span>
        </div>
      </div>

      {/* Live Operational Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 py-3 text-xs font-mono">
        {/* Metric 1 */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-sky-400" />
              Official Corpus
            </span>
            <span className="text-emerald-400 font-bold">24 URLs</span>
          </div>
          <div className="mt-1 font-bold text-slate-200 text-xs">
            0 Third-Party
          </div>
          <div className="text-[9px] text-slate-400">files.hdfcfund.com • sebi.gov.in</div>
        </div>

        {/* Metric 2 */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-indigo-400" />
              Vector Index
            </span>
            <span className="text-indigo-300 font-bold">ChromaDB</span>
          </div>
          <div className="mt-1 font-bold text-slate-200 text-xs">
            563 Chunks
          </div>
          <div className="text-[9px] text-slate-400">Cosine Threshold &ge; 0.70</div>
        </div>

        {/* Metric 3 */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Compliance
            </span>
            <span className="text-emerald-400 font-bold">SEBI/AMFI</span>
          </div>
          <div className="mt-1 font-bold text-slate-200 text-xs">
            0 Advice Policy
          </div>
          <div className="text-[9px] text-slate-400">Refuses return forecasting</div>
        </div>

        {/* Metric 4 */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              Privacy Shield
            </span>
            <span className="text-amber-300 font-bold">Active</span>
          </div>
          <div className="mt-1 font-bold text-slate-200 text-xs">
            PII Redaction
          </div>
          <div className="text-[9px] text-slate-400">PAN, Aadhaar, OTP filtered</div>
        </div>
      </div>

      {/* Live Animated Telemetry Signal Feed Bar */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <span className="w-1 h-2.5 bg-emerald-500 rounded-xs animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-4 bg-emerald-400 rounded-xs animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-3 bg-sky-400 rounded-xs animate-pulse" style={{ animationDelay: '300ms' }} />
            <span className="w-1 h-5 bg-indigo-400 rounded-xs animate-pulse" style={{ animationDelay: '450ms' }} />
            <span className="w-1 h-3.5 bg-emerald-400 rounded-xs animate-pulse" style={{ animationDelay: '600ms' }} />
          </div>
          <span className="text-slate-300">
            {isLoading ? "Generating factual verification..." : "Ready • Query official SIDs"}
          </span>
        </div>
        <div className="text-slate-400">P95 &lt; 1.2s</div>
      </div>
    </div>
  );
}
