'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Linkedin, Dribbble, Mail } from 'lucide-react';
import { BehanceIcon } from '@/components/icons/BehanceIcon';
import { ThemeToggle } from './ThemeToggle';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <p className="text-muted-foreground">
            © {year} Javier Velasquez
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              aria-label="LinkedIn"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="Behance"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <BehanceIcon className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="Dribbble"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Dribbble className="h-5 w-5" />
            </Link>
             <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
