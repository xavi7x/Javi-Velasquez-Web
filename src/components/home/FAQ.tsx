'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: "¿Por qué la inversión inicial es de $1,500+?",
    answer: "Porque no vendo plantillas genéricas. Desarrollo un activo digital a medida con arquitectura React/Next.js, optimización SEO técnica avanzada y un sistema de gestión personalizado. Es la diferencia entre gastar en una web que hay que rehacer en un año, o invertir en una plataforma escalable para los próximos 5."
  },
  {
    question: "¿Usas WordPress?",
    answer: "Sí, lo utilizo estratégicamente para proyectos que requieren autogestión simple o blogs de contenido. Sin embargo, para aplicaciones web complejas, plataformas SaaS o e-commerce de alto rendimiento, prefiero desarrollar con React y Next.js para garantizarte velocidad máxima, seguridad total y escalabilidad sin límites."
  },
  {
    question: "¿Qué incluye el 'Socio Tecnológico'?",
    answer: "No desaparezco tras el lanzamiento. Mi plan de mantenimiento incluye hosting de alto rendimiento, dominio, actualizaciones de seguridad, backups diarios y, lo más importante: acceso a tu Dashboard de Cliente para solicitar cambios o soporte prioritario sin burocracia."
  },
  {
    question: "¿Cuánto tiempo tarda el desarrollo?",
    answer: "Para un sitio corporativo High-End (Plan Launch), el promedio es de 2 a 3 semanas. Para ecosistemas más complejos o Apps (Plan Growth), entre 4 y 6 semanas. Trabajamos por sprints semanales para que veas avances reales constantemente."
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-20 md:py-32 relative overflow-hidden bg-neutral-50/50 dark:bg-white/5 border-t border-neutral-200 dark:border-white/5">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium mb-6 backdrop-blur-md">
            <HelpCircle size={12} />
            <span>Resolviendo Dudas</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Todo lo que necesitas saber antes de iniciar.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={cn(
                "group rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-white/[0.02] overflow-hidden transition-all duration-300",
                openIndex === index ? "border-indigo-500/30 shadow-lg dark:shadow-indigo-500/10" : "hover:border-indigo-500/20"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex items-center justify-between w-full p-6 text-left"
              >
                <span className={cn(
                  "text-lg font-medium transition-colors",
                  openIndex === index ? "text-indigo-600 dark:text-indigo-400" : "text-foreground"
                )}>
                  {faq.question}
                </span>
                <div className={cn(
                  "p-2 rounded-full transition-colors duration-300",
                  openIndex === index ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "bg-neutral-100 dark:bg-white/5 text-muted-foreground group-hover:bg-neutral-200 dark:group-hover:bg-white/10"
                )}>
                  {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              
              <div 
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}