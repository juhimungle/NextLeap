import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export function HeroDisclaimerBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm backdrop-blur-md">
      <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
      <span>Facts-only. No investment advice.</span>
    </div>
  );
}

export function FooterDisclaimer() {
  return (
    <footer className="w-full py-4 px-4 border-t border-white/5 text-center text-xs text-slate-400 glass-panel">
      <div className="max-w-4xl mx-auto flex items-start sm:items-center justify-center gap-2">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Facts-only.</strong> This assistant provides factual information from official sources (HDFC AMC, SEBI, AMFI) and does not provide investment advice or recommendations. Do not share PAN, Aadhaar, account numbers, OTPs, phone numbers, email addresses, passwords, or other personal information.
        </p>
      </div>
    </footer>
  );
}
