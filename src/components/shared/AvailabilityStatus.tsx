'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAvailability } from '@/hooks/use-availability';
import { cn } from '@/lib/utils';

export function AvailabilityStatus() {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const email = 'hey@javivelasquez.com';
  const { isAvailable, isLoaded } = useAvailability();
  const pathname = usePathname();

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: '¡Correo Copiado!',
      description: 'El correo ha sido copiado a tu portapapeles.',
    });
  };

  if (!isLoaded || !isAvailable || pathname === '/propietario') {
    return null;
  }

  return (
    <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={handleCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-2 md:gap-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1.5 md:px-4 md:py-2 shadow-lg hover:bg-white/10 transition-colors"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <p className="text-xs md:text-sm text-muted-foreground">
          <span className={cn(isHovered ? 'hidden' : 'block', 'md:hidden')}>
            Disponible
          </span>
           <span className={cn(isHovered ? 'block' : 'hidden', 'md:hidden')}>
            {email}
          </span>
          <span className="hidden md:block">
            {isHovered ? email : 'Actualmente disponible para un proyecto.'}
          </span>
        </p>
      </button>
    </div>
  );
}
