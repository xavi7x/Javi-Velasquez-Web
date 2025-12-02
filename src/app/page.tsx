'use client';

import { Suspense } from 'react';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { QuantumLoader } from '@/components/shared/QuantumLoader';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { usePortfolio } from '@/firebase/firestore/hooks/use-portfolio';
import type { Project } from '@/lib/project-types';

function HomePageContent() {
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings, isLoading: isSettingsLoading } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );
  
  const { data: projects, loading: areProjectsLoading } = usePortfolio();

  if (isSettingsLoading || areProjectsLoading) {
    return <QuantumLoader />;
  }

  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  return <MainContent projects={projects as Project[] | null} isLoading={areProjectsLoading}/>;
}

export default function Home() {
  return (
    <Suspense fallback={<QuantumLoader />}>
      <HomePageContent />
    </Suspense>
  );
}
