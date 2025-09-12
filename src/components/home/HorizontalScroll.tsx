'use client';

import { useRef, useEffect } from 'react';

export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        container.scrollBy({
          left: event.deltaY > 0 ? window.innerWidth : -window.innerWidth,
          behavior: 'smooth',
        });
      }
    };

    container.addEventListener('wheel', handleWheel);

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="flex h-screen w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
    >
      {children}
    </main>
  );
}
