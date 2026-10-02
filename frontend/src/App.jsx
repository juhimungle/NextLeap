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

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 max-w-6xl xl:max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 flex flex-col gap-5">
        {/* Top Hero Section */}
        <section className="w-full flex flex-col items-center text-center gap-3 pt-2 pb-1">
          <HeroDisclaimerBadge />
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-sky-300 bg-clip-text text-transparent leading-tight drop-shadow-sm max-w-4xl">
            FACTS-ONLY MUTUAL FUND ASSISTANT
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Directly interrogates official scheme information documents (SIDs), key information memoranda (KIMs), and SEBI/AMFI regulatory guidelines for factual certainty. Zero investment advice.
          </p>

          {/* Institutional Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-semibold shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              4 Curated Schemes
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-300 font-semibold shadow-xs">
              <Cpu className="w-3 h-3 text-sky-400" />
              24 SIDs & KIMs
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 font-semibold shadow-xs">
              <TrendingUp className="w-3 h-3 text-indigo-400" />
              563 Chunks Indexed
            </span>
          </div>

          {/* PROMINENT CHATBOT INPUT BAR (Centerpiece - Immediately Visible Above the Fold) */}
          <div className="w-full max-w-3xl mt-2">
            <InputBar
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onClearChat={handleClearChat}
              hasMessages={messages.length > 0}
            />
          </div>
        </section>

        {/* Live Conversation Stream (Only shows when messages or loading exist, completely merged into page) */}
        {(messages.length > 0 || isLoading || error) && (
          <section className="w-full max-w-4xl mx-auto py-2">
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              error={error}
              onRetry={handleRetry}
              onSelectQuestion={handleSendMessage}
            />
          </section>
        )}

        {/* Seamless Financial Telemetry & Scheme Directory (Integrated Into Page Background) */}
        <section className="w-full flex flex-col lg:flex-row gap-4 items-start justify-between mt-1">
          {/* 4 Scheme Directory Cards */}
          <div className="flex-1 w-full">
            <SchemeCardsGrid
              selectedScheme={selectedScheme}
              onSelectScheme={setSelectedScheme}
              onAskQuestion={handleSendMessage}
              disabled={isLoading}
            />
          </div>

          {/* Interactive Animated Financial NAV Graph */}
          <div className="w-full lg:w-[420px] shrink-0 lg:mt-9">
            <TelemetryCard
              isLoading={isLoading}
              selectedScheme={selectedScheme}
              onSelectScheme={setSelectedScheme}
            />
          </div>
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
