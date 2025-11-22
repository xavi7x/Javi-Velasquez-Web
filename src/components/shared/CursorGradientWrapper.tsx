'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';

export function CursorGradientWrapper({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Ensure the ref is attached before trying to use it
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        containerRef.current.style.setProperty('--x', `${x}px`);
        containerRef.current.style.setProperty('--y', `${y}px`);
      }
    };
    
    // Attach listener only on the client-side after mount
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
    }

    // Cleanup function to remove the listener
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount (client-side)

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
