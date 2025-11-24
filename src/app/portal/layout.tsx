'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { PortalSidebar } from '@/components/portal/PortalSidebar';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-muted/40">
        <PortalSidebar />
        <main className="flex-1 flex flex-col w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
