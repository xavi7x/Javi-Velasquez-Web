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
import { Briefcase, MessageSquare, User } from 'lucide-react';
import { ProjectsView } from '@/components/propietario/ProjectsView';
import { MessagesView } from '@/components/propietario/MessagesView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OwnerPage() {
  const [activeView, setActiveView] = useState('projects');

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
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                 <User size={20} />
              </div>
              <div className="text-sm">
                <p className="font-semibold">Javier</p>
                <p className="text-muted-foreground">Admin</p>
              </div>
            </div>
             <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/">Volver al Inicio</Link>
            </Button>
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
