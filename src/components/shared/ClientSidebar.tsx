'use client';

import { useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CreditCard,
  User,
  LogOut,
  Menu,
} from 'lucide-react';
import Image from 'next/image';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function ClientSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const clientId = params.clientId as string;
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  const navLinks = [
    {
      href: `/portal/${clientId}`,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: `/portal/${clientId}/projects`,
      label: 'Proyectos',
      icon: Briefcase,
    },
    {
      href: `/portal/${clientId}/requests`,
      label: 'Solicitudes',
      icon: FileText,
    },
    {
      href: `/portal/${clientId}/finances`,
      label: 'Finanzas',
      icon: CreditCard,
    },
    {
      href: `/portal/${clientId}/profile`,
      label: 'Mi Perfil',
      icon: User,
    },
  ];

  const logoUrl =
    'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';

  const closeSheet = () => setIsSheetOpen(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-8 p-4">
      <div className="flex items-center gap-3 p-2">
        <Image
          src={logoUrl}
          alt="Logo"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
        <span className="text-lg font-semibold">Portal Cliente</span>
      </div>

      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <Button
            key={link.href}
            asChild
            variant={pathname === link.href ? 'default' : 'ghost'}
            className="justify-start gap-3"
            onClick={closeSheet}
          >
            <Link href={link.href}>
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          </Button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between">
          {user && (
            <div className="text-sm">
              <p className="font-semibold truncate">
                {user.displayName || user.email || 'Cliente'}
              </p>
            </div>
          )}
          <ThemeSwitcher />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col bg-background rounded-2xl m-2 border border-border">
        <SidebarContent />
      </aside>

      {/* Mobile Header and Sheet */}
      <header className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={logoUrl}
            alt="Logo"
            width={28}
            height={28}
            className="h-7 w-7 object-contain ml-2"
          />
          <span className="text-lg font-semibold">Portal</span>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader>
              <SheetTitle className="sr-only">Menú del Portal</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
