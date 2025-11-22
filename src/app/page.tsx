'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { MainContent } from '@/components/home/MainContent';
import { ComingSoon } from '@/components/home/ComingSoon';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';

export default function Home() {
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings, isLoading } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );

  // While loading, render a minimal layout to prevent flickering.
  // This avoids rendering MainContent on the server and ComingSoon on the client.
  if (isLoading) {
    return (
      <CursorGradientWrapper>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </CursorGradientWrapper>
    );
  }

  // Once loading is complete, decide which component to render.
  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  return <MainContent />;
}
