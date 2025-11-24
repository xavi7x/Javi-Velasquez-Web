'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Project } from '@/lib/project-types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    delay: index * 150,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0 transition-all duration-700 ease-out',
        inView ? 'animate-fade-in-up' : 'translate-y-5'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card className="h-full overflow-hidden group">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-muted-foreground mb-4 text-sm">{project.tagline}</p>
            <div className="flex flex-wrap gap-2">
              {project.skills.slice(0, 4).map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export function PortfolioGrid() {
  const firestore = useFirestore();

  const portfolioQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Remove orderBy to simplify the query and avoid index-related security rule issues.
    return query(
      collection(firestore, 'projects'),
      where('type', '==', 'portfolio')
    );
  }, [firestore]);

  const { data, isLoading } = useCollection<Project>(portfolioQuery);

  // Sort projects on the client-side after fetching
  const projects = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => a.order - b.order);
  }, [data]);

  return (
    <section
      id="portfolio"
      className="w-full py-16 md:py-32"
    >
      <div className="mx-auto max-w-5xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Proyectos Destacados
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Aquí hay una selección de mis trabajos más recientes.
          </p>
      </div>

      {isLoading ? (
        <div className="mt-16 h-48 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
          <p className="text-muted-foreground">Cargando proyectos...</p>
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
         <div className="mt-16 h-48 flex flex-col items-center justify-center text-center bg-muted/50 rounded-2xl">
            <h3 className="text-lg font-semibold">Portafolio en Construcción</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
                Aún no se han añadido proyectos públicos. ¡Vuelve pronto para ver mi trabajo!
            </p>
        </div>
      )}
    </section>
  );
}
