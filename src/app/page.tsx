'use client';

import { Suspense } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { QuantumLoader } from '@/components/shared/QuantumLoader';

function HomePageContent() {
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );

  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  return <MainContent />;
}

export default function Home() {
  return (
    <Suspense fallback={<QuantumLoader />}>
      <HomePageContent />
    </Suspense>
  );
}