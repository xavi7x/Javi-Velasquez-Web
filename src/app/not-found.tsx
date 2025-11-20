import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <CursorGradientWrapper>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto flex h-full min-h-[calc(100vh-160px)] flex-col items-center justify-center px-4 text-center md:px-6">
          <div className="space-y-6">
            <h1 className="font-headline text-8xl font-bold tracking-tighter bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              404
            </h1>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Página No Encontrada
            </h2>
            <p className="mx-auto max-w-md text-muted-foreground md:text-xl">
              Parece que te has perdido en el universo digital. Pero no te preocupes, podemos guiarte de vuelta.
            </p>
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Inicio
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </CursorGradientWrapper>
  );
}
