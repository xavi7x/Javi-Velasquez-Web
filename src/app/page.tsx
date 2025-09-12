import { PortfolioGrid } from '@/components/home/PortfolioGrid';
import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { ContactCTA } from '@/components/home/ContactCTA';
import { Header } from '@/components/shared/Header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex h-screen w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden">
        <div className="h-screen w-screen flex-shrink-0 snap-center">
          <Hero />
        </div>
        <div className="h-screen w-screen flex-shrink-0 snap-center">
          <PortfolioGrid />
        </div>
        <div className="h-screen w-screen flex-shrink-0 snap-center">
          <About />
        </div>
        <div className="h-screen w-screen flex-shrink-0 snap-center">
          <ContactCTA />
        </div>
      </main>
    </>
  );
}
