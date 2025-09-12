import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { PortfolioGrid } from '@/components/home/PortfolioGrid';
import { Hero } from '@/components/home/Hero';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <PortfolioGrid />
      </main>
      <Footer />
    </div>
  );
}
