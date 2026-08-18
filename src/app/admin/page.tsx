import Link from 'next/link';
import { requireStaffPageAuth } from '@/lib/server/admin-guard';
import { getAdminDashboardStats } from '@/server/admin/records-service';

export default async function AdminDashboardPage() {
  const staffUser = await requireStaffPageAuth();

  const stats = await getAdminDashboardStats();

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
      {/* Welcome Banner & Action Header */}
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
              Editorial records management portal. Create, edit, and audit factual claims, evidence sources, and project milestones.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {(staffUser.role === 'super_admin' || staffUser.role === 'researcher') && (
              <Link
                href="/admin/records/new"
                id="create-record-btn"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/50 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>+ Create Record</span>
              </Link>
            )}
            <Link
              href="/admin/records"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium border border-slate-700 transition-all"
            >
              Browse All Records
            </Link>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Total Canonical Records</div>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-2 font-mono">
            {stats.totalRecords}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all 4 model classes</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Drafts in Progress</div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 mt-2 font-mono">
            {stats.draftRecords}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Non-public staging data</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">My Identity / Role</div>
          <div className="text-base sm:text-lg font-bold text-emerald-400 mt-2 truncate font-sans">
            {staffUser.role.toUpperCase()}
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-1 font-mono">{staffUser.email}</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Database Writer Role</div>
          <div className="text-base sm:text-lg font-bold text-slate-200 mt-2 font-mono">
            tat_admin_writer
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Least-Privilege Scoped</div>
        </div>
      </div>

      {/* Distribution by Class */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white">Records Distribution by Class</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['achievement', 'policy', 'project', 'programme'].map((type) => {
            const count = stats.byClass.find((c) => c.recordType === type)?.count || 0;
            return (
              <div key={type} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-medium text-slate-400 capitalize">{type}s</div>
                <div className="text-xl font-bold text-white mt-1 font-mono">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recently Updated Records Table */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Recently Updated Records</h2>
          <Link href="/admin/records" className="text-xs text-emerald-400 hover:text-emerald-300">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Class</th>
                <th className="pb-3 font-semibold">Sector</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Workflow</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.recentRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-medium text-white max-w-xs truncate">{r.title}</td>
                  <td className="py-3 capitalize text-slate-300">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 font-mono">
                      {r.record_type}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 truncate max-w-[150px]">
                    {r.lead_sector_label || '—'}
                  </td>
                  <td className="py-3 text-slate-300 capitalize">{r.implementation_status.replace('_', ' ')}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        r.publication_status === 'published'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                      }`}
                    >
                      {r.publication_status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/records/${r.id}`}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
