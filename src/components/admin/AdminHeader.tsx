'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  type StaffUser,
  getAllowedRoutesForRole,
  CSRF_HEADER_NAME,
  CSRF_HEADER_EXPECTED_VALUE,
} from '@/lib/auth/types';

interface AdminHeaderProps {
  user: StaffUser;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/records', label: 'Records' },
  { href: '/admin/research', label: 'Research' },
  { href: '/admin/review', label: 'Review' },
  { href: '/admin/publish', label: 'Publish' },
  { href: '/admin/users', label: 'Staff Directory' },
];

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const allowedRoutes = getAllowedRoutesForRole(user.role);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [CSRF_HEADER_NAME]: CSRF_HEADER_EXPECTED_VALUE,
        },
      });
    } catch {
      // Ignore network failure on logout
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  }

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    researcher: 'Researcher',
    reviewer: 'Reviewer',
    publisher: 'Publisher',
  };

  const roleColors: Record<string, string> = {
    super_admin: 'bg-purple-950/80 text-purple-300 border-purple-700/50',
    researcher: 'bg-blue-950/80 text-blue-300 border-blue-700/50',
    reviewer: 'bg-amber-950/80 text-amber-300 border-amber-700/50',
    publisher: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="font-bold tracking-tight text-white flex items-center gap-2 text-sm hover:text-emerald-400 transition-colors"
          >
            <span className="inline-block w-2.5 h-2.5 rounded bg-emerald-500" />
            <span>TAT Admin Console</span>
          </Link>

          <span
            className={`px-2 py-0.5 rounded text-[11px] font-mono border uppercase tracking-wider font-semibold ${
              roleColors[user.role] || 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {roleLabels[user.role] || user.role}
          </span>
        </div>

        {/* Dynamic Navigation for allowed roles */}
        <nav aria-label="Admin Navigation" className="flex items-center gap-1 overflow-x-auto py-1">
          {NAV_ITEMS.filter(item => allowedRoutes.includes(item.href)).map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700/80'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Identity & Logout Button */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-slate-200 font-medium truncate max-w-[220px]">
              {user.email}
            </span>
            <span className="text-[10px] text-slate-300 font-mono">
              UID: {user.uid.slice(0, 10)}...
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-3 py-1.5 rounded bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 font-medium transition-colors disabled:opacity-50 text-xs flex items-center gap-1.5"
          >
            {loggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </header>
  );
}
