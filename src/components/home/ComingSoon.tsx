'use client';

import { MinimalHeader } from '@/components/shared/MinimalHeader';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import { Hero } from '@/components/home/Hero';

export function ComingSoon() {
  return (
    <CursorGradientWrapper>
      <MinimalHeader />
      <main className="flex-1">
        <Hero />
      </main>
    </CursorGradientWrapper>
  );
}
