'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, PenTool, Code, Rocket, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Hook simple para detectar visibilidad (sin dependencias externas pesadas)
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Opcional: dejar de observar si solo queremos que anime una vez
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold }
    );

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [threshold]);

  return [domRef, isVisible] as const;
};

// Componente Wrapper para animar cada paso
const RevealStep = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => {
    const [ref, isVisible] = useScrollReveal(0.2);
    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={cn(
                "transition-all duration-1000 ease-out transform",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20",
                className
            )}
        >
            {children}
        </div>
    );
};

const steps = [
  {
    title: '1. Inmersión & Estrategia',
    description:
      'No escribo una sola línea de código sin entender tu negocio. Analizamos tus KPIs, tu competencia y definimos qué es el "éxito" para este proyecto.',
    icon: Search,
    color: 'bg-blue-500',
    shadow: 'shadow-blue-500/20',
  },
  {
    title: '2. Diseño & Arquitectura',
    description:
      'Diseñamos la experiencia de usuario (UX) enfocada en conversión. Definimos el stack tecnológico ideal para que tu ecosistema sea rápido y escalable.',
    icon: PenTool,
    color: 'bg-purple-500',
    shadow: 'shadow-purple-500/20',
  },
  {
    title: '3. Desarrollo & Dashboard',
    description:
      'Construcción en React/Next.js. Aquí también configuro tu Portal de Cliente para que tengas control total desde el primer día.',
    icon: Code,
    color: 'bg-indigo-500',
    shadow: 'shadow-indigo-500/20',
  },
  {
    title: '4. Lanzamiento & Escala',
    description:
      'Pruebas rigurosas, optimización SEO técnica y despliegue. Pero no termina ahí: activamos el plan de mantenimiento para crecer mes a mes.',
    icon: Rocket,
    color: 'bg-emerald-500',
    shadow: 'shadow-emerald-500/20',
  },
];

export function ProcessTimeline() {
  return (
    <section className="w-full py-20 md:py-32 relative overflow-hidden">
       {/* Línea conectora central (Decorativa - Animada al hacer scroll) */}
       <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent hidden md:block"></div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <RevealStep className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                Un Proceso <span className="text-indigo-600 dark:text-indigo-400">Sin Sorpresas</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
                Deja la incertidumbre para los freelancers. Aquí seguimos un plan de vuelo probado.
            </p>
        </RevealStep>

        <div className="grid gap-12 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <RevealStep key={index} delay={index * 100} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 relative ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Contenido (Texto) */}
                <div className="flex-1 text-center md:text-left">
                    <div className={`p-8 rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/10 group ${!isEven && 'md:text-right'}`}>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{step.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                            {step.description}
                        </p>
                    </div>
                </div>

                {/* Icono Central (Timeline) */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg ${step.shadow} ${step.color} transform transition-transform duration-500 hover:scale-110`}>
                    <Icon size={24} />
                  </div>
                  {/* Número flotante */}
                   <div className="absolute -top-6 -right-6 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                        {index + 1}
                   </div>
                </div>

                {/* Espacio vacío para balancear el grid */}
                <div className="flex-1 hidden md:block"></div>
              </RevealStep>
            );
          })}
        </div>
        
        {/* CTA Intermedio con animación de rebote y fade */}
        <RevealStep delay={600} className="flex justify-center mt-20">
            <div className="flex flex-col items-center animate-bounce text-slate-400">
                <span className="text-xs font-medium uppercase tracking-widest mb-2">Tu proyecto empieza aquí</span>
                <ArrowDown size={20} />
            </div>
        </RevealStep>
      </div>
    </section>
  );
}