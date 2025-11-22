'use client';

import { useState, useEffect } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { doc } from 'firebase/firestore';
import { QuantumLoader } from '@/components/shared/QuantumLoader';

export default function Home() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings, isLoading: isSettingsLoading } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );

  useEffect(() => {
    const hasLoadedBefore = sessionStorage.getItem('hasLoadedBefore');

    if (hasLoadedBefore) {
      setIsAppLoading(false);
      setShowLoader(false);
    } else {
      const timer = setTimeout(() => {
        setIsAppLoading(false);
        sessionStorage.setItem('hasLoadedBefore', 'true');
      }, 2500); // Muestra el loader por 2.5 segundos

      return () => clearTimeout(timer);
    }
  }, []);
  
  const isLoading = isAppLoading || isSettingsLoading;

  if (isLoading || showLoader) {
    return <QuantumLoader />;
  }

  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  return <MainContent />;
}
