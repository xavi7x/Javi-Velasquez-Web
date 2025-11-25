'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <CursorGradientWrapper>
          <main className="flex-1">
            {children}
          </main>
      </CursorGradientWrapper>
    </AuthGuard>
  );
}
