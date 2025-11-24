'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';


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
      <Card className="p-8 md:p-12 bg-neutral-100/50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 backdrop-blur-xl overflow-hidden">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Proyectos Destacados
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Aquí hay una selección de mis trabajos más recientes.
          </p>
        </div>
        <div className="mt-16 h-48 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Sección en Mantenimiento</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
                Estamos realizando mejoras en esta sección. Los proyectos destacados volverán a estar visibles pronto.
            </p>
        </div>
      </Card>
    </section>
  );
}
