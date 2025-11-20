import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { projects } from '@/lib/projects';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <CursorGradientWrapper>
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
          <div className="mb-8">
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
          </div>

          <article className="space-y-8">
            <header className="text-center">
              <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">{project.tagline}</p>
            </header>

            <div className="space-y-4">
              {project.images.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  width={1200}
                  height={800}
                  alt={`Imagen del proyecto ${index + 1}`}
                  className="aspect-[3/2] w-full rounded-3xl object-cover"
                  data-ai-hint="project screenshot"
                />
              ))}
            </div>

            <div className="mx-auto max-w-3xl space-y-8">
              <div className="space-y-6">
                <div>
                  <h2 className="font-headline text-2xl font-bold">El Desafío</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {project.description.challenge}
                  </p>
                </div>
                <div>
                  <h2 className="font-headline text-2xl font-bold">La Solución</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {project.description.solution}
                  </p>
                </div>
                <div>
                  <h2 className="font-headline text-2xl font-bold">Los Resultados</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {project.description.results}
                  </p>
                </div>
              </div>
              <aside className="space-y-6">
                <div>
                  <h3 className="font-headline text-xl font-bold">Habilidades y Herramientas</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </CursorGradientWrapper>
  );
}
