
'use client';

import { Suspense } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, query, where, orderBy } from 'firebase/firestore';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { QuantumLoader } from '@/components/shared/QuantumLoader';
import type { Project } from '@/lib/project-types';
import { usePublicCollection } from '@/firebase/firestore/use-public-collection';

function HomePageContent() {
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings, isLoading: isSettingsLoading } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );
  
  const { data: projectsData, isLoading: areProjectsLoading } = usePublicCollection<Project>(
    'projects',
    [where('isPublic', '==', true), orderBy('order', 'asc')]
  );

  if (isSettingsLoading) {
    return <QuantumLoader />;
  }

  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  return <MainContent projects={projectsData} isLoading={areProjectsLoading}/>;
}

export default function Home() {
  return (
    <Suspense fallback={<QuantumLoader />}>
      <HomePageContent />
    </Suspense>
  );
}
