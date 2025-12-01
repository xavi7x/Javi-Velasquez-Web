'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/shared/ClientSidebar';

export default function ClientPortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { clientId: string };
}) {
  return (
    <AuthGuard>
      <CursorGradientWrapper>
        <SidebarProvider>
          <ClientSidebar clientId={params.clientId} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </CursorGradientWrapper>
    </AuthGuard>
  );
}
