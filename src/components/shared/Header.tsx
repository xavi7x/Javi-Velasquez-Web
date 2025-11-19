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
        <Link href="/" className="group flex items-center gap-2" prefetch={false}>
            <div className="relative h-8 w-8">
            <svg
              className="h-full w-full text-foreground transition-transform duration-500 group-hover:rotate-12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 12L12 22L22 12L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M12 2V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
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
