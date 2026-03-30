import { SignatureForm } from '@/components/admin/signature-form';
import { getAdminSignatureData } from '@/lib/admin/data';

export default async function AdminSignaturePage() {
  const signature = await getAdminSignatureData();

  return <SignatureForm initialContent={signature} />;
}
