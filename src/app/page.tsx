import { PortfolioGrid } from '@/components/home/PortfolioGrid';
import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { ContactCTA } from '@/components/home/ContactCTA';
import { Header } from '@/components/shared/Header';
import { HorizontalScroll } from '@/components/home/HorizontalScroll';

export default function Home() {
  return (
    <>
      <Header />
      <HorizontalScroll>
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
      </HorizontalScroll>
    </>
  );
}
