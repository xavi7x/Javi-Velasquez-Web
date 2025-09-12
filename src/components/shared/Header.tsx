'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Proyectos' },
  { href: '/about', label: 'Sobre mí' },
  { href: '/contact', label: 'Contacto' },
];

export function Header() {
  const pathname = usePathname();

  const NavLinks = ({ inSheet }: { inSheet?: boolean }) => {
    const commonClasses = "transition-colors hover:text-primary";
    
    if (inSheet) {
      return (
        <nav className="flex flex-col gap-4 text-lg font-medium">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("text-2xl", commonClasses, pathname === link.href ? "text-primary" : "")}
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      );
    }

    return (
      <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(commonClasses, pathname === link.href ? "text-primary" : "")}
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="font-headline text-lg font-bold">Javier Velasquez</span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLinks />
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
                      <span className="font-headline text-lg font-bold">Javier Velasquez</span>
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
