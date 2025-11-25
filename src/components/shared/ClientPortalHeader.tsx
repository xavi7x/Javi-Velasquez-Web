'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogOut, Menu, X, LayoutDashboard, Briefcase, FileText, CreditCard, User } from 'lucide-react';
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
import { useAuth } from '@/firebase';
import { signOut }from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function ClientPortalHeader() {
  const pathname = usePathname();
  const params = useParams();
  const clientId = params.clientId as string;
  const auth = useAuth();
  const router = useRouter();
  
  const navLinks = [
      { href: `/portal/${clientId}`, label: 'Dashboard', icon: LayoutDashboard },
      { href: `/portal/${clientId}/projects`, label: 'Proyectos', icon: Briefcase },
      { href: `/portal/${clientId}/requests`, label: 'Solicitudes', icon: FileText },
      { href: `/portal/${clientId}/finances`, label: 'Finanzas', icon: CreditCard },
      { href: `/portal/${clientId}/profile`, label: 'Mi Perfil', icon: User },
  ];

  const logoUrl =
    'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';
  const name = 'Portal de Cliente';
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  const closeSheet = () => setIsSheetOpen(false);

  const NavLinks = ({ inSheet = false }) => {
    return (
      <nav
        className={cn(
          'flex items-center gap-4 text-sm font-medium',
          inSheet && 'flex-col items-start gap-2 text-base'
        )}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Button
              key={link.href}
              asChild
              variant={isActive ? 'default' : 'ghost'}
              className={cn("justify-start", !inSheet && "rounded-full")}
              onClick={closeSheet}
            >
              <Link
                href={link.href}
                prefetch={false}
              >
                <Icon className="mr-2 h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href={`/portal/${clientId}`}
          className="group flex items-center gap-2"
          prefetch={false}
        >
          <Image
            src={logoUrl}
            alt="Logo"
            width={28}
            height={28}
            className="object-contain transition-transform duration-500 group-hover:rotate-12"
          />
          <span className="font-headline text-md font-bold hidden sm:block">
            {name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <NavLinks />
        </div>

        <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9" onClick={handleLogout}>
                <LogOut className="h-4 w-4"/>
                <span className="sr-only">Cerrar sesión</span>
            </Button>

            {/* Mobile Navigation */}
            <div className="flex md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Abrir Menú</span>
                </Button>
                </SheetTrigger>
                <SheetContent 
                side="right" 
                className="w-full sm:w-80 bg-background/80 backdrop-blur-xl border-white/10"
                >
                <SheetHeader className="p-6 flex-row justify-between items-center">
                    <SheetTitle className="font-headline text-lg font-bold">
                        Menú del Portal
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full p-6 pt-0">
                    <NavLinks inSheet={true} />
                    <div className="mt-auto">
                        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
