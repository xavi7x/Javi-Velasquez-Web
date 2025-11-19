import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Badge } from '@/components/ui/badge';

const tools = [
  { name: 'Adobe Photoshop' },
  { name: 'Adobe Illustrator' },
  { name: 'Notion' },
  { name: 'Firebase' },
  { name: 'Next.js' },
  { name: 'React' },
  { name: 'Tailwind CSS' },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-950 text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 lg:gap-24">
            <div className="flex flex-col justify-center space-y-6">
              <header>
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
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
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <Image
                src="https://picsum.photos/seed/101/600/800"
                alt="Javier Velásquez"
                width={600}
                height={800}
                className="relative h-full w-full rounded-3xl object-cover"
                data-ai-hint="portrait person"
              />
            </div>
          </div>
        </div>
        <section
          id="tools"
          className="w-full py-16 md:py-24"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-5xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Mis Herramientas
              </h2>
              <p className="mt-4 max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed">
                Estas son algunas de las herramientas que utilizo para dar vida a mis proyectos.
              </p>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              {tools.map((tool) => (
                <Badge
                  key={tool.name}
                  variant="secondary"
                  className="rounded-full text-lg py-2 px-4 border border-white/10"
                >
                  {tool.name}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
