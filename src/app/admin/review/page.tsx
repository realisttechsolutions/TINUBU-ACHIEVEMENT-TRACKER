import { requireStaffAuth } from '@/lib/server/admin-guard';
import Link from 'next/link';

export default async function AdminReviewPage() {
  const staffUser = await requireStaffAuth(['reviewer']);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1 font-semibold">
            Editorial Module • Reviewer Role
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Editorial Review & Audit
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Verification gate, citation cross-checking, confidence rating, and editorial sign-off.
          </p>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition-colors w-fit"
        >
          ← Back to Console
        </Link>
      </div>

      {/* Module Inactive Warning Banner */}
      <div className="p-5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-900/60 text-amber-300 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-1">
          <div className="font-semibold text-amber-300 text-sm">
            Review Gate Foundation Active (M10E Scaffolding)
          </div>
          <p className="text-amber-200/80 leading-relaxed">
            Role authentication and route authorization for <strong>Reviewer</strong> and <strong>Super Admin</strong> are fully certified. Interactive multi-stage editorial verification queues and review sign-offs will be activated in Mission 10F.
          </p>
        </div>
      </div>

      {/* Scaffolding Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="text-slate-300 font-mono text-[11px]">REVIEW GATE 01</div>
          <h3 className="font-bold text-white text-sm">Citation Integrity Audit</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Automated & peer verification of source URL accessibility, gazette numbering, and publisher credibility ratings.
          </p>
          <div className="pt-3 text-[11px] text-slate-300 font-mono italic">
            Status: Scaffolding Ready (M10F)
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="text-slate-300 font-mono text-[11px]">REVIEW GATE 02</div>
          <h3 className="font-bold text-white text-sm">Cross-Entity Consistency</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Reconciliation between policy enactments, executing MDAs, funding mechanisms, and project outcomes.
          </p>
          <div className="pt-3 text-[11px] text-slate-300 font-mono italic">
            Status: Scaffolding Ready (M10F)
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="text-slate-300 font-mono text-[11px]">REVIEW GATE 03</div>
          <h3 className="font-bold text-white text-sm">Editorial Decision Queue</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Formal approval, rejection with feedback, or request for supplementary evidence from researcher authors.
          </p>
          <div className="pt-3 text-[11px] text-slate-300 font-mono italic">
            Status: Scaffolding Ready (M10F)
          </div>
        </div>
      </div>
    </div>
  );
}
