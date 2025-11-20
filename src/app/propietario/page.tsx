'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MessageSquare, LogOut, AreaChart, ExternalLink, Menu } from 'lucide-react';
import { ProjectsView } from '@/components/propietario/ProjectsView';
import { MessagesView, type Message } from '@/components/propietario/MessagesView';
import { AnalyticsView } from '@/components/propietario/AnalyticsView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth, useUser, useCollection, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Image from 'next/image';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';
import { collection, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAvailability } from '@/hooks/use-availability';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

function OwnerDashboard() {
  const [activeView, setActiveView] = useState('projects');
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const firestore = useFirestore();
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';
  const { isAvailable, setIsAvailable } = useAvailability();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings } = useDoc<{ isMaintenanceMode: boolean }>(settingsRef);
  
  const isMaintenanceMode = settings?.isMaintenanceMode ?? false;

  const setIsMaintenanceMode = async (value: boolean) => {
    if (settingsRef) {
      await setDoc(settingsRef, { isMaintenanceMode: value }, { merge: true });
    }
  };

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contactFormSubmissions'), orderBy('submissionDate', 'desc'));
  }, [firestore]);

  const { data: messages, isLoading, error } = useCollection<Message>(messagesQuery);

  useEffect(() => {
    if (messages) {
      const newCount = messages.filter(msg => msg.status === 'new').length;
      setNewMessagesCount(newCount);
    }
  }, [messages]);


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const handleViewChange = (view: string) => {
    setActiveView(view);
    setIsSheetOpen(false); // Close sheet on navigation
  }

  const renderView = () => {
    switch (activeView) {
      case 'projects':
        return <ProjectsView />;
      case 'messages':
        return <MessagesView messages={messages} isLoading={isLoading} error={error} />;
      case 'traffic':
        return <AnalyticsView />;
      default:
        return <ProjectsView />;
    }
  }

  const SidebarContent = () => (
     <div className="flex h-full flex-col gap-8 p-4">
      <div className="flex items-center gap-3 p-2">
        <Image src={logoUrl} alt="Logo" width={28} height={28} className="h-7 w-7 object-contain" />
        <span className="text-lg font-semibold">Panel</span>
      </div>

      <nav className="flex flex-col gap-2">
        <Button
          variant={activeView === 'projects' ? 'default' : 'ghost'}
          className="justify-start gap-3"
          onClick={() => handleViewChange('projects')}
        >
          <Briefcase className="h-4 w-4" />
          <span>Proyectos</span>
        </Button>
        <Button
          variant={activeView === 'messages' ? 'default' : 'ghost'}
          className="justify-start gap-3"
          onClick={() => handleViewChange('messages')}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="flex-1 text-left">Mensajes</span>
          {newMessagesCount > 0 && (
            <Badge className="h-6 w-6 justify-center p-0 rounded-full bg-primary text-primary-foreground">{newMessagesCount}</Badge>
          )}
        </Button>
          <Button
          variant={activeView === 'traffic' ? 'default' : 'ghost'}
          className="justify-start gap-3"
          onClick={() => handleViewChange('traffic')}
        >
          <AreaChart className="h-4 w-4" />
          <span>Tráfico</span>
        </Button>
      </nav>

      <div className="mt-auto space-y-4">
          <div className="flex items-center space-x-2 rounded-lg p-3">
            <Switch id="availability-mode" checked={isAvailable} onCheckedChange={setIsAvailable} />
            <Label htmlFor="availability-mode" className="flex flex-col">
              <span>Disponibilidad</span>
              <span className="font-normal text-xs text-muted-foreground">
                {isAvailable ? 'Visible' : 'Oculto'}
              </span>
            </Label>
          </div>

          <div className="flex items-center space-x-2 rounded-lg p-3">
            <Switch id="maintenance-mode" checked={isMaintenanceMode} onCheckedChange={setIsMaintenanceMode} />
            <Label htmlFor="maintenance-mode" className="flex flex-col">
              <span>Modo Construcción</span>
              <span className="font-normal text-xs text-muted-foreground">
                {isMaintenanceMode ? 'Activo' : 'Inactivo'}
              </span>
            </Label>
          </div>

        <div className="flex items-center justify-between">
          {user && (
            <div className="text-sm">
              <p className="font-semibold truncate">{user.displayName || user.email || 'Admin'}</p>
            </div>
          )}
          <ThemeSwitcher />
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild variant="outline" className="w-full justify-center">
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4 -scale-x-100" />
              <span>Volver al Inicio</span>
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-center" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-muted text-foreground">
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col bg-background rounded-2xl m-2 border border-border">
        <SidebarContent />
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-background rounded-2xl m-2 md:ml-0 border border-border">
          <header className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-4">
             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            <div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                {activeView === 'projects' && 'Gestión de Proyectos'}
                {activeView === 'messages' && 'Mensajes Recibidos'}
                {activeView === 'traffic' && 'Análisis de Tráfico'}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {activeView === 'projects' && 'Añade, edita y elimina los proyectos de tu portafolio.'}
                {activeView === 'messages' && 'Aquí puedes ver los mensajes enviados desde el formulario de contacto.'}
                {activeView === 'traffic' && 'Visualiza las métricas de visitas y rendimiento de tu sitio web.'}
              </p>
            </div>
          </div>
          {activeView === 'traffic' && (
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4"/>
                Ir a Analytics
              </Link>
            </Button>
          )}
        </header>
        {renderView()}
      </main>
    </div>
  );
}


export default function OwnerPage() {
  return (
    <AuthGuard>
      <OwnerDashboard />
    </AuthGuard>
  );
}
