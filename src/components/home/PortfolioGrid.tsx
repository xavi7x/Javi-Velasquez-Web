import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PortfolioGrid() {
  return (
    <section id="portfolio" className="w-full py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Proyectos Destacados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => (
                <Link
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  className="group block relative"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-card-foreground/5 transition-all duration-300 group-hover:border-primary">
                    <div className="absolute -inset-px z-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-20"></div>
                    <div className="relative">
                      <Image
                        src={project.thumbnail}
                        width={600}
                        height={400}
                        alt={project.title}
                        className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="p-4">
                        <h3 className="text-md font-semibold text-foreground transition-colors group-hover:text-primary">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {project.tagline}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
