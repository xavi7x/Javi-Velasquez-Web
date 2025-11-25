'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Footer } from '@/components/shared/Footer';
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
          <main className="flex-1">
            {children}
          </main>
        <Footer />
      </CursorGradientWrapper>
    </AuthGuard>
  );
}
