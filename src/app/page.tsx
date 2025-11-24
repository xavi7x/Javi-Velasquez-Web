
'use client';

import { Suspense } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { QuantumLoader } from '@/components/shared/QuantumLoader';
import type { Project } from '@/lib/project-types';
import { usePublicCollection } from '@/firebase/firestore/use-public-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';

function HomePageContent() {
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings, isLoading: isSettingsLoading } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );
  
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // This query is now safe and will not require a composite index
    return query(collection(firestore, 'projects'), where('isPublic', '==', true));
  }, [firestore]);
  
  const { data: projectsData, isLoading: areProjectsLoading } = usePublicCollection<Project>(
    projectsQuery
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
