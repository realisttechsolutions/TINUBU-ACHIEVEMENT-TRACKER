import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminRecordsManager } from '@/admin-service/records';
import type { VerifiedStaffContext } from '@/admin-service/auth';
import type { AdminControlPlaneDb } from '@/admin-service/db';


describe('Authoritative Corrections & Version History Lifecycle', () => {
  let mockDb: any;
  let manager: AdminRecordsManager;

  const mockResearcher: VerifiedStaffContext = {
    uid: 'user-researcher-1',
    email: 'researcher@tat.gov.ng',
    role: 'researcher',
  };

  const mockReviewer: VerifiedStaffContext = {
    uid: 'user-reviewer-1',
    email: 'reviewer@tat.gov.ng',
    role: 'reviewer',
  };

  const mockPublisher: VerifiedStaffContext = {
    uid: 'user-publisher-1',
    email: 'publisher@tat.gov.ng',
    role: 'publisher',
  };

  const mockSuperAdmin: VerifiedStaffContext = {
    uid: 'user-superadmin-1',
    email: 'superadmin@tat.gov.ng',
    role: 'super_admin',
  };

  // Mock Database In-Memory State
  let recordState: any;
  let claimsState: any[];
  let financialsState: any[];
  let beneficiariesState: any[];
  let timelineState: any[];
  let correctionsState: any[];
  let reviewDecisions: any[];
  let recordVersions: any[];
  let actorProfiles: any[];

  beforeEach(() => {
    recordState = {
      id: '00000000-0000-4000-8000-000000000001',
      external_id: 'REC-00000001',
      slug: 'test-lagos-calabar-coastal-highway',
      record_type: 'project',
      title: 'Lagos-Calabar Coastal Highway Section 1',
      summary: 'Initial published summary of coastal highway project',
      body: 'Full project description covering initial 47km section.',
      implementation_status: 'implementation_ongoing',
      verification_status: 'verified',
      workflow_status: 'ready_for_publication',
      publication_status: 'published',
      is_public: true,
      current_revision: 1,
      updated_at: '2026-08-17T10:00:00.000Z',
      published_at: '2026-08-17T10:00:00.000Z',
      created_by: '00000000-0000-4000-8000-000000000001',
      created_at: '2026-08-17T08:00:00.000Z',
      qualification: null,
    };

    claimsState = [
      {
        id: '00000000-0000-4000-8000-000000000010',
        record_id: recordState.id,
        claim_text: '47km of Section 1 paved with concrete',
        workflow_status: 'published',
        verification_status: 'verified',
      },
    ];

    financialsState = [
      {
        id: '00000000-0000-4000-8000-000000000020',
        record_id: recordState.id,
        financial_type: 'capital_allocation',
        amount: '1060000000000.00',
        currency_code: 'NGN',
      },
    ];

    beneficiariesState = [];
    timelineState = [];
    correctionsState = [];
    reviewDecisions = [];
    recordVersions = [
      {
        id: '00000000-0000-4000-8000-000000000030',
        record_id: recordState.id,
        version_number: 1,
        changed_by: '00000000-0000-4000-8000-000000000003',
        change_reason: 'Initial public catalog release',
        snapshot_json: { title: recordState.title, short_summary: recordState.summary },
        diff_json: {},
        created_at: '2026-08-17T10:00:00.000Z',
      },
    ];

    actorProfiles = [
      { id: '00000000-0000-4000-8000-000000000001', firebase_uid: 'user-researcher-1', email: 'researcher@tat.gov.ng', display_name: 'Lead Researcher' },
      { id: '00000000-0000-4000-8000-000000000002', firebase_uid: 'user-reviewer-1', email: 'reviewer@tat.gov.ng', display_name: 'Lead Reviewer' },
      { id: '00000000-0000-4000-8000-000000000003', firebase_uid: 'user-publisher-1', email: 'publisher@tat.gov.ng', display_name: 'Chief Publisher' },
      { id: '00000000-0000-4000-8000-000000000004', firebase_uid: 'user-superadmin-1', email: 'superadmin@tat.gov.ng', display_name: 'Super Admin' },
    ];

    const mockTx = {
      query: vi.fn(async (sql: string, params?: any[]) => {
        const normalized = sql.trim().replace(/\s+/g, ' ');

        // Actor profile query
        if (normalized.includes('SELECT id FROM actor_profiles WHERE firebase_uid = $1 OR email = $2')) {
          const found = actorProfiles.find((a) => a.firebase_uid === params?.[0] || a.email === params?.[1]);
          return { rows: found ? [{ id: found.id }] : [] };
        }

        // Catch any forbidden mutation on actor_profiles
        if (normalized.includes('INSERT INTO actor_profiles') || normalized.includes('UPDATE actor_profiles')) {
          throw new Error('FORBIDDEN_ACTOR_PROFILES_MUTATION');
        }

        // Query record by id
        if (normalized.includes('FROM records WHERE id = $1') || normalized.includes('FROM records r WHERE r.id = $1') || normalized.includes('SELECT * FROM records WHERE id = $1')) {
          if (params?.[0] === recordState.id) {
            return { rows: [{ ...recordState }] };
          }
          return { rows: [] };
        }


        // Child records snapshot queries
        if (normalized.includes('SELECT * FROM evidence_claims WHERE record_id = $1')) {
          return { rows: claimsState.filter((c) => c.record_id === params?.[0]) };
        }
        if (normalized.includes('SELECT * FROM financial_records WHERE record_id = $1')) {
          return { rows: financialsState.filter((f) => f.record_id === params?.[0]) };
        }
        if (normalized.includes('SELECT * FROM beneficiary_records WHERE record_id = $1')) {
          return { rows: beneficiariesState.filter((b) => b.record_id === params?.[0]) };
        }
        if (normalized.includes('SELECT * FROM timeline_events WHERE record_id = $1')) {
          return { rows: timelineState.filter((t) => t.record_id === params?.[0]) };
        }

        // Check active correction query (chain-aware resolution with CTE)
        if (normalized.includes('WITH latest_chain_states AS') || normalized.includes('FROM latest_chain_states') || normalized.includes('SELECT id, lifecycle_status FROM corrections WHERE record_id = $1')) {
          const recordCorrections = correctionsState.filter((c) => c.record_id === params?.[0]);
          const chainsMap = new Map<string, any>();
          for (const c of recordCorrections) {
            const chainId = c.original_state?.chain_id || c.corrected_state?.chain_id || c.id;
            chainsMap.set(chainId, c); // Last appended row for this chain is stored
          }
          const activeChains = Array.from(chainsMap.values()).filter((c) =>
            ['proposed', 'under_review', 'approved'].includes(c.lifecycle_status),
          );
          return { rows: activeChains.slice(-1) };
        }

        // Insert into corrections
        if (normalized.includes('INSERT INTO corrections')) {
          const origParsed = typeof params?.[6] === 'string' ? JSON.parse(params?.[6]) : params?.[6];
          const corrParsed = typeof params?.[7] === 'string' ? JSON.parse(params?.[7]) : params?.[7];
          const statusMatch = normalized.includes('\'under_review\'')
            ? 'under_review'
            : normalized.includes('\'approved\'')
            ? 'approved'
            : normalized.includes('\'rejected\'')
            ? 'rejected'
            : normalized.includes('\'published\'')
            ? 'published'
            : 'proposed';

          const newCorr = {
            id: params?.[0],
            external_id: params?.[1],
            record_id: params?.[2],
            claim_id: params?.[3],
            source_id: params?.[4],
            correction_type: params?.[5],
            original_state: origParsed,
            corrected_state: corrParsed,
            reason: params?.[8],
            lifecycle_status: statusMatch,
            public_notice: params?.[9] || null,
            created_by: params?.[10] || params?.[9],
            created_at: new Date().toISOString(),
          };
          correctionsState.push(newCorr);
          return { rows: [{ id: newCorr.id }] };
        }


        // Insert into review_decisions
        if (normalized.includes('INSERT INTO review_decisions')) {
          const newDec = {
            id: params?.[0],
            external_id: params?.[1],
            record_id: params?.[2],
            record_revision: params?.[3],
            gate_code: normalized.includes('gate_3_automated_data_readiness')
              ? 'gate_3_automated_data_readiness'
              : normalized.includes('gate_4_editorial_human_approval')
              ? 'gate_4_editorial_human_approval'
              : 'gate_5_publication_stewardship',
            decision: params?.[4] || 'approved',
            reviewer_id: params?.[5] || params?.[4],
            rationale: params?.[6] || params?.[5],
            decided_at: new Date().toISOString(),
          };
          reviewDecisions.push(newDec);
          return { rows: [{ id: newDec.id }] };
        }

        // Check Gate 4 approval decision
        if (normalized.includes('FROM review_decisions WHERE record_id = $1 AND record_revision = $2 AND gate_code = \'gate_4_editorial_human_approval\'')) {
          const found = reviewDecisions.filter(
            (rd) =>
              rd.record_id === params?.[0] &&
              rd.record_revision === params?.[1] &&
              rd.gate_code === 'gate_4_editorial_human_approval' &&
              ['approved', 'approved_with_qualification'].includes(rd.decision),
          );
          return { rows: found.slice(-1) };
        }

        // Insert into record_versions
        if (normalized.includes('INSERT INTO record_versions')) {
          const newVer = {
            id: params?.[0],
            record_id: params?.[1],
            version_number: params?.[2],
            changed_by: params?.[3],
            change_reason: params?.[4],
            snapshot_json: typeof params?.[5] === 'string' ? JSON.parse(params?.[5]) : params?.[5],
            diff_json: typeof params?.[6] === 'string' ? JSON.parse(params?.[6]) : params?.[6],
            created_at: new Date().toISOString(),
          };
          recordVersions.push(newVer);
          return { rows: [{ id: newVer.id }] };
        }

        // Update records on publish_correction
        if (normalized.includes('UPDATE records SET title = $1, slug = $2, summary = $3, body = $4, implementation_status = $5, current_revision = $6, publication_status = \'corrected\', verification_status = \'corrected\'')) {
          recordState.title = params?.[0];
          recordState.slug = params?.[1];
          recordState.summary = params?.[2];
          recordState.body = params?.[3];
          recordState.implementation_status = params?.[4];
          recordState.current_revision = params?.[5];
          recordState.publication_status = 'corrected';
          recordState.verification_status = 'corrected';
          recordState.workflow_status = 'ready_for_publication';
          recordState.is_public = true;
          recordState.updated_at = new Date().toISOString();
          return { rows: [{ updated_at: recordState.updated_at }] };
        }

        // Insert timeline correction event
        if (normalized.includes('INSERT INTO timeline_events')) {
          const newTl = {
            id: params?.[0],
            record_id: params?.[2],
            event_type: 'correction',
            title: params?.[3],
            description: params?.[4],
            is_public: true,
          };
          timelineState.push(newTl);
          return { rows: [{ id: newTl.id }] };
        }

        // Touch records updated_at
        if (normalized.includes('UPDATE records SET updated_at = CURRENT_TIMESTAMP WHERE id = $1')) {
          recordState.updated_at = new Date().toISOString();
          return { rows: [{ updated_at: recordState.updated_at }] };
        }

        if (normalized.includes('SELECT updated_at::text FROM records WHERE id = $1')) {
          return { rows: [{ updated_at: recordState.updated_at }] };
        }

        // Full history queries
        if (normalized.includes('SELECT rv.*, ap.display_name AS changed_by_name')) {
          return { rows: recordVersions };
        }
        if (normalized.includes('SELECT rd.*, ap.display_name AS reviewer_name')) {
          return { rows: reviewDecisions };
        }
        if (normalized.includes('SELECT c.*, ap.display_name AS creator_name')) {
          return { rows: correctionsState };
        }

        return { rows: [] };
      }),
    };

    mockDb = {
      query: vi.fn(async (sql: string, params?: any[]) => mockTx.query(sql, params)),
      withTransaction: vi.fn(async (callback: (tx: any) => Promise<any>) => callback(mockTx)),
    };

    manager = new AdminRecordsManager(mockDb as unknown as AdminControlPlaneDb);
  });

  // 1. Positive Correction Lifecycle Test
  it('executes end-to-end positive correction lifecycle: open -> submit -> return -> resubmit -> approve -> publish', async () => {
    // 1. Open Correction as Researcher
    const openRes = await manager.openCorrection(
      recordState.id,
      {
        correction_type: 'numerical_update',
        reason: 'Updated highway pavement length based on certified Ministry inspection report',
        public_notice: 'Revised concrete section from 47km to 52km after Stage 1 completion.',
        expected_revision: 1,
        changes: {
          title: 'Lagos-Calabar Coastal Highway Section 1 (52km)',
          short_summary: 'Updated summary reflecting verified 52km concrete pavement.',
        },
      },
      mockResearcher,
    );

    expect(openRes.success).toBe(true);
    expect(openRes.status).toBe('proposed');
    expect(openRes.current_revision).toBe(1);
    expect(openRes.target_revision).toBe(2);
    expect(correctionsState.length).toBe(1);

    // 2. Submit Correction for Review
    const submitRes = await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'submit_correction', reason: 'Submitting numerical update for reviewer verification' },
      mockResearcher,
    );
    expect(submitRes.success).toBe(true);
    expect(correctionsState[correctionsState.length - 1].lifecycle_status).toBe('under_review');

    // 3. Reviewer returns correction for additional clarification
    const returnRes = await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'return_correction', reason: 'Please attach specific FEC certificate reference in public notice.' },
      mockReviewer,
    );
    expect(returnRes.success).toBe(true);
    expect(correctionsState[correctionsState.length - 1].lifecycle_status).toBe('proposed');

    // 4. Researcher updates draft notice and resubmits
    await manager.updateCorrectionDraft(
      recordState.id,
      {
        public_notice: 'Revised concrete section from 47km to 52km per FEC approval FEC/2026/08/01.',
      },
      mockResearcher,
    );

    const resubmitRes = await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'submit_correction', reason: 'Resubmitted with FEC reference attached.' },
      mockResearcher,
    );
    expect(resubmitRes.success).toBe(true);
    expect(correctionsState[correctionsState.length - 1].lifecycle_status).toBe('under_review');

    // 5. Reviewer approves correction
    const approveRes = await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'approve_correction', qualification: 'Verified against FEC Gazette' },
      mockReviewer,
    );
    expect(approveRes.success).toBe(true);
    expect(correctionsState[correctionsState.length - 1].lifecycle_status).toBe('approved');

    // 6. Publisher releases corrected revision into catalog
    const publishRes = await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'publish_correction', reason: 'Chief Publisher released corrected revision v2' },
      mockPublisher,
    );
    expect(publishRes.success).toBe(true);
    expect(publishRes.publication_status).toBe('corrected');
    expect(publishRes.is_public).toBe(true);

    // Verify record state updated
    expect(recordState.current_revision).toBe(2);
    expect(recordState.publication_status).toBe('corrected');
    expect(recordState.verification_status).toBe('corrected');
    expect(recordState.title).toBe('Lagos-Calabar Coastal Highway Section 1 (52km)');

    // Verify version snapshot & diff recorded
    expect(recordVersions.length).toBe(2);
    expect(recordVersions[1].version_number).toBe(2);
    expect(recordVersions[1].diff_json.title).toBeDefined();

    // Verify unified history query
    const fullHistory = await manager.getRecordFullHistory(recordState.id);
    expect(fullHistory.historyCapability).toBe('FULL_SNAPSHOT_AND_EVENT_HISTORY');
    expect(fullHistory.currentRevision).toBe(2);
    expect(fullHistory.publicationStatus).toBe('corrected');
    expect(fullHistory.events.length).toBeGreaterThan(4);
  });

  // 2. Negative Test: Published Record Direct Edit Lock
  it('blocks direct edits on published records with CORRECTION_REQUIRED', async () => {
    // Ordinary overview update
    await expect(
      manager.updateRecordOverview(
        recordState.id,
        {
          record_type: 'project',
          title: 'Directly Overwritten Title Without Audit',
          slug: 'test-slug',
          short_summary: 'Overwritten summary',
          full_description: 'Overwritten desc',
          implementation_status: 'in_progress',
          geographic_scope: 'national',
          expected_updated_at: recordState.updated_at,
          sector_ids: [],
          institution_ids: [],
          geographic_unit_ids: [],
        },
        mockResearcher,
      ),
    ).rejects.toThrow(/CORRECTION_REQUIRED/);

    // Child entity addition
    await expect(
      manager.saveClaim(
        recordState.id,
        {
          claim_type: 'infrastructure_output',
          claim_text: 'Illegitimately added claim on published record',
          data_value_nature: 'actual',
          verification_status: 'verified',
          linked_source_ids: [],
        },
        mockResearcher,
      ),
    ).rejects.toThrow(/CORRECTION_REQUIRED/);
  });

  // 3. Negative Test: Super Admin Cannot Bypass Direct Edit Lock on Published Content
  it('blocks Super Admin from directly modifying published content without audited correction', async () => {
    await expect(
      manager.updateRecordOverview(
        recordState.id,
        {
          record_type: 'project',
          title: 'Super Admin Silent Rewrite Attempt',
          slug: 'test-slug',
          short_summary: 'Super admin summary',
          full_description: 'Super admin desc',
          implementation_status: 'in_progress',
          geographic_scope: 'national',
          expected_updated_at: recordState.updated_at,
          sector_ids: [],
          institution_ids: [],
          geographic_unit_ids: [],
        },
        mockSuperAdmin,
      ),
    ).rejects.toThrow(/CORRECTION_REQUIRED/);

  });

  // 4. Negative Test: Gate 4 Human Approval Binding Before Publish
  it('blocks publishing a correction without prior Gate 4 editorial human approval', async () => {
    // Open correction
    await manager.openCorrection(
      recordState.id,
      {
        correction_type: 'factual_error',
        reason: 'Factual error fix',
        expected_revision: 1,
      },
      mockResearcher,
    );

    // Force correction to 'approved' lifecycle state in mock without inserting Gate 4 decision
    correctionsState[0].lifecycle_status = 'approved';

    // Publisher tries to publish without Gate 4 decision
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        { action: 'publish_correction' },
        mockPublisher,
      ),
    ).rejects.toThrow(/REVIEW_APPROVAL_REQUIRED/);
  });

  // 5. Negative Test: Concurrency Conflict on Expected Revision
  it('rejects opening a correction when expected revision does not match current record revision', async () => {
    await expect(
      manager.openCorrection(
        recordState.id,
        {
          correction_type: 'factual_error',
          reason: 'Stale revision correction attempt',
          expected_revision: 99, // Stale!
        },
        mockResearcher,
      ),
    ).rejects.toThrow(/CONCURRENCY_CONFLICT/);
  });

  // 6. Negative Test: Duplicate Active Corrections Blocked
  it('blocks opening duplicate active corrections while one is already in progress', async () => {
    await manager.openCorrection(
      recordState.id,
      {
        correction_type: 'factual_error',
        reason: 'First active correction',
        expected_revision: 1,
      },
      mockResearcher,
    );

    await expect(
      manager.openCorrection(
        recordState.id,
        {
          correction_type: 'numerical_update',
          reason: 'Second conflicting correction',
          expected_revision: 1,
        },
        mockResearcher,
      ),
    ).rejects.toThrow(/DUPLICATE_CORRECTION_IN_PROGRESS/);
  });

  // 7. Negative Test: Role RBAC Matrix for Correction Transitions
  it('enforces RBAC role authorization matrix on all correction transitions', async () => {
    // Reviewer cannot open correction
    await expect(
      manager.openCorrection(
        recordState.id,
        {
          correction_type: 'factual_error',
          reason: 'Reviewer cannot open correction',
          expected_revision: 1,
        },
        mockReviewer,
      ),
    ).rejects.toThrow(/FORBIDDEN_TRANSITION_ROLE/);

    // Open correction as researcher
    await manager.openCorrection(
      recordState.id,
      {
        correction_type: 'factual_error',
        reason: 'Legitimate proposed correction',
        expected_revision: 1,
      },
      mockResearcher,
    );

    // Reviewer cannot submit correction (only researcher / superadmin)
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        { action: 'submit_correction' },
        mockReviewer,
      ),
    ).rejects.toThrow(/FORBIDDEN_TRANSITION_ROLE/);

    // Submit as researcher
    await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'submit_correction' },
      mockResearcher,
    );

    // Researcher cannot approve correction (only reviewer / superadmin)
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        { action: 'approve_correction' },
        mockResearcher,
      ),
    ).rejects.toThrow(/FORBIDDEN_TRANSITION_ROLE/);

    // Approve as reviewer
    await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'approve_correction' },
      mockReviewer,
    );

    // Reviewer cannot publish correction (only publisher / superadmin)
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        { action: 'publish_correction' },
        mockReviewer,
      ),
    ).rejects.toThrow(/FORBIDDEN_TRANSITION_ROLE/);
  });

  // 8. Terminal State Isolation: Prevents resurrection of old lifecycle rows after terminal state
  it('strictly isolates terminal states (published, rejected, cancelled) without resurrecting superseded rows', async () => {
    // A. Rejection Cycle: Open -> Submit -> Reject
    const openRes = await manager.openCorrection(
      recordState.id,
      {
        correction_type: 'factual_error',
        reason: 'Correction to be rejected',
        expected_revision: 1,
      },
      mockResearcher,
    );
    expect(openRes.success).toBe(true);

    await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'submit_correction' },
      mockResearcher,
    );

    // Reject correction
    const rejectRes = await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'reject_correction', reason: 'Evidence does not corroborate proposed change' },
      mockReviewer,
    );
    expect(rejectRes.success).toBe(true);

    // Verify terminal state: No active correction exists (old proposed/under_review rows are NOT resurrected)
    const activeAfterReject = await manager.getActiveCorrection(recordState.id);
    expect(activeAfterReject).toBeNull();

    // B. Cancellation Cycle: Open -> Cancel
    const openCancel = await manager.openCorrection(
      recordState.id,
      {
        correction_type: 'typographical',
        reason: 'Correction to be cancelled',
        expected_revision: 1,
      },
      mockResearcher,
    );
    expect(openCancel.success).toBe(true);

    await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'cancel_correction', reason: 'Author decided typo is minor' },
      mockResearcher,
    );

    // Verify terminal state: No active correction exists
    const activeAfterCancel = await manager.getActiveCorrection(recordState.id);
    expect(activeAfterCancel).toBeNull();
  });

  // 9. Multiple Sequential Correction Cycles with Distinct Chain Identities
  it('supports multiple sequential correction cycles across revisions with distinct chain identities and intact history', async () => {
    // --- CYCLE 1: Revision 1 -> Revision 2 ---
    const openRes1 = await manager.openCorrection(
      recordState.id,
      {
        correction_type: 'numerical_update',
        reason: 'Cycle 1 correction: Update allocation',
        expected_revision: 1,
        changes: { title: 'Lagos-Calabar Highway v2 Title' },
      },
      mockResearcher,
    );
    expect(openRes1.success).toBe(true);
    expect(openRes1.current_revision).toBe(1);
    expect(openRes1.target_revision).toBe(2);

    await manager.executeWorkflowTransition(recordState.id, { action: 'submit_correction' }, mockResearcher);
    await manager.executeWorkflowTransition(recordState.id, { action: 'approve_correction' }, mockReviewer);
    const pubRes1 = await manager.executeWorkflowTransition(recordState.id, { action: 'publish_correction' }, mockPublisher);

    expect(pubRes1.success).toBe(true);
    expect(recordState.current_revision).toBe(2);

    // Active correction for record must be null after publication
    const activeAfterCycle1 = await manager.getActiveCorrection(recordState.id);
    expect(activeAfterCycle1).toBeNull();

    // --- CYCLE 2: Revision 2 -> Revision 3 ---
    const openRes2 = await manager.openCorrection(
      recordState.id,
      {
        correction_type: 'date_refinement',
        reason: 'Cycle 2 correction: Update start date',
        expected_revision: 2,
        changes: { title: 'Lagos-Calabar Highway v3 Title' },
      },
      mockResearcher,
    );
    expect(openRes2.success).toBe(true);
    expect(openRes2.current_revision).toBe(2);
    expect(openRes2.target_revision).toBe(3);

    // Update draft of Cycle 2
    await manager.updateCorrectionDraft(
      recordState.id,
      {
        public_notice: 'Updated notice for Cycle 2 revision 3',
      },
      mockResearcher,
    );

    await manager.executeWorkflowTransition(recordState.id, { action: 'submit_correction' }, mockResearcher);

    // Verify active correction is Cycle 2 under_review, not resurrecting Cycle 1
    const activeCycle2 = await manager.getActiveCorrection(recordState.id);
    expect(activeCycle2).not.toBeNull();
    expect(activeCycle2.lifecycle_status).toBe('under_review');
    expect(activeCycle2.reason).toContain('Cycle 2');

    await manager.executeWorkflowTransition(recordState.id, { action: 'approve_correction' }, mockReviewer);
    const pubRes2 = await manager.executeWorkflowTransition(recordState.id, { action: 'publish_correction' }, mockPublisher);

    expect(pubRes2.success).toBe(true);
    expect(recordState.current_revision).toBe(3);

    // Full history must contain all events from both Cycle 1 and Cycle 2
    const fullHistory = await manager.getRecordFullHistory(recordState.id);
    expect(fullHistory.currentRevision).toBe(3);
    expect(fullHistory.publicationStatus).toBe('corrected');
    expect(recordVersions.length).toBe(3);
  });
});
