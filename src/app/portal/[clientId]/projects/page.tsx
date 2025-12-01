'use client';

import { useParams } from 'next/navigation';
import { useClientProjects } from '@/firebase/firestore/hooks/use-client-projects';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { ProgressUpdate } from '@/lib/project-types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Timestamp } from 'firebase/firestore';


function ProjectHistory({ history }: { history?: ProgressUpdate[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
        No hay historial de avances para este proyecto.
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => {
    const dateA = a.date instanceof Timestamp ? a.date.toMillis() : new Date(a.date).getTime();
    const dateB = b.date instanceof Timestamp ? b.date.toMillis() : new Date(b.date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="p-4 space-y-4">
      <h4 className="font-semibold flex items-center gap-2 text-sm">
        <History className="h-4 w-4" />
        Historial de Avances
      </h4>
      <div className="relative pl-6">
        <div className="absolute left-[3px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
        <ul className="space-y-6">
          {sortedHistory.map((item, index) => {
            const itemDate = item.date instanceof Timestamp ? item.date.toDate() : new Date(item.date);
            return (
              <li key={index} className="relative">
                <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-primary/50 border-4 border-background"></div>
                <p className="text-xs text-muted-foreground">
                  {format(itemDate, "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                </p>
                <p className="text-sm font-medium">Progreso actualizado al {item.progress}%</p>
                <p className="text-sm text-muted-foreground italic mt-1">"{item.comment}"</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}


export default function ProjectsPage() {
  const params = useParams();
  const clientId = params.clientId as string;

  const { data: projects, isLoading } = useClientProjects({ clientId });

  const renderSkeletons = () => (
    [...Array(2)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 flex-grow" />
            <Skeleton className="h-4 w-10" />
          </div>
        </CardContent>
      </Card>
    ))
  );

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
        <p className="text-muted-foreground">Un resumen detallado del estado y progreso de cada uno de tus proyectos.</p>
      </header>

      <div className="space-y-6">
        {isLoading ? renderSkeletons() : (
          projects && projects.length > 0 ? (
            projects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  {project.description && (
                    <CardDescription>
                      {typeof project.description === 'string' ? project.description : project.description.challenge}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Progress value={project.progress || 0} className="flex-1" />
                    <span className="text-sm font-semibold text-muted-foreground">{project.progress || 0}%</span>
                  </div>
                </CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-t">
                    <AccordionTrigger className="px-6 py-3 text-sm font-medium text-muted-foreground hover:no-underline">
                      Ver historial de avances
                    </AccordionTrigger>
                    <AccordionContent>
                      <ProjectHistory history={project.progressHistory} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            ))
          ) : (
            <Card className="flex flex-col items-center justify-center h-64 border-dashed">
              <Briefcase className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay proyectos todavía</h3>
              <p className="mt-1 text-sm text-muted-foreground">Cuando se te asigne un proyecto, aparecerá aquí.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
