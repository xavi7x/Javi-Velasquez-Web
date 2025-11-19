'use client';

import { useState, useRef } from 'react';
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
import { projects } from '@/lib/projects'; // Usando datos estáticos por ahora
import type { Project } from '@/lib/types';
import { PlusCircle, Upload } from 'lucide-react';

export function ProjectsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const openAddModal = () => {
    setEditingProject(null);
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      console.log('Proyecto actualizado (simulado):', editingProject.title);
    } else {
      console.log('Nuevo proyecto guardado (simulado)');
    }
    setIsModalOpen(false);
    setEditingProject(null);
    setThumbnailFile(null);
  };
  
  const handleDeleteProject = () => {
    if (projectToDelete) {
      console.log('Proyecto eliminado (simulado):', projectToDelete.title);
      // Lógica de borrado aquí
      setProjectToDelete(null);
    }
  };


  const modalTitle = editingProject ? 'Editar Proyecto' : 'Añadir Nuevo Proyecto';
  const modalDescription = editingProject
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
              {projects.map((project) => (
                <TableRow key={project.slug}>
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
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                <Input id="title" defaultValue={editingProject?.title} placeholder="Ej: Renovación de Marca" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  defaultValue={editingProject?.tagline}
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
                defaultValue={editingProject?.description.challenge}
                placeholder="Describe el problema o desafío."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">La Solución</Label>
              <Textarea
                id="solution"
                defaultValue={editingProject?.description.solution}
                placeholder="Explica la solución que implementaste."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="results">Los Resultados</Label>
              <Textarea
                id="results"
                defaultValue={editingProject?.description.results}
                placeholder="Menciona los resultados obtenidos."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Habilidades (separadas por coma)</Label>
              <Input id="skills" defaultValue={editingProject?.skills.join(', ')} placeholder="Ej: React, Figma, Branding" />
            </div>
          </form>
          <DialogFooter>
             <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleFormSubmit}>Guardar Proyecto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
