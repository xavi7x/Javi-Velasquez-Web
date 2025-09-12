'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function AvailabilityStatus() {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const email = 'hey@javivelasquez.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: '¡Correo Copiado!',
      description: 'El correo ha sido copiado a tu portapapeles.',
    });
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={handleCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-3 rounded-full bg-background/80 backdrop-blur-sm border px-4 py-2 shadow-lg hover:bg-accent/20 transition-colors"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
        <p className="text-sm text-muted-foreground">
          {isHovered ? email : 'Actualmente disponible para un proyecto.'}
        </p>
      </button>
    </div>
  );
}
