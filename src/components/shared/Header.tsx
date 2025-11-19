'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';

const navLinks = [
  { href: '/', label: 'Proyectos' },
  { href: '/about', label: 'Sobre mí' },
  { href: '/contact', label: 'Contacto' },
];

export function Header() {
  const pathname = usePathname();

  const NavLinks = () => {
    return (
      <nav className="flex items-center gap-6 text-sm font-medium">
        {navLinks.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground",
                isActive ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
              prefetch={false}
            >
              {link.label}
            </Link>
          )
        })}
         <Link
          href="/propietario"
          className={cn(
            "transition-colors hover:text-foreground",
            pathname === '/propietario' ? "text-foreground" : "text-muted-foreground"
          )}
          prefetch={false}
          aria-label="Admin"
        >
          <Lock className="h-4 w-4" />
        </Link>
      </nav>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="font-headline text-lg font-bold">Javier Velasquez</span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLinks />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
