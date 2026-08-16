import Link from 'next/link';
import { getAuthenticatedStaffUser } from '@/lib/server/admin-guard';

export default async function AdminUnauthorizedPage() {
  const staffUser = await getAuthenticatedStaffUser();

  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900/90 border border-red-900/40 shadow-2xl backdrop-blur text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-white tracking-tight">
          403 — Access Denied
        </h1>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Your authenticated staff account does not have sufficient role privileges to access this administrative module.
        </p>

        {staffUser && (
          <div className="my-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-1.5 font-mono">
            <div className="text-slate-300">
              <span className="text-slate-400">Authenticated Email:</span> {staffUser.email}
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Assigned Role:</span>{' '}
              <span className="text-amber-400 font-semibold uppercase">{staffUser.role}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/admin"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Return to Dashboard
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
