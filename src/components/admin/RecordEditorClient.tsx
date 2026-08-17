'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AdminRecordDetail } from '@/server/admin/records-service';
import type { ReferenceDataResponse } from '@/server/admin/reference-service';

export default function RecordEditorClient({
  detail,
  refData,
  canEdit,
  userRole,
}: {
  detail: AdminRecordDetail;
  refData: ReferenceDataResponse;
  canEdit: boolean;
  userRole: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'claims' | 'sources' | 'financials' | 'beneficiaries' | 'timeline' | 'geography' | 'institutions' | 'indicators' | 'corrections' | 'history' | 'metadata'
  >('overview');

  const [record, setRecord] = useState(detail.record);
  const [profile, setProfile] = useState<any>(detail.profile || {});
  const [claims, setClaims] = useState(detail.claims);
  const [sources, setSources] = useState(detail.sources);
  const [financials, setFinancials] = useState(detail.financials);
  const [beneficiaries, setBeneficiaries] = useState(detail.beneficiaries);
  const [timeline, setTimeline] = useState(detail.timeline);

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Workflow Modal State
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [workflowAction, setWorkflowAction] = useState<string>('');
  const [workflowReason, setWorkflowReason] = useState<string>('');
  const [workflowQualification, setWorkflowQualification] = useState<string>('');

  // History State
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [fullHistoryData, setFullHistoryData] = useState<any | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Corrections State
  const [correctionsList, setCorrectionsList] = useState<any[]>([]);
  const [activeCorrection, setActiveCorrection] = useState<any | null>(null);
  const [showOpenCorrectionModal, setShowOpenCorrectionModal] = useState(false);
  const [newCorrection, setNewCorrection] = useState({
    correction_type: 'factual_error',
    reason: '',
    public_notice: '',
    title: detail.record.title,
    short_summary: detail.record.short_summary || '',
    full_description: detail.record.full_description || '',
    implementation_status: detail.record.implementation_status || 'implementation_ongoing',
  });

  const isPublished = (record.publication_status === 'published' || record.publication_status === 'corrected') && record.is_public;

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/admin/records/${record.id}/history`);
      const data = await res.json();
      if (res.ok) {
        setHistoryList(data.events || data.history || []);
        setFullHistoryData(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchCorrections = async () => {
    try {
      const res = await fetch(`/api/admin/records/${record.id}/corrections`);
      const data = await res.json();
      if (res.ok) {
        setActiveCorrection(data.active || null);
        setCorrectionsList(data.corrections || []);
      }
    } catch {
      // ignore
    }
  };

  React.useEffect(() => {
    fetchHistory();
    fetchCorrections();
  }, [record.id]);

  const handleOpenCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/records/${record.id}/corrections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
        body: JSON.stringify({
          correction_type: newCorrection.correction_type,
          reason: newCorrection.reason,
          public_notice: newCorrection.public_notice || undefined,
          expected_revision: (fullHistoryData?.currentRevision || record.current_revision || 1),
          changes: {
            title: newCorrection.title,
            short_summary: newCorrection.short_summary,
            full_description: newCorrection.full_description,
            implementation_status: newCorrection.implementation_status,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to open correction');
      setShowOpenCorrectionModal(false);
      setStatusMessage({ type: 'success', text: 'Audited correction opened successfully. You can now submit it for review.' });
      fetchCorrections();
      fetchHistory();
      setActiveTab('corrections');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleWorkflowTransition = async (action: string, reason?: string, qualification?: string) => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/records/${record.id}/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
        body: JSON.stringify({
          action,
          reason: reason || undefined,
          qualification: qualification || undefined,
          expected_updated_at: record.updated_at,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Workflow transition failed');
      }
      setRecord((prev) => ({
        ...prev,
        workflow_status: data.workflow_status,
        publication_status: data.publication_status,
        is_public: data.is_public,
        updated_at: data.updated_at,
      }));
      setStatusMessage({
        type: 'success',
        text: `Workflow action '${action.replace(/_/g, ' ')}' succeeded. Record is now '${data.workflow_status}' / '${data.publication_status}'.`,
      });
      setShowWorkflowModal(false);
      setWorkflowReason('');
      setWorkflowQualification('');
      fetchHistory();
      fetchCorrections();
      router.refresh();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };


  // Modals state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  // New Claim Form
  const [newClaim, setNewClaim] = useState({
    claim_type: 'infrastructure_output',
    claim_text: '',
    value_numeric: '',
    unit_code: '',
    data_value_nature: 'actual',
    verification_status: 'verified',
    limitations: '',
    linked_source_ids: [] as string[],
  });

  // New Source Form
  const [newSource, setNewSource] = useState({
    title: '',
    publisher_name: '',
    source_type: 'government_gazette',
    source_level: 1,
    original_url: '',
    visibility_class: 'public',
  });

  // New Financial Form
  const [newFinancial, setNewFinancial] = useState({
    financial_type: 'capital_allocation',
    amount: '',
    currency_code: 'NGN',
    reporting_period_label: '2024-Q2',
    nominal_or_real: 'nominal',
    methodology: '',
    limitations: '',
  });

  // New Beneficiary Form
  const [newBeneficiary, setNewBeneficiary] = useState({
    beneficiary_type: 'students',
    beneficiary_stage: 'disbursed',
    count_value: 0,
    unit: 'individual',
    cumulative: false,
    reporting_period_label: '2024-Q2',
  });

  // New Timeline Form
  const [newTimeline, setNewTimeline] = useState({
    event_type: 'milestone_reached',
    title: '',
    description: '',
    date_value: '',
    date_precision: 'exact_day',
  });

  // Handle Save Overview
  const handleSaveOverview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    setSaving(true);
    setStatusMessage(null);

    const payload: any = {
      record_type: record.record_type,
      title: record.title,
      slug: record.slug,
      short_summary: record.short_summary,
      full_description: record.full_description,
      lead_sector_id: record.lead_sector_id,
      lead_institution_id: record.lead_institution_id,
      implementation_status: record.implementation_status,
      geographic_scope: record.geographic_scope || 'national',
      announced_date: record.announced_date,
      announced_date_precision: record.announced_date_precision || 'exact_day',
      start_date: record.start_date,
      start_date_precision: record.start_date_precision || 'exact_day',
      completion_date: record.completion_date,
      completion_date_precision: record.completion_date_precision || 'exact_day',
      expected_updated_at: record.updated_at,
      sector_ids: record.lead_sector_id ? [record.lead_sector_id] : [],
      institution_ids: record.lead_institution_id ? [record.lead_institution_id] : [],
      geographic_unit_ids: [],
    };

    if (record.record_type === 'achievement') {
      payload.achievement_profile = profile;
    } else if (record.record_type === 'policy') {
      payload.policy_details = profile;
    } else if (record.record_type === 'project') {
      payload.project_details = profile;
    } else if (record.record_type === 'programme') {
      payload.programme_details = profile;
    }

    try {
      const res = await fetch(`/api/admin/records/${record.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-tat-admin-csrf': '1',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update record');
      }

      setRecord((prev) => ({ ...prev, updated_at: data.updated_at }));
      setStatusMessage({ type: 'success', text: 'Overview changes saved successfully.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // Add Claim Handler
  const handleAddClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/records/${record.id}/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
        body: JSON.stringify(newClaim),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save claim');
      setShowClaimModal(false);
      router.refresh();
      setStatusMessage({ type: 'success', text: 'Claim added successfully.' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add Source Handler
  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/records/${record.id}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
        body: JSON.stringify(newSource),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save source');
      setShowSourceModal(false);
      router.refresh();
      setStatusMessage({ type: 'success', text: 'Source added successfully.' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add Financial Handler
  const handleAddFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/records/${record.id}/financials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
        body: JSON.stringify(newFinancial),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save financial record');
      setShowFinancialModal(false);
      router.refresh();
      setStatusMessage({ type: 'success', text: 'Financial record added successfully.' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add Beneficiary Handler
  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/records/${record.id}/beneficiaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
        body: JSON.stringify(newBeneficiary),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save beneficiary record');
      setShowBeneficiaryModal(false);
      router.refresh();
      setStatusMessage({ type: 'success', text: 'Beneficiary record added successfully.' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add Timeline Handler
  const handleAddTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/records/${record.id}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
        body: JSON.stringify(newTimeline),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save timeline event');
      setShowTimelineModal(false);
      router.refresh();
      setStatusMessage({ type: 'success', text: 'Timeline event added successfully.' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '1. Overview', count: null },
    { id: 'claims', label: '2. Claims', count: claims.length },
    { id: 'sources', label: '3. Sources & Evidence', count: sources.length },
    { id: 'financials', label: '4. Financials', count: financials.length },
    { id: 'beneficiaries', label: '5. Beneficiaries', count: beneficiaries.length },
    { id: 'timeline', label: '6. Timeline', count: timeline.length },
    { id: 'geography', label: '7. Geography', count: detail.geographies.length },
    { id: 'institutions', label: '8. Institutions', count: detail.institutions.length },
    { id: 'indicators', label: '9. Indicators', count: null },
    { id: 'corrections', label: '10. Corrections', count: correctionsList.length },
    { id: 'history', label: '11. Version & Decision Trail', count: historyList.length },
    { id: 'metadata', label: '12. Metadata & Audit', count: null },
  ] as const;

  const currentWorkflowStatus = record.workflow_status || 'draft';
  const isDraftLocked = currentWorkflowStatus !== 'draft' && userRole !== 'super_admin' && !isPublished;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/admin" className="hover:text-emerald-400">Admin</Link>
            <span>/</span>
            <Link href="/admin/records" className="hover:text-emerald-400">Records</Link>
            <span>/</span>
            <span className="text-white font-mono">{record.slug}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-3">
            <span>{record.title}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono capitalize bg-slate-800 text-slate-300 border border-slate-700">
              {record.record_type}
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-xs">
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
            currentWorkflowStatus === 'draft'
              ? 'bg-slate-950 border-slate-700 text-slate-300'
              : currentWorkflowStatus === 'evidence_review'
              ? 'bg-amber-950/80 border-amber-800/60 text-amber-300'
              : currentWorkflowStatus === 'ready_for_publication'
              ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/80 border-rose-800/60 text-rose-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            <span className="uppercase">{currentWorkflowStatus.replace(/_/g, ' ')}</span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border ${
            record.publication_status === 'published' || record.publication_status === 'corrected'
              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            {record.is_public ? `PUBLIC (v${record.current_revision || 1})` : 'INTERNAL'}
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
            ROLE: {userRole.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Workflow Transition Action Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs">
          <span className="font-semibold text-white">Workflow Phase: </span>
          <span className="font-mono text-slate-300 capitalize">{currentWorkflowStatus.replace(/_/g, ' ')}</span>
          <span className="text-slate-500 mx-2">•</span>
          <span className="text-slate-400">Publication: </span>
          <span className="font-mono text-slate-300 uppercase">{record.publication_status}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Researcher / Super Admin: Submit for Review (only when in draft) */}
          {currentWorkflowStatus === 'draft' && !isPublished && (userRole === 'researcher' || userRole === 'super_admin') && (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleWorkflowTransition('submit_for_review')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-950/30"
            >
              <span>🚀</span>
              <span>Submit for Review</span>
            </button>
          )}

          {/* Published Record: Open Audited Correction */}
          {isPublished && (userRole === 'researcher' || userRole === 'super_admin') && (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                if (activeCorrection) {
                  setActiveTab('corrections');
                } else {
                  setShowOpenCorrectionModal(true);
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-950/30"
            >
              <span>✏️</span>
              <span>{activeCorrection ? 'View Active Correction' : 'Open Audited Correction'}</span>
            </button>
          )}

          {/* Reviewer / Super Admin: Review decisions */}
          {currentWorkflowStatus === 'evidence_review' && !isPublished && (userRole === 'reviewer' || userRole === 'super_admin') && (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setWorkflowAction('approve_review');
                  setShowWorkflowModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span>✅</span>
                <span>Approve Review</span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setWorkflowAction('return_for_changes');
                  setShowWorkflowModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-700/50 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <span>↩️</span>
                <span>Return for Changes</span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setWorkflowAction('reject_review');
                  setShowWorkflowModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <span>❌</span>
                <span>Reject</span>
              </button>
            </>
          )}

          {/* Publisher / Super Admin: Publication decisions */}
          {currentWorkflowStatus === 'ready_for_publication' && !isPublished && (record.publication_status === 'publishable' || record.publication_status === 'publishable_with_qualification') && (userRole === 'publisher' || userRole === 'super_admin') && (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleWorkflowTransition('publish')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-950/30"
              >
                <span>🌐</span>
                <span>Publish to Public Catalog</span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setWorkflowAction('return_for_changes');
                  setShowWorkflowModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-700/50 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <span>↩️</span>
                <span>Return to Review</span>
              </button>
            </>
          )}

          {/* Publisher / Super Admin: Unpublish */}
          {isPublished && (userRole === 'publisher' || userRole === 'super_admin') && (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setWorkflowAction('unpublish');
                setShowWorkflowModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span>⚠️</span>
              <span>Unpublish Record</span>
            </button>
          )}
        </div>
      </div>

      {isPublished && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 flex items-start justify-between gap-4 text-amber-200 text-xs">
          <div className="flex items-start gap-3">
            <span className="text-lg">🔒</span>
            <div>
              <div className="font-bold text-sm text-amber-300">Published Record Lock Active (Revision #{record.current_revision || 1})</div>
              <div className="mt-0.5 text-amber-200/80">
                Published information is locked against silent edits to ensure public accountability and data integrity. To make modifications, open a peer-reviewed correction workflow.
              </div>
            </div>
          </div>
          {(userRole === 'researcher' || userRole === 'super_admin') && !activeCorrection && (
            <button
              type="button"
              onClick={() => setShowOpenCorrectionModal(true)}
              className="shrink-0 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              Open Correction
            </button>
          )}
        </div>
      )}

      {isDraftLocked && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-3">
          <span className="text-base">🔒</span>
          <div>
            <strong>Record Locked for Editing:</strong> This record is currently in <strong>{currentWorkflowStatus.replace(/_/g, ' ')}</strong> state. Direct content mutations are restricted until it is returned to draft.
          </div>
        </div>
      )}

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/80 border-rose-800 text-rose-300'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Navigation Bar */}
      <div className="flex overflow-x-auto border-b border-slate-800 gap-1 pb-px scrollbar-thin">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 text-xs font-medium rounded-t-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === t.id
                ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-500 border-x border-slate-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <span>{t.label}</span>
            {t.count !== null && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <form onSubmit={handleSaveOverview} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label htmlFor="edit-title" className="block font-medium text-slate-300 mb-1">Title</label>
              <input
                id="edit-title"
                disabled={!canEdit || isPublished}
                value={record.title}
                onChange={(e) => setRecord({ ...record, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white disabled:opacity-50 text-sm font-semibold"
              />
            </div>


            <div>
              <label htmlFor="edit-slug" className="block font-medium text-slate-300 mb-1">Slug</label>
              <input
                id="edit-slug"
                disabled={!canEdit}
                value={record.slug}
                onChange={(e) => setRecord({ ...record, slug: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="edit-status" className="block font-medium text-slate-300 mb-1">Implementation Status</label>
              <select
                id="edit-status"
                disabled={!canEdit}
                value={record.implementation_status}
                onChange={(e) => setRecord({ ...record, implementation_status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white disabled:opacity-50"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="ongoing_periodic">Ongoing Periodic</option>
                <option value="suspended">Suspended</option>
                <option value="under_review">Under Review</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="edit-summary" className="block font-medium text-slate-300 mb-1">Short Summary</label>
              <textarea
                id="edit-summary"
                rows={3}
                disabled={!canEdit}
                value={record.short_summary || ''}
                onChange={(e) => setRecord({ ...record, short_summary: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white disabled:opacity-50"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="edit-desc" className="block font-medium text-slate-300 mb-1">Full Description</label>
              <textarea
                id="edit-desc"
                rows={6}
                disabled={!canEdit}
                value={record.full_description || ''}
                onChange={(e) => setRecord({ ...record, full_description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="edit-sector" className="block font-medium text-slate-300 mb-1">Lead Sector</label>
              <select
                id="edit-sector"
                disabled={!canEdit}
                value={record.lead_sector_id || ''}
                onChange={(e) => setRecord({ ...record, lead_sector_id: e.target.value || null })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white disabled:opacity-50"
              >
                <option value="">None Selected</option>
                {refData.sectors.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-inst" className="block font-medium text-slate-300 mb-1">Lead Institution</label>
              <select
                id="edit-inst"
                disabled={!canEdit}
                value={record.lead_institution_id || ''}
                onChange={(e) => setRecord({ ...record, lead_institution_id: e.target.value || null })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white disabled:opacity-50"
              >
                <option value="">None Selected</option>
                {refData.institutions.map((i) => (
                  <option key={i.id} value={i.id}>{i.canonical_name}</option>
                ))}
              </select>
            </div>
          </div>

          {canEdit && (
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                id="save-overview-btn"
                disabled={saving}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs shadow-md transition-all"
              >
                {saving ? 'Saving...' : 'Save Overview'}
              </button>
            </div>
          )}
        </form>
      )}

      {/* 2. CLAIMS TAB */}
      {activeTab === 'claims' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Factual Evidence Claims</h2>
              <p className="text-xs text-slate-400">Verifiable, quantitative, and statutory claims linked to this record.</p>
            </div>
            {canEdit && (
              <button
                type="button"
                id="add-claim-btn"
                onClick={() => setShowClaimModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                + Add Claim
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Claim Text</th>
                  <th className="pb-2">Value</th>
                  <th className="pb-2">Origin</th>
                  <th className="pb-2">Verification</th>
                  <th className="pb-2">Sources</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">No claims attached yet.</td>
                  </tr>
                ) : (
                  claims.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 font-mono text-[11px] text-slate-300">{c.claim_type}</td>
                      <td className="py-3 text-white max-w-sm">{c.claim_text}</td>
                      <td className="py-3 font-mono text-emerald-400">
                        {c.value_numeric ? `${c.value_numeric} ${c.unit_code || ''}` : c.value_text || '—'}
                      </td>
                      <td className="py-3 capitalize text-slate-400">{c.source_origin.replace('_', ' ')}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 capitalize">
                          {c.verification_status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-slate-400">{c.sources.length} linked</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SOURCES TAB */}
      {activeTab === 'sources' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Source Documents & Evidence Links</h2>
              <p className="text-xs text-slate-400">Official gazettes, ministry releases, and audit records supporting claims.</p>
            </div>
            {canEdit && (
              <button
                type="button"
                id="add-source-btn"
                onClick={() => setShowSourceModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                + Add Source
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Publisher</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Level</th>
                  <th className="pb-2">URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sources.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">No sources linked yet.</td>
                  </tr>
                ) : (
                  sources.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 font-medium text-white max-w-xs">{s.title}</td>
                      <td className="py-3 text-slate-300">{s.publisher_name}</td>
                      <td className="py-3 capitalize text-slate-400">{s.source_type.replace('_', ' ')}</td>
                      <td className="py-3 font-mono text-emerald-400">Level {s.source_level}</td>
                      <td className="py-3 text-slate-400 truncate max-w-[200px]">
                        <a href={s.original_url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                          {s.original_url}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. FINANCIALS TAB */}
      {activeTab === 'financials' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Financial & Capital Allocation Data</h2>
              <p className="text-xs text-slate-400">Approved allocations, disbursements, and contract commitments.</p>
            </div>
            {canEdit && (
              <button
                type="button"
                id="add-financial-btn"
                onClick={() => setShowFinancialModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                + Add Financial Record
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Currency</th>
                  <th className="pb-2">Period</th>
                  <th className="pb-2">Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {financials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">No financial records attached.</td>
                  </tr>
                ) : (
                  financials.map((f) => (
                    <tr key={f.id}>
                      <td className="py-3 font-mono capitalize text-slate-300">{f.financial_type.replace('_', ' ')}</td>
                      <td className="py-3 font-bold font-mono text-emerald-400">{f.amount}</td>
                      <td className="py-3 font-mono text-slate-400">{f.currency_code}</td>
                      <td className="py-3 text-slate-400">{f.reporting_period_label || '—'}</td>
                      <td className="py-3 text-slate-400 capitalize">{f.nominal_or_real}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. BENEFICIARIES TAB */}
      {activeTab === 'beneficiaries' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Beneficiary Records</h2>
              <p className="text-xs text-slate-400">Targeted, registered, and disbursement-verified citizen counts.</p>
            </div>
            {canEdit && (
              <button
                type="button"
                id="add-beneficiary-btn"
                onClick={() => setShowBeneficiaryModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                + Add Beneficiary Record
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-2">Beneficiary Type</th>
                  <th className="pb-2">Stage</th>
                  <th className="pb-2">Count</th>
                  <th className="pb-2">Unit</th>
                  <th className="pb-2">Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {beneficiaries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">No beneficiary records attached.</td>
                  </tr>
                ) : (
                  beneficiaries.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 font-medium text-white">{b.beneficiary_type}</td>
                      <td className="py-3 capitalize text-amber-400 font-mono">{b.beneficiary_stage}</td>
                      <td className="py-3 font-bold font-mono text-emerald-400">{b.count_value.toLocaleString()}</td>
                      <td className="py-3 text-slate-400">{b.unit}</td>
                      <td className="py-3 text-slate-400">{b.reporting_period_label || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Timeline & Milestone Events</h2>
              <p className="text-xs text-slate-400">Chronological history from announcement to completion.</p>
            </div>
            {canEdit && (
              <button
                type="button"
                id="add-timeline-btn"
                onClick={() => setShowTimelineModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                + Add Timeline Event
              </button>
            )}
          </div>

          <div className="space-y-3">
            {timeline.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">No timeline events recorded.</div>
            ) : (
              timeline.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono capitalize">
                        {t.event_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-white">{t.title}</span>
                    </div>
                    {t.description && <p className="text-xs text-slate-400">{t.description}</p>}
                  </div>
                  <div className="text-right shrink-0 font-mono text-[11px] text-slate-400">
                    {t.date_value || t.reporting_period_label || 'Date TBD'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 7. GEOGRAPHY TAB */}
      {activeTab === 'geography' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <h2 className="text-base font-bold text-white">Geographic Coverage Units</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {detail.geographies.length === 0 ? (
              <div className="sm:col-span-3 text-slate-500 py-4">No specific geographic units associated (National Scope).</div>
            ) : (
              detail.geographies.map((g) => (
                <div key={g.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-white">{g.name}</div>
                  <div className="text-slate-400 font-mono text-[10px] capitalize">{g.geography_type} ({g.coverage_role})</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 8. INSTITUTIONS TAB */}
      {activeTab === 'institutions' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <h2 className="text-base font-bold text-white">Responsible Ministries, Departments & Agencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {detail.institutions.map((i) => (
              <div key={i.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{i.canonical_name}</div>
                  {i.short_name && <div className="text-slate-400 font-mono text-[11px]">{i.short_name}</div>}
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 capitalize">
                  {i.role_code}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. INDICATORS TAB */}
      {activeTab === 'indicators' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <h2 className="text-base font-bold text-white">Quantitative Indicator Linkages</h2>
          <p className="text-slate-400">Indicators linked to this record via verified evidence claims.</p>
          <div className="p-6 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
            Quantitative indicators are linked automatically through verified evidence claims in Section 2.
          </div>
        </div>
      )}

      {/* 10. CORRECTIONS TAB */}
      {activeTab === 'corrections' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Audited Corrections Workspace</h2>
              <p className="text-slate-400">Formal review and publication pipeline for corrections to published records.</p>
            </div>
            {isPublished && (userRole === 'researcher' || userRole === 'super_admin') && !activeCorrection && (
              <button
                type="button"
                onClick={() => setShowOpenCorrectionModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-950/30"
              >
                <span>+ Open New Correction</span>
              </button>
            )}
          </div>

          {/* Active Correction Workspace */}
          {activeCorrection ? (
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-900/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-800/80 text-amber-300 font-mono font-bold uppercase text-[11px]">
                    Correction {activeCorrection.lifecycle_status.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">{activeCorrection.external_id || activeCorrection.id}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                    Type: {activeCorrection.correction_type}
                  </span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  Created by {activeCorrection.creator_name || activeCorrection.creator_email || 'Researcher'}
                </div>
              </div>

              <div className="space-y-2">
                <div><strong>Reason:</strong> <span className="text-slate-300">{activeCorrection.reason}</span></div>
                {activeCorrection.public_notice && (
                  <div><strong>Public Notice:</strong> <span className="text-slate-300">{activeCorrection.public_notice}</span></div>
                )}
              </div>

              {/* Side-by-Side Diff */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                <h4 className="font-bold text-slate-200">Proposed Changes Comparison</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="font-bold text-slate-400 font-mono text-[11px]">Published State (v{record.current_revision || 1})</div>
                    <div className="space-y-1 text-slate-300">
                      <div><strong className="text-slate-400">Title:</strong> {record.title}</div>
                      <div><strong className="text-slate-400">Summary:</strong> {record.short_summary}</div>
                      <div><strong className="text-slate-400">Status:</strong> {record.implementation_status}</div>

                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                    <div className="font-bold text-amber-400 font-mono text-[11px]">Proposed Corrected State (v{(record.current_revision || 1) + 1})</div>
                    <div className="space-y-1 text-slate-200">
                      <div>
                        <strong className="text-slate-400">Title:</strong>{' '}
                        {(typeof activeCorrection.corrected_state === 'string' ? JSON.parse(activeCorrection.corrected_state) : activeCorrection.corrected_state)?.title || record.title}
                      </div>
                      <div>
                        <strong className="text-slate-400">Summary:</strong>{' '}
                        {(typeof activeCorrection.corrected_state === 'string' ? JSON.parse(activeCorrection.corrected_state) : activeCorrection.corrected_state)?.short_summary || record.short_summary}
                      </div>
                      <div>
                        <strong className="text-slate-400">Status:</strong>{' '}
                        {(typeof activeCorrection.corrected_state === 'string' ? JSON.parse(activeCorrection.corrected_state) : activeCorrection.corrected_state)?.implementation_status || record.implementation_status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Correction Lifecycle Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2">
                {activeCorrection.lifecycle_status === 'proposed' && (userRole === 'researcher' || userRole === 'super_admin') && (
                  <>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleWorkflowTransition('cancel_correction', 'Cancelled by author')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-medium"
                    >
                      Cancel Correction
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleWorkflowTransition('submit_correction')}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1"
                    >
                      <span>🚀</span>
                      <span>Submit Correction for Review</span>
                    </button>
                  </>
                )}

                {activeCorrection.lifecycle_status === 'under_review' && (userRole === 'reviewer' || userRole === 'super_admin') && (
                  <>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setWorkflowAction('return_correction');
                        setShowWorkflowModal(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium"
                    >
                      Return for Changes
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setWorkflowAction('reject_correction');
                        setShowWorkflowModal(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 font-medium border border-rose-800"
                    >
                      Reject Correction
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setWorkflowAction('approve_correction');
                        setShowWorkflowModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1"
                    >
                      <span>✅</span>
                      <span>Approve Correction</span>
                    </button>
                  </>
                )}

                {activeCorrection.lifecycle_status === 'approved' && (userRole === 'publisher' || userRole === 'super_admin') && (
                  <>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setWorkflowAction('return_correction');
                        setShowWorkflowModal(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium"
                    >
                      Return to Editorial Review
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleWorkflowTransition('publish_correction', 'Publisher released corrected revision into catalog')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1 shadow-lg shadow-emerald-950/30"
                    >
                      <span>🌐</span>
                      <span>Publish Corrected Revision (v{(record.current_revision || 1) + 1})</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60 font-mono">
              {isPublished
                ? 'No active correction in progress. Click "+ Open New Correction" to propose an audited revision.'
                : 'Corrections apply only to published records. Unpublish or edit directly in draft.'}
            </div>
          )}

          {/* Past Corrections Log */}
          <div className="space-y-3 pt-4">
            <h3 className="font-bold text-white text-sm">Corrections History Log</h3>
            {correctionsList.length === 0 ? (
              <div className="p-4 text-center text-slate-500 font-mono">No prior corrections on record.</div>
            ) : (
              correctionsList.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        c.lifecycle_status === 'published'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : c.lifecycle_status === 'rejected'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {c.lifecycle_status}
                      </span>
                      <span className="text-slate-300 text-xs font-bold">{c.correction_type}</span>
                    </div>
                    <p className="text-slate-300 font-sans text-xs">{c.reason}</p>
                    {c.public_notice && <p className="text-slate-400 font-sans text-xs italic">Notice: {c.public_notice}</p>}
                  </div>
                  <div className="text-right text-[11px] text-slate-400 shrink-0">
                    <div>{new Date(c.created_at).toLocaleDateString()}</div>
                    <div>By: {c.creator_name || 'Staff'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 11. VERSION & DECISION TRAIL TAB */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Unified Record History & Decision Trail</h2>
              <p className="text-slate-400">Append-only audit trail: Revisions, Editorial Approval Decisions, and Correction Milestones.</p>
            </div>
            <button
              type="button"
              onClick={fetchHistory}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
            >
              Refresh Trail
            </button>
          </div>

          {loadingHistory ? (
            <div className="p-8 text-center text-slate-500 font-mono">Loading history trail...</div>
          ) : historyList.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60 font-mono">
              No history events recorded for this record yet.
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map((h, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      {h.eventType === 'review_decision' ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          h.decision === 'approved' || h.decision === 'approved_with_qualification'
                            ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                            : h.decision === 'revision_requested'
                            ? 'bg-amber-950 border border-amber-800 text-amber-300'
                            : 'bg-rose-950 border border-rose-800 text-rose-300'
                        }`}>
                          Gate: {h.gateCode} ({h.decision.replace(/_/g, ' ')})
                        </span>
                      ) : h.eventType === 'version_snapshot' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 border border-blue-800 text-blue-300">
                          Revision #{h.versionNumber} Snapshot
                        </span>
                      ) : h.eventType === 'correction_milestone' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 border border-amber-800 text-amber-300">
                          Correction Milestone ({h.lifecycleStatus})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                          Record Created
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {new Date(h.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-slate-200 font-sans text-xs">
                    {h.rationale || h.description || h.changeReason || h.reason || 'No description provided'}
                  </div>

                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3 pt-1">
                    {h.reviewerName && <span>Reviewer: {h.reviewerName}</span>}
                    {h.changedByName && <span>Changed By: {h.changedByName}</span>}
                    {h.creatorName && <span>Created By: {h.creatorName}</span>}
                    {h.revision && <span>Revision: #{h.revision}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 12. METADATA TAB */}
      {activeTab === 'metadata' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs font-mono">
          <h2 className="text-base font-bold text-white font-sans">System Metadata & Audit Trail</h2>
          <div className="space-y-2 text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div><strong>Record UUID:</strong> {record.id}</div>
            <div><strong>Canonical Schema:</strong> database/schema.sql (PostgreSQL 17)</div>
            <div><strong>Current Revision:</strong> #{record.current_revision || 1}</div>
            <div><strong>Workflow Status:</strong> {currentWorkflowStatus}</div>
            <div><strong>Publication Status:</strong> {record.publication_status}</div>
            <div><strong>Public Visibility:</strong> {record.is_public ? 'PUBLIC (Published)' : 'FALSE (Draft Isolated)'}</div>
            <div><strong>Created Timestamp:</strong> {record.created_at}</div>
            <div><strong>Updated Timestamp:</strong> {record.updated_at}</div>
            <div><strong>Database Identity:</strong> tat_admin_writer (Least Privilege)</div>
          </div>
        </div>
      )}

      {/* MODAL: OPEN AUDITED CORRECTION */}
      {showOpenCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleOpenCorrection} className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white font-sans">Open Audited Correction Workflow</h3>
            <p className="text-slate-400">
              Opening a correction creates a tracked revision draft. Changes undergo full editorial review before publication.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Correction Type *</label>
                <select
                  value={newCorrection.correction_type}
                  onChange={(e) => setNewCorrection({ ...newCorrection, correction_type: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="factual_error">Factual Error</option>
                  <option value="numerical_update">Numerical Update</option>
                  <option value="status_correction">Status Correction</option>
                  <option value="date_refinement">Date Refinement</option>
                  <option value="source_replacement">Source Replacement</option>
                  <option value="retraction">Retraction</option>
                  <option value="typographical">Typographical</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Target Revision</label>
                <input
                  disabled
                  value={`Revision #${(record.current_revision || 1) + 1}`}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-400 font-mono disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Reason / Rationale (Mandatory, min 5 chars) *</label>
              <textarea
                required
                rows={2}
                value={newCorrection.reason}
                onChange={(e) => setNewCorrection({ ...newCorrection, reason: e.target.value })}
                placeholder="Explain the precise need for this correction and what source evidence warrants it..."
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Public Notice (Optional, visible to public catalog readers)</label>
              <input
                value={newCorrection.public_notice}
                onChange={(e) => setNewCorrection({ ...newCorrection, public_notice: e.target.value })}
                placeholder="e.g. Updated disbursement figures based on Q3 audited gazette release."
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <h4 className="font-bold text-white">Proposed Modifications</h4>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Title</label>
                <input
                  value={newCorrection.title}
                  onChange={(e) => setNewCorrection({ ...newCorrection, title: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Short Summary</label>
                <textarea
                  rows={2}
                  value={newCorrection.short_summary}
                  onChange={(e) => setNewCorrection({ ...newCorrection, short_summary: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowOpenCorrectionModal(false)}
                className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || newCorrection.reason.trim().length < 5}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
              >
                Create Correction Draft
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: WORKFLOW TRANSITION ACTION */}
      {showWorkflowModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white font-sans capitalize">
              Confirm Action: {workflowAction.replace(/_/g, ' ')}
            </h3>

            {workflowAction === 'approve_review' && (
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Editorial Qualification (Optional)
                </label>
                <input
                  value={workflowQualification}
                  onChange={(e) => setWorkflowQualification(e.target.value)}
                  placeholder="e.g. Scope verified for Q1–Q3; awaiting Q4 gazette"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            )}

            {(workflowAction === 'return_for_changes' || workflowAction === 'reject_review' || workflowAction === 'unpublish' || workflowAction === 'return_correction' || workflowAction === 'reject_correction') && (
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Reason / Rationale (Mandatory, min 5 chars) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={workflowReason}
                  onChange={(e) => setWorkflowReason(e.target.value)}
                  placeholder="Describe why this action is being taken for the audit trail..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            )}

            {(workflowAction === 'approve_review' || workflowAction === 'approve_correction') && (
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Reviewer Rationale (Optional)
                </label>
                <textarea
                  rows={2}
                  value={workflowReason}
                  onChange={(e) => setWorkflowReason(e.target.value)}
                  placeholder="Notes on verified evidence package..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowWorkflowModal(false);
                  setWorkflowReason('');
                  setWorkflowQualification('');
                }}
                className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  saving ||
                  ((workflowAction === 'return_for_changes' ||
                    workflowAction === 'reject_review' ||
                    workflowAction === 'unpublish' ||
                    workflowAction === 'return_correction' ||
                    workflowAction === 'reject_correction') &&
                    workflowReason.trim().length < 5)
                }
                onClick={() => handleWorkflowTransition(workflowAction, workflowReason, workflowQualification)}
                className={`px-4 py-2 text-white rounded-lg font-semibold ${
                  workflowAction.includes('reject') || workflowAction.includes('unpublish')
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                Confirm {workflowAction.replace(/_/g, ' ')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CLAIM */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleAddClaim} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white font-sans">Add Factual Evidence Claim</h3>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Claim Text *</label>
              <textarea
                required
                rows={3}
                value={newClaim.claim_text}
                onChange={(e) => setNewClaim({ ...newClaim, claim_text: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Claim Type</label>
                <input
                  value={newClaim.claim_type}
                  onChange={(e) => setNewClaim({ ...newClaim, claim_type: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Numeric Value</label>
                <input
                  value={newClaim.value_numeric}
                  onChange={(e) => setNewClaim({ ...newClaim, value_numeric: e.target.value })}
                  placeholder="e.g. 50000000000"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Link Existing Sources</label>
              <div className="max-h-32 overflow-y-auto space-y-1 p-2 bg-slate-950 rounded-lg border border-slate-800">
                {sources.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={newClaim.linked_source_ids.includes(s.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setNewClaim((prev) => ({
                          ...prev,
                          linked_source_ids: checked
                            ? [...prev.linked_source_ids, s.id]
                            : prev.linked_source_ids.filter((id) => id !== s.id),
                        }));
                      }}
                    />
                    <span className="truncate">{s.title}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button type="button" onClick={() => setShowClaimModal(false)} className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Save Claim</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD SOURCE */}
      {showSourceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleAddSource} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white font-sans">Add Source Citation</h3>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Source Title *</label>
              <input
                required
                value={newSource.title}
                onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
                placeholder="Official Gazette or Ministry Document Title"
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Publisher Name *</label>
                <input
                  required
                  value={newSource.publisher_name}
                  onChange={(e) => setNewSource({ ...newSource, publisher_name: e.target.value })}
                  placeholder="e.g. Federal Ministry of Works"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Source Level</label>
                <select
                  value={newSource.source_level}
                  onChange={(e) => setNewSource({ ...newSource, source_level: parseInt(e.target.value, 10) })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="1">Level 1: Gazette / Primary Statutory</option>
                  <option value="2">Level 2: Official Ministry Release</option>
                  <option value="3">Level 3: Verified External Report</option>
                  <option value="4">Level 4: Secondary News</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Original URL *</label>
              <input
                required
                type="url"
                value={newSource.original_url}
                onChange={(e) => setNewSource({ ...newSource, original_url: e.target.value })}
                placeholder="https://works.gov.ng/gazette-2024.pdf"
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button type="button" onClick={() => setShowSourceModal(false)} className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Save Source</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD FINANCIAL */}
      {showFinancialModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleAddFinancial} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white font-sans">Add Financial Record</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Financial Type</label>
                <select
                  value={newFinancial.financial_type}
                  onChange={(e) => setNewFinancial({ ...newFinancial, financial_type: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="capital_allocation">Capital Allocation</option>
                  <option value="actual_disbursement">Actual Disbursement</option>
                  <option value="fec_approved_contract">FEC Approved Contract</option>
                  <option value="appropriated_amount">Appropriated Amount</option>
                  <option value="revenue_generated">Revenue Generated</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Amount (Numeric Text) *</label>
                <input
                  required
                  value={newFinancial.amount}
                  onChange={(e) => setNewFinancial({ ...newFinancial, amount: e.target.value })}
                  placeholder="50000000000.00"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button type="button" onClick={() => setShowFinancialModal(false)} className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Save Financial</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD BENEFICIARY */}
      {showBeneficiaryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleAddBeneficiary} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white font-sans">Add Beneficiary Record</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Beneficiary Type *</label>
                <input
                  required
                  value={newBeneficiary.beneficiary_type}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, beneficiary_type: e.target.value })}
                  placeholder="e.g. Tertiary Students"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Beneficiary Stage</label>
                <select
                  value={newBeneficiary.beneficiary_stage}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, beneficiary_stage: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="targeted">Targeted</option>
                  <option value="registered">Registered</option>
                  <option value="verified">Verified</option>
                  <option value="disbursed">Disbursed</option>
                  <option value="completed">Completed</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Count Value *</label>
                <input
                  required
                  type="number"
                  value={newBeneficiary.count_value}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, count_value: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Unit</label>
                <input
                  value={newBeneficiary.unit}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, unit: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button type="button" onClick={() => setShowBeneficiaryModal(false)} className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Save Beneficiary</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD TIMELINE */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleAddTimeline} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white font-sans">Add Milestone Timeline Event</h3>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Event Title *</label>
              <input
                required
                value={newTimeline.title}
                onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })}
                placeholder="e.g. FEC Approves Phase 1 Construction"
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Event Type</label>
                <select
                  value={newTimeline.event_type}
                  onChange={(e) => setNewTimeline({ ...newTimeline, event_type: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="announced">Announced</option>
                  <option value="approved">Approved</option>
                  <option value="flag_off">Flag Off</option>
                  <option value="commenced">Commenced</option>
                  <option value="milestone_reached">Milestone Reached</option>
                  <option value="commissioned">Commissioned</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={newTimeline.date_value}
                  onChange={(e) => setNewTimeline({ ...newTimeline, date_value: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={newTimeline.description}
                onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button type="button" onClick={() => setShowTimelineModal(false)} className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Save Milestone</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

