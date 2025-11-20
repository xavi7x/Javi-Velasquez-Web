'use client';

import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
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
import { PlusCircle, Upload, Trash, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';


const emptyProject: Omit<Project, 'id'> = {
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
  const [editingProject, setEditingProject] = useState<Project | Partial<Project> | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firestore = useFirestore();

  const projectsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'projects');
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsCollection);

  const openAddModal = () => {
    setEditingProject(emptyProject);
    setThumbnailFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setThumbnailFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firestore || !editingProject || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      let thumbnail = editingProject.thumbnail || '';
      if (thumbnailFile) {
        const storage = getStorage();
        const fileRef = storageRef(storage, `project-thumbnails/${Date.now()}-${thumbnailFile.name}`);
        const snapshot = await uploadBytes(fileRef, thumbnailFile);
        thumbnail = await getDownloadURL(snapshot.ref);
      }

      const projectData = {
        ...editingProject,
        thumbnail,
      };
      
      if ('id' in editingProject && editingProject.id) {
        // Update existing project
        const projectRef = doc(firestore, 'projects', editingProject.id);
        await updateDoc(projectRef, projectData);
        toast({ title: "Proyecto actualizado", description: `"${projectData.title}" ha sido actualizado.` });
      } else {
        // Add new project
        const projectsCollection = collection(firestore, 'projects');
        await addDoc(projectsCollection, projectData);
        toast({ title: "Proyecto añadido", description: `"${projectData.title}" ha sido creado.` });
      }

      setIsModalOpen(false);
      setEditingProject(null);
      setThumbnailFile(null);

    } catch (error) {
      console.error("Error saving project: ", error);
      toast({ variant: 'destructive', title: "Error", description: "No se pudo guardar el proyecto." });
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
      console.error("Error deleting project:", error);
      toast({ variant: 'destructive', title: "Error", description: "No se pudo eliminar el proyecto." });
    } finally {
      setProjectToDelete(null);
    }
  };


  const modalTitle = editingProject && 'id' in editingProject ? 'Editar Proyecto' : 'Añadir Nuevo Proyecto';
  const modalDescription = editingProject && 'id' in editingProject
    ? `Realiza cambios en el proyecto "${editingProject.title}".`
    : 'Completa el formulario para añadir un nuevo proyecto a tu portafolio.';


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Proyectos Actuales</CardTitle>
          </div>
          <Button onClick={openAddModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Proyecto
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tagline</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.tagline}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => openEditModal(project)}>
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setProjectToDelete(project)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
            <form onSubmit={handleFormSubmit} className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Proyecto</Label>
                  <Input id="title" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} placeholder="Ej: Renovación de Marca" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={editingProject.tagline}
                    onChange={e => setEditingProject({...editingProject, tagline: e.target.value})}
                    placeholder="Una descripción corta y llamativa"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail-upload">Miniatura del Proyecto</Label>
                <input 
                  type="file" 
                  id="thumbnail-upload"
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Miniatura
                </Button>
                <p className="text-xs text-muted-foreground">
                  Recomendado: 1200x800 píxeles.
                </p>
                {thumbnailFile ? (
                  <p className="text-sm text-foreground">Archivo seleccionado: {thumbnailFile.name}</p>
                ) : editingProject?.thumbnail ? (
                  <p className="text-sm text-foreground">Miniatura actual: {editingProject.thumbnail.split('/').pop()}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenge">El Desafío</Label>
                <Textarea
                  id="challenge"
                  value={editingProject.description?.challenge}
                  onChange={e => setEditingProject({...editingProject, description: {...editingProject.description!, challenge: e.target.value}})}
                  placeholder="Describe el problema o desafío."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution">La Solución</Label>
                <Textarea
                  id="solution"
                  value={editingProject.description?.solution}
                  onChange={e => setEditingProject({...editingProject, description: {...editingProject.description!, solution: e.target.value}})}
                  placeholder="Explica la solución que implementaste."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="results">Los Resultados</Label>
                <Textarea
                  id="results"
                  value={editingProject.description?.results}
                  onChange={e => setEditingProject({...editingProject, description: {...editingProject.description!, results: e.target.value}})}
                  placeholder="Menciona los resultados obtenidos."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Habilidades (separadas por coma)</Label>
                <Input 
                  id="skills" 
                  value={editingProject.skills?.join(', ')} 
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
              <Button type="submit" onClick={handleFormSubmit} disabled={isSubmitting}>
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
