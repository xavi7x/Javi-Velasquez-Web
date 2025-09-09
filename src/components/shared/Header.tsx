'use client';
import Link from 'next/link';
import { Mountain } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { href: '/#about', label: 'Sobre mí' },
  { href: '/#portfolio', label: 'Proyectos' },
  { href: '/#contact', label: 'Contacto' },
];

export function Header() {
  const pathname = usePathname();

  const NavLinks = ({ inSheet }: { inSheet?: boolean }) => {
    if (inSheet) {
      return (
        <nav className="flex flex-col gap-4 text-lg font-medium">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-2xl transition-colors hover:text-primary"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      );
    }

    return (
      <nav className="hidden items-center rounded-lg bg-secondary p-1 text-sm font-medium md:flex">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              pathname === link.href ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20'
            )}
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Mountain className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-bold">Velasquez</span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLinks />
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 p-6">
                  <Link href="/" className="flex items-center gap-2" prefetch={false}>
                    <Mountain className="h-6 w-6 text-primary" />
                    <span className="font-headline text-lg font-bold">Velasquez</span>
                  </Link>
                  <NavLinks inSheet />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
