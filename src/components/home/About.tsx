import { Code, LayoutTemplate, PenTool, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    name: 'Diseño Estratégico',
    description:
      'Creo interfaces intuitivas y atractivas centradas en el usuario.',
    icon: PenTool,
  },
  {
    name: 'Desarrollo a Medida',
    description:
      'Soluciones web y móviles robustas, escalables y de alto rendimiento.',
    icon: Code,
  },
  {
    name: 'Prototipos Funcionales',
    description:
      'Valido ideas rápidamente con prototipos interactivos y realistas.',
    icon: LayoutTemplate,
  },
  {
    name: 'Contenido para Redes',
    description:
      'Diseño visual atractivo y estratégico para potenciar tu marca en redes sociales.',
    icon: Share2,
  },
];

export function About() {
  return (
    <section
      id="about"
      className="w-full py-16 md:py-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Uniendo Tecnología y Diseño
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Combino creatividad y tecnología para construir soluciones digitales
            que resuelven problemas reales y generan un impacto medible.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex flex-col items-center p-4 text-center"
            >
              <service.icon className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">{service.name}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
         <div className="mt-16 text-center">
            <Button asChild variant="link" size="lg" className="group">
              <Link href="/about">
                Conoce más sobre mí
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
      </div>
    </section>
  );
}
