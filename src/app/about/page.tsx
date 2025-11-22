'use client';

import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Badge } from '@/components/ui/badge';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

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

interface AboutContent {
  headline: string;
  subheadline: string;
  mainParagraph: string;
  imageUrl: string;
}

export default function AboutPage() {
  const extendedTools = [...tools, ...tools]; // Duplicate for seamless loop
  const firestore = useFirestore();

  const aboutContentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'about');
  }, [firestore]);

  const { data: aboutContent, isLoading } = useDoc<AboutContent>(aboutContentRef);
  
  const content = aboutContent || {
      headline: "Transformando Ideas en Código",
      subheadline: "Soy Javier, un desarrollador apasionado por construir productos digitales que sean eficientes, escalables y resuelvan problemas reales.",
      mainParagraph: "Me apasiona la intersección entre la creatividad y la tecnología. Utilizo un flujo de trabajo potenciado por IA que me permite saltar las barreras técnicas tradicionales y construir plataformas robustas de manera ágil. Mi objetivo no es solo que la web funcione, sino que sea escalable, estética y fácil de mantener, abarcando todo el ciclo de vida del proyecto con una visión integral.",
      imageUrl: "https://picsum.photos/seed/101/600/800"
  };

  return (
    <CursorGradientWrapper>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-16 items-start">
            <div className="flex flex-col justify-center space-y-6 lg:col-span-2">
              <header>
                 {isLoading ? (
                  <>
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-full mt-4" />
                    <Skeleton className="h-6 w-5/6 mt-2" />
                  </>
                ) : (
                  <>
                  <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                    {content.headline}
                  </h1>
                  <p className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">
                    {content.subheadline}
                  </p>
                  </>
                 )}
              </header>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
              ) : (
                 <p className="leading-relaxed text-muted-foreground">
                  {content.mainParagraph}
                </p>
              )}
            </div>
             <div className="relative group lg:col-span-1 lg:order-first">
               <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              {isLoading ? (
                 <Skeleton className="aspect-[3/4] w-full max-w-sm mx-auto rounded-3xl" />
              ) : (
                <Image
                  src={content.imageUrl}
                  alt="Javier Velásquez"
                  width={450}
                  height={600}
                  className="relative h-full w-full max-w-sm mx-auto rounded-3xl object-cover"
                  data-ai-hint="portrait person"
                  priority
                />
              )}
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
