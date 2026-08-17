import { NextRequest, NextResponse } from 'next/server';
import { requireStaffAuth } from '@/lib/server/admin-guard';
import { validateCsrfProtection } from '@/lib/server/csrf';
import { listAdminRecords, createRecord } from '@/server/admin/records-service';
import { listAdminRecordsSchema, createRecordSchema } from '@/server/admin/validation';

export async function GET(req: NextRequest) {
  try {
    await requireStaffAuth();

    const { searchParams } = new URL(req.url);
    const rawQuery = {
      q: searchParams.get('q') || undefined,
      type: searchParams.get('type') || undefined,
      sector: searchParams.get('sector') || undefined,
      status: searchParams.get('status') || undefined,
      publication_status: searchParams.get('publication_status') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
    };

    const parsedQuery = listAdminRecordsSchema.safeParse(rawQuery);
    if (!parsedQuery.success) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }

    const result = await listAdminRecords(parsedQuery.data);
    return NextResponse.json(result);
  } catch (err: any) {
    if (err.message?.includes('UNAUTHENTICATED') || err.message?.includes('FORBIDDEN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in GET /api/admin/records:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const staffUser = await requireStaffAuth();

    if (staffUser.role !== 'super_admin' && staffUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient role permissions to create records' },
        { status: 403 },
      );
    }

    const csrfValid = validateCsrfProtection(req);
    if (!csrfValid) {
      return NextResponse.json({ error: 'Forbidden: CSRF validation failed' }, { status: 403 });
    }

    const body = await req.json();
    const parsedBody = createRecordSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid record payload', details: parsedBody.error.flatten() },
        { status: 400 },
      );
    }

    const created = await createRecord(parsedBody.data, staffUser);
    return NextResponse.json({ success: true, ...created }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes('UNAUTHENTICATED')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in POST /api/admin/records:', err);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}
