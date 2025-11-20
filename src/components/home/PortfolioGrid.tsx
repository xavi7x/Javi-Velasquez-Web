'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Project } from '@/lib/project-types';
import { Skeleton } from '@/components/ui/skeleton';

export function PortfolioGrid() {
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('title'), limit(6));
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
      <Card className="p-8 md:p-12 bg-white/50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Proyectos Destacados
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Aquí hay una selección de mis trabajos más recientes.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-2xl">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.id}`}
              className="group block"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 blur-lg transition-all duration-300 group-hover:opacity-25"></div>
                <Card className="relative overflow-hidden rounded-2xl transition-all duration-300 h-full">
                  {project.thumbnail && (
                    <Image
                      src={project.thumbnail}
                      width={600}
                      height={400}
                      alt={project.title}
                      className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
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
            </Link>
          ))}
        </div>
      </Card>
    </section>
  );
}
