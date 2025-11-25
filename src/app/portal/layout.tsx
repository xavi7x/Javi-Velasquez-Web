
'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Footer } from '@/components/shared/Footer';
import { Header } from '@/components/shared/Header';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <CursorGradientWrapper>
        <Header />
          <main className="flex-1">
            {children}
          </main>
        <Footer />
      </CursorGradientWrapper>
    </AuthGuard>
  );
}
