import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { PortfolioGrid } from '@/components/home/PortfolioGrid';
import { ContactForm } from '@/components/home/ContactForm';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <PortfolioGrid />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
