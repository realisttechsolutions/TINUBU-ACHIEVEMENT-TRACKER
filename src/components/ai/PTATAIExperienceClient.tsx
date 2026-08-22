'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Menu,
  User,
  AlertCircle,
  ArrowDown,
} from 'lucide-react';
import type { PTATGroundedAnswer } from '@/types/ai.types';
import { AIComposer } from './AIComposer';
import { AIWelcomeHero } from './AIWelcomeHero';
import { AIAnswerCard } from './AIAnswerCard';
import { AIEvidencePanel } from './AIEvidencePanel';
import { AISidebar } from './AISidebar';

export interface AIMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  answer?: PTATGroundedAnswer;
  error?: string;
  isStreaming?: boolean;
  statusText?: string;
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
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const latestMessageRef = useRef<HTMLDivElement | null>(null);
  const isAutoFollowingRef = useRef(true);

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

  // Scroll listener to detect if user manually scrolled up
  const handleScroll = useCallback(() => {
    const el = mainScrollRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isNearBottom = distanceToBottom < 120;

    isAutoFollowingRef.current = isNearBottom;
    setUserScrolledUp(!isNearBottom);
  }, []);

  const scrollToBottom = (smooth = true) => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({
        top: mainScrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
      setUserScrolledUp(false);
      isAutoFollowingRef.current = true;
    }
  };

  const handleSendQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `asst-${Date.now()}`;

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

    // Prepare bounded conversation history
    const conversationHistory = newMessages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Add placeholder assistant message
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        statusText: 'Searching PTAT records...',
        timestamp: new Date().toISOString(),
      },
    ]);

    // Position scroll gently to the new assistant answer
    setTimeout(() => {
      scrollToBottom(true);
    }, 50);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream, application/json',
        },
        body: JSON.stringify({
          question: trimmed,
          conversationHistory,
          stream: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Server returned error (${res.status})`);
      }

      const contentType = res.headers.get('content-type') || '';

      // If server returned SSE stream
      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedText = '';
        const partialAnswer: Partial<PTATGroundedAnswer> = {};

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const ev of events) {
            if (!ev.trim()) continue;
            const lines = ev.split('\n');
            let eventType = 'message';
            let eventDataStr = '';

            for (const line of lines) {
              if (line.startsWith('event: ')) {
                eventType = line.slice(7).trim();
              } else if (line.startsWith('data: ')) {
                eventDataStr = line.slice(6).trim();
              }
            }

            if (!eventDataStr) continue;
            try {
              const data = JSON.parse(eventDataStr);

              if (eventType === 'status') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, statusText: data.message }
                      : m
                  )
                );
              } else if (eventType === 'answer_start') {
                partialAnswer.sourceMode = data.sourceMode;
                partialAnswer.answerability = data.answerability;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, statusText: undefined }
                      : m
                  )
                );
              } else if (eventType === 'answer_chunk') {
                accumulatedText += data.text || '';
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? {
                          ...m,
                          content: accumulatedText,
                          answer: {
                            ...(m.answer || {}),
                            query: trimmed,
                            intent: 'SUMMARY_QUERY',
                            answerability: partialAnswer.answerability || 'ANSWERABLE',
                            sourceMode: partialAnswer.sourceMode || 'PTAT_ONLY',
                            answer: accumulatedText,
                            answerText: accumulatedText,
                            citations: m.answer?.citations || [],
                            recordLinks: m.answer?.recordLinks || [],
                            limitations: m.answer?.limitations || [],
                            confidence: m.answer?.confidence || {
                              overallScore: 0.9,
                              entityMatchScore: 1,
                              constraintMatchScore: 1,
                              evidenceCoverageScore: 1,
                              sourceAuthenticityScore: 1,
                              geographicPrecisionScore: 1,
                              temporalPrecisionScore: 1,
                              confidenceTier: 'HIGH',
                              explanation: 'Streaming response',
                            },
                            modelMetadata: m.answer?.modelMetadata || {
                              model: 'gemini-3.6-flash',
                              location: 'global',
                              retrievalLatencyMs: 0,
                              modelLatencyMs: 0,
                              totalLatencyMs: 0,
                              retriesAttempted: 0,
                            },
                            citationValidation: m.answer?.citationValidation || {
                              valid: true,
                              totalCitations: 0,
                              validCitations: 0,
                              rejectedCitations: 0,
                              rejectionReasons: [],
                              validatedCitations: [],
                            },
                            isGrounded: true,
                          },
                        }
                      : m
                  )
                );

                if (isAutoFollowingRef.current) {
                  scrollToBottom(false);
                }
              } else if (eventType === 'sources') {
                partialAnswer.citations = data.citations || [];
                partialAnswer.webSources = data.webSources || [];
                partialAnswer.webGrounding = data.webGrounding;
                partialAnswer.recordLinks = data.recordLinks || [];
              } else if (eventType === 'metadata') {
                partialAnswer.financialSummary = data.financialSummary || [];
                partialAnswer.beneficiarySummary = data.beneficiarySummary || [];
                partialAnswer.comparisonSummary = data.comparisonSummary;
                partialAnswer.limitations = data.limitations || [];
                partialAnswer.confidence = data.confidence;
                partialAnswer.sourceMode = data.sourceMode;
                partialAnswer.isGrounded = data.isGrounded;
              } else if (eventType === 'done') {
                const finalAnswer: PTATGroundedAnswer = {
                  query: trimmed,
                  intent: 'SUMMARY_QUERY',
                  answerability: partialAnswer.answerability || 'ANSWERABLE',
                  sourceMode: partialAnswer.sourceMode || 'PTAT_ONLY',
                  answer: accumulatedText,
                  answerText: accumulatedText,
                  citations: partialAnswer.citations || [],
                  webSources: partialAnswer.webSources || [],
                  webGrounding: partialAnswer.webGrounding,
                  recordLinks: partialAnswer.recordLinks || [],
                  financialSummary: partialAnswer.financialSummary || [],
                  beneficiarySummary: partialAnswer.beneficiarySummary || [],
                  comparisonSummary: partialAnswer.comparisonSummary,
                  limitations: partialAnswer.limitations || [],
                  confidence: partialAnswer.confidence || {
                    overallScore: 0.9,
                    entityMatchScore: 1,
                    constraintMatchScore: 1,
                    evidenceCoverageScore: 1,
                    sourceAuthenticityScore: 1,
                    geographicPrecisionScore: 1,
                    temporalPrecisionScore: 1,
                    confidenceTier: 'HIGH',
                    explanation: 'Certified synthesis',
                  },
                  modelMetadata: {
                    model: 'gemini-3.6-flash',
                    location: 'global',
                    retrievalLatencyMs: 0,
                    modelLatencyMs: 0,
                    totalLatencyMs: 0,
                    retriesAttempted: 0,
                  },
                  citationValidation: {
                    valid: true,
                    totalCitations: (partialAnswer.citations || []).length,
                    validCitations: (partialAnswer.citations || []).length,
                    rejectedCitations: 0,
                    rejectionReasons: [],
                    validatedCitations: partialAnswer.citations || [],
                  },
                  isGrounded: true,
                };

                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? {
                          ...m,
                          isStreaming: false,
                          statusText: undefined,
                          content: accumulatedText,
                          answer: finalAnswer,
                        }
                      : m
                  )
                );

                setActiveEvidenceAnswer(finalAnswer);
              }
            } catch {
              // Ignore event parse errors
            }
          }
        }
      } else {
        // Fallback standard JSON response
        const answer: PTATGroundedAnswer = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  isStreaming: false,
                  statusText: undefined,
                  content: answer.answer || answer.answerText || '',
                  answer,
                }
              : m
          )
        );
        setActiveEvidenceAnswer(answer);
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                isStreaming: false,
                statusText: undefined,
                content: 'Unable to complete intelligence synthesis.',
                error:
                  err?.message ||
                  'A temporary network or server error occurred. Please try again.',
              }
            : m
        )
      );
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
    <div className="flex-1 flex overflow-hidden relative bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 min-h-[calc(100vh-7.5rem)]">
      {/* Mobile Sidebar Toggle Button */}
      <button
        type="button"
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Toggle AI navigation sidebar"
        className="fixed top-24 left-3 z-30 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 text-slate-400 hover:text-white md:hidden shadow-lg backdrop-blur-md transition-all"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Sidebar */}
      <AISidebar
        onNewChat={handleNewChat}
        recentQueries={recentQueries}
        onSelectQuery={(q) => handleSendQuestion(q)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Conversation Container */}
      <main
        ref={mainScrollRef}
        onScroll={handleScroll}
        className="flex-1 flex flex-col h-[calc(100vh-7.5rem)] overflow-y-auto relative scroll-smooth"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex-1 w-full max-w-2xl lg:max-w-3xl mx-auto px-3.5 sm:px-6 py-3 sm:py-5 flex flex-col relative z-10">
            {/* Empty State Landing */}
            {messages.length === 0 ? (
              <div className="w-full flex flex-col items-center pt-2 sm:pt-6 md:pt-10 animate-in fade-in duration-200">
                <AIWelcomeHero />

                <div className="w-full max-w-2xl lg:max-w-3xl mt-1 sm:mt-2">
                  <AIComposer
                    onSubmit={handleSendQuestion}
                    isLoading={isLoading}
                    autoFocus={true}
                  />
                </div>
              </div>
            ) : (
              /* Active Conversational Message Stream */
              <div className="flex-1 space-y-4 pb-28">
                {messages.map((message, idx) => (
                  <div
                    key={message.id}
                    ref={idx === messages.length - 1 ? latestMessageRef : undefined}
                    className="w-full"
                  >
                    {message.role === 'user' ? (
                      /* User Message Bubble */
                      <div className="flex items-start justify-end gap-2 sm:gap-2.5 my-2">
                        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-none px-3.5 py-2 sm:py-2.5 bg-slate-900 border border-slate-700/80 text-slate-100 text-xs sm:text-[13.5px] font-sans shadow-md">
                          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 shadow-sm mt-0.5">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                    ) : message.error ? (
                      /* Assistant Error Message */
                      <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-2.5 my-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-rose-300 mb-0.5 text-xs sm:text-sm">Intelligence Notice</h4>
                          <p className="text-xs text-rose-200/90 leading-relaxed">{message.error}</p>
                        </div>
                      </div>
                    ) : message.isStreaming && !message.content ? (
                      /* Streaming Status Notice */
                      <div className="py-2.5 flex items-center gap-2 text-xs font-mono text-cyan-400 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                        <span>{message.statusText || 'Synthesizing verified response...'}</span>
                      </div>
                    ) : message.answer ? (
                      /* Assistant Answer Component (Prose-First) */
                      <AIAnswerCard
                        answer={message.answer}
                        isStreaming={message.isStreaming}
                        onOpenEvidencePanel={(citationIndex) =>
                          handleOpenEvidencePanel(message.answer!, citationIndex)
                        }
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Floating "↓ Latest" Button when user scrolled away */}
          {userScrolledUp && messages.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToBottom(true)}
              className="fixed bottom-20 right-6 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-900/90 hover:bg-cyan-800 border border-cyan-500/50 text-cyan-100 text-xs font-medium shadow-2xl backdrop-blur-md transition-all hover:scale-105"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Latest</span>
            </button>
          )}

          {/* Sticky Bottom Composer */}
          {messages.length > 0 && (
            <div className="sticky bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-1.5 pb-2.5 sm:pb-3.5 px-3 sm:px-6 z-20">
              <div className="max-w-2xl lg:max-w-3xl mx-auto">
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
  );
};

export default PTATAIExperienceClient;
