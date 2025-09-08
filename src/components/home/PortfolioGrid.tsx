import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { projects } from '@/lib/projects';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PortfolioGrid() {
  return (
    <section id="portfolio" className="w-full bg-secondary py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Mi Trabajo Reciente</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Aquí hay algunos proyectos en los que he trabajado recientemente.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.slug} href={`/portfolio/${project.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <Image
                  src={project.thumbnail}
                  width={600}
                  height={400}
                  alt={project.title}
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={
                    project.slug === 'brand-identity-revamp'
                      ? 'brand design'
                      : project.slug === 'e-commerce-platform'
                      ? 'online shopping'
                      : project.slug === 'mobile-banking-app'
                      ? 'mobile banking'
                      : 'dashboard analytics'
                  }
                />
                <CardContent className="p-6">
                  <h3 className="font-headline text-2xl font-bold">{project.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{project.tagline}</p>
                  <div className="mt-4 flex items-center font-semibold text-accent">
                    Ver Caso de Estudio
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
