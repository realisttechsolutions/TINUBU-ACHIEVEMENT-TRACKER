import { NextRequest, NextResponse } from 'next/server';
import { requireStaffAuth } from '@/lib/server/admin-guard';
import { validateCsrfProtection } from '@/lib/server/csrf';
import { getAdminRecordDetail, updateRecordOverview } from '@/server/admin/records-service';
import { updateRecordOverviewSchema } from '@/server/admin/validation';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireStaffAuth();
    const { id } = await params;

    const detail = await getAdminRecordDetail(id);
    if (!detail) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (err: any) {
    if (err.message?.includes('UNAUTHENTICATED')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in GET /api/admin/records/[id]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const staffUser = await requireStaffAuth();
    const { id } = await params;

    if (staffUser.role !== 'super_admin' && staffUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient role permissions to edit records' },
        { status: 403 },
      );
    }

    const csrfValid = validateCsrfProtection(req);
    if (!csrfValid) {
      return NextResponse.json({ error: 'Forbidden: CSRF validation failed' }, { status: 403 });
    }

    const body = await req.json();
    const parsedBody = updateRecordOverviewSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid update payload', details: parsedBody.error.flatten() },
        { status: 400 },
      );
    }

    const result = await updateRecordOverview(id, parsedBody.data, staffUser);
    return NextResponse.json(result);
  } catch (err: any) {
    if (err.message === 'RECORD_NOT_FOUND') {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    if (err.message === 'CONCURRENCY_CONFLICT') {
      return NextResponse.json(
        { error: 'Conflict: Record was modified by another editor. Please refresh.' },
        { status: 409 },
      );
    }
    if (err.message?.includes('UNAUTHENTICATED')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in PUT /api/admin/records/[id]:', err);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}
