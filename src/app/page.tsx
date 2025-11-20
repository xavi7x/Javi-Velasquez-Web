'use client';
import { PortfolioGrid } from '@/components/home/PortfolioGrid';
import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { ContactCTA } from '@/components/home/ContactCTA';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { MinimalHeader } from '@/components/shared/MinimalHeader';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';


export default function Home() {
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings, isLoading: isSettingsLoading } = useDoc<{ isMaintenanceMode: boolean }>(settingsRef);

  if (isSettingsLoading) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  const isMaintenanceMode = settings?.isMaintenanceMode ?? false;

  return (
    <CursorGradientWrapper>
      {isMaintenanceMode ? (
        <>
          <MinimalHeader />
          <main>
            <Hero />
          </main>
        </>
      ) : (
        <>
          <Header />
          <main>
            <Hero />
            <div className="container mx-auto px-4 md:px-6">
              <PortfolioGrid />
            </div>
            <About />
            <ContactCTA />
          </main>
          <Footer />
        </>
      )}
    </CursorGradientWrapper>
  );
}
