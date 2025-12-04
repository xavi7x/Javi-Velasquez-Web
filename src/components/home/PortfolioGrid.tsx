'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/project-types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose, 
  DialogTitle, // Importamos DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Layers, ExternalLink, X } from 'lucide-react'; 

interface PortfolioGridProps {
  projects: Project[] | null;
  isLoading: boolean;
}

export function PortfolioGrid({ projects, isLoading }: PortfolioGridProps) {
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const renderSkeletons = () => (
    [...Array(3)].map((_, i) => (
       <div key={i} className="space-y-4">
         <Skeleton className="h-64 w-full rounded-3xl bg-white/5" />
         <div className="space-y-2">
            <Skeleton className="h-6 w-3/4 bg-white/5" />
            <Skeleton className="h-4 w-1/2 bg-white/5" />
         </div>
       </div>
    ))
  );

  return (
    <section
      id="portfolio"
      ref={inViewRef}
      className={cn(
        'w-full py-20 md:py-32 relative',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 transition-all duration-1000'
      )}
    >
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-indigo-500/5 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      <div className="mx-auto max-w-5xl mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 text-indigo-600 dark:text-slate-400 text-xs font-medium mb-6 backdrop-blur-md">
            <Layers size={12} className="text-indigo-600 dark:text-indigo-400" />
            <span>Casos de Estudio</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-4">
            Trabajo que genera <span className="text-indigo-600 dark:text-indigo-500">Resultados</span>
          </h2>
          <p className="max-w-2xl text-muted-foreground md:text-lg leading-relaxed">
            Una selección de proyectos donde la tecnología se encuentra con la estrategia de negocio.
          </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 px-4">
          {isLoading ? renderSkeletons() : (
            <Dialog>
              {projects?.map((project) => (
                <DialogTrigger
                  asChild
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="group cursor-pointer flex flex-col gap-4">
                    {/* Tarjeta de Imagen con Efecto Glass */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-2xl transition-all duration-500 group-hover:border-indigo-500/30 group-hover:shadow-indigo-500/10">
                      
                      {/* Overlay en Hover */}
                      <div className="absolute inset-0 z-10 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center backdrop-blur-[2px]">
                         <div className="transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm shadow-lg">
                               Ver Caso Completo
                               <ArrowUpRight size={16} />
                            </span>
                         </div>
                      </div>

                      <Image
                        src={project.thumbnail || `https://picsum.photos/seed/${project.id}/800/600`}
                        width={800}
                        height={600}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Info del Proyecto */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {project.title}
                            </h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {project.tagline}
                        </p>
                        
                        {/* Tech Stack Mini Tags */}
                        {project.skills && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {project.skills.slice(0, 3).map(skill => (
                                    <span key={skill} className="text-[10px] font-mono uppercase tracking-wider text-slate-500 border border-neutral-200 dark:border-white/10 px-2 py-1 rounded-md bg-neutral-100 dark:bg-white/5">
                                        {skill}
                                    </span>
                                ))}
                                {project.skills.length > 3 && (
                                    <span className="text-[10px] font-mono text-slate-500 px-1 py-1">+{project.skills.length - 3}</span>
                                )}
                            </div>
                        )}
                    </div>
                  </div>
                </DialogTrigger>
              ))}

              {!isLoading && (!projects || projects.length === 0) && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-3xl border-dashed">
                    <Layers size={48} className="text-slate-400 mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground">Portafolio en Actualización</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mt-2">
                        Estoy subiendo mis últimos proyectos High-Ticket. Vuelve pronto para ver las novedades.
                    </p>
                </div>
              )}
              
              {/* MODAL DEL PROYECTO (ADAPTATIVO LIGHT/DARK) */}
              {selectedProject && (
                <DialogContent className="max-w-5xl w-[95%] h-[90vh] bg-background dark:bg-[#0A0A0A] border-neutral-200 dark:border-white/10 p-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/50">
                  
                  {/* FIX DE ACCESIBILIDAD: Título oculto para lectores de pantalla */}
                  <DialogTitle className="sr-only">
                    Detalles del proyecto: {selectedProject.title}
                  </DialogTitle>

                  {/* Botón de Cerrar Flotante y Visible */}
                  <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-transform hover:scale-110 hover:bg-black/70 focus:outline-none">
                    <X size={20} />
                    <span className="sr-only">Cerrar</span>
                  </DialogClose>

                  <ScrollArea className="h-full w-full">
                    <div className="relative">
                        {/* Hero Image del Modal */}
                        <div className="relative h-[40vh] w-full">
                            {/* Gradiente de superposición para legibilidad del texto */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                            <Image
                                src={selectedProject.thumbnail || `https://picsum.photos/seed/${selectedProject.id}/1200/800`}
                                fill
                                alt={selectedProject.title}
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 p-8 z-20">
                                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{selectedProject.title}</h2>
                                <p className="text-xl text-muted-foreground font-light">{selectedProject.tagline}</p>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12 bg-background">
                            {/* Columna Contenido Principal */}
                            <div className="md:col-span-2 space-y-10">
                                {selectedProject.description && (
                                    <>
                                        <div>
                                            <h3 className="text-indigo-600 dark:text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4">El Reto</h3>
                                            <p className="text-foreground/80 leading-relaxed text-lg">{selectedProject.description.challenge}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-indigo-600 dark:text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4">La Solución</h3>
                                            <p className="text-foreground/80 leading-relaxed text-lg">{selectedProject.description.solution}</p>
                                        </div>
                                        {selectedProject.description.results && (
                                            <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl">
                                                <h3 className="text-emerald-600 dark:text-emerald-400 font-mono text-sm uppercase tracking-widest mb-2">Impacto & Resultados</h3>
                                                <p className="text-emerald-800 dark:text-emerald-100 leading-relaxed font-medium">{selectedProject.description.results}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {/* Galería de Imágenes */}
                                {selectedProject.images?.map((img, index) => (
                                    <div key={index} className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 shadow-sm">
                                        <Image
                                            src={img}
                                            width={1200}
                                            height={800}
                                            alt={`Detalle ${index + 1}`}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-foreground font-bold mb-4">Tecnologías</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.skills?.map((skill) => (
                                            <Badge key={skill} variant="secondary" className="bg-neutral-100 dark:bg-white/10 text-foreground hover:bg-neutral-200 dark:hover:bg-white/20 border-0">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                
                                {selectedProject.link && (
                                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                                        <div className="w-full bg-foreground text-background hover:opacity-90 font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-opacity">
                                            Visitar Sitio Web
                                            <ExternalLink size={18} />
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                  </ScrollArea>
                </DialogContent>
              )}
            </Dialog>
          )}
      </div>
    </section>
  );
}