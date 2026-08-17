import { NextRequest, NextResponse } from 'next/server';
import { requireStaffAuth } from '@/lib/server/admin-guard';
import { updateCorrectionDraft } from '@/server/admin/records-service';
import { updateCorrectionDraftSchema } from '@/server/admin/validation';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const staffUser = await requireStaffAuth();
    const body = await req.json();

    const parsedBody = updateCorrectionDraftSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsedBody.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { id: recordId } = await params;
    const result = await updateCorrectionDraft(recordId, parsedBody.data, staffUser);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    if (err.message?.includes('UNAUTHENTICATED')) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }
    if (err.message?.includes('FORBIDDEN')) {
      return NextResponse.json({ error: err.message || 'Forbidden' }, { status: 403 });
    }
    if (err.message?.includes('NO_ACTIVE_PROPOSED_CORRECTION') || err.message?.includes('REASON_REQUIRED')) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
