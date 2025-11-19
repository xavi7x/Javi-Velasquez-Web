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
      description: 'Copiado al portapapeles',
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto flex h-full min-h-[calc(100vh-160px)] flex-col items-center justify-center px-4 text-center md:px-6">
          <div className="space-y-4">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
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
                'group relative font-headline text-2xl font-bold tracking-tight text-foreground transition-colors sm:text-3xl md:text-4xl'
              )}
            >
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text group-hover:brightness-125 transition-all">
                 {email}
              </span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
