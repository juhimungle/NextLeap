import React, { useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import SchemeSelector from './components/SchemeSelector';
import SchemeCardsGrid from './components/SchemeCardsGrid';
import ExampleQuestions from './components/ExampleQuestions';
import ChatPanel from './components/ChatPanel';
import InputBar from './components/InputBar';
import SourcesModal from './components/SourcesModal';
import GuideModal from './components/GuideModal';
import { HeroDisclaimerBadge, FooterDisclaimer } from './components/DisclaimerBanner';
import { Cpu, CheckCircle2, TrendingUp } from 'lucide-react';

import TelemetryCard from './components/TelemetryCard';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState('All schemes');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');

  const handleSendMessage = async (question) => {
    if (!question || isLoading) return;
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

      {/* Main Content Container - Expansive max-w-6xl xl:max-w-7xl to eliminate empty side voids */}
      <main className="relative z-10 flex-1 max-w-6xl xl:max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 flex flex-col gap-3 sm:gap-4">
        {/* Hero Section */}
        <section className="w-full flex flex-col md:flex-row items-center justify-between gap-5 lg:gap-8 py-1 sm:py-2">
          {/* Headline & Subtitle */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start gap-2.5">
            <HeroDisclaimerBadge />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-sky-300 bg-clip-text text-transparent leading-tight drop-shadow-sm">
              FACTS-ONLY MUTUAL FUND ASSISTANT
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Ask factual questions about mutual fund schemes using verified official sources from HDFC AMC, SEBI, and AMFI. Strict adherence to zero investment advice.
            </p>

            {/* Institutional Trust Badges Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 font-mono text-[11px]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-semibold shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                4 Curated Schemes
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-300 font-semibold shadow-xs">
                <Cpu className="w-3 h-3 text-sky-400" />
                24 SIDs & KIMs
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 font-semibold shadow-xs">
                <TrendingUp className="w-3 h-3 text-indigo-400" />
                563 Chunks Indexed
              </span>
            </div>
          </div>

          {/* Institutional Telemetry Engine Card */}
          <div className="shrink-0 my-1">
            <TelemetryCard isLoading={isLoading} />
          </div>
        </section>

        {/* Scheme Directory Cards Grid (WealthTech / Groww Style) */}
        <SchemeCardsGrid
          selectedScheme={selectedScheme}
          onSelectScheme={setSelectedScheme}
          onAskQuestion={handleSendMessage}
          disabled={isLoading}
        />

        {/* Chat Card Container - Expands comfortably with Pro Neon Edge Beam */}
        <div className="w-full flex-1 rounded-3xl glass-panel p-3 sm:p-5 lg:p-6 shadow-2xl flex flex-col border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_12px_#6366f1]" />
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            onSelectQuestion={handleSendMessage}
          />
          <InputBar
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onClearChat={handleClearChat}
            hasMessages={messages.length > 0}
          />
        </div>
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
