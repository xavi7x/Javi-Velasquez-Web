'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { doc } from 'firebase/firestore';

export function HomePageContent() {
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
