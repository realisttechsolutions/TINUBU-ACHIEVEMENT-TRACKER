'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Menu,
  RotateCcw,
  User,
  AlertCircle,
} from 'lucide-react';
import { Link } from '@/lib/navigation';
import type { PTATGroundedAnswer } from '@/types/ai.types';
import { AIComposer } from './AIComposer';
import { AIWelcomeHero } from './AIWelcomeHero';
import { AIAnswerCard } from './AIAnswerCard';
import { AILoadingState } from './AILoadingState';
import { AIEvidencePanel } from './AIEvidencePanel';
import { AISidebar } from './AISidebar';

export interface AIMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  answer?: PTATGroundedAnswer;
  error?: string;
  timestamp: string;
}

const SESSION_STORAGE_KEY = 'ptat_ai_session_queries_v1';

export const PTATAIExperienceClient: React.FC = () => {
  const [messages, setMessages] = useState<AIMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeEvidenceAnswer, setActiveEvidenceAnswer] = useState<PTATGroundedAnswer | null>(null);
  const [evidencePanelOpen, setEvidencePanelOpen] = useState(false);
  const [selectedCitationIndex, setSelectedCitationIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize recent queries from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        setRecentQueries(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveRecentQuery = (query: string) => {
    setRecentQueries((prev) => {
      const updated = [query, ...prev.filter((q) => q !== query)].slice(0, 10);
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newMessages: AIMessageItem[] = [
      ...messages,
      {
        id: userMessageId,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      },
    ];

    setMessages(newMessages);
    setIsLoading(true);
    saveRecentQuery(trimmed);

    // Prepare bounded conversation history (last 6 turns)
    const conversationHistory = newMessages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          conversationHistory,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Server returned error (${res.status})`);
      }

      const answer: PTATGroundedAnswer = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: answer.answer || answer.answerText || '',
          answer,
          timestamp: new Date().toISOString(),
        },
      ]);

      setActiveEvidenceAnswer(answer);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to complete intelligence synthesis.',
          error:
            err?.message ||
            'A temporary network or server error occurred while retrieving evidence. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEvidencePanel = (answer: PTATGroundedAnswer, citationIndex?: number) => {
    setActiveEvidenceAnswer(answer);
    setSelectedCitationIndex(citationIndex || null);
    setEvidencePanelOpen(true);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveEvidenceAnswer(null);
    setEvidencePanelOpen(false);
    setSelectedCitationIndex(null);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Global AI Experience Header */}
      <header className="sticky top-0 z-40 h-14 sm:h-16 bg-slate-950/80 border-b border-slate-800/60 backdrop-blur-xl flex items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle AI navigation sidebar"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 md:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-slate-950 font-extrabold font-mono text-xs sm:text-sm shadow-md group-hover:scale-105 transition-transform">
              AI
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm sm:text-base text-slate-100 leading-tight">
                PTAT AI
              </span>
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest hidden sm:block">
                Evidence Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Right Header Affordances */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleNewChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Query</span>
            </button>
          )}

          {activeEvidenceAnswer && (
            <button
              type="button"
              onClick={() => setEvidencePanelOpen((prev) => !prev)}
              aria-label="Toggle evidence panel"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Evidence Rail</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </button>
          )}

          <Link
            to="/achievements"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors hidden md:inline-flex"
          >
            Catalog
          </Link>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <AISidebar
          onNewChat={handleNewChat}
          recentQueries={recentQueries}
          onSelectQuery={(q) => handleSendQuestion(q)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Conversation / Landing Container */}
        <main className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto relative">
          {/* Subtle Ambient Background Bloom */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between relative z-10">
            {/* Empty State / Minimal AI Landing View */}
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center my-auto py-12 sm:py-16 animate-in fade-in duration-300">
                <AIWelcomeHero />

                <div className="w-full max-w-2xl lg:max-w-3xl mt-2">
                  <AIComposer
                    onSubmit={handleSendQuestion}
                    isLoading={isLoading}
                    autoFocus={true}
                  />
                </div>
              </div>
            ) : (
              /* Active Multi-Turn Message Flow */
              <div className="flex-1 space-y-6 pb-32">
                {messages.map((message) => (
                  <div key={message.id} className="w-full">
                    {message.role === 'user' ? (
                      /* User Message Bubble */
                      <div className="flex items-start justify-end gap-2 sm:gap-3 my-2">
                        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-none px-4 py-3 bg-slate-900 border border-slate-700/80 text-slate-100 text-sm sm:text-base font-sans shadow-lg">
                          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <span className="text-[10px] font-mono text-slate-400 block text-right mt-1">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 shadow-sm mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                    ) : message.error ? (
                      /* Assistant Error Message */
                      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-rose-300 mb-1">Intelligence Error</h4>
                          <p className="text-xs text-rose-200/90 leading-relaxed">{message.error}</p>
                        </div>
                      </div>
                    ) : message.answer ? (
                      /* Assistant Grounded Answer Card */
                      <AIAnswerCard
                        answer={message.answer}
                        onOpenEvidencePanel={(citationIndex) =>
                          handleOpenEvidencePanel(message.answer!, citationIndex)
                        }
                      />
                    ) : null}
                  </div>
                ))}

                {/* Loading State Animation */}
                {isLoading && <AILoadingState />}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Sticky Bottom Composer when conversation has started */}
          {messages.length > 0 && (
            <div className="sticky bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-4 pb-4 sm:pb-6 px-3 sm:px-6 z-20">
              <div className="max-w-4xl mx-auto">
                <AIComposer
                  onSubmit={handleSendQuestion}
                  isLoading={isLoading}
                  autoFocus={false}
                />
              </div>
            </div>
          )}
        </main>

        {/* Evidence Rail Drawer */}
        <AIEvidencePanel
          answer={activeEvidenceAnswer}
          isOpen={evidencePanelOpen}
          onClose={() => setEvidencePanelOpen(false)}
          selectedCitationIndex={selectedCitationIndex}
          onClearSelectedCitation={() => setSelectedCitationIndex(null)}
        />
      </div>
    </div>
  );
};

export default PTATAIExperienceClient;
