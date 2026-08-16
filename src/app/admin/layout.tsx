import type { Metadata } from 'next';
import Link from 'next/link';
import { getAuthenticatedStaffUser } from '@/lib/server/admin-guard';
import { getAllowedRoutesForRole, type StaffRole } from '@/lib/auth/types';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Staff Administration | Tinubu Achievement Tracker',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staffUser = await getAuthenticatedStaffUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Top Security & Staging Staff Notice */}
      <aside aria-label="Environment notices" className="bg-amber-950/80 border-b border-amber-500/30 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>TAT STAFF ACCESS CONTROL — RESTRICTED INTERNAL SURFACE</span>
        </div>
        <div className="hidden sm:block text-[11px] text-amber-400/80">
          STAGING ENVIRONMENT (US-CENTRAL1)
        </div>
      </aside>

      {/* Admin Shell Header (when authenticated) */}
      {staffUser && <AdminHeader user={staffUser} />}

      {/* Main Admin Content Area */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Admin Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 px-6 py-4 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Tinubu Administration Achievement Tracker — Staff Administrative Foundation (M10E)
        </div>
        <div className="text-slate-300 font-mono text-[11px]">
          Confidential & Proprietary • Session Revocation Enforced
        </div>
      </footer>
    </div>
  );
}
