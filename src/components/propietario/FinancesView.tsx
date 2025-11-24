'use client';

import { useState, useMemo } from 'react';
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
  CardFooter,
} from '@/components/ui/card';
import type { Invoice, Client, Project } from '@/lib/project-types';
import { Download, PlusCircle, Loader2 } from 'lucide-react';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import {
  collection,
  query,
  orderBy,
  addDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const emptyInvoice: Partial<Invoice> = {
  invoiceNumber: '',
  concept: '',
  amount: 0,
  issueDate: new Date().toISOString(),
  dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
  status: 'Pending',
  clientId: '',
  projectId: '',
};

export function FinancesView() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>(emptyInvoice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data queries
  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'invoices'), orderBy('issueDate', 'desc'));
  }, [firestore]);

  const clientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'clients'), orderBy('name', 'asc'));
  }, [firestore]);

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('title', 'asc'));
  }, [firestore]);

  const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);
  const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);
  const { data: projects, isLoading: isLoadingProjects } = useCollection<Project>(projectsQuery);

  const projectsForSelectedClient = useMemo(() => {
    if (!newInvoice.clientId || !projects) return [];
    return projects.filter(p => p.clientId === newInvoice.clientId);
  }, [newInvoice.clientId, projects]);


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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !newInvoice.clientId || !newInvoice.projectId || !newInvoice.invoiceNumber) {
      toast({ variant: 'destructive', title: 'Campos requeridos', description: 'Por favor, completa todos los campos obligatorios.' });
      return;
    }
    setIsSubmitting(true);
    
    try {
      const invoicesCollection = collection(firestore, 'invoices');
      const invoiceData = {
        ...newInvoice,
        amount: Number(newInvoice.amount || 0),
        status: 'Pending',
        id: '', // Firestore will generate
      }
      
      const docRef = await addDoc(invoicesCollection, invoiceData);
      // This part might need adjustment based on final data structure
      // await addDoc(collection(firestore, `clients/${newInvoice.clientId}/invoices`), { invoiceId: docRef.id });

      toast({
        title: 'Factura Creada',
        description: `La factura #${newInvoice.invoiceNumber} ha sido creada con éxito.`
      });
      setIsModalOpen(false);
      setNewInvoice(emptyInvoice);
    } catch (error: any) {
      console.error("Error creating invoice: ", error);
      const contextualError = new FirestorePermissionError({
          path: 'invoices',
          operation: 'create',
          requestResourceData: newInvoice
      });
      errorEmitter.emit('permission-error', contextualError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="space-y-8">
       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Facturado</CardDescription>
            <CardTitle className="text-4xl">{isLoadingInvoices ? <Skeleton className="h-10 w-3/4" /> : formatCurrency(summary.totalBilled)}</CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Suma de todas las facturas emitidas.</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pagado</CardDescription>
            <CardTitle className="text-4xl">{isLoadingInvoices ? <Skeleton className="h-10 w-3/4" /> : formatCurrency(summary.totalPaid)}</CardTitle>
          </CardHeader>
          <CardFooter>
             <p className="text-xs text-muted-foreground">Suma de todas las facturas pagadas.</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saldo Pendiente</CardDescription>
            <CardTitle className="text-4xl">{isLoadingInvoices ? <Skeleton className="h-10 w-3/4" /> : formatCurrency(summary.totalPending)}</CardTitle>
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
          <Button onClick={() => setIsModalOpen(true)}>
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
                {isLoadingInvoices ? (
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

    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear Nueva Factura</DialogTitle>
          <DialogDescription>
            Completa los detalles para generar una nueva factura.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} id="invoice-form" className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1 pr-4">
          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Select
              value={newInvoice.clientId}
              onValueChange={(value) => setNewInvoice({ ...newInvoice, clientId: value, projectId: '' })}
              disabled={isLoadingClients}
            >
              <SelectTrigger id="client">
                <SelectValue placeholder="Selecciona un cliente..." />
              </SelectTrigger>
              <SelectContent>
                {clients?.map(client => (
                  <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Proyecto</Label>
            <Select
              value={newInvoice.projectId}
              onValueChange={(value) => setNewInvoice({ ...newInvoice, projectId: value })}
              disabled={!newInvoice.clientId || isLoadingProjects}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Selecciona un proyecto..." />
              </SelectTrigger>
              <SelectContent>
                {projectsForSelectedClient.map(project => (
                  <SelectItem key={project.id} value={project.id}>{project.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Número de Factura</Label>
            <Input id="invoiceNumber" value={newInvoice.invoiceNumber} onChange={e => setNewInvoice({...newInvoice, invoiceNumber: e.target.value})} placeholder="Ej: 00123" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concept">Concepto</Label>
            <Input id="concept" value={newInvoice.concept} onChange={e => setNewInvoice({...newInvoice, concept: e.target.value})} placeholder="Ej: Desarrollo de landing page" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Monto (CLP)</Label>
            <Input id="amount" type="number" value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: Number(e.target.value)})} placeholder="Ej: 500000" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Emisión</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newInvoice.issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newInvoice.issueDate ? format(new Date(newInvoice.issueDate), "PPP", { locale: es }) : <span>Elige una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newInvoice.issueDate ? new Date(newInvoice.issueDate) : undefined}
                    onSelect={(date) => setNewInvoice({...newInvoice, issueDate: date?.toISOString()})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Fecha de Vencimiento</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newInvoice.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newInvoice.dueDate ? format(new Date(newInvoice.dueDate), "PPP", { locale: es }) : <span>Elige una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newInvoice.dueDate ? new Date(newInvoice.dueDate) : undefined}
                    onSelect={(date) => setNewInvoice({...newInvoice, dueDate: date?.toISOString()})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </form>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" form="invoice-form" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              {isSubmitting ? 'Creando...' : 'Crear Factura'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
