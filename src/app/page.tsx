'use client';

import { useEffect, useState } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { doc } from 'firebase/firestore';

export default function Home() {
  // The isClient state is no longer necessary and has been removed 
  // to prevent the flickering effect on page load.
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings, isLoading } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );

  // Render ComingSoon while loading or if maintenance mode is on.
  // Defaults to ComingSoon on initial server render because isLoading is true.
  if (isLoading || settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  // Once loading is complete and maintenance mode is off, render the full content.
  return <MainContent />;
}
