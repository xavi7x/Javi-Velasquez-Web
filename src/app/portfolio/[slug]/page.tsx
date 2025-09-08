import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { projects } from '@/lib/projects';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

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
    <div className="flex min-h-dvh flex-col bg-secondary">
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
          <div className="mb-8">
            <Button asChild variant="ghost">
              <Link href="/#portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Portfolio
              </Link>
            </Button>
          </div>

          <article className="overflow-hidden rounded-lg bg-background shadow-lg">
            <header className="p-8 md:p-12">
              <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">{project.tagline}</p>
            </header>

            <div className="px-8 md:px-12">
              <Carousel className="w-full">
                <CarouselContent>
                  {project.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={img}
                        width={1200}
                        height={800}
                        alt={`Project image ${index + 1}`}
                        className="aspect-[3/2] w-full rounded-lg object-cover"
                        data-ai-hint="project screenshot"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-16" />
                <CarouselNext className="mr-16" />
              </Carousel>
            </div>

            <div className="grid gap-8 p-8 md:grid-cols-3 md:p-12">
              <div className="space-y-6 md:col-span-2">
                <div>
                  <h2 className="font-headline text-2xl font-bold">The Challenge</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {project.description.challenge}
                  </p>
                </div>
                <div>
                  <h2 className="font-headline text-2xl font-bold">The Solution</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {project.description.solution}
                  </p>
                </div>
                <div>
                  <h2 className="font-headline text-2xl font-bold">The Results</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {project.description.results}
                  </p>
                </div>
              </div>
              <aside className="space-y-6">
                <div>
                  <h3 className="font-headline text-xl font-bold">Skills & Tools</h3>
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
    </div>
  );
}
