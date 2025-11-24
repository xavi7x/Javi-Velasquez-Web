'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, orderBy } from 'firebase/firestore';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { QuantumLoader } from '@/components/shared/QuantumLoader';
import type { Project } from '@/lib/project-types';

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
  
    const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Query for portfolio projects and order them
    return query(
      collection(firestore, 'projects'),
      where('type', '==', 'portfolio'),
      orderBy('order', 'asc')
    );
  }, [firestore]);

  const { data: projects, isLoading: areProjectsLoading } = useCollection<Project>(projectsQuery);

  useEffect(() => {
    // Hide loader only when both timer is up and data is loaded
    if (isTimerElapsed && !isSettingsLoading && !areProjectsLoading) {
      setShowLoader(false);
    }
  }, [isTimerElapsed, isSettingsLoading, areProjectsLoading]);


  if (showLoader) {
    return <QuantumLoader />;
  }

  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  return <MainContent projects={projects} isLoading={areProjectsLoading}/>;
}

export default function Home() {
  // Suspense is still useful for other parts of the app during navigation
  return <HomePageContent />;
}
