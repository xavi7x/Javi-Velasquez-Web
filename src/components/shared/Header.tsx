'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Lock, Menu, X } from 'lucide-react';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Proyectos' },
  { href: '/about', label: 'Sobre mí' },
  { href: '/contact', label: 'Contacto' },
];

export function Header() {
  const pathname = usePathname();
  const logoUrl =
    'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';
  const name = 'Javier Velasquez';
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeSheet = () => setIsSheetOpen(false);

  const NavLinks = ({ inSheet = false }) => {
    return (
      <nav
        className={cn(
          'flex items-center gap-6 text-sm font-medium',
          inSheet && 'flex-col items-start gap-4 text-base'
        )}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeSheet}
              className={cn(
                'transition-colors hover:text-foreground',
                isActive
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground',
                inSheet && 'py-2'
              )}
              prefetch={false}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/propietario"
          onClick={closeSheet}
          className={cn(
            'transition-colors hover:text-foreground',
            pathname === '/propietario'
              ? 'text-foreground'
              : 'text-muted-foreground',
            inSheet && 'py-2 flex items-center gap-2'
          )}
          prefetch={false}
          aria-label="Admin"
        >
          <Lock className="h-4 w-4" />
          {inSheet && <span>Admin</span>}
        </Link>
      </nav>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2"
          prefetch={false}
        >
          <Image
            src={logoUrl}
            alt="Logo Javier Velasquez"
            width={32}
            height={32}
            className="object-contain transition-transform duration-500 group-hover:rotate-12"
          />
          <div
            className={cn(
              'font-headline text-lg font-bold transition-opacity duration-500 hidden sm:block',
              isScrolled ? 'opacity-0' : 'opacity-100'
            )}
          >
            {name}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavLinks />
          <ThemeSwitcher />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <SheetHeader className="p-6 flex-row justify-between items-center">
                <Link
                  href="/"
                  onClick={closeSheet}
                  className="group flex items-center gap-2"
                  prefetch={false}
                >
                  <Image
                    src={logoUrl}
                    alt="Logo Javier Velasquez"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <span className="font-headline text-lg font-bold">
                    {name}
                  </span>
                </Link>
                <SheetTitle className="sr-only">Navegación Principal</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full p-6 pt-0">
                <NavLinks inSheet={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
