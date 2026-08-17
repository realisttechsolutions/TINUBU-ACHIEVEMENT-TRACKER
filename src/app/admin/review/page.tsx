import { requireStaffAuth } from '@/lib/server/admin-guard';
import { getReviewQueue } from '@/server/admin/records-service';
import Link from 'next/link';

export default async function AdminReviewPage() {
  const staffUser = await requireStaffAuth(['reviewer', 'super_admin']);
  let records: any[] = [];
  let fetchError: string | null = null;

  try {
    records = await getReviewQueue(staffUser);
  } catch (err: any) {
    fetchError = err.message || 'Failed to load review queue';
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1 font-semibold">
            Editorial Workflow • Review Gate
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Editorial Review Queue
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Verification gate for researcher submissions. Approve for publication readiness, return for revisions, or reject.
          </p>
        </div>

        <Link
          href="/admin/records"
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition-colors w-fit"
        >
          All Records
        </Link>
      </div>

      {fetchError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-200">
          <strong>Error loading queue:</strong> {fetchError}
        </div>
      )}

      {/* Queue Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Pending Review</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{records.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Authorized Roles</div>
          <div className="text-sm font-medium text-slate-200 mt-1">Reviewer, Super Admin</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Gate Protocol</div>
          <div className="text-sm font-medium text-emerald-400 mt-1">Gate 4 Human Approval</div>
        </div>
      </div>

      {/* Review Queue Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Records Requiring Review</h2>
          <span className="text-xs font-mono text-slate-400">{records.length} record(s)</span>
        </div>

        {records.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-300">Review Queue is Clear</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no records submitted for review. When researchers submit drafts, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Record / Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Researcher</th>
                  <th className="px-6 py-3 text-center">Claims</th>
                  <th className="px-6 py-3 text-center">Financials</th>
                  <th className="px-6 py-3 text-center">Beneficiaries</th>
                  <th className="px-6 py-3">Submitted</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-semibold text-white truncate">{r.title}</div>
                      <div className="text-[11px] font-mono text-slate-500 truncate">{r.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {r.record_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {r.researcher_name || 'Staff Researcher'}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-400">{r.claim_count || 0}</td>
                    <td className="px-6 py-4 text-center font-mono text-slate-400">{r.financial_count || 0}</td>
                    <td className="px-6 py-4 text-center font-mono text-slate-400">{r.beneficiary_count || 0}</td>
                    <td className="px-6 py-4 text-slate-400 text-[11px]">
                      {new Date(r.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/records/${r.id}`}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors inline-block"
                      >
                        Inspect & Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
