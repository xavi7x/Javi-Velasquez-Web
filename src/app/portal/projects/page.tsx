'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Project } from '@/lib/project-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Eye } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // CORRECTED: Query the client-specific sub-collection for projects.
  // This is more secure and aligns with Firestore's recommended data modeling for user-specific data.
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // The query now targets '/clients/{userId}/projects' instead of the global '/projects' collection.
    return collection(firestore, 'clients', user.uid, 'projects');
  }, [firestore, user]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);
  
  const getProjectStatus = (project: Project) => {
    if (!project.stages || project.stages.length === 0) {
      return 'Sin definir';
    }
    const completedStages = project.stages.filter(s => s.status === 'Completed').length;
    if (completedStages === project.stages.length) {
      return 'Completado';
    }
    if (project.stages.some(s => s.status === 'In Progress')) {
      return 'En Progreso';
    }
    return 'Pendiente';
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Completado':
        return 'default';
      case 'En Progreso':
        return 'secondary';
      default:
        return 'outline';
    }
  }


  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver el estado y el progreso de todos tus proyectos.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Proyectos</CardTitle>
          <CardDescription>Un resumen de los proyectos activos y pasados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Proyecto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(2)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-9 w-24 rounded-full inline-block" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : projects && projects.length > 0 ? (
                  projects.map((project) => {
                    const status = getProjectStatus(project);
                    return (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(status)}>{status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/portal/projects/${project.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Ver Detalles
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Briefcase className="h-12 w-12 text-muted-foreground" />
                        <h3 className="font-semibold">No tienes proyectos asignados</h3>
                        <p className="text-muted-foreground">
                          Cuando se te asigne un proyecto, aparecerá aquí.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
