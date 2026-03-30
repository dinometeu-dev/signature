import { redirect } from 'next/navigation';

import { AdminLoginForm } from '@/components/admin/login-form';
import { getCurrentAdminSession } from '@/lib/admin/session';

export default async function AdminLoginPage() {
  const session = await getCurrentAdminSession();

  if (session) {
    redirect('/admin');
  }

  return <AdminLoginForm />;
}
