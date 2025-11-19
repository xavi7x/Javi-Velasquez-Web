'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { projects } from '@/lib/projects';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function PortfolioGrid() {
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
            Aquí hay una selección de mis trabajos más recientes en desarrollo web.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group block"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 blur-lg transition-all duration-300 group-hover:opacity-25"></div>
                <Card className="relative overflow-hidden rounded-2xl transition-all duration-300 h-full">
                  <Image
                    src={project.thumbnail}
                    width={600}
                    height={400}
                    alt={project.title}
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
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
