'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Proyectos' },
  { href: '/about', label: 'Sobre mí' },
  { href: '/contact', label: 'Contacto' },
];

export function Header() {
  const pathname = usePathname();
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';

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
            <Image
              src={logoUrl}
              alt="Logo Javier Velasquez"
              width={32}
              height={32}
              className="h-8 w-8 object-contain transition-transform duration-500 group-hover:rotate-12"
            />
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
