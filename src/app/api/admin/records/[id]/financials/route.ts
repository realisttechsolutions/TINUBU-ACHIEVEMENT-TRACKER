import { NextRequest, NextResponse } from 'next/server';
import { requireStaffAuth } from '@/lib/server/admin-guard';
import { validateCsrfProtection } from '@/lib/server/csrf';
import { saveFinancialRecord } from '@/server/admin/records-service';
import { financialRecordSchema } from '@/server/admin/validation';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const staffUser = await requireStaffAuth();
    const { id } = await params;

    if (staffUser.role !== 'super_admin' && staffUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient role permissions to manage financials' },
        { status: 403 },
      );
    }

    const csrfValid = validateCsrfProtection(req);
    if (!csrfValid) {
      return NextResponse.json({ error: 'Forbidden: CSRF validation failed' }, { status: 403 });
    }

    const body = await req.json();
    const parsedBody = financialRecordSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid financial payload', details: parsedBody.error.flatten() },
        { status: 400 },
      );
    }

    const result = await saveFinancialRecord(id, parsedBody.data, staffUser);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    if (err.message?.includes('UNAUTHENTICATED')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (
      err.message?.includes('CORRECTION_REQUIRED') ||
      err.message?.includes('RECORD_LOCKED_FOR_REVIEW') ||
      err.message?.includes('FORBIDDEN') ||
      err.message?.includes('Forbidden')
    ) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    console.error('Error in POST /api/admin/records/[id]/financials:', err);
    return NextResponse.json({ error: 'Failed to save financial record' }, { status: 500 });
  }
}
