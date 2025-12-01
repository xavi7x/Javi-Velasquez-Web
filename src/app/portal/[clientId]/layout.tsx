'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/shared/ClientSidebar';

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <CursorGradientWrapper>
        <SidebarProvider>
          <ClientSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </CursorGradientWrapper>
    </AuthGuard>
  );
}
