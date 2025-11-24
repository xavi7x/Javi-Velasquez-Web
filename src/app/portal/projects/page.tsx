'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { useClientProjects } from '@/firebase/firestore/hooks/use-client-projects';
import { useUser } from '@/firebase';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { ClientProject } from '@/lib/project-types';

const ProjectCardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

const getStatusVariant = (status: ClientProject['status']) => {
  switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'on-hold': return 'outline';
      default: return 'outline';
  }
}
 const getStatusLabel = (status: ClientProject['status']) => {
  switch (status) {
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      case 'on-hold': return 'En Pausa';
      default: return status;
  }
}

export default function ProjectsPage() {
  const { user } = useUser();
  const { data: projects, isLoading } = useClientProjects({ clientId: user?.uid });

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver el estado y el progreso de todos tus proyectos, activos y pasados.
        </p>
      </header>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-2 h-[40px]">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">PROGRESO</span>
                        <span className="text-xs font-bold">{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} />
                </div>
                <div className="flex items-center justify-between pt-2">
                    <Badge variant={getStatusVariant(project.status)}>
                      {getStatusLabel(project.status)}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/portal/projects/${project.id}`}>Ver detalles</Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">Aún no tienes proyectos asignados</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Cuando se cree un proyecto para ti, aparecerá aquí.
          </p>
        </Card>
      )}
    </div>
  );
}
