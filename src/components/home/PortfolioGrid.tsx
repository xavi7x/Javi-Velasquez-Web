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

export function PortfolioGrid() {
  
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

        <div className="mt-16 h-48 flex flex-col items-center justify-center text-center bg-muted/50 rounded-2xl">
            <h3 className="text-lg font-semibold">Portafolio en Construcción</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
                Esta sección está temporalmente en mantenimiento. ¡Vuelve pronto para ver mi trabajo!
            </p>
        </div>
    </section>
  );
}
