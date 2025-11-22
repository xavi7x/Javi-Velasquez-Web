'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CreditCard,
  MessageSquare,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { getAnalyticsData, type AnalyticsDataOutput } from '@/ai/flows/get-analytics-data';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Invoice, Project, Client } from '@/lib/project-types';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardViewProps {
  setActiveView: (view: string) => void;
}

const StatCard = ({ title, value, footer, isLoading }: { title: string, value: string, footer: string, isLoading: boolean }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardDescription>{title}</CardDescription>
            {isLoading ? <Skeleton className="h-10 w-1/3" /> : <CardTitle className="text-4xl">{value}</CardTitle>}
        </CardHeader>
        <CardFooter>
            {isLoading ? <Skeleton className="h-3 w-1/2" /> : <p className="text-xs text-muted-foreground">{footer}</p>}
        </CardFooter>
    </Card>
);

export function DashboardView({ setActiveView }: DashboardViewProps) {
  const [analytics, setAnalytics] = useState<AnalyticsDataOutput | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const firestore = useFirestore();

  // Fetch Invoices
  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'invoices'), orderBy('issueDate', 'desc'));
  }, [firestore]);
  const { data: invoices, isLoading: isInvoicesLoading } = useCollection<Invoice>(invoicesQuery);
  
  // Fetch Projects
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('order', 'asc'), limit(5));
  }, [firestore]);
  const { data: projects, isLoading: isProjectsLoading } = useCollection<Project>(projectsQuery);

  // Fetch Clients
  const clientsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'clients'), orderBy('name', 'asc'), limit(5));
  }, [firestore]);
  const { data: clients, isLoading: isClientsLoading } = useCollection<Client>(clientsQuery);

  // Fetch Messages
   const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'contactFormSubmissions'),
      orderBy('submissionDate', 'desc')
    );
  }, [firestore]);
  const { data: messages } = useCollection(messagesQuery);
  const unreadMessagesCount = messages?.filter(msg => msg.status === 'new').length || 0;


  // Fetch Analytics
  useEffect(() => {
    async function fetchData() {
      setIsAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        const result = await getAnalyticsData();
        setAnalytics(result);
      } catch (e: any) {
        setAnalyticsError(e.message || 'Error al cargar datos de Analytics.');
      } finally {
        setIsAnalyticsLoading(false);
      }
    }
    fetchData();
  }, []);
  
  const financialSummary = invoices?.reduce(
    (acc, invoice) => {
      acc.totalBilled += invoice.amount;
      if (invoice.status === 'Paid') {
        acc.totalPaid += invoice.amount;
      } else if (invoice.status === 'Pending') {
        acc.totalPending += invoice.amount;
      }
      return acc;
    },
    { totalBilled: 0, totalPaid: 0, totalPending: 0 }
  ) || { totalBilled: 0, totalPaid: 0, totalPending: 0 };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Visitantes Únicos" 
            value={analytics?.stats?.totalUsers || '0'} 
            footer="Últimos 28 días"
            isLoading={isAnalyticsLoading}
        />
        <StatCard 
            title="Total Facturado" 
            value={formatCurrency(financialSummary.totalBilled)} 
            footer="Suma de todas las facturas"
            isLoading={isInvoicesLoading}
        />
        <StatCard 
            title="Saldo Pendiente" 
            value={formatCurrency(financialSummary.totalPending)} 
            footer="Facturas pendientes y vencidas"
            isLoading={isInvoicesLoading}
        />
        <StatCard 
            title="Mensajes Nuevos" 
            value={String(unreadMessagesCount)} 
            footer="En tu bandeja de entrada"
            isLoading={false}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions & Recent Clients */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Accesos Rápidos</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveView('projects')}><Briefcase className="mr-2"/>Proyectos</Button>
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveView('clients')}><Users className="mr-2"/>Clientes</Button>
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveView('finance')}><CreditCard className="mr-2"/>Finanzas</Button>
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveView('messages')}><MessageSquare className="mr-2"/>Mensajes</Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                     <div className="space-y-1.5">
                        <CardTitle>Clientes Recientes</CardTitle>
                        <CardDescription>Tus últimos clientes añadidos.</CardDescription>
                    </div>
                     <Button variant="ghost" size="sm" onClick={() => setActiveView('clients')}>
                        Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardHeader>
                 <CardContent>
                    {isClientsLoading ? (
                        <div className="space-y-2">
                             <Skeleton className="h-5 w-4/5" />
                             <Skeleton className="h-5 w-2/3" />
                        </div>
                    ): clients?.length ? (
                        <ul className="space-y-2">
                            {clients.map(c => <li key={c.id} className="text-sm text-muted-foreground">{c.name}</li>)}
                        </ul>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No hay clientes aún.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>

       {analyticsError && (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <AlertCircle />
                        Error al cargar datos de Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="mt-2 p-3 bg-muted rounded-md text-xs whitespace-pre-wrap font-code">
                        {analyticsError}
                    </pre>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
