'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MessageSquare, LogOut } from 'lucide-react';
import { ProjectsView } from '@/components/propietario/ProjectsView';
import { MessagesView, type Message } from '@/components/propietario/MessagesView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Image from 'next/image';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';
import { collection, query, orderBy } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAvailability } from '@/hooks/use-availability';

function OwnerDashboard() {
  const [activeView, setActiveView] = useState('projects');
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const firestore = useFirestore();
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';
  const { isAvailable, setIsAvailable } = useAvailability();

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

  return (
    <div className="flex h-dvh overflow-hidden bg-muted text-foreground">
      <aside className="w-64 flex-shrink-0 bg-background rounded-2xl m-2 border border-border p-4 flex flex-col gap-8">
        <div className="flex items-center gap-3 p-2">
          <Image src={logoUrl} alt="Logo" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="text-lg font-semibold">Panel</span>
        </div>

        <nav className="flex flex-col gap-2">
          <Button
            variant={activeView === 'projects' ? 'secondary' : 'ghost'}
            className="justify-start gap-3"
            onClick={() => setActiveView('projects')}
          >
            <Briefcase className="h-4 w-4" />
            <span>Proyectos</span>
          </Button>
          <Button
            variant={activeView === 'messages' ? 'secondary' : 'ghost'}
            className="justify-start gap-3"
            onClick={() => setActiveView('messages')}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="flex-1 text-left">Mensajes</span>
            {newMessagesCount > 0 && (
              <Badge className="h-6 w-6 justify-center p-0 rounded-full bg-primary text-primary-foreground">{newMessagesCount}</Badge>
            )}
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
      </aside>

      <main className="flex-1 p-8 overflow-y-auto bg-background rounded-2xl m-2 ml-0 border border-border">
        <header className="mb-8">
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
        {activeView === 'projects' ? <ProjectsView /> : <MessagesView messages={messages} isLoading={isLoading} error={error} />}
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
