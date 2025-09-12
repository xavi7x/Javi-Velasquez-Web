import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects';

export function PortfolioGrid() {
  return (
    <section
      id="portfolio"
      className="flex h-full w-full items-center justify-center"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group block"
            >
              <div className="overflow-hidden">
                <Image
                  src={project.thumbnail}
                  width={600}
                  height={400}
                  alt={project.title}
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
