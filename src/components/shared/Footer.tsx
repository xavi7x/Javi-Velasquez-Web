'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Instagram, X } from 'lucide-react';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-sm">
          <p className="text-muted-foreground text-center md:text-left">
            © {year} Javier Velasquez
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              aria-label="X (Twitter)"
              className="text-muted-foreground transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="GitHub"
              className="text-muted-foreground transition-colors hover:text-white"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="text-muted-foreground transition-colors hover:text-white"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
