
'use client';

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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { projects } from '@/lib/projects'; // Usando datos estáticos por ahora

export default function OwnerPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8 lg:p-12">
        <div className="container mx-auto grid gap-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Propietario</h1>
            <p className="text-muted-foreground">
              Aquí puedes añadir, editar y eliminar los proyectos de tu portafolio.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Añadir Nuevo Proyecto</CardTitle>
                  <CardDescription>
                    Completa el formulario para añadir un nuevo proyecto.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del Proyecto</Label>
                    <Input id="title" placeholder="Ej: Renovación de Marca" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" placeholder="Una descripción corta y llamativa" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">URL de Miniatura</Label>
                    <Input id="thumbnail" placeholder="https://picsum.photos/seed/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="challenge">El Desafío</Label>
                    <Textarea id="challenge" placeholder="Describe el problema o desafío." />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="solution">La Solución</Label>
                    <Textarea id="solution" placeholder="Explica la solución que implementaste." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="results">Los Resultados</Label>
                    <Textarea id="results" placeholder="Menciona los resultados obtenidos." />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="skills">Habilidades (separadas por coma)</Label>
                    <Input id="skills" placeholder="Ej: React, Figma, Branding" />
                  </div>
                  <Button className="w-full">Guardar Proyecto</Button>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Proyectos Actuales</CardTitle>
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
                          <TableCell className="text-muted-foreground">{project.tagline}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="sm" className="rounded-full">Editar</Button>
                            <Button variant="destructive" size="sm" className="rounded-full">Eliminar</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
