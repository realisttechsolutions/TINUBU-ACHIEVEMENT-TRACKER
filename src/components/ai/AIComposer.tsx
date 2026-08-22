'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, X } from 'lucide-react';

interface AIComposerProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const AIComposer: React.FC<AIComposerProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Ask about achievements, projects, programmes, policies or public evidence...',
  autoFocus = true,
}) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(scrollHeight, 56), 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isLoading || trimmed.length > 2000) return;

    onSubmit(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = value.trim().length > 0 && value.length <= 2000 && !isLoading;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl lg:max-w-4xl mx-auto transition-all"
    >
      <div className="relative flex flex-col rounded-2xl sm:rounded-3xl bg-slate-900/90 dark:bg-slate-950/90 border border-slate-700/70 hover:border-slate-600 focus-within:border-cyan-500/80 focus-within:ring-4 focus-within:ring-cyan-500/10 shadow-2xl backdrop-blur-xl transition-all duration-200 p-3 sm:p-4">
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          maxLength={2000}
          aria-label="Ask PTAT AI a question"
          className="w-full bg-transparent text-slate-100 placeholder:text-slate-400 text-sm sm:text-base md:text-lg resize-none outline-none focus:outline-none min-h-[56px] max-h-[200px] leading-relaxed pr-12 font-sans selection:bg-cyan-500/30"
        />

        {/* Bottom Minimal Action Bar */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800/40 mt-1">
          <div className="flex items-center gap-2">
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setValue('');
                  if (textareaRef.current) {
                    textareaRef.current.style.height = '56px';
                    textareaRef.current.focus();
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Clear text"
                aria-label="Clear text"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              aria-label="Submit query to PTAT AI"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                canSubmit
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 hover:scale-105 active:scale-95'
                  : 'bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-2.5">
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Use Enter to send • Shift+Enter for new line
        </span>
      </div>
    </form>
  );
};

export default AIComposer;
