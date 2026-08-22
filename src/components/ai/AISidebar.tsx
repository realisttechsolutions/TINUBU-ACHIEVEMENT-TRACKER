'use client';

import React from 'react';
import { Link } from '@/lib/navigation';
import {
  Plus,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  History,
} from 'lucide-react';

interface AISidebarProps {
  onNewChat: () => void;
  recentQueries: string[];
  onSelectQuery: (query: string) => void;
  activeQuery?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AISidebar: React.FC<AISidebarProps> = ({
  onNewChat,
  recentQueries,
  onSelectQuery,
  activeQuery,
  isOpen = true,
  onClose,
}) => {
  return (
    <aside
      className={`w-full md:w-64 lg:w-72 bg-slate-950/95 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 transition-all duration-200 ${
        isOpen ? 'block' : 'hidden md:flex'
      }`}
      aria-label="PTAT AI Session Sidebar"
    >
      <div className="space-y-4">
        {/* 1. New Intelligence Query Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-cyan-500/40 text-slate-100 font-semibold text-xs sm:text-sm shadow-md transition-all group"
        >
          <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform" />
          <span>New Query</span>
        </button>

        {/* 2. In-Session History */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-1.5 px-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
            <History className="w-3 h-3 text-slate-400" />
            <span>Recent Queries</span>
          </div>

          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto space-y-1 pr-1">
            {recentQueries.length > 0 ? (
              recentQueries.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectQuery(q)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-colors truncate ${
                    activeQuery === q
                      ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{q}</span>
                </button>
              ))
            ) : (
              <div className="px-2 py-4 text-[11px] text-slate-400 italic">
                Previous inquiries in this session will appear here.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Tracker Nav Link */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Main Tracker</span>
        </Link>

        <div className="px-3 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-emerald-500/80" />
          <span>270 Verified Public Records</span>
        </div>
      </div>
    </aside>
  );
};

export default AISidebar;
