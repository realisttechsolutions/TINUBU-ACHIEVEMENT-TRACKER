import { NextRequest, NextResponse } from 'next/server';
import { requireStaffAuth } from '@/lib/server/admin-guard';
import { validateCsrfProtection } from '@/lib/server/csrf';
import { saveSource } from '@/server/admin/records-service';
import { sourceSchema } from '@/server/admin/validation';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const staffUser = await requireStaffAuth();
    await params; // validate params

    if (staffUser.role !== 'super_admin' && staffUser.role !== 'researcher') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient role permissions to manage sources' },
        { status: 403 },
      );
    }

    const csrfValid = validateCsrfProtection(req);
    if (!csrfValid) {
      return NextResponse.json({ error: 'Forbidden: CSRF validation failed' }, { status: 403 });
    }

    const body = await req.json();
    const parsedBody = sourceSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid source payload', details: parsedBody.error.flatten() },
        { status: 400 },
      );
    }

    const result = await saveSource(parsedBody.data, staffUser);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    if (err.message?.includes('UNAUTHENTICATED')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in POST /api/admin/records/[id]/sources:', err);
    return NextResponse.json({ error: 'Failed to save source' }, { status: 500 });
  }
}
