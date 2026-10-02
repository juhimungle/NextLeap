import React from 'react';
import { Layers } from 'lucide-react';

const SCHEMES = [
  { id: "All schemes", label: "All schemes" },
  { id: "HDFC Flexi Cap Fund", label: "HDFC Flexi Cap" },
  { id: "HDFC Large Cap Fund", label: "HDFC Large Cap" },
  { id: "HDFC ELSS Tax Saver", label: "HDFC ELSS Tax Saver" },
  { id: "HDFC Mid-Cap Opportunities Fund", label: "HDFC Mid-Cap" }
];

export default function SchemeSelector({ selectedScheme, onSelectScheme }) {
  return (
    <div className="w-full flex flex-col gap-2 my-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium px-1">
        <Layers className="w-3.5 h-3.5 text-indigo-400" />
        <span>Target Scheme Scope:</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SCHEMES.map((s) => {
          const isSelected = selectedScheme === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectScheme(s.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 font-semibold'
                  : 'bg-slate-900/60 dark:bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
