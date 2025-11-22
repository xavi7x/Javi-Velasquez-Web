'use client';

import { Suspense } from 'react';
import { HomePageContent } from '@/components/home/HomePageContent';
import { QuantumLoader } from '@/components/shared/QuantumLoader';

export default function Home() {
  return (
    <Suspense fallback={<QuantumLoader />}>
      <HomePageContent />
    </Suspense>
  );
}
