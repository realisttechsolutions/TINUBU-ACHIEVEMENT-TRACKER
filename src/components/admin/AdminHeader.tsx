'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const filteredNav = NAV_ITEMS.filter(item => allowedRoutes.includes(item.href));

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur px-4 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Lockup & Role Badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Admin Navigation Menu"
            aria-expanded={mobileMenuOpen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link
            href="/admin"
            className="font-bold tracking-tight text-white flex items-center gap-2 text-xs sm:text-sm hover:text-emerald-400 transition-colors shrink-0"
          >
            <div className="relative w-6 h-6 rounded overflow-hidden border border-emerald-500/40 shadow-sm shrink-0">
              <Image
                src="/brand/ptat-icon-master.png"
                alt="PTAT"
                width={24}
                height={24}
                priority
                className="object-contain w-full h-full"
              />
            </div>
            <span className="truncate font-semibold">PTAT Admin Console</span>
          </Link>

          <span
            className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono border uppercase tracking-wider font-semibold shrink-0 ${
              roleColors[user.role] || 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {roleLabels[user.role] || user.role}
          </span>
        </div>

        {/* Desktop Navigation for allowed roles */}
        <nav aria-label="Admin Desktop Navigation" className="hidden md:flex items-center gap-1">
          {filteredNav.map(item => {
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
        <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-slate-200 font-medium truncate max-w-[200px]">
              {user.email}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              UID: {user.uid.slice(0, 8)}...
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 font-medium transition-colors disabled:opacity-50 text-[11px] sm:text-xs flex items-center gap-1"
          >
            {loggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-slate-800 mt-2.5 space-y-2 animate-fade-in">
          <div className="px-2 py-1 text-[11px] font-mono text-slate-400 border-b border-slate-800/60 pb-1.5 mb-1.5 flex items-center justify-between">
            <span className="truncate">{user.email}</span>
            <span className="text-emerald-400 uppercase font-semibold">{user.role}</span>
          </div>
          <nav aria-label="Admin Mobile Navigation" className="grid grid-cols-2 gap-1.5">
            {filteredNav.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 font-semibold border border-emerald-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

