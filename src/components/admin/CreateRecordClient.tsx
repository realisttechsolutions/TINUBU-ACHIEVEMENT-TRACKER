'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ReferenceDataResponse } from '@/server/admin/reference-service';
import type { RecordType } from '@/server/admin/validation';

export default function CreateRecordClient({ refData }: { refData: ReferenceDataResponse }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recordType, setRecordType] = useState<RecordType>('achievement');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortSummary, setShortSummary] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [leadSectorId, setLeadSectorId] = useState('');
  const [leadInstitutionId, setLeadInstitutionId] = useState('');
  const [geographicScope, setGeographicScope] = useState('national');
  const [announcedDate, setAnnouncedDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');

  // Class specific
  const [milestoneType, setMilestoneType] = useState('commissioned');
  const [flagshipTier, setFlagshipTier] = useState('1');
  const [policyType, setPolicyType] = useState('executive_order');
  const [legalInstrument, setLegalInstrument] = useState('');
  const [projectType, setProjectType] = useState('capital_infrastructure');
  const [targetYear, setTargetYear] = useState('2027');
  const [programmeType, setProgrammeType] = useState('direct_intervention');
  const [beneficiaryGroup, setBeneficiaryGroup] = useState('citizens');

  // Auto-generate slug on title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: any = {
      record_type: recordType,
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      short_summary: shortSummary.trim() || null,
      full_description: fullDescription.trim() || null,
      lead_sector_id: leadSectorId || null,
      lead_institution_id: leadInstitutionId || null,
      geographic_scope: geographicScope,
      announced_date: announcedDate || null,
      start_date: startDate || null,
      completion_date: completionDate || null,
      sector_ids: leadSectorId ? [leadSectorId] : [],
      institution_ids: leadInstitutionId ? [leadInstitutionId] : [],
      geographic_unit_ids: [],
    };

    if (recordType === 'achievement') {
      payload.achievement_profile = {
        milestone_type: milestoneType,
        flagship_tier: parseInt(flagshipTier, 10) || 1,
      };
    } else if (recordType === 'policy') {
      payload.policy_details = {
        policy_type: policyType,
        legal_instrument_type: legalInstrument || null,
      };
    } else if (recordType === 'project') {
      payload.project_details = {
        project_type: projectType,
        target_completion_year: parseInt(targetYear, 10) || null,
      };
    } else if (recordType === 'programme') {
      payload.programme_details = {
        programme_type: programmeType,
        target_beneficiary_group: beneficiaryGroup,
      };
    }

    try {
      const res = await fetch('/api/admin/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tat-admin-csrf': '1',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create record');
      }

      router.push(`/admin/records/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/admin" className="hover:text-emerald-400">Admin</Link>
            <span>/</span>
            <Link href="/admin/records" className="hover:text-emerald-400">Records</Link>
            <span>/</span>
            <span className="text-white">New Record</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Create Canonical Record Draft
          </h1>
          <p className="text-xs text-slate-300">
            Drafts remain non-public until approved and published in accordance with governance rules.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
          <strong>Creation Failed:</strong> {error}
        </div>
      )}

      {/* Wizard Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        {/* Step 1: Select Model Class */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            1. Select Record Model Class
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'achievement', label: 'Achievement', desc: 'Milestone or outcome delivery' },
              { id: 'policy', label: 'Policy', desc: 'Executive order, reform, circular' },
              { id: 'project', label: 'Project', desc: 'Capital physical infrastructure' },
              { id: 'programme', label: 'Programme', desc: 'Social or economic intervention' },
            ].map((cls) => (
              <button
                key={cls.id}
                type="button"
                onClick={() => setRecordType(cls.id as RecordType)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  recordType === cls.id
                    ? 'bg-emerald-950/60 border-emerald-500/80 text-white ring-2 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-sm text-white capitalize">{cls.label}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">{cls.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Core Metadata */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            2. Core Record Metadata
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label htmlFor="record-title" className="block font-medium text-slate-300 mb-1">
                Record Title <span className="text-rose-400">*</span>
              </label>
              <input
                id="record-title"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Student Loan Scheme Phase 1 Fund Disbursement"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="record-slug" className="block font-medium text-slate-300 mb-1">
                URL Slug <span className="text-rose-400">*</span>
              </label>
              <input
                id="record-slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. student-loan-scheme-phase-1-fund-disbursement"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="record-summary" className="block font-medium text-slate-300 mb-1">
                Short Summary (Fact-Dense Overview)
              </label>
              <textarea
                id="record-summary"
                rows={3}
                value={shortSummary}
                onChange={(e) => setShortSummary(e.target.value)}
                placeholder="Precise factual overview summarizing key metrics and impact..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div>
              <label htmlFor="record-sector" className="block font-medium text-slate-300 mb-1">
                Lead Sector
              </label>
              <select
                id="record-sector"
                value={leadSectorId}
                onChange={(e) => setLeadSectorId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select Sector</option>
                {refData.sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="record-inst" className="block font-medium text-slate-300 mb-1">
                Lead Institution
              </label>
              <select
                id="record-inst"
                value={leadInstitutionId}
                onChange={(e) => setLeadInstitutionId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select Institution</option>
                {refData.institutions.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.canonical_name} {i.short_name ? `(${i.short_name})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="record-scope" className="block font-medium text-slate-300 mb-1">
                Geographic Scope
              </label>
              <select
                id="record-scope"
                value={geographicScope}
                onChange={(e) => setGeographicScope(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="national">National</option>
                <option value="geopolitical_zone">Geopolitical Zone</option>
                <option value="state">State</option>
                <option value="multi_state">Multi-State Corridor</option>
                <option value="lga">LGA</option>
                <option value="diaspora">Diaspora</option>
                <option value="unspecified">Unspecified</option>
              </select>
            </div>

            <div>
              <label htmlFor="record-announced" className="block font-medium text-slate-300 mb-1">
                Announced Date
              </label>
              <input
                id="record-announced"
                type="date"
                value={announcedDate}
                onChange={(e) => setAnnouncedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Class Specific Details */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider capitalize">
            3. {recordType} Specific Fields
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {recordType === 'achievement' && (
              <>
                <div>
                  <label htmlFor="ach-milestone" className="block font-medium text-slate-300 mb-1">Milestone Type</label>
                  <input
                    id="ach-milestone"
                    value={milestoneType}
                    onChange={(e) => setMilestoneType(e.target.value)}
                    placeholder="e.g. commissioned, flag_off, disbursement"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label htmlFor="ach-flagship" className="block font-medium text-slate-300 mb-1">Flagship Tier</label>
                  <select
                    id="ach-flagship"
                    value={flagshipTier}
                    onChange={(e) => setFlagshipTier(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="1">Tier 1 (National Priority)</option>
                    <option value="2">Tier 2 (Sector Major)</option>
                    <option value="3">Tier 3 (Standard Delivery)</option>
                  </select>
                </div>
              </>
            )}

            {recordType === 'policy' && (
              <>
                <div>
                  <label htmlFor="pol-type" className="block font-medium text-slate-300 mb-1">Policy Type</label>
                  <input
                    id="pol-type"
                    value={policyType}
                    onChange={(e) => setPolicyType(e.target.value)}
                    placeholder="e.g. executive_order, fiscal_reform"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label htmlFor="pol-instrument" className="block font-medium text-slate-300 mb-1">Legal Instrument Number</label>
                  <input
                    id="pol-instrument"
                    value={legalInstrument}
                    onChange={(e) => setLegalInstrument(e.target.value)}
                    placeholder="e.g. Executive Order No. 41 of 2024"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </>
            )}

            {recordType === 'project' && (
              <>
                <div>
                  <label htmlFor="prj-type" className="block font-medium text-slate-300 mb-1">Project Type</label>
                  <input
                    id="prj-type"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    placeholder="e.g. highway, deep_sea_port, transmission"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label htmlFor="prj-year" className="block font-medium text-slate-300 mb-1">Target Completion Year</label>
                  <input
                    id="prj-year"
                    type="number"
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    placeholder="e.g. 2027"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </>
            )}

            {recordType === 'programme' && (
              <>
                <div>
                  <label htmlFor="prg-type" className="block font-medium text-slate-300 mb-1">Programme Type</label>
                  <input
                    id="prg-type"
                    value={programmeType}
                    onChange={(e) => setProgrammeType(e.target.value)}
                    placeholder="e.g. social_intervention, loan_disbursement"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label htmlFor="prg-beneficiary" className="block font-medium text-slate-300 mb-1">Target Beneficiary Group</label>
                  <input
                    id="prg-beneficiary"
                    value={beneficiaryGroup}
                    onChange={(e) => setBeneficiaryGroup(e.target.value)}
                    placeholder="e.g. Tertiary Students, MSMEs"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <Link
            href="/admin/records"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            id="save-draft-btn"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2"
          >
            {loading ? (
              <span>Creating Draft...</span>
            ) : (
              <>
                <span>Create Draft Record</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
