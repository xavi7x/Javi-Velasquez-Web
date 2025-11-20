'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export function MinimalHeader() {
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-2" prefetch={false}>
              <Image
                src={logoUrl}
                alt="Logo Javier Velasquez"
                width={32}
                height={32}
                className="object-contain transition-transform duration-500 group-hover:rotate-12"
              />
          </Link>
          <Badge variant="outline" className="hidden sm:flex">Web en desarrollo</Badge>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/propietario"
            className={cn(
              "transition-colors hover:text-foreground text-muted-foreground"
            )}
            prefetch={false}
            aria-label="Admin"
          >
            <Lock className="h-4 w-4" />
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
