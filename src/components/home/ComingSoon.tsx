'use client';

import { Header } from '@/components/shared/Header';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import { Hero } from '@/components/home/Hero';

export function ComingSoon() {
  return (
    <CursorGradientWrapper>
      <Header />
      <main className="flex-1">
        <Hero />
      </main>
    </CursorGradientWrapper>
  );
}
