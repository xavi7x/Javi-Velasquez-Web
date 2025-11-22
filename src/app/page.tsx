'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { doc } from 'firebase/firestore';

export default function Home() {
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );

  // Only render ComingSoon if maintenance mode is explicitly true.
  // Otherwise, render the main content. The components inside MainContent
  // will handle their own loading states (e.g., skeletons).
  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  // Default to showing the main content structure to avoid flickering.
  return <MainContent />;
}
