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


function OwnerDashboard() {
  const [activeView, setActiveView] = useState('projects');
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                <Briefcase size={18} />
              </div>
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
                   <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold">{user.displayName || 'Admin'}</p>
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
