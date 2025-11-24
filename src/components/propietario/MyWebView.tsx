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
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Project } from '@/lib/project-types';
import { PlusCircle, Trash, Loader2, Edit } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, addDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';

const emptyProject: Partial<Project> = {
  title: '',
  tagline: '',
  thumbnail: 'https://picsum.photos/seed/placeholder/600/400',
  skills: [],
  order: 0,
  type: 'portfolio',
  description: {
    challenge: '',
    solution: '',
    results: ''
  },
  images: [],
};

export function MyWebView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firestore = useFirestore();

  const portfolioQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'projects'),
      where('type', '==', 'portfolio'),
      orderBy('order', 'asc')
    );
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(portfolioQuery);

  const openAddModal = () => {
    setEditingProject({ ...emptyProject, order: (projects?.length || 0) + 1 });
    setIsEditing(false);
    setIsModalOpen(true);
  };
  
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setIsSubmitting(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !editingProject?.title) {
        toast({ variant: "destructive", title: "Error", description: "El título es obligatorio." });
        return;
    }
    
    setIsSubmitting(true);
    const projectData = { ...editingProject, type: 'portfolio' };

    try {
      if (isEditing && editingProject.id) {
        const projectRef = doc(firestore, 'projects', editingProject.id);
        await setDoc(projectRef, projectData, { merge: true });
        toast({ title: "Proyecto actualizado", description: "El proyecto ha sido guardado." });
      } else {
        const collectionRef = collection(firestore, 'projects');
        await addDoc(collectionRef, projectData);
        toast({ title: "Proyecto creado", description: "El nuevo proyecto ha sido añadido a tu portafolio." });
      }
      closeModal();
    } catch (error) {
       console.error("Error submitting project:", error);
       const contextualError = new FirestorePermissionError({
          path: isEditing && editingProject.id ? `projects/${editingProject.id}` : 'projects',
          operation: isEditing ? 'update' : 'create',
          requestResourceData: projectData,
       });
       errorEmitter.emit('permission-error', contextualError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete || !firestore) return;
    try {
      const projectRef = doc(firestore, 'projects', projectToDelete.id);
      await deleteDoc(projectRef);
      toast({ title: "Proyecto eliminado", description: `"${projectToDelete.title}" ha sido eliminado.` });
    } catch(error) {
      const contextualError = new FirestorePermissionError({
          path: `projects/${projectToDelete.id}`,
          operation: 'delete',
      });
      errorEmitter.emit('permission-error', contextualError);
    } finally {
      setProjectToDelete(null);
    }
  };

  const modalTitle = isEditing ? 'Editar Proyecto del Portafolio' : 'Añadir Proyecto al Portafolio';
  const modalDescription = isEditing ? 'Modifica los detalles de este proyecto público.' : 'Añade un nuevo proyecto a tu página de inicio.';

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Proyectos Públicos (Portafolio)</CardTitle>
            <CardDescription>Gestiona los proyectos que se muestran en tu página de inicio.</CardDescription>
          </div>
          <Button onClick={openAddModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Proyecto
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Miniatura</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden sm:table-cell">Tagline</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-16 rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell className="text-right space-x-2">
                        <Skeleton className="h-9 w-9 rounded-full inline-block" />
                        <Skeleton className="h-9 w-9 rounded-full inline-block" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : projects?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No hay proyectos en tu portafolio. Empieza añadiendo uno.
                    </TableCell>
                  </TableRow>
                ) : projects?.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.order}</TableCell>
                    <TableCell>
                      <Image src={project.thumbnail} alt={project.title} width={64} height={48} className="rounded-md object-cover" />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{project.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate hidden sm:table-cell">{project.tagline}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => openEditModal(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="h-9 w-9" onClick={() => setProjectToDelete(project)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingProject && (
        <Dialog open={isModalOpen} onOpenChange={(isOpen) => !isOpen && closeModal()}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
              <DialogDescription>{modalDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} id="project-form" className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1 pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Proyecto</Label>
                  <Input id="title" value={editingProject.title || ''} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} placeholder="Ej: Rediseño Web Corporativo" disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Orden de Visualización</Label>
                  <Input id="order" type="number" value={editingProject.order || 0} onChange={e => setEditingProject({ ...editingProject, order: Number(e.target.value) })} disabled={isSubmitting} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" value={editingProject.tagline || ''} onChange={e => setEditingProject({ ...editingProject, tagline: e.target.value })} placeholder="Una frase corta que describa el proyecto." disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">URL de la Miniatura</Label>
                <Input id="thumbnail" value={editingProject.thumbnail || ''} onChange={e => setEditingProject({ ...editingProject, thumbnail: e.target.value })} placeholder="https://picsum.photos/600/400" disabled={isSubmitting} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="skills">Habilidades (separadas por coma)</Label>
                <Input id="skills" value={editingProject.skills?.join(', ') || ''} onChange={e => setEditingProject({ ...editingProject, skills: e.target.value.split(',').map(s => s.trim()) })} placeholder="Next.js, Tailwind, Firebase" disabled={isSubmitting} />
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
              <Button type="submit" form="project-form" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Guardando...' : 'Guardar Proyecto'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!projectToDelete} onOpenChange={(isOpen) => !isOpen && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el proyecto "{projectToDelete?.title}" de tu portafolio público. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Sí, eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
