import { requireStaffAuth } from '@/lib/server/admin-guard';
import Link from 'next/link';

export default async function AdminResearchPage() {
  const staffUser = await requireStaffAuth(['researcher']);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1 font-semibold">
            Editorial Module • Researcher Role
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Research & Evidence Intake
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Intake primary source evidence, bibliographic references, and quantitative policy metrics.
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
      <div className="p-5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-xs text-blue-200 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-900/60 text-blue-300 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <div className="font-semibold text-blue-300 text-sm">
            Research Intake Foundation Active (M10E Scaffolding)
          </div>
          <p className="text-blue-200/80 leading-relaxed">
            Role authentication and route authorization for <strong>Researcher</strong> and <strong>Super Admin</strong> are fully certified. Interactive data-intake forms, document extraction, and CRUD operations will be activated in Mission 10F with dedicated writer credentials.
          </p>
        </div>
      </div>

      {/* Scaffolding Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="text-slate-300 font-mono text-[11px]">MODULE 01</div>
          <h3 className="font-bold text-white text-sm">Primary Source Registry</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Registration of gazettes, circulars, audits, and international partner publications with 6-tier hierarchy metadata.
          </p>
          <div className="pt-3 text-[11px] text-slate-300 font-mono italic">
            Status: Scaffolding Ready (M10F)
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="text-slate-300 font-mono text-[11px]">MODULE 02</div>
          <h3 className="font-bold text-white text-sm">Factual Claims Formulation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Drafting candidate achievement claims, qualitative narratives, and geographic linkage to 36 states + FCT.
          </p>
          <div className="pt-3 text-[11px] text-slate-300 font-mono italic">
            Status: Scaffolding Ready (M10F)
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="text-slate-300 font-mono text-[11px]">MODULE 03</div>
          <h3 className="font-bold text-white text-sm">Financial & Beneficiary Linkage</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Linking NGN budget allocations, CBN releases, and registered citizen counts directly to canonical records.
          </p>
          <div className="pt-3 text-[11px] text-slate-300 font-mono italic">
            Status: Scaffolding Ready (M10F)
          </div>
        </div>
      </div>
    </div>
  );
}
