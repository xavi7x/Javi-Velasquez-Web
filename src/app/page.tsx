'use client';

import { Suspense } from 'react';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, orderBy } from 'firebase/firestore';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { QuantumLoader } from '@/components/shared/QuantumLoader';
import type { Project } from '@/lib/project-types';

const OWNER_ID = 'H8PgEUNupRNQhBpfAxiEA3jNVSf2';

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
    return query(
      collection(firestore, 'clients', OWNER_ID, 'projects'),
      where('isPublic', '==', true),
      orderBy('order', 'asc')
    );
  }, [firestore]);

  const { data: projectsData, isLoading: areProjectsLoading } = useCollection<Project>(projectsQuery);

  const isLoading = isSettingsLoading || areProjectsLoading;

  if (isLoading) {
    return <QuantumLoader />;
  }

  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  return <MainContent projects={projectsData} isLoading={isLoading}/>;
}

export default function Home() {
  return (
    <Suspense fallback={<QuantumLoader />}>
      <HomePageContent />
    </Suspense>
  );
}
