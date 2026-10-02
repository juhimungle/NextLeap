import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import SchemeSelector from './components/SchemeSelector';
import SchemeCardsGrid from './components/SchemeCardsGrid';
import ExampleQuestions from './components/ExampleQuestions';
import ChatPanel from './components/ChatPanel';
import InputBar from './components/InputBar';
import SourcesModal from './components/SourcesModal';
import GuideModal from './components/GuideModal';
import { HeroDisclaimerBadge, FooterDisclaimer } from './components/DisclaimerBanner';
import { Cpu, CheckCircle2, TrendingUp, MessageSquare } from 'lucide-react';

import TelemetryCard from './components/TelemetryCard';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState('All schemes');
  const [mobileTab, setMobileTab] = useState('assistant'); // 'assistant' | 'schemes'
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const handleSendMessage = async (question) => {
    if (!question || isLoading) return;
    setMobileTab('assistant');
    setError(null);
    setIsLoading(true);
    setLastQuestion(question);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          scheme: selectedScheme !== 'All schemes' ? selectedScheme : null
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          user: question,
          answer: data.answer,
          source_url: data.source_url,
          source_title: data.source_title,
          last_updated: data.last_updated,
          type: data.type
        }
      ]);
    } catch (err) {
      console.error("Ask query error:", err);
      setError("Unable to reach the assistant service. Please check your network or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  const handleRetry = () => {
    if (lastQuestion) {
      handleSendMessage(lastQuestion);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden ${
      isDark ? 'bg-[#080d1a] text-slate-100 dark' : 'bg-slate-50 text-slate-900 light'
    }`}>
      {/* Background Subtle Grid Texture */}
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern opacity-60 z-0" />

      {/* Background Aurora Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full filter blur-[140px] opacity-35 ${
          isDark ? 'bg-indigo-600' : 'bg-indigo-300'
        }`} />
        <div className={`absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full filter blur-[160px] opacity-25 ${
          isDark ? 'bg-sky-600' : 'bg-sky-300'
        }`} />
        <div className={`absolute top-1/2 -right-32 w-[550px] h-[550px] rounded-full filter blur-[150px] opacity-20 ${
          isDark ? 'bg-emerald-600' : 'bg-emerald-300'
        }`} />
      </div>

      {/* Navigation */}
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        reduceMotion={reduceMotion}
        setReduceMotion={setReduceMotion}
        onOpenSources={() => setSourcesOpen(true)}
        onOpenGuide={() => setGuideOpen(true)}
      />

      {/* Mobile Institutional Segmented Switcher (<lg only) */}
      <div className="lg:hidden w-full max-w-7xl mx-auto px-3 sm:px-6 pt-2 pb-1 z-20">
        <div className="flex p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 backdrop-blur-md shadow-xs">
          <button
            type="button"
            onClick={() => setMobileTab('assistant')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              mobileTab === 'assistant'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#00D09C]" />
            <span>AI Fact Assistant</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('schemes')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              mobileTab === 'schemes'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
            <span>Funds & Telemetry</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold">
              4
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Container - Split-Screen Command Center */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-2 sm:py-3 flex flex-col lg:flex-row gap-4 sm:gap-5">
        {/* Left Column (58% width): AI Fact Assistant Workspace */}
        <section className={`flex-1 lg:w-[58%] flex-col rounded-3xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl p-3.5 sm:p-5 relative overflow-hidden h-[calc(100dvh-10.5rem)] lg:h-[calc(100vh-6.5rem)] min-h-[480px] ${
          mobileTab === 'assistant' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Top Neon Edge Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 shadow-[0_0_12px_#00D09C]" />

          {/* Workspace Title & Trust Bar */}
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 mb-2 border-b border-slate-200 dark:border-white/10 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <HeroDisclaimerBadge />
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
                  • 100% Grounded
                </span>
              </div>
              <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                FACTS-ONLY MUTUAL FUND ASSISTANT
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">
                Directly interrogates official HDFC AMC SIDs & SEBI guidelines. Strict zero advice.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-emerald-700 dark:text-emerald-300 font-medium">24 SIDs</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-sky-700 dark:text-sky-300 font-medium">563 Chunks</span>
            </div>
          </div>

          {/* Scrollable Conversation Stream */}
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-none my-1">
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              error={error}
              onRetry={handleRetry}
              onSelectQuestion={handleSendMessage}
            />
          </div>

          {/* Pinned Input Bar at Bottom of Workspace */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 mt-auto shrink-0">
            <InputBar
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onClearChat={handleClearChat}
              hasMessages={messages.length > 0}
            />
          </div>
        </section>

        {/* Right Column (42% width): Scheme Explorer & Live NAV Telemetry */}
        <section className={`w-full lg:w-[42%] flex-col gap-3.5 overflow-y-auto max-h-[calc(100dvh-10.5rem)] lg:h-[calc(100vh-6.5rem)] pr-1.5 scroll-smooth ${
          mobileTab === 'schemes' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Interactive Animated Financial NAV Graph */}
          <TelemetryCard
            isLoading={isLoading}
            selectedScheme={selectedScheme}
            onSelectScheme={setSelectedScheme}
          />

          {/* 4 Scheme Directory Cards (2x2 Grid) */}
          <SchemeCardsGrid
            selectedScheme={selectedScheme}
            onSelectScheme={setSelectedScheme}
            onAskQuestion={handleSendMessage}
            disabled={isLoading}
          />
        </section>
      </main>

      {/* Sources Drawer/Modal */}
      <SourcesModal
        isOpen={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
      />

      {/* User Guidance Modal */}
      <GuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        onSelectQuestion={handleSendMessage}
      />

      {/* Always Visible Footer Disclaimer */}
      <FooterDisclaimer />
    </div>
  );
}
