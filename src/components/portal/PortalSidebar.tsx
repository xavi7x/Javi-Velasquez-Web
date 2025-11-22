'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Briefcase,
  FileText,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import Image from 'next/image';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/portal/dashboard', label: 'Dashboard', icon: Home },
  { href: '/portal/projects', label: 'Proyectos', icon: Briefcase },
  { href: '/portal/requests', label: 'Solicitudes', icon: MessageSquare },
  { href: '/portal/invoices', label: 'Finanzas', icon: FileText },
  { href: '/portal/profile', label: 'Mi Perfil', icon: User },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();
  const logoUrl =
    'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center border-b px-6">
        <Link href="/portal/dashboard" className="flex items-center gap-2 font-semibold">
          <Image src={logoUrl} alt="Logo" width={28} height={28} />
          <span className="">Portal Cliente</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setIsSheetOpen(false)}
          >
            <Link href={item.href}>
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="mt-auto border-t p-4">
        <div className="mb-4 rounded-lg bg-muted p-4">
            <p className="text-sm font-semibold truncate">{user?.displayName || user?.email}</p>
            <p className="text-xs text-muted-foreground">Cliente</p>
        </div>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-72 flex-shrink-0 border-r bg-background">
        <SidebarContent />
      </aside>
       <header className="md:hidden sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-20 sm:px-6 w-full">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú de navegación</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 w-full max-w-sm">
             <SidebarContent />
          </SheetContent>
        </Sheet>
        <Link href="/portal/dashboard" className="flex items-center gap-2 font-semibold">
            <Image src={logoUrl} alt="Logo" width={24} height={24} />
            <span>Portal Cliente</span>
        </Link>
      </header>
    </>
  );
}
