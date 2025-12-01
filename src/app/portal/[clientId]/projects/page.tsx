'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, History, AlertCircle, ExternalLink, FileText, BadgeDollarSign, CalendarDays, Info } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Invoice } from '@/lib/project-types';
import { ProgressTimeline } from '@/components/shared/ProgressTimeline';


// --- TIPOS ---
interface ProgressUpdate {
  progress: number;
  comment: string;
  date: Timestamp | Date;
}

interface ProjectData {
  id: string;
  title: string;
  description?: string | { challenge: string }; // Adaptado a tu código
  progress: number;
  progressHistory?: ProgressUpdate[];
  clientId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  downloadUrl?: string;
  invoiceId?: string;
}

// --- SUB-COMPONENTE DE HISTORIAL ---
function ProjectHistory({ history }: { history?: ProgressUpdate[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
        No hay historial de avances registrado para este proyecto.
      </div>
    );
  }

  // Ordenamos el historial del más reciente al más antiguo en el cliente
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = a.date instanceof Timestamp ? a.date.toMillis() : new Date(a.date).getTime();
    const dateB = b.date instanceof Timestamp ? b.date.toMillis() : new Date(b.date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="p-4 space-y-4 bg-muted/30 rounded-b-lg">
      <h4 className="font-semibold flex items-center gap-2 text-sm text-foreground">
        <History className="h-4 w-4" />
        Historial de Avances
      </h4>
      <div className="relative pl-6">
        {/* Línea vertical de tiempo */}
        <div className="absolute left-[3px] top-2 h-[calc(100%-10px)] w-0.5 bg-border -translate-x-1/2"></div>
        <ul className="space-y-6">
          {sortedHistory.map((item, index) => {
            const itemDate = item.date instanceof Timestamp ? item.date.toDate() : new Date(item.date);
            return (
              <li key={index} className="relative">
                <div className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background shadow-sm"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    {format(itemDate, "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    Progreso actualizado al <span className="text-primary">{item.progress}%</span>
                  </span>
                  {item.comment && (
                    <p className="text-sm text-muted-foreground italic bg-background/50 p-2 rounded border mt-1">
                      "{item.comment}"
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function ProjectsPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const firestore = useFirestore();
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // 1. QUERY DE PROYECTOS
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore || !clientId) return null;
    return query(
      collection(firestore, 'client-projects'),
      where('clientId', '==', clientId)
    );
  }, [firestore, clientId]);
  const { data: projects, loading: isLoadingProjects, error: projectsError } = useCollection<ProjectData>(projectsQuery);

  // 2. QUERY DE FACTURAS
  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore || !clientId) return null;
    return query(collection(firestore, 'invoices'), where('clientId', '==', clientId));
  }, [firestore, clientId]);
  const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);

  const associatedInvoice = selectedProject?.invoiceId 
    ? invoices?.find(inv => inv.id === selectedProject.invoiceId)
    : null;

  // --- RENDERIZADO ---
  
  if (projectsError) {
    return (
       <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Error cargando proyectos</h2>
        <p className="text-muted-foreground">Hubo un problema de conexión. Intenta recargar.</p>
      </div>
    );
  }

  const renderSkeletons = () => (
    [...Array(2)].map((_, i) => (
      <Card key={i} className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 flex-grow rounded-full" />
            <Skeleton className="h-4 w-10" />
          </div>
        </CardContent>
      </Card>
    ))
  );
  
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
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedProject(null)}>
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
          <p className="text-muted-foreground">
            Un resumen detallado del estado y progreso de cada uno de tus desarrollos.
          </p>
        </header>

        <div className="grid gap-6">
          {isLoadingProjects ? renderSkeletons() : (
            projects && projects.length > 0 ? (
              projects.map(project => (
                <Card key={project.id} className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <DialogTrigger asChild>
                          <button onClick={() => setSelectedProject(project)}>
                            <CardTitle className="text-xl text-left hover:underline">{project.title}</CardTitle>
                          </button>
                        </DialogTrigger>
                        {project.description && (
                           <CardDescription className="line-clamp-2 text-left">
                             {typeof project.description === 'string' ? project.description : project.description.challenge}
                           </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Avance General</span>
                        <span className="font-bold text-primary">{project.progress || 0}%</span>
                      </div>
                      <ProgressTimeline
                        progress={project.progress || 0}
                        history={project.progressHistory || []}
                      />
                    </div>
                  </CardContent>

                  {/* Acordeón de Historial */}
                  <Accordion type="single" collapsible className="w-full border-t bg-muted/10">
                    <AccordionItem value="history" className="border-b-0">
                      <AccordionTrigger className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:no-underline transition-colors">
                        Ver historial de avances
                      </AccordionTrigger>
                      <AccordionContent className="p-0">
                        <ProjectHistory history={project.progressHistory} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              ))
            ) : (
              <Card className="flex flex-col items-center justify-center h-64 border-dashed bg-muted/5">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No hay proyectos activos</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm text-center">
                  Actualmente no tienes proyectos asignados. Cuando iniciemos un nuevo desarrollo, aparecerá aquí.
                </p>
              </Card>
            )
          )}
        </div>
      </div>
      
      {selectedProject && (
        <DialogContent className="max-w-2xl">
           <DialogHeader>
              <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
              <DialogDescription>
                  {typeof selectedProject.description === 'string' ? selectedProject.description : selectedProject.description?.challenge}
              </DialogDescription>
            </DialogHeader>

             <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground border-y py-4">
                {(selectedProject.createdAt || selectedProject.updatedAt) && (
                    <>
                        {selectedProject.createdAt && (
                             <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4"/>
                                <span><span className="font-semibold text-foreground">Inicio:</span> {format(selectedProject.createdAt.toDate(), "dd MMM, yyyy", { locale: es })}</span>
                            </div>
                        )}
                         {selectedProject.updatedAt && (
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                <span><span className="font-semibold text-foreground">Últ. Act:</span> {format(selectedProject.updatedAt.toDate(), "dd MMM, yyyy", { locale: es })}</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="grid gap-6 py-4">
              {selectedProject.downloadUrl && (
                  <Button asChild>
                    <Link href={selectedProject.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Acceder al Proyecto
                    </Link>
                  </Button>
              )}

              <div className="space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Factura Asociada
                  </h4>
                  {isLoadingInvoices ? (
                    <Skeleton className="h-24 w-full" />
                  ) : associatedInvoice ? (
                      <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="font-mono text-sm">#{associatedInvoice.invoiceNumber}</p>
                            <Badge variant={getStatusVariant(associatedInvoice.status)}>
                              {getStatusLabel(associatedInvoice.status)}
                            </Badge>
                          </div>
                           <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <BadgeDollarSign className="h-4 w-4" />
                              <span className="font-semibold">{formatCurrency(associatedInvoice.amount)}</span>
                            </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span>Emisión: {format(new Date(associatedInvoice.issueDate), 'dd MMM yyyy', { locale: es })}</span>
                          </div>
                      </div>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground p-4 border border-dashed rounded-lg flex items-center justify-center gap-2">
                      <Info className="h-4 w-4" />
                      No hay una factura asociada a este proyecto.
                    </div>
                  )}
              </div>
            </div>
        </DialogContent>
      )}

    </Dialog>
  );
}
