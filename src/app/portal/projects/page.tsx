
'use client';

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
import type { Project } from '@/lib/project-types';
import { Progress } from '@/components/ui/progress';

export default function ProjectsPage() {
  const { user } = useUser();
  const { data: projects, isLoading: areProjectsLoading } = useClientProjects({
    clientId: user?.uid,
  });

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver el estado y progreso de todos tus proyectos.
        </p>
      </header>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proyecto</TableHead>
              <TableHead className="w-[200px]">Progreso</TableHead>
              <TableHead className="text-right w-[120px]">Acciones</TableHead>
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
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-9 w-20 rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : !projects || projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-48 text-center">
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
                    <div className="flex items-center gap-2">
                        <Progress value={project.progress || 0} className="w-[60%]" />
                        <span className="text-xs text-muted-foreground">{project.progress || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/portal/projects/${project.id}`}>
                        Ver Detalles
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
    </div>
  );
}
