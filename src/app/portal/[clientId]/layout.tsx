'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import { ClientSidebar } from '@/components/shared/ClientSidebar';

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <CursorGradientWrapper>
        <div className="flex h-dvh overflow-hidden bg-muted text-foreground">
          <ClientSidebar />
          <main className="flex-1 overflow-y-auto bg-background rounded-2xl m-2 md:ml-0 border border-border">
            {children}
          </main>
        </div>
      </CursorGradientWrapper>
    </AuthGuard>
  );
}
