'use client';
import { useState, useEffect } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { ComingSoon } from '@/components/home/ComingSoon';
import { MainContent } from '@/components/home/MainContent';

export default function Home() {
  const firestore = useFirestore();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site');
  }, [firestore]);

  const { data: settings, isLoading } = useDoc<{ isMaintenanceMode: boolean }>(
    settingsRef
  );
  
  // Use state to prevent flash of content during hydration
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  if (isLoading || !isClientLoaded) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <div className="w-full max-w-4xl space-y-8 p-4">
            <Skeleton className="h-[200px] w-full md:h-[300px]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (settings?.isMaintenanceMode) {
    return <ComingSoon />;
  }

  return <MainContent />;
}
