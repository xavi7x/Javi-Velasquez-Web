import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects';

export function PortfolioGrid() {
  return (
    <section
      id="portfolio"
      className="w-full py-16 md:py-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Proyectos Destacados
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Una selección de mis trabajos que muestran mi pasión por el diseño y el desarrollo.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group block relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
                <Image
                  src={project.thumbnail}
                  width={600}
                  height={400}
                  alt={project.title}
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              
                <div className="p-6">
                  <h3 className="text-lg font-semibold transition-colors group-hover:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.tagline}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
