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
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Briefcase,
  CreditCard,
  MessageSquare,
  Users,
} from 'lucide-react';
import { getAnalyticsData, type AnalyticsDataOutput } from '@/ai/flows/get-analytics-data';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Invoice } from '@/lib/project-types';
import { Skeleton } from '../ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '../ui/separator';

interface DashboardViewProps {
  setActiveView: (view: string) => void;
  isAvailable: boolean;
  setIsAvailable: (value: boolean) => void;
  isMaintenanceMode: boolean;
  setIsMaintenanceMode: (value: boolean) => void;
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

export function DashboardView({ 
  setActiveView,
  isAvailable,
  setIsAvailable,
  isMaintenanceMode,
  setIsMaintenanceMode
 }: DashboardViewProps) {
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

      <div className="grid gap-6">
        {/* Quick Actions & Recent Clients */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Accesos Rápidos y Controles</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveView('projects')}><Briefcase className="mr-2"/>Proyectos</Button>
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveView('clients')}><Users className="mr-2"/>Clientes</Button>
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveView('finance')}><CreditCard className="mr-2"/>Finanzas</Button>
                    <Button variant="outline" className="w-full justify-start h-12" onClick={() => setActiveView('messages')}><MessageSquare className="mr-2"/>Mensajes</Button>
                </CardContent>
                <Separator className="my-4"/>
                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                   <div className="flex items-center space-x-4 rounded-lg p-3">
                      <Switch
                        id="availability-mode"
                        checked={isAvailable}
                        onCheckedChange={setIsAvailable}
                      />
                      <Label htmlFor="availability-mode" className="flex flex-col">
                        <span>Disponibilidad</span>
                        <span className="font-normal text-xs text-muted-foreground">
                          {isAvailable ? 'Visible en la web' : 'Oculto'}
                        </span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-4 rounded-lg p-3">
                      <Switch
                        id="maintenance-mode"
                        checked={isMaintenanceMode}
                        onCheckedChange={setIsMaintenanceMode}
                      />
                      <Label htmlFor="maintenance-mode" className="flex flex-col">
                        <span>Modo Construcción</span>
                        <span className="font-normal text-xs text-muted-foreground">
                          {isMaintenanceMode ? 'Página principal desactivada' : 'Página principal activa'}
                        </span>
                      </Label>
                    </div>
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
