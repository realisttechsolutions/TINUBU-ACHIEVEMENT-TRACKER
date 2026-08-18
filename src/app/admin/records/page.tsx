import Link from 'next/link';
import { requireStaffPageAuth } from '@/lib/server/admin-guard';
import { listAdminRecords } from '@/server/admin/records-service';
import { getAdminReferenceData } from '@/server/admin/reference-service';
import type { RecordType } from '@/server/admin/validation';

export default async function AdminRecordsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    sector?: string;
    status?: string;
    publication_status?: string;
    page?: string;
  }>;
}) {
  const staffUser = await requireStaffPageAuth();

  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const result = await listAdminRecords({
    q: params.q,
    type: params.type as RecordType | undefined,
    sector: params.sector,
    status: params.status as any,
    publication_status: params.publication_status as any,
    page,
    limit: 20,
  });

  const refData = await getAdminReferenceData();

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/admin" className="hover:text-emerald-400">
              Admin
            </Link>
            <span>/</span>
            <span className="text-white">Records Index</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Canonical Records Directory
          </h1>
          <p className="text-xs text-slate-300">
            Manage, edit, and track all {result.total} records across all four model classes.
          </p>
        </div>

        {(staffUser.role === 'super_admin' || staffUser.role === 'researcher') && (
          <Link
            href="/admin/records/new"
            id="create-record-btn"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Create Record</span>
          </Link>
        )}
      </div>

      {/* Filter & Search Bar */}
      <form method="GET" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label htmlFor="search-q" className="block font-medium text-slate-400 mb-1">Search Keywords</label>
            <input
              id="search-q"
              name="q"
              defaultValue={params.q || ''}
              placeholder="Search title, summary, slug..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="filter-type" className="block font-medium text-slate-400 mb-1">Record Type</label>
            <select
              id="filter-type"
              name="type"
              defaultValue={params.type || ''}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Types</option>
              <option value="achievement">Achievement</option>
              <option value="policy">Policy</option>
              <option value="project">Project</option>
              <option value="programme">Programme</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-sector" className="block font-medium text-slate-400 mb-1">Lead Sector</label>
            <select
              id="filter-sector"
              name="sector"
              defaultValue={params.sector || ''}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Sectors</option>
              {refData.sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-status" className="block font-medium text-slate-400 mb-1">Workflow Status</label>
            <select
              id="filter-status"
              name="publication_status"
              defaultValue={params.publication_status || ''}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in_review">In Review</option>
              <option value="ready_for_publication">Ready for Publication</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400">
            Showing <strong>{result.records.length}</strong> of <strong>{result.total}</strong> records
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/records"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Reset
            </Link>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </form>

      {/* Records Table */}
      <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                <th className="p-3.5 font-semibold">Title</th>
                <th className="p-3.5 font-semibold">Type</th>
                <th className="p-3.5 font-semibold">Lead Sector</th>
                <th className="p-3.5 font-semibold">Implementation</th>
                <th className="p-3.5 font-semibold">Workflow</th>
                <th className="p-3.5 font-semibold">Last Updated</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {result.records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No records found matching current criteria.
                  </td>
                </tr>
              ) : (
                result.records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-medium text-white max-w-sm">
                      <div className="truncate font-semibold">{r.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">{r.slug}</div>
                    </td>
                    <td className="p-3.5 capitalize">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 font-mono">
                        {r.record_type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-[160px] truncate">
                      {r.lead_sector_label || '—'}
                    </td>
                    <td className="p-3.5 capitalize text-slate-300">
                      {r.implementation_status.replace('_', ' ')}
                    </td>
                    <td className="p-3.5">
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
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(r.updated_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5 text-right font-semibold">
                      <Link
                        href={`/admin/records/${r.id}`}
                        className="px-3 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 rounded-lg text-xs transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Page {result.page} of {result.totalPages}
            </span>
            <div className="flex items-center gap-2">
              {result.page > 1 && (
                <Link
                  href={`/admin/records?page=${result.page - 1}${params.q ? `&q=${encodeURIComponent(params.q)}` : ''}${params.type ? `&type=${params.type}` : ''}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  ← Previous
                </Link>
              )}
              {result.page < result.totalPages && (
                <Link
                  href={`/admin/records?page=${result.page + 1}${params.q ? `&q=${encodeURIComponent(params.q)}` : ''}${params.type ? `&type=${params.type}` : ''}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
