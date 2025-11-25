'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, Timestamp } from 'firebase/firestore';
import type { Client, Project, Invoice } from '@/lib/project-types';
import { useClientProjects } from '@/firebase/firestore/hooks/use-client-projects';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

export default function ClientDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Fetch client data
  const clientDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'clients', user.uid);
  }, [firestore, user]);
  const { data: clientData, isLoading: isClientLoading } = useDoc<Client>(clientDocRef);

  // Fetch active project
  const { data: projects, isLoading: areProjectsLoading } = useClientProjects({ 
    clientId: user?.uid
  });
  
  const activeProjects = projects?.filter(p => p.progress !== undefined && p.progress < 100);
  const activeProject = activeProjects?.[0]; // Get the most recent active project

  // Fetch invoices to calculate pending payments
  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'invoices'), where('clientId', '==', user.uid), where('status', '==', 'Pending'));
  }, [firestore, user]);
  const { data: pendingInvoices, isLoading: areInvoicesLoading } = useCollection<Invoice>(invoicesQuery);

  const pendingPaymentsAmount = pendingInvoices?.reduce((sum, invoice) => sum + invoice.amount, 0) || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  }

  const getDeadline = (project: Project) => {
    if (!project.estimatedDeliveryDate) return 'No definida';
    const date = project.estimatedDeliveryDate instanceof Timestamp ? project.estimatedDeliveryDate.toDate() : new Date(project.estimatedDeliveryDate);
    return format(date, 'dd MMM, yyyy');
  }
  
  const isLoading = isUserLoading || isClientLoading || areProjectsLoading || areInvoicesLoading;

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {isLoading ? <Skeleton className="h-9 w-48" /> : `Hola, ${clientData?.name || 'Cliente'}`}
        </h1>
        <p className="text-muted-foreground">Bienvenido a tu portal de cliente.</p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-full" /></CardContent></Card>
        ) : activeProject ? (
            <Card>
            <CardHeader>
                <CardTitle>Proyecto Activo</CardTitle>
                <CardDescription>{activeProject.title}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    En Progreso ({activeProject.progress || 0}%)
                </span>
                <Button asChild variant="outline" size="sm">
                    <Link href={`/portal/projects/${activeProject.id}`}>Ver Detalles</Link>
                </Button>
                </div>
            </CardContent>
            </Card>
        ) : (
             <Card>
                <CardHeader>
                    <CardTitle>Proyecto Activo</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground text-sm pt-6">
                    No tienes proyectos activos en este momento.
                </CardContent>
            </Card>
        )}
        
        {isLoading ? (
             <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-full" /></CardContent></Card>
        ) : (
            <Card>
            <CardHeader>
                <CardTitle>Pagos Pendientes</CardTitle>
                <CardDescription>Facturas que requieren tu atención.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{formatCurrency(pendingPaymentsAmount)}</span>
                <Button asChild variant="default" size="sm" disabled={pendingPaymentsAmount === 0}>
                    <Link href="/portal/invoices">Ir a Finanzas</Link>
                </Button>
                </div>
            </CardContent>
            </Card>
        )}

        {isLoading ? (
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-full" /></CardContent></Card>
        ) : (
            <Card>
            <CardHeader>
                <CardTitle>Próxima Entrega</CardTitle>
                <CardDescription>Fecha clave en tu proyecto.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      {activeProject ? getDeadline(activeProject) : 'No definida'}
                    </span>
                    <Button asChild variant="secondary" size="sm" disabled={!activeProject}>
                        <Link href={`/portal/projects/${activeProject?.id || ''}`}>Ver Cronograma</Link>
                    </Button>
                </div>
            </CardContent>
            </Card>
        )}
      </div>

       <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col justify-center items-center p-6 text-center">
                <CardHeader>
                    <CardTitle>¿Necesitas un cambio?</CardTitle>
                    <CardDescription>Crea una nueva solicitud para ajustes, cambios o nuevas ideas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild size="lg">
                        <Link href="/portal/requests/new">Crear Solicitud</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="flex flex-col justify-center items-center p-6 text-center">
                <CardHeader>
                    <CardTitle>Acceso a tus Archivos</CardTitle>
                    <CardDescription>Encuentra todos los entregables, logos y documentos importantes aquí.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline" size="lg" disabled={!activeProject}>
                        <Link href={`/portal/projects/${activeProject?.id || ''}?tab=files`}>Ir a Archivos</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}
