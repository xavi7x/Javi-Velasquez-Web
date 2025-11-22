'use client';

import { Suspense, useState, useEffect } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { QuantumLoader } from '@/components/shared/QuantumLoader';

function HomePageContent() {
  const firestore = useFirestore();
  const [showLoader, setShowLoader] = useState(true);
  const [isTimerElapsed, setIsTimerElapsed] = useState(false);

  // Timer to ensure loader shows for at least 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimerElapsed(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  
  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings, isLoading: isSettingsLoading } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );
  
  useEffect(() => {
    // Hide loader only when both timer is up and data is loaded
    if (isTimerElapsed && !isSettingsLoading) {
      setShowLoader(false);
    }
  }, [isTimerElapsed, isSettingsLoading]);


  if (showLoader) {
    return <QuantumLoader />;
  }

  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  return <MainContent />;
}

export default function Home() {
  // Suspense is still useful for other parts of the app during navigation
  return <HomePageContent />;
}
