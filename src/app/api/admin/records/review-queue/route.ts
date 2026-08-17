import { NextRequest, NextResponse } from 'next/server';
import { requireStaffAuth } from '@/lib/server/admin-guard';
import { getReviewQueue } from '@/server/admin/records-service';

export async function GET(req: NextRequest) {
  try {
    const staffUser = await requireStaffAuth(['reviewer', 'super_admin']);
    const records = await getReviewQueue(staffUser);
    return NextResponse.json({ success: true, records });
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
