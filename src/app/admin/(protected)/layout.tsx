import React from 'react';

import { AdminShell } from '@/components/admin/admin-shell';
import { requireAdminSession } from '@/lib/admin/session';

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdminSession();

  return <AdminShell userEmail={session.user.email}>{children}</AdminShell>;
}
