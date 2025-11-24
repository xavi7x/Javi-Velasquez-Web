'use client';

import { useState, useRef, ChangeEvent } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { PlusCircle, Trash, Loader2, Edit, Upload, Image as ImageIcon, X, Eye, EyeOff } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, addDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';

const emptyProject: Partial<Project> = {
  title: '',
  tagline: '',
  description: { challenge: '', solution: '', results: '' },
  skills: [],
  thumbnail: '',
  images: [],
  order: 0,
  type: 'portfolio',
  isPublic: true,
};

export function MyWebView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const firestore = useFirestore();

  // THIS IS THE CRITICAL CHANGE: The query is now inside the component that uses it.
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Only fetch projects of type 'portfolio' for this view
    return query(collection(firestore, 'projects'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const openAddModal = () => {
    setEditingProject({
        ...emptyProject,
        order: (projects?.length || 0) + 1, // Default order to last
    });
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
    setIsUploading(false);
  }

  const handleFormChange = (field: keyof Project, value: any) => {
    setEditingProject(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleDescriptionChange = (field: 'challenge' | 'solution' | 'results', value: string) => {
    setEditingProject(prev => prev ? { 
        ...prev, 
        description: { 
            ...(prev.description || { challenge: '', solution: '', results: '' }), 
            [field]: value 
        } 
    } : null);
  };

  const handleImageUpload = async (file: File, isThumbnail: boolean) => {
    if (!file || !user) return;

    setIsUploading(true);
    try {
        const storage = getStorage();
        const projectId = editingProject?.id || Date.now().toString();
        const path = `projects/${projectId}/${isThumbnail ? 'thumbnail' : `gallery_${Date.now()}`}_${file.name}`;
        const fileRef = storageRef(storage, path);
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        if (isThumbnail) {
            handleFormChange('thumbnail', downloadURL);
        } else {
            handleFormChange('images', [...(editingProject?.images || []), downloadURL]);
        }
        toast({ title: 'Imagen subida', description: 'La imagen se ha subido y añadido al proyecto.' });

    } catch (error) {
        console.error("Error uploading image:", error);
        toast({ variant: 'destructive', title: 'Error de carga', description: 'No se pudo subir la imagen.' });
    } finally {
        setIsUploading(false);
    }
  };

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>, isThumbnail: boolean) => {
    const files = e.target.files;
    if (files) {
        if (isThumbnail && files[0]) {
            handleImageUpload(files[0], true);
        } else {
            Array.from(files).forEach(file => handleImageUpload(file, false));
        }
    }
    e.target.value = ''; // Reset file input
  }
  
  const handleRemoveGalleryImage = (imageUrl: string) => {
    if(!editingProject) return;

    // Filter out the image to be removed
    const updatedImages = editingProject.images?.filter(img => img !== imageUrl) || [];
    handleFormChange('images', updatedImages);

    // Optional: Delete from Firebase Storage
    const storage = getStorage();
    const imageRef = storageRef(storage, imageUrl);
    deleteObject(imageRef).then(() => {
        toast({ title: 'Imagen eliminada', description: 'La imagen ha sido eliminada de la galería y del almacenamiento.' });
    }).catch(error => {
        // If it fails, it's not critical, but good to know. The link is removed from Firestore anyway.
        console.error("Error deleting image from Storage:", error);
    });
  }


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firestore || !editingProject || !editingProject.title) {
        toast({ variant: "destructive", title: "Error", description: "El título es obligatorio." });
        return;
    }
    
    setIsSubmitting(true);

    const projectData = {
        ...editingProject,
        order: Number(editingProject.order || 0),
        type: 'portfolio',
        isPublic: editingProject.isPublic ?? true, // Ensure isPublic is set
    };

    try {
        if (isEditing && editingProject.id) {
            const projectRef = doc(firestore, 'projects', editingProject.id);
            await setDoc(projectRef, projectData, { merge: true });
            toast({
                title: "Proyecto actualizado",
                description: `El proyecto "${projectData.title}" ha sido actualizado.`
            });
        } else {
            const collectionRef = collection(firestore, 'projects');
            const docRef = await addDoc(collectionRef, { ...projectData, id: '' });
            await updateDoc(docRef, { id: docRef.id });

            toast({
                title: "Proyecto creado",
                description: `El proyecto "${projectData.title}" ha sido añadido a tu portafolio.`
            });
        }
        closeModal();
    } catch (error: any) {
        const path = isEditing && editingProject.id ? `projects/${editingProject.id}` : 'projects';
        const operation = isEditing ? 'update' : 'create';
        const contextualError = new FirestorePermissionError({ path, operation, requestResourceData: projectData });
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

  const toggleProjectVisibility = async (project: Project) => {
    if (!firestore) return;
    const projectRef = doc(firestore, 'projects', project.id);
    const newVisibility = !project.isPublic;
    try {
        await updateDoc(projectRef, { isPublic: newVisibility });
        toast({
            title: 'Visibilidad actualizada',
            description: `El proyecto "${project.title}" ahora está ${newVisibility ? 'visible' : 'oculto'}.`
        });
    } catch (error) {
        const contextualError = new FirestorePermissionError({
          path: projectRef.path,
          operation: 'update',
          requestResourceData: { isPublic: newVisibility },
      });
      errorEmitter.emit('permission-error', contextualError);
    }
  };

  const modalTitle = isEditing ? 'Editar Proyecto' : 'Añadir Nuevo Proyecto';
  const modalDescription = isEditing ? 'Modifica los datos del proyecto de tu portafolio.' : 'Añade un nuevo proyecto a tu sección pública de portafolio.';

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
                  <TableHead className="w-[80px]">Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden sm:table-cell">Tagline</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-10 w-16 rounded-md" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell className="text-right space-x-2">
                                <Skeleton className="h-9 w-9 rounded-md inline-block" />
                                <Skeleton className="h-9 w-9 rounded-md inline-block" />
                                <Skeleton className="h-9 w-9 rounded-md inline-block" />
                            </TableCell>
                        </TableRow>
                    ))
                ) : projects?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No hay proyectos en tu portafolio. Empieza añadiendo uno.
                        </TableCell>
                    </TableRow>
                ) : projects?.map((project) => (
                  <TableRow key={project.id} className={!project.isPublic ? 'bg-muted/50 hover:bg-muted/60' : ''}>
                    <TableCell>
                        <div className="h-10 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                        {project.thumbnail ? (
                            <Image src={project.thumbnail} alt={project.title} width={64} height={40} className="h-full w-full object-cover" />
                        ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                        </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{project.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[300px] truncate hidden sm:table-cell">
                      {project.tagline || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => toggleProjectVisibility(project)}
                      >
                        {project.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                       <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => openEditModal(project)}
                      >
                        <Edit className="h-4 w-4" />
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
        <Dialog open={isModalOpen} onOpenChange={(isOpen) => !isOpen && closeModal()}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
              <DialogDescription>{modalDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} id="project-form" className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" value={editingProject.title} onChange={e => handleFormChange('title', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="order">Orden</Label>
                        <Input id="order" type="number" value={editingProject.order} onChange={e => handleFormChange('order', e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline / Frase corta</Label>
                    <Input id="tagline" value={editingProject.tagline} onChange={e => handleFormChange('tagline', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label>Imagen Principal (Thumbnail)</Label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-muted border flex items-center justify-center">
                            {editingProject.thumbnail ? (
                                <Image src={editingProject.thumbnail} alt="Thumbnail" layout="fill" objectFit="cover" />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <input type="file" ref={thumbnailInputRef} onChange={(e) => handleFileSelected(e, true)} accept="image/*" className="hidden" />
                            <Button type="button" onClick={() => thumbnailInputRef.current?.click()} disabled={isUploading || isSubmitting} variant="outline">
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                Cambiar
                            </Button>
                        </div>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Galería de Imágenes</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {editingProject.images?.map((imageUrl) => (
                            <div key={imageUrl} className="relative group aspect-square">
                                <Image src={imageUrl} alt="Gallery image" layout="fill" objectFit="cover" className="rounded-md" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveGalleryImage(imageUrl)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                         <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={isUploading || isSubmitting}
                            className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted hover:border-muted-foreground transition-colors"
                        >
                            {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <PlusCircle className="h-6 w-6" />}
                            <span className="text-xs mt-1">Añadir</span>
                        </button>
                         <input type="file" ref={galleryInputRef} onChange={(e) => handleFileSelected(e, false)} accept="image/*" multiple className="hidden" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description-challenge">Descripción: El Desafío</Label>
                    <Textarea id="description-challenge" value={editingProject.description?.challenge} onChange={e => handleDescriptionChange('challenge', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description-solution">Descripción: La Solución</Label>
                    <Textarea id="description-solution" value={editingProject.description?.solution} onChange={e => handleDescriptionChange('solution', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description-results">Descripción: Los Resultados</Label>
                    <Textarea id="description-results" value={editingProject.description?.results} onChange={e => handleDescriptionChange('results', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="skills">Habilidades (separadas por comas)</Label>
                    <Input id="skills" value={Array.isArray(editingProject.skills) ? editingProject.skills.join(', ') : ''} onChange={e => handleFormChange('skills', e.target.value.split(',').map(s => s.trim()))} />
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch
                        id="isPublic"
                        checked={editingProject.isPublic}
                        onCheckedChange={(checked) => handleFormChange('isPublic', checked)}
                    />
                    <Label htmlFor="isPublic">Visible en el portafolio público</Label>
                </div>
            </form>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary" disabled={isUploading || isSubmitting}>Cancelar</Button></DialogClose>
                <Button type="submit" form="project-form" disabled={isUploading || isSubmitting}>
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
              Esta acción eliminará el proyecto "{projectToDelete?.title}" de forma permanente.
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
