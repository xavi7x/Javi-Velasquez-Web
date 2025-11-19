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
import { projects } from '@/lib/projects'; // Usando datos estáticos por ahora
import { PlusCircle } from 'lucide-react';

export function ProjectsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lógica para manejar el envío del formulario (a implementar)
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar en Firestore
    console.log('Proyecto guardado (simulado)');
    setIsModalOpen(false); // Cierra el modal después de guardar
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Proyectos Actuales</CardTitle>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
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
                    <Button variant="outline" size="sm" className="rounded-full">
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full"
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
            <DialogTitle>Añadir Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa el formulario para añadir un nuevo proyecto a tu portafolio.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProject} className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Proyecto</Label>
                <Input id="title" placeholder="Ej: Renovación de Marca" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="Una descripción corta y llamativa"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail">URL de Miniatura</Label>
              <Input
                id="thumbnail"
                placeholder="https://picsum.photos/seed/..."
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="challenge">El Desafío</Label>
              <Textarea
                id="challenge"
                placeholder="Describe el problema o desafío."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">La Solución</Label>
              <Textarea
                id="solution"
                placeholder="Explica la solución que implementaste."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="results">Los Resultados</Label>
              <Textarea
                id="results"
                placeholder="Menciona los resultados obtenidos."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Habilidades (separadas por coma)</Label>
              <Input id="skills" placeholder="Ej: React, Figma, Branding" />
            </div>
          </form>
          <DialogFooter>
             <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleAddProject}>Guardar Proyecto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
