'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import type { Project } from '@/lib/project-types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function PortfolioGrid() {
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const firestore = useFirestore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // FIX: Only fetch projects explicitly marked as 'portfolio' type for the public grid.
    return query(
      collection(firestore, 'projects'), 
      where('type', '==', 'portfolio'),
      orderBy('order', 'asc'), 
      limit(6)
    );
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  return (
    <section
      id="portfolio"
      ref={inViewRef}
      className={cn(
        'w-full py-16 md:py-32 opacity-0 transition-opacity duration-1000',
        inView && 'animate-fade-in-up opacity-100'
      )}
    >
      <Card className="p-8 md:p-12 bg-neutral-100/50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 backdrop-blur-xl overflow-hidden">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Proyectos Destacados
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Aquí hay una selección de mis trabajos más recientes.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Dialog>
            {isLoading ? (
               [...Array(3)].map((_, i) => (
                 <div key={i}>
                    <Skeleton className="aspect-video w-full rounded-2xl" />
                    <Skeleton className="h-5 w-3/4 mt-4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                 </div>
               ))
            ) : projects?.map((project) => (
              <DialogTrigger
                asChild
                key={project.id}
                onClick={() => setSelectedProject(project)}
              >
                <div className="group block cursor-pointer">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 blur-lg transition-all duration-300 group-hover:opacity-25"></div>
                    <Card className="relative overflow-hidden rounded-2xl transition-all duration-300 h-full">
                      {project.thumbnail ? (
                        <Image
                          src={project.thumbnail}
                          width={600}
                          height={400}
                          alt={project.title}
                          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="aspect-video w-full bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground text-sm">Sin imagen</p>
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="text-md font-semibold text-foreground">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {project.tagline}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </DialogTrigger>
            ))}
            {selectedProject && (
              <DialogContent className="max-w-4xl w-[95%] h-[90vh] md:h-[80vh] bg-white dark:bg-white/5 border-neutral-200/50 dark:border-white/10 dark:backdrop-blur-xl p-0 rounded-2xl">
                <ScrollArea className="h-full w-full rounded-2xl">
                  <div className="p-6 md:p-8">
                    <DialogHeader className="text-center mb-8">
                      <DialogTitle className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                        {selectedProject.title}
                      </DialogTitle>
                      <p className="mt-2 text-lg text-muted-foreground md:text-xl">{selectedProject.tagline}</p>
                    </DialogHeader>

                    <article className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedProject.thumbnail && (
                          <Image
                            src={selectedProject.thumbnail}
                            width={1200}
                            height={800}
                            alt={`Imagen principal del proyecto ${selectedProject.title}`}
                            className="aspect-[3/2] w-full rounded-3xl object-cover"
                            data-ai-hint="project screenshot"
                          />
                        )}
                        {selectedProject.images?.map((img, index) => (
                          <Image
                            key={index}
                            src={img}
                            width={1200}
                            height={800}
                            alt={`Imagen del proyecto ${index + 1}`}
                            className="aspect-[3/2] w-full rounded-3xl object-cover"
                            data-ai-hint="project screenshot"
                          />
                        ))}
                      </div>

                      <div className="mx-auto max-w-3xl space-y-8">
                        <div className="space-y-6">
                          {selectedProject.description.challenge && (
                            <div>
                              <h2 className="font-headline text-2xl font-bold">El Desafío</h2>
                              <p className="mt-2 leading-relaxed text-muted-foreground">
                                {selectedProject.description.challenge}
                              </p>
                            </div>
                          )}
                           {selectedProject.description.solution && (
                            <div>
                              <h2 className="font-headline text-2xl font-bold">La Solución</h2>
                              <p className="mt-2 leading-relaxed text-muted-foreground">
                                {selectedProject.description.solution}
                              </p>
                            </div>
                           )}
                          {selectedProject.description.results && (
                            <div>
                              <h2 className="font-headline text-2xl font-bold">Los Resultados</h2>
                              <p className="mt-2 leading-relaxed text-muted-foreground">
                                {selectedProject.description.results}
                              </p>
                            </div>
                          )}
                        </div>
                        {selectedProject.skills?.length > 0 && (
                          <aside className="space-y-6">
                            <div>
                              <h3 className="font-headline text-xl font-bold">Habilidades y Herramientas</h3>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {selectedProject.skills.map((skill) => (
                                  <Badge key={skill} variant="outline" className="bg-accent text-accent-foreground">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </aside>
                        )}
                      </div>
                    </article>
                  </div>
                </ScrollArea>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </Card>
    </section>
  );
}
