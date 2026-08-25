'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { clientStaffSignIn, clientStaffSignOut } from '@/lib/auth/firebase-client';
import { CSRF_HEADER_NAME, CSRF_HEADER_EXPECTED_VALUE } from '@/lib/auth/types';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate with Firebase Client SDK
      const authResult = await clientStaffSignIn(email, password);

      // 2. Exchange ID token for server-side HTTP-only session cookie
      const response = await fetch('/api/admin/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [CSRF_HEADER_NAME]: CSRF_HEADER_EXPECTED_VALUE,
        },
        body: JSON.stringify({ idToken: authResult.idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication rejected by security policy.');
      }

      // 3. Clear ephemeral client-side auth state
      await clientStaffSignOut();

      // 4. Redirect to authoritative protected admin destination
      router.push(redirectTarget);
      router.refresh();
    } catch (err: unknown) {
      // Ephemeral cleanup
      await clientStaffSignOut();

      // Provide generic, safe user-facing message to prevent email enumeration
      if (err instanceof Error) {
        if (err.message.includes('EMAIL_NOT_VERIFIED') || err.message.includes('verified')) {
          setErrorMessage('Staff account email must be verified before login.');
        } else if (err.message.includes('NOT_STAFF') || err.message.includes('role')) {
          setErrorMessage('Access denied: User is not authorized for staff administration.');
        } else {
          setErrorMessage('Invalid credentials or unauthorized account. Please verify details with system operator.');
        }
      } else {
        setErrorMessage('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur">
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="relative w-[240px] h-[58px] mb-4">
          <Image
            src="/brand/ptat-header-logo.png"
            alt="President Tinubu Achievement Tracker"
            fill
            priority
            sizes="240px"
            className="object-contain"
          />
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">
          Staff Administration Console
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Authorized editorial, research, and governance personnel only
        </p>
      </div>


      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-3.5 rounded-lg bg-red-950/80 border border-red-800/60 text-xs text-red-200 flex items-start gap-2.5"
        >
          <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="staff-email" className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Staff Email Address
          </label>
          <input
            id="staff-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="name@example.com"
            className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans disabled:opacity-50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="staff-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="staff-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="••••••••••••"
            className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Verifying Staff Credentials...</span>
            </>
          ) : (
            <span>Authenticate & Enter Admin</span>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Public registration is disabled. Staff accounts are provisioned exclusively via authorized administrative procedures.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
      <Suspense fallback={<div className="text-xs text-slate-500">Loading administrative login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
