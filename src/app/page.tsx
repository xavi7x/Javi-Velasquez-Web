import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { PortfolioGrid } from '@/components/home/PortfolioGrid';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <PortfolioGrid />
      </main>
      <Footer />
    </div>
  );
}
