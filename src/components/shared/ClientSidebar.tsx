'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CreditCard,
  User,
  LogOut,
} from 'lucide-react';
import Image from 'next/image';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function ClientSidebar({ clientId }: { clientId: string }) {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

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

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <Image src={logoUrl} width={28} height={28} alt="Logo" />
        <span className="text-lg font-semibold">Portal Cliente</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => (
            <SidebarMenuItem key={link.label}>
              <Link href={link.href} passHref>
                <SidebarMenuButton
                  as="a"
                  isActive={pathname === link.href}
                  tooltip={link.label}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <ThemeSwitcher />
        <SidebarSeparator />
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Cerrar Sesión"
              variant="outline"
            >
              <LogOut />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
