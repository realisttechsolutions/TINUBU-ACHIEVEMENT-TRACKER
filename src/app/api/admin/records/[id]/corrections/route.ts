import { NextRequest, NextResponse } from 'next/server';
import { requireStaffAuth } from '@/lib/server/admin-guard';
import { openCorrection, getRecordCorrections } from '@/server/admin/records-service';
import { openCorrectionSchema } from '@/server/admin/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const staffUser = await requireStaffAuth();
    const { id: recordId } = await params;
    const result = await getRecordCorrections(recordId, staffUser);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    if (err.message?.includes('UNAUTHENTICATED')) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }
    if (err.message?.includes('FORBIDDEN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const staffUser = await requireStaffAuth();
    const body = await req.json();

    const parsedBody = openCorrectionSchema.safeParse(body);
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
    const result = await openCorrection(recordId, parsedBody.data, staffUser);
    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes('UNAUTHENTICATED')) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }
    if (err.message?.includes('FORBIDDEN')) {
      return NextResponse.json({ error: err.message || 'Forbidden' }, { status: 403 });
    }
    if (err.message?.includes('CONCURRENCY_CONFLICT') || err.message?.includes('DUPLICATE_CORRECTION_IN_PROGRESS')) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    if (err.message?.includes('INVALID_TRANSITION') || err.message?.includes('REASON_REQUIRED')) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
