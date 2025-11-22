'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  MessageSquare,
  LogOut,
  AreaChart,
  ExternalLink,
  Menu,
  Users,
  CreditCard,
  LayoutDashboard,
  User,
} from 'lucide-react';
import { DashboardView } from '@/components/propietario/DashboardView';
import { ProjectsView } from '@/components/propietario/ProjectsView';
import { ClientsView } from '@/components/propietario/ClientsView';
import { ProfileView } from '@/components/propietario/ProfileView';
import {
  MessagesView,
  type Message,
} from '@/components/propietario/MessagesView';
import { AnalyticsView } from '@/components/propietario/AnalyticsView';
import { FinancesView } from '@/components/propietario/FinancesView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  useAuth,
  useUser,
  useCollection,
  useFirestore,
  useDoc,
  useMemoFirebase,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';
import { collection, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAvailability } from '@/hooks/use-availability';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function OwnerDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const firestore = useFirestore();
  const logoUrl =
    'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';
  const { isAvailable, setIsAvailable } = useAvailability();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );

  const isMaintenanceMode = settings?.isMaintenanceMode ?? false;

  const setIsMaintenanceMode = async (value: boolean) => {
    if (settingsRef) {
      const data = { isMaintenanceMode: value };
      setDoc(settingsRef, data, { merge: true }).catch((error) => {
        const contextualError = new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'update',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', contextualError);
      });
    }
  };

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'contactFormSubmissions'),
      orderBy('submissionDate', 'desc')
    );
  }, [firestore]);

  const {
    data: messages,
    isLoading,
    error,
  } = useCollection<Message>(messagesQuery);

  useEffect(() => {
    if (messages) {
      const newCount = messages.filter((msg) => msg.status === 'new').length;
      setNewMessagesCount(newCount);
    }
  }, [messages]);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setIsSheetOpen(false); // Close sheet on navigation
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            setActiveView={setActiveView}
            isAvailable={isAvailable}
            setIsAvailable={setIsAvailable}
            isMaintenanceMode={isMaintenanceMode}
            setIsMaintenanceMode={setIsMaintenanceMode}
          />
        );
      case 'projects':
        return <ProjectsView />;
      case 'clients':
        return <ClientsView />;
       case 'profile':
        return <ProfileView />;
      case 'messages':
        return (
          <MessagesView
            messages={messages}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'traffic':
        return <AnalyticsView />;
      case 'finance':
        return <FinancesView />;
      default:
        return (
          <DashboardView
            setActiveView={setActiveView}
            isAvailable={isAvailable}
            setIsAvailable={setIsAvailable}
            isMaintenanceMode={isMaintenanceMode}
            setIsMaintenanceMode={setIsMaintenanceMode}
          />
        );
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-8 p-4">
      <div className="flex items-center gap-3 p-2">
        <Image
          src={logoUrl}
          alt="Logo"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
        <span className="text-lg font-semibold">Panel</span>
      </div>

      <nav className="flex flex-col gap-2">
        <Button
          variant={activeView === 'dashboard' ? 'default' : 'ghost'}
          className="justify-start gap-3"
          onClick={() => handleViewChange('dashboard')}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Button>
        <Button
          variant={activeView === 'projects' ? 'default' : 'ghost'}
          className="justify-start gap-3"
          onClick={() => handleViewChange('projects')}
        >
          <Briefcase className="h-4 w-4" />
          <span>Proyectos</span>
        </Button>
        <Button
          variant={activeView === 'clients' ? 'default' : 'ghost'}
          className="justify-start gap-3"
          onClick={() => handleViewChange('clients')}
        >
          <Users className="h-4 w-4" />
          <span>Clientes</span>
        </Button>
        <Button
          variant={activeView === 'finance' ? 'default' : 'ghost'}
          className="justify-start gap-3"
          onClick={() => handleViewChange('finance')}
        >
          <CreditCard className="h-4 w-4" />
          <span>Finanzas</span>
        </Button>
         <Button
          variant={activeView === 'profile' ? 'default' : 'ghost'}
          className="justify-start gap-3"
          onClick={() => handleViewChange('profile')}
        >
          <User className="h-4 w-4" />
          <span>Mi Perfil</span>
        </Button>
        <Button
          variant={activeView === 'messages' ? 'default' : 'ghost'}
          className="justify-start gap-3"
          onClick={() => handleViewChange('messages')}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="flex-1 text-left">Mensajes</span>
          {newMessagesCount > 0 && (
            <Badge className="h-6 w-6 justify-center p-0 rounded-full bg-primary text-primary-foreground">
              {newMessagesCount}
            </Badge>
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
        <div className="flex items-center justify-between">
          {user && (
            <div className="text-sm">
              <p className="font-semibold truncate">
                {user.displayName || user.email || 'Admin'}
              </p>
            </div>
          )}
          <ThemeSwitcher />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            asChild
            variant="outline"
            className="w-full justify-center"
          >
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4 -scale-x-100" />
              <span>Volver al Inicio</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={handleLogout}
          >
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
                <SheetHeader>
                  <SheetTitle className="sr-only">Menú del Panel</SheetTitle>
                </SheetHeader>
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                {activeView === 'dashboard' && 'Dashboard'}
                {activeView === 'projects' && 'Gestión de Proyectos'}
                {activeView === 'clients' && 'Gestión de Clientes'}
                {activeView === 'profile' && 'Mi Perfil'}
                {activeView === 'messages' && 'Mensajes Recibidos'}
                {activeView === 'traffic' && 'Análisis de Tráfico'}
                {activeView === 'finance' && 'Gestión Financiera'}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {activeView === 'dashboard' && 'Una vista general de toda tu actividad.'}
                {activeView === 'projects' &&
                  'Añade, edita y elimina los proyectos de tu portafolio.'}
                {activeView === 'clients' &&
                  'Administra las cuentas y el acceso de tus clientes.'}
                {activeView === 'profile' && 'Actualiza tu información pública y de perfil.'}
                {activeView === 'finance' &&
                  'Visualiza el estado de las facturas y pagos.'}
                {activeView === 'messages' &&
                  'Aquí puedes ver los mensajes enviados desde el formulario de contacto.'}
                {activeView === 'traffic' &&
                  'Visualiza las métricas de visitas y rendimiento de tu sitio web.'}
              </p>
            </div>
          </div>
          {activeView === 'traffic' && (
            <Button asChild>
              <Link
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver en Google Analytics
              </Link>
            </Button>
          )}
        </header>
        {renderView()}
      </main>
    </div>
  );
}
