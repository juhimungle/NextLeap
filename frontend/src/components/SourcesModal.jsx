import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Database, Search, ShieldCheck } from 'lucide-react';

export default function SourcesModal({ isOpen, onClose }) {
  const [sources, setSources] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && sources.length === 0) {
      setLoading(true);
      fetch('/api/sources')
        .then(res => res.json())
        .then(data => {
          setSources(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed loading sources:", err);
          setLoading(false);
        });
    }
  }, [isOpen, sources.length]);

  if (!isOpen) return null;

  const filtered = sources.filter(s => {
    const matchesType = filter === 'ALL' || s.source_type === filter;
    const matchesSearch = search === '' || 
      s.source_title.toLowerCase().includes(search.toLowerCase()) ||
      s.scheme.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Knowledge Base Sources ({sources.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official documents verified from HDFC AMC, SEBI, and AMFI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-3 bg-slate-50 dark:bg-transparent">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scheme or document title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['ALL', 'AMC', 'SEBI', 'AMFI'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  filter === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200/70 text-slate-700 hover:text-slate-900 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sources List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50 dark:bg-transparent">
          {loading ? (
            <div className="text-center py-12 text-sm text-slate-400">
              Loading verified official sources...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">
              No matching sources found.
            </div>
          ) : (
            filtered.map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 hover:border-indigo-500/40 shadow-xs transition-all flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      s.source_type === 'AMC' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30' :
                      s.source_type === 'SEBI' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30' :
                      'bg-sky-50 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30'
                    }`}>
                      {s.source_type}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {s.scheme}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Updated: {s.last_updated}
                  </span>
                </div>

                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>{s.source_title}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-indigo-600" />
                </a>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Doc type: {s.document_type}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-slate-200 dark:border-white/10 text-center text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/40">
          Only official AMC, SEBI, and AMFI pages. Zero third-party blogs or unverified links.
        </div>
      </div>
    </div>
  );
}
