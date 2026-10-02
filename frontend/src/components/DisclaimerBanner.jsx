import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export function HeroDisclaimerBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 shadow-xs backdrop-blur-md">
      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
      <span>Facts-only. No investment advice.</span>
    </div>
  );
}

export function FooterDisclaimer() {
  return (
    <footer className="w-full py-3.5 px-4 border-t border-slate-200 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-[#0c1222]/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex items-start sm:items-center justify-center gap-2">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 dark:text-slate-300">Facts-only.</strong> This assistant provides factual information from official sources (HDFC AMC, SEBI, AMFI) and does not provide investment advice or recommendations. Do not share PAN, Aadhaar, account numbers, OTPs, phone numbers, email addresses, passwords, or other personal information.
        </p>
      </div>
    </footer>
  );
}
