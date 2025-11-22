'use client';

import { useRef, useEffect, type ReactNode } from 'react';

export function CursorGradientWrapper({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerRef.current.style.setProperty('--x', `${x}px`);
      containerRef.current.style.setProperty('--y', `${y}px`);
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden bg-background text-foreground bg-[radial-gradient(ellipse_400px_400px_at_var(--x,50%)_var(--y,50%),rgba(120,119,198,0.3),transparent)]"
      style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
    >
      <div className="relative z-10 flex min-h-dvh flex-col">
        {children}
      </div>
    </div>
  );
}
