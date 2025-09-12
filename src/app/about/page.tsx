import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Code, PenTool, LayoutTemplate, Share2 } from 'lucide-react';

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
    name: 'Contenido para Redes',
    description: 'Diseño visual atractivo y estratégico para potenciar tu marca en redes sociales.',
    icon: Share2,
  },
];


export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 lg:gap-24">
            <div className="flex flex-col justify-center space-y-6">
              <header>
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                  Uniendo Creatividad y Código
                </h1>
                <p className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">
                  Soy Javier Velásquez, un tecnólogo creativo y diseñador de productos apasionado por construir experiencias digitales que sean intuitivas, impactantes y resuelvan problemas reales.
                </p>
              </header>
              <p className="leading-relaxed text-muted-foreground">
                Mi enfoque combina una profunda comprensión del diseño centrado en el usuario con la habilidad técnica para llevar esas ideas a la realidad. Disfruto cada etapa del proceso, desde la conceptualización y el prototipado hasta el desarrollo y lanzamiento final.
              </p>
               <p className="leading-relaxed text-muted-foreground">
                Fuera del trabajo, me encontrarás explorando nuevas tecnologías, contribuyendo a proyectos de código abierto o buscando inspiración en el arte y la naturaleza.
              </p>
            </div>
            <div className="relative">
               <Image
                  src="https://picsum.photos/seed/101/600/800"
                  alt="Javier Velásquez"
                  width={600}
                  height={800}
                  className="h-full w-full object-cover"
                  data-ai-hint="portrait person"
                />
            </div>
          </div>

          <section id="services" className="w-full py-20 md:py-32">
            <div className="mx-auto max-w-5xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Mis Servicios</h2>
              <p className="mt-4 max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed">
                Ofrezco una gama de servicios para ayudarte a llevar tu visión al siguiente nivel.
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
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
