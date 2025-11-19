import { Code, LayoutTemplate, Smartphone, Server } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    name: 'Desarrollo Frontend',
    description:
      'Construyo interfaces de usuario interactivas, rápidas y responsive con las últimas tecnologías.',
    icon: LayoutTemplate,
  },
  {
    name: 'Desarrollo Backend',
    description:
      'Diseño y desarrollo APIs robustas, bases de datos eficientes y lógica de servidor escalable.',
    icon: Server,
  },
  {
    name: 'Aplicaciones Web',
    description:
      'Soluciones web completas, desde la idea hasta el despliegue, usando stacks modernos.',
    icon: Code,
  },
  {
    name: 'Desarrollo Móvil',
    description:
      'Creo experiencias móviles fluidas y nativas para iOS y Android con tecnologías híbridas.',
    icon: Smartphone,
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
            Especialista en Desarrollo Web
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Soy desarrollador web integral, listo para llevar tu visión al siguiente nivel. Combino creatividad y tecnología para construir soluciones digitales que resuelven problemas reales y generan un impacto medible.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="relative flex flex-col items-center p-8 text-center rounded-3xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <div className="absolute top-0 left-0 -inset-full h-full w-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="mb-4 inline-block rounded-full bg-white/10 p-4">
                   <service.icon className="h-8 w-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{service.name}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
         <div className="mt-16 text-center">
            <Button asChild variant="link" size="lg" className="group text-foreground">
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
