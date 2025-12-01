'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { ClientPortalHeader } from '@/components/shared/ClientPortalHeader';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <CursorGradientWrapper>
        <ClientPortalHeader />
          <main className="flex-1 bg-background text-foreground">
            {children}
          </main>
      </CursorGradientWrapper>
    </AuthGuard>
  );
}
