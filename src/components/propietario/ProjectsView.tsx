'use client';

import { useState, useRef, type FormEvent, ChangeEvent } from 'react';
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
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Project } from '@/lib/project-types';
import { PlusCircle, Upload, Trash, Loader2, Paperclip, X, Link as LinkIcon } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, addDoc, setDoc, deleteDoc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';

const emptyProject: Partial<Project> = {
  title: '',
  tagline: '',
  thumbnail: '',
  images: [],
  description: {
    challenge: '',
    solution: '',
    results: '',
  },
  skills: [],
};


export function ProjectsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('title'));
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const openAddModal = () => {
    setEditingProject(emptyProject);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
 const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!firestore || !editingProject || !editingProject.title) {
        toast({ variant: "destructive", title: "Error", description: "El título del proyecto es obligatorio." });
        return;
    }

    setIsSubmitting(true);
    const projectData = { ...editingProject };
    
    try {
        const projectId = projectData.id || doc(collection(firestore, 'projects')).id;
        projectData.id = projectId;

        projectData.updatedAt = serverTimestamp() as any;
        
        const projectRef = doc(firestore, 'projects', projectId);

        if (isEditing) {
            await updateDoc(projectRef, projectData).catch(error => {
                const contextualError = new FirestorePermissionError({
                    path: projectRef.path,
                    operation: 'update',
                    requestResourceData: projectData,
                });
                errorEmitter.emit('permission-error', contextualError);
                throw contextualError;
            });
        } else {
            projectData.createdAt = serverTimestamp() as any;
            await setDoc(projectRef, projectData).catch(error => {
                const contextualError = new FirestorePermissionError({
                    path: projectRef.path,
                    operation: 'create',
                    requestResourceData: projectData,
                });
                errorEmitter.emit('permission-error', contextualError);
                throw contextualError;
            });
        }

        toast({
            title: isEditing ? "Proyecto actualizado" : "Proyecto añadido",
            description: `"${projectData.title}" ha sido guardado.`
        });
        setIsModalOpen(false);

    } catch (error) {
        console.error("Error submitting form:", error);
        toast({ variant: 'destructive', title: "Error al guardar", description: "No se pudo guardar el proyecto. Revisa la consola para más detalles." });
    } finally {
        setIsSubmitting(false);
        setEditingProject(null);
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

  const addImageUrlToGallery = () => {
    if (newImageUrl && editingProject) {
      const updatedImages = [...(editingProject.images || []), newImageUrl];
      setEditingProject({ ...editingProject, images: updatedImages });
      setNewImageUrl('');
    }
  };

  const removeImageFromGallery = (index: number) => {
    if (editingProject) {
      const updatedImages = editingProject.images?.filter((_, i) => i !== index) || [];
      setEditingProject({ ...editingProject, images: updatedImages });
    }
  };

  const modalTitle = isEditing ? 'Editar Proyecto' : 'Añadir Nuevo Proyecto';
  const modalDescription = isEditing && editingProject?.title
    ? `Realiza cambios en el proyecto "${editingProject.title}".`
    : 'Completa el formulario para añadir un nuevo proyecto a tu portafolio.';


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Proyectos Actuales</CardTitle>
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
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden sm:table-cell">Tagline</TableHead>
                  <TableHead className="hidden lg:table-cell">Creado</TableHead>
                  <TableHead className="hidden lg:table-cell">Modificado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : projects?.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium max-w-xs truncate">{project.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate hidden sm:table-cell">
                      {project.tagline}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-nowrap hidden lg:table-cell">
                      {project.createdAt ? format(project.createdAt.toDate(), 'dd MMM yyyy', { locale: es }) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-nowrap hidden lg:table-cell">
                      {project.updatedAt ? format(project.updatedAt.toDate(), 'dd MMM yyyy', { locale: es }) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(project)}>
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setProjectToDelete(project)}
                      >
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
              <DialogDescription>
                {modalDescription}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} id="project-form" className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Proyecto</Label>
                  <Input id="title" value={editingProject.title || ''} onChange={e => setEditingProject({...editingProject, title: e.target.value})} placeholder="Ej: Renovación de Marca" disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={editingProject.tagline || ''}
                    onChange={e => setEditingProject({...editingProject, tagline: e.target.value})}
                    placeholder="Una descripción corta y llamativa"
                  />
                </div>
              </div>
               <div className="space-y-2">
                <Label>URL de la Miniatura</Label>
                <Input
                  id="thumbnail-url"
                  value={editingProject.thumbnail || ''}
                  onChange={e => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                  placeholder="Pega la URL de la imagen aquí"
                  disabled={isSubmitting}
                />
                {editingProject.thumbnail && (
                  <div className="mt-2 relative w-48 h-32 rounded-md overflow-hidden group">
                    <Image
                      src={editingProject.thumbnail}
                      alt="Miniatura actual"
                      layout="fill"
                      objectFit="cover"
                      className="bg-muted"
                    />
                  </div>
                )}
              </div>


               <div className="space-y-2">
                <Label>URLs de la Galería</Label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    placeholder="Pega una URL de imagen y añádela"
                    className="flex-grow"
                  />
                  <Button type="button" onClick={addImageUrlToGallery} disabled={!newImageUrl}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                 <div className="space-y-2 mt-2">
                  {editingProject.images?.map((imageUrl, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 rounded-md border">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <LinkIcon className="h-4 w-4 flex-shrink-0" />
                        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="truncate text-blue-500 hover:underline">{imageUrl}</a>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => removeImageFromGallery(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                 </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenge">El Desafío</Label>
                <Textarea
                  id="challenge"
                  value={editingProject.description?.challenge || ''}
                  onChange={e => setEditingProject({...editingProject, description: {...(editingProject.description || {}), challenge: e.target.value}})}
                  placeholder="Describe el problema o desafío."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution">La Solución</Label>
                <Textarea
                  id="solution"
                  value={editingProject.description?.solution || ''}
                  onChange={e => setEditingProject({...editingProject, description: {...(editingProject.description || {}), solution: e.target.value}})}
                  placeholder="Explica la solución que implementaste."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="results">Los Resultados</Label>
                <Textarea
                  id="results"
                  value={editingProject.description?.results || ''}
                  onChange={e => setEditingProject({...editingProject, description: {...(editingProject.description || {}), results: e.target.value}})}
                  placeholder="Menciona los resultados obtenidos."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Habilidades (separadas por coma)</Label>
                <Input 
                  id="skills" 
                  value={editingProject.skills?.join(', ') || ''} 
                  onChange={e => setEditingProject({...editingProject, skills: e.target.value.split(',').map(s => s.trim())})} 
                  placeholder="Ej: React, Figma, Branding" />
              </div>
            </form>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" form="project-form" disabled={isSubmitting || !editingProject.title}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto
              "{projectToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>
              Sí, eliminar proyecto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
