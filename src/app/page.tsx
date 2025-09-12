import { PortfolioGrid } from '@/components/home/PortfolioGrid';
import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { ContactCTA } from '@/components/home/ContactCTA';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <div className="h-screen">
          <Hero />
        </div>
        <PortfolioGrid />
        <About />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
