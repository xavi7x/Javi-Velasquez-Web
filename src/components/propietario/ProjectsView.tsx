'use client';

import { useState, useRef, type FormEvent, ChangeEvent, useMemo, useEffect } from 'react';
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
import type { Project, Client } from '@/lib/project-types';
import { PlusCircle, Upload, Trash, Loader2, Paperclip, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { collection, doc, addDoc, setDoc, deleteDoc, serverTimestamp, query, orderBy, updateDoc, writeBatch } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';

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
  order: 0,
  progress: 0,
  stages: [],
  type: 'portfolio'
};


export function ProjectsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'client'>('portfolio');

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const firestore = useFirestore();
  const { user } = useUser();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('order', 'asc'));
  }, [firestore]);
  
  const clientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'clients'), orderBy('name', 'asc'));
  }, [firestore]);


  const { data: projectsData, isLoading } = useCollection<Project>(projectsQuery);
  const { data: clients } = useCollection<Client>(clientsQuery);
  
 useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  const portfolioProjects = useMemo(() => projects.filter(p => p.type === 'portfolio' || !p.type).sort((a,b) => (a.order ?? 0) - (b.order ?? 0)), [projects]);
  const clientProjects = useMemo(() => projects.filter(p => p.type === 'client').sort((a,b) => (a.order ?? 0) - (b.order ?? 0)), [projects]);

  const openAddModal = () => {
    const maxOrder = projects.reduce((max, p) => Math.max(p.order ?? 0, max), -1);
    setEditingProject({...emptyProject, order: maxOrder + 1, type: activeTab });
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
        const path = `project-thumbnails/${user.uid}/${Date.now()}_${file.name}`;
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
            const path = `project-gallery/${user.uid}/${Date.now()}_${file.name}`;
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
    const projectData: Partial<Project> = { 
      ...editingProject,
      type: activeTab,
    };
    
    try {
        const isNewProject = !isEditing;
        const currentProjectList = activeTab === 'portfolio' ? portfolioProjects : clientProjects;
        
        if (isNewProject) {
            const maxOrder = currentProjectList.reduce((max, p) => Math.max(p.order ?? 0, max), -1);
            projectData.order = maxOrder + 1;
        }
        
        const projectId = projectData.id || doc(collection(firestore, 'projects')).id;
        projectData.id = projectId;

        projectData.updatedAt = serverTimestamp() as any;
        
        const projectRef = doc(firestore, 'projects', projectId);

        if (isNewProject) {
            projectData.createdAt = serverTimestamp() as any;
            await setDoc(projectRef, projectData);
        } else {
            await updateDoc(projectRef, projectData);
        }

        toast({
            title: isEditing ? "Proyecto actualizado" : "Proyecto añadido",
            description: `"${projectData.title}" ha sido guardado.`
        });
        setIsModalOpen(false);

    } catch (error) {
        console.error("Error submitting form:", error);
        const contextualError = new FirestorePermissionError({
            path: `projects/${projectData.id}`,
            operation: isEditing ? 'update' : 'create',
            requestResourceData: projectData,
        });
        errorEmitter.emit('permission-error', contextualError);
    } finally {
        setIsSubmitting(false);
        setEditingProject(null);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'projects', projectToDelete.id));
      
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
  
  const moveProject = async (project: Project, direction: 'up' | 'down') => {
    if (!firestore) return;
    const projectList = project.type === 'portfolio' || !project.type ? portfolioProjects : clientProjects;
    const currentIndex = projectList.findIndex(p => p.id === project.id);

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= projectList.length) return;

    const otherProject = projectList[targetIndex];

    const batch = writeBatch(firestore);
    const projectRef = doc(firestore, 'projects', project.id);
    const otherProjectRef = doc(firestore, 'projects', otherProject.id);

    batch.update(projectRef, { order: otherProject.order });
    batch.update(otherProjectRef, { order: project.order });
    
    try {
      await batch.commit();
      toast({
        title: 'Orden actualizado',
        description: 'Se ha guardado el nuevo orden de los proyectos.',
      });
    } catch (error) {
      console.error("Error updating project order:", error);
      toast({
        variant: 'destructive',
        title: 'Error al reordenar',
        description: 'No se pudo guardar el nuevo orden. La lista se recargará.',
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
    : `Completa el formulario para añadir un nuevo proyecto de ${activeTab === 'portfolio' ? 'portafolio' : 'cliente'}.`;

  const getClientName = (clientId: string | undefined) => {
    if (!clientId) return 'Sin asignar';
    return clients?.find(c => c.id === clientId)?.name || 'Cliente desconocido';
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'portfolio' | 'client')} className="w-full">
        <div className="flex justify-between items-center mb-4">
            <TabsList>
                <TabsTrigger value="portfolio">Portafolio Público</TabsTrigger>
                <TabsTrigger value="client">Proyectos de Clientes</TabsTrigger>
            </TabsList>
             <Button onClick={openAddModal}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Proyecto
            </Button>
        </div>
        <TabsContent value="portfolio">
            <Card>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[80px]">Orden</TableHead>
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
                            ) : portfolioProjects.map((project, index) => (
                            <TableRow key={project.id}>
                                <TableCell>
                                <div className="flex items-center gap-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8" 
                                        onClick={() => moveProject(project, 'up')}
                                        disabled={index === 0}
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8" 
                                        onClick={() => moveProject(project, 'down')}
                                        disabled={index === portfolioProjects.length - 1}
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
        </TabsContent>
        <TabsContent value="client">
             <Card>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Proyecto</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Progreso</TableHead>
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
                            ) : clientProjects.map((project, index) => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium max-w-xs truncate">{project.title}</TableCell>
                                <TableCell className="text-muted-foreground">{getClientName(project.clientId)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={project.progress || 0} className="w-24"/>
                                    <span className="text-muted-foreground text-sm">{project.progress || 0}%</span>
                                  </div>
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
        </TabsContent>
      </Tabs>


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
             
              {activeTab === 'client' && (
                <div className="space-y-2">
                    <Label htmlFor="clientId">Cliente</Label>
                    <Select
                        value={editingProject.clientId || ''}
                        onValueChange={value => setEditingProject({...editingProject, clientId: value})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Asignar a un cliente..." />
                        </SelectTrigger>
                        <SelectContent>
                            {clients?.map(client => (
                                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              )}

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

             {activeTab === 'portfolio' && (
               <>
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
               </>
             )}
             
             {activeTab === 'client' && (
                <div className="space-y-2">
                    <Label htmlFor="progress">Progreso del Proyecto ({editingProject.progress || 0}%)</Label>
                    <Slider 
                        id="progress"
                        min={0}
                        max={100}
                        step={5}
                        value={[editingProject.progress || 0]}
                        onValueChange={(value) => setEditingProject({...editingProject, progress: value[0]})}
                    />
                </div>
             )}

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
