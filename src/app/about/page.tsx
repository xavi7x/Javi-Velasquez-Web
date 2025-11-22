import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Badge } from '@/components/ui/badge';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';

const tools = [
  { name: 'Next.js' },
  { name: 'React' },
  { name: 'TypeScript' },
  { name: 'Node.js' },
  { name: 'Firebase' },
  { name: 'Tailwind CSS' },
  { name: 'WordPress' },
  { name: 'Google Cloud' },
  { name: 'Git & GitHub' },
];

export default function AboutPage() {
  const extendedTools = [...tools, ...tools]; // Duplicate for seamless loop

  return (
    <CursorGradientWrapper>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 lg:gap-24">
            <div className="flex flex-col justify-center space-y-6">
              <header>
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  Transformando Ideas en Código
                </h1>
                <p className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">
                  Soy Javier, un desarrollador apasionado por construir productos digitales que sean eficientes, escalables y resuelvan problemas reales.
                </p>
              </header>
              <p className="leading-relaxed text-muted-foreground">
                Me apasiona la intersección entre la creatividad y la tecnología. Utilizo un flujo de trabajo potenciado por IA que me permite saltar las barreras técnicas tradicionales y construir plataformas robustas de manera ágil. Mi objetivo no es solo que la web funcione, sino que sea escalable, estética y fácil de mantener, abarcando todo el ciclo de vida del proyecto con una visión integral.
              </p>
            </div>
            <div className="relative group order-first md:order-last">
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
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Mi Stack Tecnológico
              </h2>
              <p className="mt-4 max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed">
                Estas son algunas de las herramientas y tecnologías que utilizo para dar vida a mis proyectos.
              </p>
            </div>
          </div>
          <div className="mt-12 md:mt-16 relative w-full overflow-hidden">
             <div className="scrolling-wrapper">
              <div className="scrolling-content">
                {extendedTools.map((tool, index) => (
                  <Badge
                    key={`${tool.name}-${index}`}
                    variant="outline"
                    className="whitespace-nowrap rounded-full text-base md:text-lg py-2 px-4 md:px-6 bg-white/10 dark:bg-white/5 border-neutral-200/50 dark:border-white/10 backdrop-blur-sm"
                  >
                    {tool.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </CursorGradientWrapper>
  );
}
