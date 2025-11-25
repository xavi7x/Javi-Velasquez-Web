
'use client';

import {
  Card,
  CardContent,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { useClientProjects } from '@/firebase/firestore/hooks/use-client-projects';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ClientProject } from '@/lib/project-types';

export default function ProjectsPage() {
  const { user } = useUser();
  const { data: projects, isLoading: areProjectsLoading } = useClientProjects({
    clientId: user?.uid,
  });

  const getStatusVariant = (status: ClientProject['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'on-hold':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: ClientProject['status']) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'completed':
        return 'Completado';
      case 'on-hold':
        return 'En Pausa';
      default:
        return status;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver el estado y progreso de todos tus proyectos.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Progreso</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areProjectsLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-9 w-9 rounded-md ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : !projects || projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Briefcase className="h-12 w-12 text-muted-foreground" />
                        <h3 className="font-semibold">
                          Aún no tienes proyectos asignados
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Cuando se inicie un proyecto, aparecerá aquí.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {project.progress || 0}%
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm" className='ml-auto flex'>
                          <Link href={`/portal/projects/${project.id}`}>
                            Ver
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
