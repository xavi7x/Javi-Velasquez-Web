'use client';

import { useState, useRef, type FormEvent, ChangeEvent, useMemo } from 'react';
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
import { PlusCircle, Upload, Trash, Loader2, Paperclip, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { collection, doc, addDoc, setDoc, deleteDoc, serverTimestamp, query, orderBy, updateDoc, writeBatch } from 'firebase/firestore';
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
  order: 0
};


export function ProjectsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const firestore = useFirestore();
  const { user } = useUser();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: projectsData, isLoading } = useCollection<Project>(projectsQuery);
  
  const sortedProjects = useMemo(() => {
    if (!projectsData) return [];
    return projectsData.map((p, i) => ({
      ...p,
      order: p.order ?? i, 
    }));
  }, [projectsData]);


  const openAddModal = () => {
    const maxOrder = sortedProjects.reduce((max, p) => Math.max(p.order ?? 0, max), 0);
    setEditingProject({...emptyProject, order: maxOrder + 1 });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
  const uploadFile = async (file: File, path: string): Promise<string> => {
    if (!user) throw new Error("Usuario no autenticado.");
    const storage = getStorage();
    const fileRef = storageRef(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const handleThumbnailUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingProject && user) {
      const file = e.target.files[0];
      setIsSubmitting(true);
      try {
        const path = `project-thumbnails/${user.uid}/${file.name}`;
        const downloadURL = await uploadFile(file, path);
        setEditingProject({ ...editingProject, thumbnail: downloadURL });
        toast({ title: 'Miniatura subida', description: 'La imagen se ha subido y asignado correctamente.' });
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        toast({ variant: 'destructive', title: 'Error de carga', description: 'No se pudo subir la miniatura.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && editingProject && user) {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      
      setIsSubmitting(true);
      try {
        const uploadPromises = files.map(file => {
            const path = `project-gallery/${user.uid}/${file.name}`;
            return uploadFile(file, path);
        });

        const downloadURLs = await Promise.all(uploadPromises);

        const updatedImages = [...(editingProject.images || []), ...downloadURLs];
        setEditingProject({ ...editingProject, images: updatedImages });
        toast({ title: 'Imágenes añadidas', description: `${files.length} imagen(es) se han añadido a la galería.` });

      } catch (error) {
        console.error("Error uploading gallery images:", error);
        toast({ variant: 'destructive', title: 'Error de carga', description: 'No se pudieron subir las imágenes a la galería.' });
      } finally {
        setIsSubmitting(false);
      }
    }
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
        if (projectData.order === undefined || projectData.order === null) {
          const maxOrder = sortedProjects.reduce((max, p) => Math.max(p.order ?? 0, max), 0);
          projectData.order = maxOrder + 1;
        }
        
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

  const moveProject = async (currentIndex: number, direction: 'up' | 'down') => {
    if (!firestore || !sortedProjects) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= sortedProjects.length) {
      return;
    }

    const projectToMove = sortedProjects[currentIndex];
    const otherProject = sortedProjects[targetIndex];

    if (!projectToMove?.id || !otherProject?.id) {
        console.error("Project ID is missing, cannot reorder.");
        return;
    }
    
    const batch = writeBatch(firestore);

    const projectToMoveRef = doc(firestore, 'projects', projectToMove.id);
    batch.update(projectToMoveRef, { order: otherProject.order });

    const otherProjectRef = doc(firestore, 'projects', otherProject.id);
    batch.update(otherProjectRef, { order: projectToMove.order });

    try {
      await batch.commit();
      toast({
        title: 'Proyecto movido',
        description: `Se ha actualizado el orden de los proyectos.`,
      });
    } catch (error) {
      console.error("Error moving project:", error);
      toast({
        variant: 'destructive',
        title: 'Error al mover',
        description: 'No se pudo actualizar el orden de los proyectos.',
      });
    }
  };

  const removeImageFromGallery = (index: number) => {
    if (editingProject) {
      const updatedImages = editingProject.images?.filter((_, i) => i !== index) || [];
      setEditingProject({ ...editingProject, images: updatedImages });
    }
  };
  
  const removeThumbnail = () => {
    if (editingProject) {
      setEditingProject({ ...editingProject, thumbnail: '' });
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
                  <TableHead className="w-[50px]">Orden</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden sm:table-cell">Tagline</TableHead>
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
                ) : sortedProjects?.map((project, index) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex flex-col items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => moveProject(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => moveProject(index, 'down')}
                            disabled={index === sortedProjects.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{project.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate hidden sm:table-cell">
                      {project.tagline}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-nowrap hidden lg:table-cell">
                      {project.updatedAt ? format(project.updatedAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: es }) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(project)}>
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9"
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
                <Label htmlFor="thumbnail">Miniatura del Proyecto</Label>
                {editingProject.thumbnail ? (
                  <div className="relative w-48 h-32 rounded-md overflow-hidden group">
                    <Image src={editingProject.thumbnail} alt="Miniatura actual" layout="fill" objectFit="cover" className="bg-muted" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button type="button" variant="destructive" size="icon" onClick={removeThumbnail} disabled={isSubmitting}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Input id="thumbnail-upload" type="file" onChange={handleThumbnailUpload} ref={thumbnailInputRef} className="hidden" />
                    <Button type="button" variant="outline" onClick={() => thumbnailInputRef.current?.click()} disabled={isSubmitting}>
                      <Upload className="mr-2 h-4 w-4" /> Cargar Miniatura
                    </Button>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gallery">Galería de Imágenes</Label>
                 <div className="space-y-2 mt-2">
                  {editingProject.images?.map((imageUrl, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 rounded-md border">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip className="h-4 w-4 flex-shrink-0" />
                        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="truncate text-blue-500 hover:underline">
                            {imageUrl.split('/').pop()?.split('?')[0].slice(-20) || 'Imagen'}
                        </a>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => removeImageFromGallery(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                 </div>
                <Input id="gallery-upload" type="file" multiple onChange={handleGalleryUpload} ref={galleryInputRef} className="hidden" />
                <Button type="button" variant="outline" onClick={() => galleryInputRef.current?.click()} disabled={isSubmitting}>
                  <Upload className="mr-2 h-4 w-4" /> Añadir a Galería
                </Button>
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
