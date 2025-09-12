import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects';

export function PortfolioGrid() {
  return (
    <section id="portfolio" className="w-full pb-12 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.slug} href={`/portfolio/${project.slug}`} className="group block">
              <div className="overflow-hidden">
                <Image
                  src={project.thumbnail}
                  width={600}
                  height={400}
                  alt={project.title}
                  className="w-full object-cover aspect-video transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
