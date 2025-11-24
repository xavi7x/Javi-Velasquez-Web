'use client';

import { Suspense, useState, useEffect } from 'react';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, orderBy } from 'firebase/firestore';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { QuantumLoader } from '@/components/shared/QuantumLoader';
import type { Project } from '@/lib/project-types';

function HomePageContent() {
  const firestore = useFirestore();
  const [showLoader, setShowLoader] = useState(true);

  // This timer is just for aesthetics, to ensure the loader is visible for a minimum duration.
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000); 
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
    // This query is now robust. It only runs on this page and is protected by rules.
    return query(
      collection(firestore, 'projects'),
      where('isPublic', '==', true),
      orderBy('order', 'asc')
    );
  }, [firestore]);

  const { data: projectsData, isLoading: areProjectsLoading } = useCollection<Project>(projectsQuery);

  const isLoading = showLoader || isSettingsLoading || areProjectsLoading;

  if (isLoading) {
    return <QuantumLoader />;
  }

  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  // Pass the loaded projects and loading state down to the main content
  return <MainContent projects={projectsData} isLoading={areProjectsLoading}/>;
}

export default function Home() {
  return (
    <Suspense fallback={<QuantumLoader />}>
      <HomePageContent />
    </Suspense>
  );
}
