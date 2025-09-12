'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const { toast } = useToast();
  const email = 'hey@javivelasquez.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: '¡Correo Copiado!',
      description: 'El correo ha sido copiado a tu portapapeles.',
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto flex h-full min-h-[calc(100vh-160px)] flex-col items-center justify-center px-4 text-center md:px-6">
          <div className="space-y-4">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Hablemos.
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground md:text-xl">
              ¿Tienes una idea para un proyecto o simplemente quieres saludar? Envíame un correo.
            </p>
          </div>
          <div className="mt-12">
            <button
              onClick={handleCopy}
              className={cn(
                'group relative text-2xl font-medium tracking-tight text-foreground transition-colors hover:text-primary sm:text-3xl md:text-4xl'
              )}
            >
              {email}
              <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100"></span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
