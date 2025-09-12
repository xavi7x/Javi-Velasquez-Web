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
                'group relative font-headline text-2xl font-bold tracking-tight text-foreground transition-colors hover:text-primary sm:text-3xl md:text-4xl'
              )}
            >
              <div className="flex">
                 {email.split('').map((char, index) => (
                    <span
                      key={index}
                      className="transition-all duration-300 group-hover:-translate-y-1.5"
                      style={{ transitionDelay: `${index * 30}ms` }}
                    >
                      {char}
                    </span>
                  ))}
              </div>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
