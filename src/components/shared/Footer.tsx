'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Linkedin, Dribbble, Mail, Mountain } from 'lucide-react';
import { BehanceIcon } from '@/components/icons/BehanceIcon';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg font-bold">Velasquez</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {year} Velasquez. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              aria-label="LinkedIn"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              aria-label="Behance"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <BehanceIcon className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              aria-label="Dribbble"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Dribbble className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
