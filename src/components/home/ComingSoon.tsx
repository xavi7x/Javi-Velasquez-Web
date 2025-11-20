
'use client';

import { MinimalHeader } from '@/components/shared/MinimalHeader';
import { Footer } from '@/components/shared/Footer';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import Image from 'next/image';

export function ComingSoon() {
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';

  return (
    <CursorGradientWrapper>
      <MinimalHeader />
      <main className="flex-1">
        <div className="container mx-auto flex h-full min-h-[calc(100vh-160px)] flex-col items-center justify-center px-4 text-center md:px-6">
          <div className="space-y-4">
             <Image
              src={logoUrl}
              alt="Logo Javier Velasquez"
              width={80}
              height={80}
              className="object-contain mx-auto animate-pulse"
            />
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Próximamente
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground md:text-xl">
              Mi nuevo sitio web está en construcción. Vuelve pronto para ver las novedades.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </CursorGradientWrapper>
  );
}
