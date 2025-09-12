import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects';

export function PortfolioGrid() {
  return (
    <section id="portfolio" className="w-full py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.slug} href={`/portfolio/${project.slug}`} className="group relative">
              <div className="overflow-hidden">
                <Image
                  src={project.thumbnail}
                  width={600}
                  height={400}
                  alt={project.title}
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={
                    project.slug === 'brand-identity-revamp'
                      ? 'brand design'
                      : 'online shopping'
                  }
                />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center p-4">
                  <div className="text-center text-white">
                      <h3 className="font-headline text-2xl font-bold">{project.title}</h3>
                      <p className="mt-2 text-sm">{project.tagline}</p>
                  </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
