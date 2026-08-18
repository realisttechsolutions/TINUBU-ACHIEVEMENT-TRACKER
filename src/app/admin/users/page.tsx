import { requireStaffPageAuth } from '@/lib/server/admin-guard';
import Link from 'next/link';

export default async function AdminUsersPage() {
  const staffUser = await requireStaffPageAuth(['super_admin']);


  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-1 font-semibold">
            Governance Surface • Super Admin Only
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Staff Directory & Access Control
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Super administrative governance, role claim assignments, security audits, and operator CLI controls.
          </p>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition-colors w-fit"
        >
          ← Back to Console
        </Link>
      </div>

      {/* Super Admin Notice */}
      <div className="p-5 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs text-purple-200 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-purple-900/60 text-purple-300 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="space-y-1">
          <div className="font-semibold text-purple-300 text-sm">
            Super Administrator Authority Verified
          </div>
          <p className="text-purple-200/80 leading-relaxed">
            You are authenticated as <strong>{staffUser.email}</strong> with full super administrative privileges. In Mission 10E, staff account creation and role updates are provisioned via secure operator CLI bootstrap scripts with strict ADC authentication.
          </p>
        </div>
      </div>

      {/* Operator CLI Reference Guide */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight">
          Operator Access Control CLI Scripts (ADC Authenticated)
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          For security and auditability, staff provisioning scripts operate out-of-band using Google Application Default Credentials:
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <div className="text-slate-300 text-[11px] font-sans mb-1"># Provision a new staff user or promote an existing account</div>
            <code className="text-emerald-400">
              node scripts/admin/bootstrap-staff.mjs --email user@example.com --role researcher --confirm
            </code>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <div className="text-slate-300 text-[11px] font-sans mb-1"># Update assigned staff role</div>
            <code className="text-emerald-400">
              node scripts/admin/set-staff-role.mjs --email user@example.com --role reviewer --confirm
            </code>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <div className="text-slate-300 text-[11px] font-sans mb-1"># Disable staff account & revoke active sessions</div>
            <code className="text-emerald-400">
              node scripts/admin/disable-staff.mjs --email user@example.com --confirm
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
