import React from 'react';
import { Layers, PieChart, Landmark, Shield, TrendingUp } from 'lucide-react';

const SCHEMES = [
  { id: "All schemes", label: "All Schemes", icon: Layers },
  { id: "HDFC Flexi Cap Fund", label: "HDFC Flexi Cap", icon: PieChart },
  { id: "HDFC Large Cap Fund", label: "HDFC Large Cap", icon: Landmark },
  { id: "HDFC ELSS Tax Saver", label: "HDFC ELSS Tax Saver", icon: Shield },
  { id: "HDFC Mid-Cap Opportunities Fund", label: "HDFC Mid-Cap", icon: TrendingUp }
];

export default function SchemeSelector({ selectedScheme, onSelectScheme }) {
  return (
    <div className="w-full flex flex-col gap-2 my-1">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active Scheme Filter</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Filter grounded answers by verified scheme documents
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SCHEMES.map((s) => {
          const isSelected = selectedScheme === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => onSelectScheme(s.id)}
              className={`group flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 text-white border-indigo-400/80 shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/20'
                  : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
