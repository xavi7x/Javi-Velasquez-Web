'use client';

import { useState, useEffect } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { doc } from 'firebase/firestore';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const firestore = useFirestore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings, isLoading } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );

  // Render ComingSoon by default and on server to avoid layout shifts/skeletons.
  // Once the client loads and confirms maintenance mode is off, show MainContent.
  if (!isClient || isLoading || settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  return <MainContent />;
}
