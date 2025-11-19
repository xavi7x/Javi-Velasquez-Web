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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';


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
  
  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'A';
  };


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
               <Image src={logoUrl} alt="Logo" width={24} height={24} className="h-8 w-8 object-contain" />
              <span className="text-lg font-semibold">Panel</span>
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
                  Proyectos
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveView('messages')}
                  isActive={activeView === 'messages'}
                  tooltip="Ver mensajes de contacto"
                >
                  <MessageSquare />
                  Mensajes
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             {user && (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                   <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold">{user.displayName || user.email || 'Admin'}</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Volver al Inicio</Link>
              </Button>
               <Button variant="ghost" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
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
