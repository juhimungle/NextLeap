import React, { useState } from 'react';
import { Send, Trash2, CornerDownLeft } from 'lucide-react';

export default function InputBar({ onSendMessage, isLoading, onClearChat, hasMessages }) {
  const [text, setText] = useState('');
  const maxLength = 500;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-2">
      <div className="relative rounded-2xl glass-card border border-white/10 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all p-2.5 shadow-2xl">
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder="Ask a factual question (e.g., 'What is the expense ratio of HDFC Flexi Cap Fund?')..."
          disabled={isLoading}
          className="w-full bg-transparent resize-none text-sm text-slate-100 placeholder-slate-400 focus:outline-none px-2 py-1 scrollbar-none font-sans"
        />

        <div className="flex items-center justify-between pt-2 px-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-mono font-medium ${
              text.length > 450 ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}>
              {text.length}/{maxLength}
            </span>

            {hasMessages && (
              <button
                type="button"
                onClick={onClearChat}
                className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer font-medium"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold inline-flex items-center gap-0.5">
                <span>Enter</span>
                <CornerDownLeft className="w-2.5 h-2.5" />
              </kbd>
            </span>

            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:brightness-110 hover:shadow-indigo-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
