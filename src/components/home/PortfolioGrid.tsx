'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import type { Project } from '@/lib/project-types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface PortfolioGridProps {
  projects: Project[] | null;
  isLoading: boolean;
}

export function PortfolioGrid({ projects, isLoading }: PortfolioGridProps) {
  
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

       {isLoading && (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Cargando proyectos...</p>
        </div>
      )}

      {!isLoading && (!projects || projects.length === 0) && (
         <div className="mt-16 h-48 flex flex-col items-center justify-center text-center bg-muted/50 rounded-2xl">
            <h3 className="text-lg font-semibold">Portafolio en Construcción</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
                Aún no hay proyectos públicos para mostrar. ¡Vuelve pronto!
            </p>
        </div>
      )}

      {!isLoading && projects && projects.length > 0 && (
         <div
          className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6"
        >
          {projects.map((project, index) => {
            const { ref, inView } = useInView({
              triggerOnce: true,
              threshold: 0.1,
            });

            return (
              <div
                key={project.id}
                ref={ref}
                className={cn(
                  'group relative col-span-1 md:col-span-2',
                  index === 0 && 'md:col-span-4 md:row-span-2',
                  index === 3 && 'md:col-span-3',
                  index === 4 && 'md:col-span-3',
                  'opacity-0 transition-all duration-700 ease-out',
                  inView ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
                )}
                style={{ animationDelay: `${Math.min(index * 150, 450)}ms` }}
              >
                <Card className="h-full w-full overflow-hidden">
                  <CardContent className="relative h-full w-full p-0">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      data-ai-hint="abstract background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white">
                        {project.title}
                      </h3>
                      <p className="text-sm text-white/80">{project.tagline}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" className="bg-white/10 text-white border-white/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
