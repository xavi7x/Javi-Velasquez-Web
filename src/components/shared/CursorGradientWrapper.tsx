'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';

export function CursorGradientWrapper({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

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

  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="cursor-gradient-wrapper relative overflow-hidden bg-background text-foreground"
    >
      <div className="relative z-10 flex min-h-dvh flex-col">
        {children}
      </div>
    </div>
  );
}
