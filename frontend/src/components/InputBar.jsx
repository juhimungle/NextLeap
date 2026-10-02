import React, { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';

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
      <div className="relative rounded-2xl glass-card border border-white/10 focus-within:border-indigo-500/80 transition-all p-2 shadow-lg">
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder="Ask a factual question (e.g., 'What is the expense ratio of HDFC Flexi Cap Fund?')..."
          disabled={isLoading}
          className="w-full bg-transparent resize-none text-sm text-slate-100 placeholder-slate-400 focus:outline-none px-2 py-1 scrollbar-none"
        />

        <div className="flex items-center justify-between pt-1 px-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-mono ${
              text.length > 450 ? 'text-amber-400' : 'text-slate-400'
            }`}>
              {text.length}/{maxLength}
            </span>

            {hasMessages && (
              <button
                type="button"
                onClick={onClearChat}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </form>
  );
}
