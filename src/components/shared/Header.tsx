import Link from 'next/link';
import { Mountain } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Mountain className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-semibold">Velásquez Digital</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="#about" className="transition-colors hover:text-primary" prefetch={false}>
              Sobre Mí
            </Link>
            <Link href="#portfolio" className="transition-colors hover:text-primary" prefetch={false}>
              Portafolio
            </Link>
            <Link href="#contact" className="transition-colors hover:text-primary" prefetch={false}>
              Contacto
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
