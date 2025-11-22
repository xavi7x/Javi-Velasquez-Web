'use client';

import { useState } from 'react';
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import type { Invoice } from '@/lib/project-types';
import { Download, PlusCircle, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function FinancesView() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'invoices'), orderBy('issueDate', 'desc'));
  }, [firestore]);

  const { data: invoices, isLoading } = useCollection<Invoice>(invoicesQuery);

  const summary = invoices?.reduce(
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

  const handleDownload = (pdfUrl: string | undefined) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'No disponible',
        description: 'El PDF de esta factura no está disponible.'
      })
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
  const getStatusLabel = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return 'Pagada';
        case 'Pending': return 'Pendiente';
        case 'Overdue': return 'Vencida';
        default: return status;
    }
  }


  return (
    <div className="space-y-8">
       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Facturado</CardDescription>
            <CardTitle className="text-4xl">{formatCurrency(summary.totalBilled)}</CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Suma de todas las facturas emitidas.</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pagado</CardDescription>
            <CardTitle className="text-4xl">{formatCurrency(summary.totalPaid)}</CardTitle>
          </CardHeader>
          <CardFooter>
             <p className="text-xs text-muted-foreground">Suma de todas las facturas pagadas.</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saldo Pendiente</CardDescription>
            <CardTitle className="text-4xl">{formatCurrency(summary.totalPending)}</CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Suma de facturas pendientes y vencidas.</p>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Historial de Facturas</CardTitle>
            <CardDescription>Lista de todas las facturas emitidas a clientes.</CardDescription>
          </div>
          <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Factura
          </Button>
        </CardHeader>
        <CardContent>
           <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Factura</TableHead>
                  <TableHead className="hidden sm:table-cell">Concepto</TableHead>
                  <TableHead className="hidden lg:table-cell">Fecha Emisión</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-9 w-9 rounded-full inline-block" /></TableCell>
                        </TableRow>
                    ))
                ) : invoices?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No hay facturas.
                        </TableCell>
                    </TableRow>
                ) : invoices?.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">#{invoice.invoiceNumber}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate hidden sm:table-cell">
                      {invoice.concept || 'N/A'}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell">
                      {format(new Date(invoice.issueDate), 'dd MMM yyyy', { locale: es })}
                    </TableCell>
                     <TableCell>
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(invoice.status)}>
                            {getStatusLabel(invoice.status)}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleDownload(invoice.pdfUrl)}
                        disabled={!invoice.pdfUrl}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
