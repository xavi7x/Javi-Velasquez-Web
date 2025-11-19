'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Briefcase, MessageSquare, User, LogOut } from 'lucide-react';
import { ProjectsView } from '@/components/propietario/ProjectsView';
import { MessagesView } from '@/components/propietario/MessagesView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Image from 'next/image';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';

function OwnerDashboard() {
  const [activeView, setActiveView] = useState('projects');
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 p-2">
               <Image src={logoUrl} alt="Logo" width={28} height={28} className="h-7 w-7 object-contain" />
              <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Panel</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveView('projects')}
                  isActive={activeView === 'projects'}
                  tooltip="Gestionar proyectos del portafolio"
                >
                  <Briefcase />
                  <span className="group-data-[collapsible=icon]:hidden">Proyectos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveView('messages')}
                  isActive={activeView === 'messages'}
                  tooltip="Ver mensajes de contacto"
                >
                  <MessageSquare />
                  <span className="group-data-[collapsible=icon]:hidden">Mensajes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2">
             <div className="flex items-center justify-between">
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-sm group-data-[collapsible=icon]:hidden">
                    <p className="font-semibold truncate">{user.displayName || user.email || 'Admin'}</p>
                  </div>
                </div>
              )}
               <ThemeSwitcher />
            </div>
            <div className="flex flex-col gap-2 mt-4 group-data-[collapsible=icon]:gap-0">
              <Button asChild variant="outline" className="w-full justify-center group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0">
                <Link href="/" title="Volver al Inicio">
                  <span className="group-data-[collapsible=icon]:hidden">Volver al Inicio</span>
                  <LogOut className="h-4 w-4 hidden group-data-[collapsible=icon]:block" />
                </Link>
              </Button>
               <Button variant="ghost" className="w-full justify-center group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0" onClick={handleLogout} title="Cerrar Sesión">
                <LogOut className="h-4 w-4" />
                <span className="ml-2 group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="p-4 md:p-8 lg:p-12">
           <header className="flex items-center gap-4 mb-8">
            <SidebarTrigger className="md:hidden" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {activeView === 'projects' ? 'Gestión de Proyectos' : 'Mensajes Recibidos'}
              </h1>
              <p className="text-muted-foreground">
                {activeView === 'projects'
                  ? 'Añade, edita y elimina los proyectos de tu portafolio.'
                  : 'Aquí puedes ver los mensajes enviados desde el formulario de contacto.'}
              </p>
            </div>
           </header>
          {activeView === 'projects' ? <ProjectsView /> : <MessagesView />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}


export default function OwnerPage() {
  return (
    <AuthGuard>
      <OwnerDashboard />
    </AuthGuard>
  );
}
