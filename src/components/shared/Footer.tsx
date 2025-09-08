'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Linkedin, Dribbble, Mail } from 'lucide-react';
import { BehanceIcon } from '@/components/icons/BehanceIcon';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full bg-secondary py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-secondary-foreground">
            © {year} Velásquez Digital. All rights reserved.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Mail className="h-5 w-5 text-secondary-foreground" />
            <a
              href="mailto:hello@velasquez.digital"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              hello@velasquez.digital
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            aria-label="LinkedIn"
            className="text-secondary-foreground transition-colors hover:text-primary"
          >
            <Linkedin className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            aria-label="Behance"
            className="text-secondary-foreground transition-colors hover:text-primary"
          >
            <BehanceIcon className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            aria-label="Dribbble"
            className="text-secondary-foreground transition-colors hover:text-primary"
          >
            <Dribbble className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
