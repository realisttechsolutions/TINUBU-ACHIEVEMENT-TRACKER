import { NextResponse } from 'next/server';
import { requireStaffAuth } from '@/lib/server/admin-guard';
import { getAdminReferenceData } from '@/server/admin/reference-service';

export async function GET() {
  try {
    await requireStaffAuth();
    const data = await getAdminReferenceData();
    return NextResponse.json(data);
  } catch (err: any) {
    if (err.message?.includes('UNAUTHENTICATED')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in GET /api/admin/reference-data:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
