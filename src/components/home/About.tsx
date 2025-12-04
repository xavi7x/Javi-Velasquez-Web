'use client';

import { Sparkles, TabletSmartphone, Rocket, LayoutDashboard, Zap, Layers } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    name: 'Ecosistemas Digitales a Medida',
    description:
      'No uso plantillas. Diseño y desarrollo arquitecturas web escalables en React/Next.js que posicionan tu marca como líder del sector.',
    icon: Layers,
  },
  {
    name: 'Aplicaciones Web Progresivas (PWA)',
    description:
      'La potencia de una App nativa, sin descargas. Experiencias móviles fluidas que retienen usuarios y funcionan incluso offline.',
    icon: TabletSmartphone,
  },
  {
    name: 'Dashboards de Control & Gestión',
    description:
      'Te doy el control total. Un portal privado para visualizar métricas, gestionar contenido y escalar tu negocio sin depender de nadie.',
    icon: LayoutDashboard,
  },
];

export function About() {
  return (
    <section
      id="about"
      className="w-full py-16 md:py-32 relative overflow-hidden"
    >
        {/* Background Gradients for Depth (Sutiles) */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[128px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[128px] -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-6 backdrop-blur-md">
            <Zap size={12} className="fill-indigo-600 dark:fill-indigo-500" />
            <span>Más allá del Código</span>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Soluciones que <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Generan Retorno</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Me alejo del modelo tradicional de "entregar y desaparecer". Construyo sistemas vivos diseñados para crecer contigo.
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.name}
                className="group relative flex flex-col items-start p-8 text-left rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                {/* Gradiente sutil en Hover */}
                <div className="absolute top-0 left-0 -inset-full h-full w-full bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 w-full">
                  <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-indigo-50 dark:bg-white/10 p-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{service.name}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
         <div className="mt-16 text-center">
            <Button asChild variant="outline" size="lg" className="group border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all">
              <Link href="/about">
                Ver mi Proceso de Trabajo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
      </div>
    </section>
  );
}