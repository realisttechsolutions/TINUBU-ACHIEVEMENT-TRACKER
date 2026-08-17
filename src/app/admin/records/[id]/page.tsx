import { notFound } from 'next/navigation';
import { requireStaffAuth } from '@/lib/server/admin-guard';
import { getAdminRecordDetail } from '@/server/admin/records-service';
import { getAdminReferenceData } from '@/server/admin/reference-service';
import RecordEditorClient from '@/components/admin/RecordEditorClient';

export default async function AdminRecordEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const staffUser = await requireStaffAuth();
  const { id } = await params;

  const [detail, refData] = await Promise.all([
    getAdminRecordDetail(id),
    getAdminReferenceData(),
  ]);

  if (!detail) {
    notFound();
  }

  const canEdit = staffUser.role === 'super_admin' || staffUser.role === 'researcher';

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-6">
      <RecordEditorClient detail={detail} refData={refData} canEdit={canEdit} userRole={staffUser.role} />
    </div>
  );
}
