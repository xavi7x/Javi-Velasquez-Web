'use client';
import { useRef, useEffect } from 'react';
import { PortfolioGrid } from '@/components/home/PortfolioGrid';
import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { ContactCTA } from '@/components/home/ContactCTA';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerRef.current.style.setProperty('--x', `${x}px`);
      containerRef.current.style.setProperty('--y', `${y}px`);
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-background text-foreground relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_400px_400px_at_var(--x,50%)_var(--y,50%),rgba(120,119,198,0.3),transparent)]"></div>
      </div>
      <div className="relative z-10">
        <Header />
        <main>
          <div className="h-screen">
            <Hero />
          </div>
          <div className="container mx-auto px-4 md:px-6">
            <PortfolioGrid />
          </div>
          <About />
          <ContactCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
