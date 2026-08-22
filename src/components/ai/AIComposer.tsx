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
  placeholder = 'Ask about achievements, programmes, policies or public evidence...',
  autoFocus = true,
}) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea smoothly based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(scrollHeight, 38), 160)}px`;
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
      textareaRef.current.style.height = '38px';
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
      className="w-full max-w-2xl lg:max-w-3xl mx-auto transition-all"
    >
      <div className="relative flex items-end gap-2 rounded-xl sm:rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 border border-slate-700/70 hover:border-slate-600 focus-within:border-cyan-500/70 focus-within:ring-2 focus-within:ring-cyan-500/10 shadow-lg backdrop-blur-xl transition-all duration-200 px-3 py-1.5 sm:px-3.5 sm:py-2">
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
          className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm md:text-[14.5px] resize-none outline-none focus:outline-none min-h-[38px] max-h-[160px] py-1.5 leading-relaxed font-sans selection:bg-cyan-500/30"
        />

        {/* Inline Actions */}
        <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setValue('');
                if (textareaRef.current) {
                  textareaRef.current.style.height = '38px';
                  textareaRef.current.focus();
                }
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Clear text"
              aria-label="Clear text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="Submit query to PTAT AI"
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
              canSubmit
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/20 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div className="text-center mt-1">
        <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 hidden sm:inline">
          Enter to send • Shift+Enter for new line
        </span>
      </div>
    </form>
  );
};

export default AIComposer;
