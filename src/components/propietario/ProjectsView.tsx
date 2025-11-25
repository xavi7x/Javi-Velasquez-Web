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
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { ProgressUpdate, ClientProject, Client } from '@/lib/project-types';
import { PlusCircle, Loader2, Edit, ChevronDown, History, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, addDoc, query, orderBy, serverTimestamp, Timestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { useClientProjects } from '@/firebase/firestore/hooks/use-client-projects';
import { ClientProjectService } from '@/firebase/firestore/services/client-project-service';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';
import React from 'react';

const emptyProject: Partial<ClientProject> = {
  title: '',
  description: '',
  status: 'active',
  clientId: '',
  clientName: '',
  progress: 0,
  progressHistory: [],
};

const ITEMS_PER_PAGE = 5;

const ProjectHistory = ({ history }: { history: ProgressUpdate[] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  if (!history || history.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-4">
        No hay historial de progreso para este proyecto.
      </div>
    );
  }
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = a.date instanceof Timestamp ? a.date.toMillis() : new Date(a.date).getTime();
    const dateB = b.date instanceof Timestamp ? b.date.toMillis() : new Date(b.date).getTime();
    return dateB - dateA;
  });

  const paginatedHistory = sortedHistory.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );


  return (
    <div className="p-4 space-y-4">
      <h4 className="font-semibold flex items-center gap-2">
        <History className="h-4 w-4" />
        Historial de Avances
      </h4>
      <ul className="space-y-4">
        {paginatedHistory.map((item, index) => {
          const itemDate = item.date instanceof Timestamp ? item.date.toDate() : new Date(item.date);
          return (
            <li key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-px flex-grow bg-border" />
                <div className="h-3 w-3 rounded-full bg-primary/50" />
                <div className="w-px flex-grow bg-border" />
              </div>
              <div className="pb-4 flex-1">
                <p className="text-xs text-muted-foreground">
                  {format(itemDate, "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                </p>
                <p className="text-sm font-medium">Progreso actualizado al {item.progress}%</p>
                <p className="text-sm text-muted-foreground italic mt-1">"{item.comment}"</p>
              </div>
            </li>
        )})}
      </ul>
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};


export function ProjectsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<ClientProject> | null>(null);
  const [progressComment, setProgressComment] = useState('');
  const [showProgressComment, setShowProgressComment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const { data: projects, isLoading: isLoadingProjects } = useClientProjects();
  
  const clientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'clients'), orderBy('name', 'asc'));
  }, [firestore]);

  const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);

  const openAddModal = () => {
    setEditingProject(emptyProject);
    setProgressComment('');
    setShowProgressComment(false);
    setIsModalOpen(true);
  };
  
  const openEditModal = (project: ClientProject) => {
    setEditingProject(project);
    setProgressComment('');
    setShowProgressComment(false);
    setIsModalOpen(true);
  };
  
  const handleFormChange = (field: keyof ClientProject, value: any) => {
    setEditingProject(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleClientChange = (clientId: string) => {
     const client = clients?.find(c => c.id === clientId);
     setEditingProject(prev => prev ? { 
         ...prev, 
         clientId: clientId,
         clientName: client?.name || ''
     } : null);
  };

  const handleProgressChange = (value: number) => {
    if (editingProject?.progress !== value) {
      handleFormChange('progress', value);
      setShowProgressComment(true);
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !editingProject || !editingProject.title || !editingProject.clientId) {
      toast({ variant: 'destructive', title: 'Campos requeridos', description: 'El título y el cliente son obligatorios.' });
      return;
    }
    setIsSubmitting(true);

    const isEditing = !!editingProject.id;
    
    try {
        if (isEditing) {
            const projectId = editingProject.id!;
            const updateData: Partial<ClientProject> & { progressHistory?: any } = {
                title: editingProject.title,
                description: editingProject.description || '',
                clientId: editingProject.clientId,
                clientName: editingProject.clientName,
                status: editingProject.status || 'active',
                progress: editingProject.progress || 0,
            };

            if (showProgressComment && progressComment.trim() !== '') {
              const newProgressUpdate: ProgressUpdate = {
                progress: editingProject.progress || 0,
                comment: progressComment.trim(),
                date: new Date(),
              };
              updateData.progressHistory = arrayUnion(newProgressUpdate);
            }

            await ClientProjectService.updateClientProject(firestore, projectId, updateData);
            toast({
              title: 'Proyecto Actualizado',
              description: `El proyecto "${editingProject.title}" ha sido actualizado.`
            });
        } else {
             const projectData: Omit<ClientProject, 'id' | 'createdAt'> = {
                title: editingProject.title,
                description: editingProject.description || '',
                clientId: editingProject.clientId,
                clientName: editingProject.clientName || '',
                status: editingProject.status || 'active',
                deadline: editingProject.deadline || new Date(),
                progress: editingProject.progress || 0,
                progressHistory: [],
            };
            await ClientProjectService.createClientProject(firestore, projectData);
            toast({
                title: 'Proyecto Creado',
                description: `El proyecto "${projectData.title}" ha sido creado.`
            });
        }
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error: any) {
      console.error("Error saving client project:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el proyecto.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
   const getStatusVariant = (status: ClientProject['status']) => {
    switch (status) {
        case 'active': return 'default';
        case 'completed': return 'secondary';
        case 'on-hold': return 'outline';
        default: return 'outline';
    }
  }
   const getStatusLabel = (status: ClientProject['status']) => {
    switch (status) {
        case 'active': return 'Activo';
        case 'completed': return 'Completado';
        case 'on-hold': return 'En Pausa';
        default: return status;
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Gestión de Proyectos de Clientes</CardTitle>
            <CardDescription>Añade, edita y gestiona los proyectos de tus clientes.</CardDescription>
          </div>
          <Button onClick={openAddModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Proyecto
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título del Proyecto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="w-[180px]">Progreso</TableHead>
                  <TableHead className="hidden md:table-cell">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              
              {isLoadingProjects ? (
                  <TableBody>
                    {[...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="text-right space-x-2">
                          <Skeleton className="h-9 w-9 rounded-md inline-block" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
              ) : !projects || projects.length === 0 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="h-48 text-center">
                          <div className="flex flex-col items-center gap-4">
                              <Briefcase className="h-12 w-12 text-muted-foreground" />
                              <h3 className="font-semibold">No hay proyectos de clientes</h3>
                              <p className="text-muted-foreground text-sm">Empieza creando uno nuevo.</p>
                          </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
              ) : (
                projects.map((project) => (
                  <Collapsible asChild key={project.id}>
                    <tbody className="w-full">
                      <CollapsibleTrigger asChild>
                        <TableRow className="cursor-pointer group">
                          <TableCell className="font-medium max-w-[200px] truncate">{project.title}</TableCell>
                          <TableCell className="text-muted-foreground">{project.clientName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress || 0} className="w-[60%]" />
                              <span className="text-xs text-muted-foreground">{project.progress || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={getStatusVariant(project.status)}>
                              {getStatusLabel(project.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="icon" className="h-9 w-9" onClick={(e) => {e.stopPropagation(); openEditModal(project); }}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      <CollapsibleContent asChild>
                        <TableRow>
                            <TableCell colSpan={5} className='p-0'>
                                <ProjectHistory history={project.progressHistory || []} />
                            </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </tbody>
                  </Collapsible>
                ))
              )}
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingProject && (
        <Dialog open={isModalOpen} onOpenChange={(isOpen) => !isOpen && setIsModalOpen(false)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProject.id ? 'Editar' : 'Crear'} Proyecto de Cliente</DialogTitle>
              <DialogDescription>
                Completa los detalles para iniciar un nuevo proyecto para un cliente.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} id="client-project-form" className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1 pr-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Proyecto</Label>
                <Input id="title" value={editingProject.title} onChange={e => handleFormChange('title', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Select
                  value={editingProject.clientId}
                  onValueChange={handleClientChange}
                  disabled={isLoadingClients || !!editingProject.id}
                  required
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
                <Label htmlFor="description">Descripción Corta</Label>
                <Textarea id="description" value={editingProject.description} onChange={e => handleFormChange('description', e.target.value)} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="progress">Progreso ({editingProject.progress || 0}%)</Label>
                <Slider
                  id="progress"
                  min={0}
                  max={100}
                  step={5}
                  value={[editingProject.progress || 0]}
                  onValueChange={(value) => handleProgressChange(value[0])}
                />
              </div>
              {showProgressComment && (
                <div className="space-y-2">
                  <Label htmlFor="progress-comment">Comentario sobre el avance</Label>
                  <Textarea
                    id="progress-comment"
                    placeholder="Ej: Se completó la integración de la pasarela de pago."
                    value={progressComment}
                    onChange={(e) => setProgressComment(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={editingProject.status}
                  onValueChange={(value) => handleFormChange('status', value as ClientProject['status'])}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecciona un estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="on-hold">En Pausa</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary" disabled={isSubmitting}>Cancelar</Button></DialogClose>
              <Button type="submit" form="client-project-form" disabled={isSubmitting || isLoadingClients}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Guardando...' : 'Guardar Proyecto'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
