'use client';

import React from 'react';
import { ArrowLeft, ArrowUpRight, Building2, Calendar, FileText, MapPin, Users } from 'lucide-react';
import { Link, useParams } from '@/lib/navigation';
import { dataAdapter } from '@/adapters/dataAdapter';
import StatusBadge from '@/components/common/StatusBadge';
import SourceBadge from '@/components/common/SourceBadge';
import DemoWatermark from '@/components/common/DemoWatermark';
import ScopeBadge from '@/components/common/ScopeBadge';
import CitizenImpactSection from '@/components/impact/CitizenImpactSection';

export type PublicRecordKind = 'project' | 'policy' | 'programme';

const detailCopy = {
  project: {
    collection: 'Capital Projects',
    collectionPath: '/projects',
    label: 'Project record',
    action: 'View project record',
  },
  policy: {
    collection: 'Policies & Reforms',
    collectionPath: '/policies',
    label: 'Policy record',
    action: 'View policy record',
  },
  programme: {
    collection: 'Social Programmes',
    collectionPath: '/programmes',
    label: 'Programme record',
    action: 'View programme record',
  },
} as const;

export function PublicRecordDetail({ kind }: { kind: PublicRecordKind }) {
  const { slug } = useParams<{ slug: string }>();
  const project = kind === 'project' ? dataAdapter.getProjectBySlug(slug || '') : undefined;
  const policy = kind === 'policy' ? dataAdapter.getPolicyBySlug(slug || '') : undefined;
  const programme = kind === 'programme' ? dataAdapter.getProgrammeBySlug(slug || '') : undefined;
  const record = project ?? policy ?? programme;
  const copy = detailCopy[kind];

  if (!record) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-gov-navy dark:text-white">Record Not Found</h1>
        <p className="text-sm text-gov-slate">The requested public record is not available in the published catalogue.</p>
        <Link to={copy.collectionPath} className="inline-flex items-center gap-2 rounded-xl bg-gov-navy px-4 py-2 text-sm font-bold text-white hover:bg-gov-emerald">
          <ArrowLeft className="h-4 w-4" />
          Return to {copy.collection}
        </Link>
      </main>
    );
  }

  const leadAgency = project?.executingAgency ?? policy?.leadMinistry ?? programme?.coordinatingAgency ?? '';
  const date = project?.startDate ?? policy?.effectiveDate ?? policy?.approvalDate ?? programme?.launchDate ?? '';
  const datePrecision = project?.datePrecision ?? policy?.datePrecision ?? programme?.datePrecision ?? '';
  const states = project?.statesCovered ?? programme?.statesCovered ?? ['National'];
  const typeLabel = project?.projectTypeLabel ?? policy?.policyTypeLabel ?? programme?.programmeTypeLabel ?? '';
  const timeline = dataAdapter.getTimelineEvents().filter((event) => event.recordId === record.id);

  return (
    <main className="min-h-screen bg-gov-canvas py-8 font-sans dark:bg-gov-navy/10 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
        <Link to={copy.collectionPath} className="inline-flex items-center gap-2 text-sm font-bold text-gov-navy hover:text-gov-emerald dark:text-gov-gold">
          <ArrowLeft className="h-4 w-4" />
          Back to {copy.collection}
        </Link>

        {record.isDemo ? <DemoWatermark /> : null}

        <section className="space-y-5 rounded-3xl border border-gov-border bg-white p-6 shadow-sm dark:bg-gov-darkSurface sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-border/60 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={record.status} size="md" />
              <ScopeBadge statesCovered={states} title={record.title} summary={record.summary} size="md" />
              <span className="rounded-full bg-gov-navy px-3 py-1 text-xs font-bold uppercase tracking-wide text-gov-gold">{typeLabel}</span>
            </div>
            <Link to={`/sectors/${record.sectorId}`} className="text-xs font-bold text-gov-emerald hover:underline">{record.sectorName}</Link>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gov-slate">{copy.label}</p>
            <h1 className="text-3xl font-extrabold leading-tight text-gov-navy dark:text-white sm:text-4xl">{record.title}</h1>
            <p className="rounded-2xl border border-gov-border/60 bg-gov-canvas p-4 text-sm leading-relaxed text-gov-slate dark:bg-white/5">{record.summary}</p>
          </div>

          <div className="grid gap-4 text-xs sm:grid-cols-3">
            <div className="rounded-xl border border-gov-border/60 bg-gov-canvas p-3.5 dark:bg-white/5">
              <span className="mb-1 flex items-center gap-1.5 font-bold uppercase tracking-wide text-gov-slate"><Building2 className="h-3.5 w-3.5" />Lead agency</span>
              <p className="font-bold text-gov-navy dark:text-white">{leadAgency}</p>
            </div>
            <div className="rounded-xl border border-gov-border/60 bg-gov-canvas p-3.5 dark:bg-white/5">
              <span className="mb-1 flex items-center gap-1.5 font-bold uppercase tracking-wide text-gov-slate"><MapPin className="h-3.5 w-3.5" />Geography</span>
              <p className="font-bold text-gov-navy dark:text-white">{states.join(', ')}</p>
            </div>
            <div className="rounded-xl border border-gov-border/60 bg-gov-canvas p-3.5 dark:bg-white/5">
              <span className="mb-1 flex items-center gap-1.5 font-bold uppercase tracking-wide text-gov-slate"><Calendar className="h-3.5 w-3.5" />Date</span>
              <p className="font-bold text-gov-navy dark:text-white">{date} ({datePrecision})</p>
            </div>
          </div>
        </section>

        {(project || programme || policy) ? (
          <section className="grid gap-4 md:grid-cols-2">
            {project ? (
              <>
                <DetailFact label="Execution progress" value={`${project.progressPercentage}%`} />
                <DetailFact label="Contract value" value={project.contractValue ?? 'Not published'} />
                <DetailFact label="Contract reference" value={project.contractor ?? 'Not published'} />
              </>
            ) : null}
            {policy ? (
              <>
                <DetailFact label="Gazette / reference" value={policy.gazetteNumber ?? 'Not published'} />
                <DetailFact label="Effective date" value={policy.effectiveDate ?? policy.approvalDate} />
              </>
            ) : null}
            {programme ? (
              <>
                <DetailFact label="Target beneficiary" value={programme.targetBeneficiaryTypeLabel} />
                <DetailFact label="Published beneficiary count" value={programme.beneficiaryCountFormatted ?? 'Not published'} icon={<Users className="h-4 w-4" />} />
              </>
            ) : null}
          </section>
        ) : null}

        {/* Citizen Impact Foundation ("What This Means for Nigerians") */}
        <CitizenImpactSection impact={record.citizenImpact} />

        <section className="space-y-5 rounded-3xl border-2 border-gov-gold/40 bg-white p-6 shadow-sm dark:bg-gov-darkSurface sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gov-gold">Evidence and sources</p>
            <h2 className="mt-1 text-xl font-bold text-gov-navy dark:text-white">Published claim citations</h2>
          </div>
          {record.evidenceClaims.length ? record.evidenceClaims.map((claim, index) => (
            <article key={claim.claimId} className="space-y-3 rounded-2xl border border-gov-border bg-gov-canvas p-5 dark:bg-white/5">
              <p className="text-sm font-semibold leading-relaxed text-gov-navy dark:text-white">Claim {index + 1}: {claim.publicClaimSummary || claim.claimText}</p>
              <div className="space-y-2 border-t border-gov-border/60 pt-3">
                {claim.sources.map((source) => (
                  <div key={source.sourceId} className="flex flex-col justify-between gap-3 rounded-xl border border-gov-border/60 bg-white p-3 text-xs dark:bg-gov-darkSurface sm:flex-row sm:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><SourceBadge level={source.sourceLevel} /><span className="font-bold text-gov-navy dark:text-white">{source.displayTitle || source.title}</span></div>
                      <p className="mt-1 text-gov-slate">Publisher: {source.publisher}{source.evidenceLocation ? ` • ${source.evidenceLocation}` : ''}</p>
                    </div>
                    {source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 font-bold text-gov-emerald hover:underline">View source <ArrowUpRight className="h-3.5 w-3.5" /></a> : null}
                  </div>
                ))}
              </div>
            </article>
          )) : <p className="text-sm text-gov-slate">No published claim citations are available for this record.</p>}
        </section>

        {timeline.length ? (
          <section className="space-y-4 rounded-3xl border border-gov-border bg-white p-6 dark:bg-gov-darkSurface sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gov-navy dark:text-white"><FileText className="h-5 w-5 text-gov-gold" />Timeline</h2>
            {timeline.map((event) => <div key={event.id} className="rounded-xl border border-gov-border/60 bg-gov-canvas p-4 text-sm dark:bg-white/5"><p className="font-bold text-gov-navy dark:text-white">{event.eventDate} — {event.title}</p><p className="mt-1 text-gov-slate">{event.summary}</p></div>)}
          </section>
        ) : null}
      </div>
    </main>
  );
}

function DetailFact({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="rounded-2xl border border-gov-border bg-white p-5 shadow-sm dark:bg-gov-darkSurface"><p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gov-slate">{icon}{label}</p><p className="mt-2 text-lg font-extrabold text-gov-navy dark:text-white">{value}</p></div>;
}

export default PublicRecordDetail;
