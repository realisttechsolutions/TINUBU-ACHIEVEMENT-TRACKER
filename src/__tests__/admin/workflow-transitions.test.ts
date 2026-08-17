import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminRecordsManager } from '@/admin-service/records';
import type { VerifiedStaffContext } from '@/admin-service/auth';
import type { AdminControlPlaneDb } from '@/admin-service/db';

describe('Admin Workflow Transitions & State Machine', () => {
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

  // In-memory mock database state
  let recordState: any;
  let claimsState: any[];
  let reviewDecisions: any[];
  let actorProfiles: any[];

  beforeEach(() => {
    recordState = {
      id: '00000000-0000-4000-8000-000000000001',
      external_id: 'REC-00000001',
      slug: 'test-trans-sahara-corridor',
      record_type: 'achievement',
      title: 'Trans-Sahara Corridor Upgrade Phase 1',
      summary: 'Infrastructure project summary',
      workflow_status: 'draft',
      publication_status: 'unpublished',
      is_public: false,
      current_revision: 1,
      updated_at: '2026-08-17T12:00:00.000Z',
      published_at: null,
      qualification: null,
    };

    claimsState = [
      {
        id: '00000000-0000-4000-8000-000000000010',
        record_id: recordState.id,
        workflow_status: 'draft',
        verification_status: 'unverified',
      },
    ];

    reviewDecisions = [];
    actorProfiles = [
      { id: '00000000-0000-4000-8000-000000000005', firebase_uid: 'system', email: 'system@tat.gov.ng' },
    ];

    const mockTx = {
      query: vi.fn(async (sql: string, params?: any[]) => {
        const normalized = sql.trim().replace(/\s+/g, ' ');

        // Query record for update
        if (normalized.includes('SELECT id, workflow_status, publication_status, is_public, current_revision, updated_at::text FROM records WHERE id = $1')) {
          if (params?.[0] === recordState.id) {
            return { rows: [{ ...recordState }] };
          }
          return { rows: [] };
        }

        // Query actor profile
        if (normalized.includes('SELECT id FROM actor_profiles WHERE firebase_uid = $1 OR email = $2')) {
          const found = actorProfiles.find((a) => a.firebase_uid === params?.[0] || a.email === params?.[1]);
          return { rows: found ? [{ id: found.id }] : [] };
        }

        // Insert actor profile
        if (normalized.includes('INSERT INTO actor_profiles')) {
          const newActor = { id: params?.[0], firebase_uid: params?.[2], email: params?.[4] };
          actorProfiles.push(newActor);
          return { rows: [{ id: newActor.id }] };
        }

        // Update records workflow status
        if (normalized.startsWith('UPDATE records SET workflow_status = $1, publication_status = $2, is_public = $3')) {
          recordState.workflow_status = params?.[0];
          recordState.publication_status = params?.[1];
          recordState.is_public = params?.[2];
          if (params?.[3]) recordState.qualification = params[3];
          if (normalized.includes('published_at = CURRENT_TIMESTAMP')) {
            recordState.published_at = '2026-08-17T12:05:00.000Z';
          } else if (normalized.includes('published_at = NULL')) {
            recordState.published_at = null;
          }
          recordState.updated_at = '2026-08-17T12:05:00.000Z';
          return { rows: [{ updated_at: recordState.updated_at }] };
        }

        // Update evidence claims
        if (normalized.startsWith('UPDATE evidence_claims SET workflow_status =')) {
          const match = normalized.match(/workflow_status\s*=\s*'([^']+)'/);
          if (match) {
            claimsState.forEach((c) => {
              c.workflow_status = match[1];
            });
          }
          return { rows: [] };
        }

        // Insert review decisions
        if (normalized.startsWith('INSERT INTO review_decisions')) {
          let gateCode = 'gate_4_editorial_human_approval';
          if (normalized.includes("'gate_5_publication_stewardship'")) {
            gateCode = 'gate_5_publication_stewardship';
          } else if (normalized.includes('$5') && params?.[4]) {
            gateCode = params[4];
          }

          let decision = 'approved';
          if (normalized.includes("'revision_requested'")) {
            decision = 'revision_requested';
          } else if (normalized.includes("'rejected'")) {
            decision = 'rejected';
          } else if (normalized.includes('$5')) {
            decision = params?.[4];
          }

          const rationale = params?.[params.length - 1];

          reviewDecisions.push({
            id: params?.[0],
            external_id: params?.[1],
            record_id: params?.[2],
            record_revision: params?.[3],
            gate_code: gateCode,
            decision: decision,
            reviewer_id: params?.[5] || params?.[6],
            rationale: rationale,
          });
          return { rows: [] };
        }

        // Update record overview check
        if (normalized.includes('SELECT updated_at::text, workflow_status FROM records WHERE id = $1')) {
          if (params?.[0] === recordState.id) {
            return { rows: [{ updated_at: recordState.updated_at, workflow_status: recordState.workflow_status }] };
          }
          return { rows: [] };
        }

        // Update overview query
        if (normalized.startsWith('UPDATE records SET title = $1')) {
          recordState.title = params?.[0];
          recordState.slug = params?.[1];
          recordState.updated_at = '2026-08-17T12:10:00.000Z';
          return { rows: [{ updated_at: recordState.updated_at }] };
        }

        return { rows: [] };
      }),
    };

    mockDb = {
      withTransaction: vi.fn(async (callback: (tx: any) => Promise<any>) => callback(mockTx)),
      query: mockTx.query,
    } as unknown as AdminControlPlaneDb;

    manager = new AdminRecordsManager(mockDb);
  });

  // 1. Positive Lifecycle Test
  it('executes full positive lifecycle: draft -> submit_for_review -> approve_review -> publish -> unpublish', async () => {
    // A. Submit for Review by Researcher
    const submitRes = await manager.executeWorkflowTransition(
      recordState.id,
      {
        action: 'submit_for_review',
        expected_updated_at: recordState.updated_at,
      },
      mockResearcher,
    );

    expect(submitRes.success).toBe(true);
    expect(submitRes.workflow_status).toBe('evidence_review');
    expect(submitRes.publication_status).toBe('under_review');
    expect(submitRes.is_public).toBe(false);
    expect(claimsState[0].workflow_status).toBe('evidence_review');

    // B. Verify Content Lock: Researcher cannot modify overview while under review
    await expect(
      manager.updateRecordOverview(
        recordState.id,
        {
          record_type: 'achievement',
          title: 'Modified Title During Review',
          slug: 'test-slug',
          short_summary: 'New summary',
          expected_updated_at: recordState.updated_at,
        },
        mockResearcher,
      ),
    ).rejects.toThrow(/RECORD_LOCKED_FOR_REVIEW/);

    // C. Approve Review by Reviewer
    const approveRes = await manager.executeWorkflowTransition(
      recordState.id,
      {
        action: 'approve_review',
        reason: 'Evidence package verified against ministerial gazette',
        expected_updated_at: recordState.updated_at,
      },
      mockReviewer,
    );

    expect(approveRes.success).toBe(true);
    expect(approveRes.workflow_status).toBe('ready_for_publication');
    expect(approveRes.publication_status).toBe('publishable');
    expect(approveRes.is_public).toBe(false);
    expect(reviewDecisions.length).toBe(1);
    expect(reviewDecisions[0].decision).toBe('approved');
    expect(reviewDecisions[0].rationale).toContain('gazette');

    // D. Publish to Public Catalog by Publisher
    const publishRes = await manager.executeWorkflowTransition(
      recordState.id,
      {
        action: 'publish',
        expected_updated_at: recordState.updated_at,
      },
      mockPublisher,
    );

    expect(publishRes.success).toBe(true);
    expect(publishRes.workflow_status).toBe('ready_for_publication');
    expect(publishRes.publication_status).toBe('published');
    expect(publishRes.is_public).toBe(true);
    expect(recordState.published_at).not.toBeNull();
    expect(reviewDecisions.length).toBe(2);

    // E. Unpublish by Publisher (requires mandatory reason)
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        {
          action: 'unpublish',
          reason: '', // empty reason must fail
          expected_updated_at: recordState.updated_at,
        },
        mockPublisher,
      ),
    ).rejects.toThrow(/REASON_REQUIRED/);

    const unpublishRes = await manager.executeWorkflowTransition(
      recordState.id,
      {
        action: 'unpublish',
        reason: 'Withdrawn for data recalibration with NBS',
        expected_updated_at: recordState.updated_at,
      },
      mockPublisher,
    );

    expect(unpublishRes.success).toBe(true);
    expect(unpublishRes.publication_status).toBe('unpublished');
    expect(unpublishRes.is_public).toBe(false);
    expect(recordState.published_at).toBeNull();
    expect(reviewDecisions.length).toBe(3);
  });

  // 2. Return for Changes Lifecycle
  it('handles return_for_changes: reviewer sends submitted record back to researcher with mandatory reason', async () => {
    // Put record into review
    recordState.workflow_status = 'evidence_review';
    recordState.publication_status = 'under_review';

    // Must provide reason
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        {
          action: 'return_for_changes',
          reason: 'bad', // too short
          expected_updated_at: recordState.updated_at,
        },
        mockReviewer,
      ),
    ).rejects.toThrow(/REASON_REQUIRED/);

    const returnRes = await manager.executeWorkflowTransition(
      recordState.id,
      {
        action: 'return_for_changes',
        reason: 'Please attach the official Gazette URL for Claim 1.',
        expected_updated_at: recordState.updated_at,
      },
      mockReviewer,
    );

    expect(returnRes.success).toBe(true);
    expect(returnRes.workflow_status).toBe('draft');
    expect(returnRes.publication_status).toBe('unpublished');
    expect(claimsState[0].workflow_status).toBe('draft');
    expect(reviewDecisions.length).toBe(1);
    expect(reviewDecisions[0].decision).toBe('revision_requested');
  });

  // 3. Rejection Lifecycle
  it('handles reject_review: reviewer formally rejects an invalid submission', async () => {
    recordState.workflow_status = 'evidence_review';
    recordState.publication_status = 'under_review';

    const rejectRes = await manager.executeWorkflowTransition(
      recordState.id,
      {
        action: 'reject_review',
        reason: 'Unsubstantiated claims with zero primary sources.',
        expected_updated_at: recordState.updated_at,
      },
      mockReviewer,
    );

    expect(rejectRes.success).toBe(true);
    expect(rejectRes.workflow_status).toBe('rejected');
    expect(rejectRes.publication_status).toBe('unpublished');
    expect(claimsState[0].workflow_status).toBe('rejected');
    expect(reviewDecisions.length).toBe(1);
    expect(reviewDecisions[0].decision).toBe('rejected');
  });

  // 4. Role Authorization Matrix (Negative tests)
  it('enforces role authorization matrix strictly', async () => {
    // Researcher cannot approve review
    recordState.workflow_status = 'evidence_review';
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        { action: 'approve_review', expected_updated_at: recordState.updated_at },
        mockResearcher,
      ),
    ).rejects.toThrow(/FORBIDDEN_TRANSITION_ROLE/);

    // Researcher cannot publish
    recordState.workflow_status = 'ready_for_publication';
    recordState.publication_status = 'publishable';
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        { action: 'publish', expected_updated_at: recordState.updated_at },
        mockResearcher,
      ),
    ).rejects.toThrow(/FORBIDDEN_TRANSITION_ROLE/);

    // Reviewer cannot submit draft for review
    recordState.workflow_status = 'draft';
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        { action: 'submit_for_review', expected_updated_at: recordState.updated_at },
        mockReviewer,
      ),
    ).rejects.toThrow(/FORBIDDEN_TRANSITION_ROLE/);

    // Reviewer cannot publish
    recordState.workflow_status = 'ready_for_publication';
    recordState.publication_status = 'publishable';
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        { action: 'publish', expected_updated_at: recordState.updated_at },
        mockReviewer,
      ),
    ).rejects.toThrow(/FORBIDDEN_TRANSITION_ROLE/);

    // Publisher cannot approve review
    recordState.workflow_status = 'evidence_review';
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        { action: 'approve_review', expected_updated_at: recordState.updated_at },
        mockPublisher,
      ),
    ).rejects.toThrow(/FORBIDDEN_TRANSITION_ROLE/);
  });

  // 5. Super Admin Authoritative Transitions
  it('allows Super Admin to execute all workflow actions using standard transition rules', async () => {
    // Draft -> Submit
    const s1 = await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'submit_for_review', expected_updated_at: recordState.updated_at },
      mockSuperAdmin,
    );
    expect(s1.workflow_status).toBe('evidence_review');

    // Review -> Approve
    const s2 = await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'approve_review', expected_updated_at: recordState.updated_at },
      mockSuperAdmin,
    );
    expect(s2.workflow_status).toBe('ready_for_publication');
    expect(s2.publication_status).toBe('publishable');

    // Ready -> Publish
    const s3 = await manager.executeWorkflowTransition(
      recordState.id,
      { action: 'publish', expected_updated_at: recordState.updated_at },
      mockSuperAdmin,
    );
    expect(s3.publication_status).toBe('published');
    expect(s3.is_public).toBe(true);
  });

  // 6. Optimistic Concurrency Check
  it('rejects workflow transition when expected_updated_at does not match current state', async () => {
    await expect(
      manager.executeWorkflowTransition(
        recordState.id,
        {
          action: 'submit_for_review',
          expected_updated_at: '2020-01-01T00:00:00.000Z', // stale timestamp
        },
        mockResearcher,
      ),
    ).rejects.toThrow(/CONCURRENCY_CONFLICT/);
  });
});
