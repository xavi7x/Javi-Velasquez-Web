
'use client';

import { useParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { Client, Project, Invoice } from '@/lib/project-types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Briefcase, FileText, BarChart } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function StatCard({ title, value, icon, isLoading }: { title: string; value: string; icon: React.ReactNode, isLoading?: boolean }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{value}</div>}
            </CardContent>
        </Card>
    )
}

export default function ClientDashboardPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Fetch Client Data
  const clientDocRef = useMemoFirebase(() => {
    if (!firestore || !clientId) return null;
    return doc(firestore, 'clients', clientId);
  }, [firestore, clientId]);
  const { data: client, isLoading: isClientLoading } = useDoc<Client>(clientDocRef);

  // Fetch Client Projects
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore || typeof clientId !== 'string' || !clientId.trim()) return null;
    return query(collection(firestore, 'client-projects'), where('clientId', '==', clientId));
  }, [firestore, clientId]);
  const { data: projects, isLoading: areProjectsLoading } = useCollection<Project>(projectsQuery);

  // Fetch Client Invoices
  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore || typeof clientId !== 'string' || !clientId.trim()) return null;
    return query(collection(firestore, 'invoices'), where('clientId', '==', clientId));
  }, [firestore, clientId]);
  const { data: invoices, isLoading: areInvoicesLoading } = useCollection<Invoice>(invoicesQuery);
  
  // Derived state
  const activeProjects = projects?.filter(p => (p.progress ?? 0) < 100) || [];
  const pendingInvoices = invoices?.filter(i => i.status === 'Pending') || [];
  const totalPendingAmount = pendingInvoices.reduce((acc, inv) => acc + inv.amount, 0);

  const isLoading = isUserLoading || isClientLoading || areProjectsLoading || areInvoicesLoading;

  // STRICT GUARD: Do not render anything until we have a client ID.
  // This is the primary fix for the "undefined path" error.
  if (!clientId || typeof clientId !== 'string') {
    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 space-y-8">
            <header>
                <Skeleton className="h-9 w-1/2 mb-2" />
                <Skeleton className="h-5 w-1/3" />
            </header>
            <div className="grid gap-4 md:grid-cols-3">
                 <Skeleton className="h-28 w-full" />
                 <Skeleton className="h-28 w-full" />
                 <Skeleton className="h-28 w-full" />
            </div>
             <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  // Security check: ensure the logged-in user matches the client ID in the URL
  if (!isUserLoading && user && user.uid !== clientId) {
    // Also check if user is owner
    // This part requires checking for owner role, which might not be available here directly.
    // For now, we restrict to the client themselves. A more robust check might involve a custom hook `useOwner()`.
    return (
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 text-center">
        <h1 className="text-2xl font-bold text-destructive">Acceso Denegado</h1>
        <p className="text-muted-foreground">No tienes permiso para ver esta página.</p>
      </div>
    );
  }

  const getStatusLabel = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return 'Pagada';
        case 'Pending': return 'Pendiente';
        case 'Overdue': return 'Vencida';
        default: return status;
    }
  }

   const getStatusVariant = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return 'default';
        case 'Pending': return 'secondary';
        case 'Overdue': return 'destructive';
        default: return 'outline';
    }
  }

   const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  }


  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 space-y-8">
      <header>
        {isLoading ? (
            <>
                <Skeleton className="h-9 w-1/2 mb-2" />
                <Skeleton className="h-5 w-1/3" />
            </>
        ): (
            <>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard de {client?.name}</h1>
                <p className="text-muted-foreground">Bienvenido a tu centro de control de proyectos.</p>
            </>
        )}
      </header>

      <section>
        <div className="grid gap-4 md:grid-cols-3">
            <StatCard 
                title="Proyectos Activos"
                value={isLoading ? '-' : activeProjects.length.toString()}
                icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                isLoading={isLoading}
            />
            <StatCard 
                title="Facturas Pendientes"
                value={isLoading ? '-' : pendingInvoices.length.toString()}
                icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                isLoading={isLoading}
            />
            <StatCard 
                title="Monto Pendiente"
                value={isLoading ? '-' : formatCurrency(totalPendingAmount)}
                icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
                isLoading={isLoading}
            />
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Mis Proyectos</CardTitle>
            <CardDescription>Resumen del estado y progreso de tus proyectos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead className="w-[250px]">Progreso</TableHead>
                  <TableHead className="text-right">Última Actualización</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areProjectsLoading ? (
                  [...Array(2)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : projects && projects.length > 0 ? (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress || 0} className="w-[60%]" />
                          <span className="text-xs text-muted-foreground">{project.progress || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {project.updatedAt ? format(project.updatedAt.toDate(), 'dd MMM yyyy', { locale: es }) : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">No tienes proyectos asignados.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
      
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Mis Facturas</CardTitle>
            <CardDescription>Historial de facturación y pagos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Factura</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha Emisión</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areInvoicesLoading ? (
                   [...Array(2)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : invoices && invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">#{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.concept}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell className="text-muted-foreground">{format(new Date(invoice.issueDate), 'dd MMM yyyy', { locale: es })}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getStatusVariant(invoice.status)}>{getStatusLabel(invoice.status)}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">No tienes facturas.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}

    