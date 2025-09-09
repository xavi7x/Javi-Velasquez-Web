import { Code, PenTool, LayoutTemplate, BarChart } from 'lucide-react';

const services = [
  {
    name: 'Diseño Estratégico',
    description: 'Creo interfaces intuitivas y atractivas centradas en el usuario.',
    icon: PenTool,
  },
  {
    name: 'Desarrollo a Medida',
    description: 'Soluciones web y móviles robustas, escalables y de alto rendimiento.',
    icon: Code,
  },
  {
    name: 'Prototipos Funcionales',
    description: 'Valido ideas rápidamente con prototipos interactivos y realistas.',
    icon: LayoutTemplate,
  },
  {
    name: 'Optimización y Datos',
    description: 'Analizo datos para optimizar la experiencia y los resultados.',
    icon: BarChart,
  },
];

export function About() {
  return (
    <section id="about" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Uniendo Tecnología y Diseño
          </h2>
          <p className="mt-4 max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed">
            Combino creatividad y tecnología para construir soluciones digitales que resuelven problemas reales y generan un impacto medible.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service.name} className="flex flex-col items-center text-center p-4">
              <service.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
