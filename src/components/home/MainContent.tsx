'use client';
import { PortfolioGrid } from '@/components/home/PortfolioGrid';
import { Hero } from '@/components/home/Hero';
import { MarqueeTestimonials } from '@/components/home/MarqueeTestimonials';
import { About } from '@/components/home/About';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { FAQ } from '@/components/home/FAQ'; // <--- IMPORTAR
import { ContactCTA } from '@/components/home/ContactCTA';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import type { Project } from '@/lib/project-types';

interface MainContentProps {
  projects: Project[] | null;
  isLoading: boolean;
}

export function MainContent({ projects, isLoading }: MainContentProps) {
  return (
    <CursorGradientWrapper>
      <Header />
      <main>
        <Hero />
        <MarqueeTestimonials />
        
        {/* Solución / Propuesta de Valor */}
        <About /> 
        
        {/* Evidencia */}
        <div className="container mx-auto px-4 md:px-6">
          <PortfolioGrid projects={projects} isLoading={isLoading} />
        </div>

        {/* Certeza del Proceso */}
        <ProcessTimeline />
        
        {/* Manejo de Objeciones */}
        <FAQ /> 
        
        {/* Cierre */}
        <ContactCTA />
      </main>
      <Footer />
    </CursorGradientWrapper>
  );
}