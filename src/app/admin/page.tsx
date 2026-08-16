import Link from 'next/link';
import { requireStaffAuth } from '@/lib/server/admin-guard';
import { getAllowedRoutesForRole } from '@/lib/auth/types';

export default async function AdminDashboardPage() {
  const staffUser = await requireStaffAuth();
  const allowedRoutes = getAllowedRoutesForRole(staffUser.role);

  const modules = [
    {
      title: 'Research & Evidence Intake',
      href: '/admin/research',
      description: 'Primary source ingestion, factual claim verification, and data linkage.',
      minRole: 'researcher',
      allowed: allowedRoutes.includes('/admin/research'),
      status: 'Planned for Mission 10F',
    },
    {
      title: 'Editorial Review & Audit',
      href: '/admin/review',
      description: 'Peer validation, claim confidence scoring, and fact-checking workflows.',
      minRole: 'reviewer',
      allowed: allowedRoutes.includes('/admin/review'),
      status: 'Planned for Mission 10F',
    },
    {
      title: 'Publication & Release Management',
      href: '/admin/publish',
      description: 'Public projection generation, canonical status updates, and release logs.',
      minRole: 'publisher',
      allowed: allowedRoutes.includes('/admin/publish'),
      status: 'Planned for Mission 10F',
    },
    {
      title: 'Staff Directory & Access Control',
      href: '/admin/users',
      description: 'Operator role assignments, audit logs, and security policy enforcement.',
      minRole: 'super_admin',
      allowed: allowedRoutes.includes('/admin/users'),
      status: 'Super Admin Operator Surface',
    },
  ];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
      {/* Welcome Banner & Staff Identity Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE AUTHENTICATED SESSION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Administrative Control Console
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Welcome to the staff management foundation. This authenticated environment establishes role-based access control, session validation, and editorial isolation.
            </p>
          </div>

          {/* Identity Snapshot Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 font-mono shrink-0 min-w-[280px]">
            <div className="text-slate-300">
              <span className="text-slate-400">Staff Identity:</span>{' '}
              <span className="text-white font-sans font-medium">{staffUser.email}</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Assigned Role:</span>{' '}
              <span className="text-emerald-400 font-bold uppercase">{staffUser.role}</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Session Type:</span>{' '}
              <span className="text-slate-300">Server Cookie (8h)</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Database Role:</span>{' '}
              <span className="text-amber-400">Read-Only Boundary</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial & Governance Modules Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Administrative Modules & Permission Boundary
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Module activation is scoped by role. Interactive write capabilities will be introduced in Mission 10F.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.title}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                mod.allowed
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-900/80 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider ${
                      mod.allowed
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {mod.allowed ? 'Authorized' : 'Restricted'}
                  </span>
                  <span className="text-[11px] text-slate-300 font-mono">
                    {mod.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{mod.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-mono">
                  Min Role: <span className="text-slate-300 uppercase">{mod.minRole}</span>
                </span>

                {mod.allowed ? (
                  <Link
                    href={mod.href}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    <span>Enter Module Shell</span>
                    <span>→</span>
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400 cursor-not-allowed">
                    Insufficient Privilege
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Architecture & Governance Notes */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs space-y-3 leading-relaxed text-slate-300">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Security Invariants in Effect (Mission 10E)</span>
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
          <li>
            <strong>Server-Authoritative RBAC:</strong> Role permissions are verified directly by server components and Firebase Admin SDK. Client-side navigation does not bypass route guards.
          </li>
          <li>
            <strong>Public Isolation:</strong> Public visitors cannot access administrative routes, and public pages remain 100% login-free.
          </li>
          <li>
            <strong>Zero Direct Database Mutation:</strong> Public App Hosting database connection retains strict read-only boundary. Editorial data mutations will occur through dedicated control planes in Mission 10F.
          </li>
        </ul>
      </div>
    </div>
  );
}
