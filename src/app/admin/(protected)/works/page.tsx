import { WorksManagerClient } from '@/components/admin/works-manager-client';
import { getAdminWorksData } from '@/lib/admin/data';

export default async function AdminWorksPage() {
  const workItems = await getAdminWorksData();

  return <WorksManagerClient initialWorkItems={workItems} />;
}
