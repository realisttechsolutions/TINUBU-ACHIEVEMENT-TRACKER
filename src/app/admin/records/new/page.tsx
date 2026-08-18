import { requireStaffPageAuth } from '@/lib/server/admin-guard';
import { getAdminReferenceData } from '@/server/admin/reference-service';
import CreateRecordClient from '@/components/admin/CreateRecordClient';


export default async function NewRecordPage() {
  const staffUser = await requireStaffPageAuth();

  if (staffUser.role !== 'super_admin' && staffUser.role !== 'researcher') {
    return (
      <div className="flex-1 max-w-2xl mx-auto p-8 text-center text-slate-300">
        <h1 className="text-xl font-bold text-white mb-2">Unauthorized Access</h1>
        <p className="text-sm">Only Super Admins and Researchers are permitted to create draft records.</p>
      </div>
    );
  }

  const refData = await getAdminReferenceData();

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8 space-y-6">
      <CreateRecordClient refData={refData} />
    </div>
  );
}
