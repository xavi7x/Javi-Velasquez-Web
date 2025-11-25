'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { PortalSidebar } from '@/components/portal/PortalSidebar';

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-dvh overflow-hidden bg-muted">
        <PortalSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
