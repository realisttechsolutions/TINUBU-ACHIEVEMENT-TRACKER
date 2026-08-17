import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import { createAdminControlPlaneDb, type AdminControlPlaneDb } from './db';
import { authenticateAdminRequest, AuthError } from './auth';
import { AdminRecordsManager } from './records';
import {
  createRecordSchema,
  updateRecordOverviewSchema,
  claimSchema,
  sourceSchema,
  financialRecordSchema,
  beneficiaryRecordSchema,
  timelineEventSchema,
  workflowTransitionSchema,
} from './validation';

let dbInstance: AdminControlPlaneDb | null = null;
let managerInstance: AdminRecordsManager | null = null;

async function getRecordsManager(): Promise<AdminRecordsManager> {
  if (!managerInstance) {
    dbInstance = await createAdminControlPlaneDb();
    managerInstance = new AdminRecordsManager(dbInstance);
  }
  return managerInstance;
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(payload);
}

export const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method || 'GET';

  // 1. Health Probe (unauthenticated)
  if (pathname === '/health' && method === 'GET') {
    return sendJson(res, 200, { status: 'healthy', service: 'tat-admin-control-plane', timestamp: new Date().toISOString() });
  }

  // 2. Authentication & Authorization for administrative routes
  try {
    const manager = await getRecordsManager();

    // POST /api/smoke-test (Smoke Test Route)
    if (pathname === '/api/smoke-test' && method === 'POST') {
      await authenticateAdminRequest(req.headers, 'write');
      const result = await manager.smokeTestRollback();
      return sendJson(res, 200, result);
    }

    // POST /api/records (Create Draft Record)
    if (pathname === '/api/records' && method === 'POST') {
      const staff = await authenticateAdminRequest(req.headers, 'write');
      const body = await parseJsonBody(req);
      const parsed = createRecordSchema.safeParse(body);
      if (!parsed.success) {
        return sendJson(res, 400, { error: 'Invalid record payload', details: parsed.error.flatten() });
      }
      const created = await manager.createRecord(parsed.data, staff);
      return sendJson(res, 201, { success: true, ...created });
    }

    // POST /api/sources (Save Source directly)
    if (pathname === '/api/sources' && method === 'POST') {
      const staff = await authenticateAdminRequest(req.headers, 'write');
      const body = await parseJsonBody(req);
      const parsed = sourceSchema.safeParse(body);
      if (!parsed.success) {
        return sendJson(res, 400, { error: 'Invalid source payload', details: parsed.error.flatten() });
      }
      const result = await manager.saveSource(parsed.data, staff);
      return sendJson(res, 200, { success: true, ...result });
    }

    // GET /api/records/review-queue (Review Queue)
    if (pathname === '/api/records/review-queue' && method === 'GET') {
      await authenticateAdminRequest(req.headers, 'review');
      const queue = await manager.getReviewQueue();
      return sendJson(res, 200, { success: true, records: queue });
    }

    // GET /api/records/publish-queue (Publish Queue)
    if (pathname === '/api/records/publish-queue' && method === 'GET') {
      await authenticateAdminRequest(req.headers, 'publish');
      const queue = await manager.getPublishQueue();
      return sendJson(res, 200, { success: true, records: queue });
    }

    // Dynamic Route Matching: /api/records/:id(/subpath)
    const match = pathname.match(/^\/api\/records\/([a-z0-9_-]+)(?:\/([a-z0-9_-]+))?$/i);
    if (match) {
      const recordId = match[1];
      const subpath = match[2];

      // POST /api/records/:id/workflow (Workflow Transition)
      if (subpath === 'workflow' && method === 'POST') {
        const staff = await authenticateAdminRequest(req.headers, 'workflow');
        const body = await parseJsonBody(req);
        const parsed = workflowTransitionSchema.safeParse(body);
        if (!parsed.success) {
          return sendJson(res, 400, { error: 'Invalid workflow payload', details: parsed.error.flatten() });
        }
        const result = await manager.executeWorkflowTransition(recordId, parsed.data, staff);
        return sendJson(res, 200, { success: true, ...result });
      }

      // GET /api/records/:id/history (Review Decision Trail)
      if (subpath === 'history' && method === 'GET') {
        await authenticateAdminRequest(req.headers, 'read');
        const history = await manager.getRecordReviewHistory(recordId);
        return sendJson(res, 200, { success: true, history });
      }

      // PUT /api/records/:id (Update Overview)
      if (!subpath && method === 'PUT') {
        const staff = await authenticateAdminRequest(req.headers, 'write');
        const body = await parseJsonBody(req);
        const parsed = updateRecordOverviewSchema.safeParse(body);
        if (!parsed.success) {
          return sendJson(res, 400, { error: 'Invalid update payload', details: parsed.error.flatten() });
        }
        const updated = await manager.updateRecordOverview(recordId, parsed.data, staff);
        return sendJson(res, 200, updated);
      }

      // POST /api/records/:id/claims
      if (subpath === 'claims' && method === 'POST') {
        const staff = await authenticateAdminRequest(req.headers, 'write');
        const body = await parseJsonBody(req);
        const parsed = claimSchema.safeParse(body);
        if (!parsed.success) {
          return sendJson(res, 400, { error: 'Invalid claim payload', details: parsed.error.flatten() });
        }
        const result = await manager.saveClaim(recordId, parsed.data, staff);
        return sendJson(res, 200, { success: true, ...result });
      }

      // POST /api/records/:id/sources
      if (subpath === 'sources' && method === 'POST') {
        const staff = await authenticateAdminRequest(req.headers, 'write');
        const body = await parseJsonBody(req);
        const parsed = sourceSchema.safeParse(body);
        if (!parsed.success) {
          return sendJson(res, 400, { error: 'Invalid source payload', details: parsed.error.flatten() });
        }
        const result = await manager.saveSource(parsed.data, staff);
        return sendJson(res, 200, { success: true, ...result });
      }

      // POST /api/records/:id/financials
      if (subpath === 'financials' && method === 'POST') {
        const staff = await authenticateAdminRequest(req.headers, 'write');
        const body = await parseJsonBody(req);
        const parsed = financialRecordSchema.safeParse(body);
        if (!parsed.success) {
          return sendJson(res, 400, { error: 'Invalid financial payload', details: parsed.error.flatten() });
        }
        const result = await manager.saveFinancialRecord(recordId, parsed.data, staff);
        return sendJson(res, 200, { success: true, ...result });
      }

      // POST /api/records/:id/beneficiaries
      if (subpath === 'beneficiaries' && method === 'POST') {
        const staff = await authenticateAdminRequest(req.headers, 'write');
        const body = await parseJsonBody(req);
        const parsed = beneficiaryRecordSchema.safeParse(body);
        if (!parsed.success) {
          return sendJson(res, 400, { error: 'Invalid beneficiary payload', details: parsed.error.flatten() });
        }
        const result = await manager.saveBeneficiaryRecord(recordId, parsed.data, staff);
        return sendJson(res, 200, { success: true, ...result });
      }

      // POST /api/records/:id/timeline
      if (subpath === 'timeline' && method === 'POST') {
        const staff = await authenticateAdminRequest(req.headers, 'write');
        const body = await parseJsonBody(req);
        const parsed = timelineEventSchema.safeParse(body);
        if (!parsed.success) {
          return sendJson(res, 400, { error: 'Invalid timeline payload', details: parsed.error.flatten() });
        }
        const result = await manager.saveTimelineEvent(recordId, parsed.data, staff);
        return sendJson(res, 200, { success: true, ...result });
      }
    }

    return sendJson(res, 404, { error: 'Not Found' });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return sendJson(res, error.statusCode, { error: error.message });
    }
    if (error.message === 'RECORD_NOT_FOUND') {
      return sendJson(res, 404, { error: 'Record not found' });
    }
    if (error.message === 'CONCURRENCY_CONFLICT') {
      return sendJson(res, 409, { error: 'Conflict: Record was modified concurrently. Please refresh.' });
    }
    if (error.message?.includes('RECORD_LOCKED_FOR_REVIEW')) {
      return sendJson(res, 403, { error: error.message });
    }
    if (error.message?.includes('FORBIDDEN_TRANSITION_ROLE')) {
      return sendJson(res, 403, { error: 'Forbidden: Your role is not authorized for this workflow transition.' });
    }
    if (error.message?.includes('INVALID_TRANSITION') || error.message?.includes('REASON_REQUIRED')) {
      return sendJson(res, 400, { error: error.message });
    }
    console.error('Admin Control Plane Unhandled Error:', error);
    return sendJson(res, 500, { error: 'Internal Server Error' });
  }
});

const PORT = parseInt(process.env.PORT || '8080', 10);

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`TAT Admin Control Plane listening on port ${PORT}`);
  });
}
