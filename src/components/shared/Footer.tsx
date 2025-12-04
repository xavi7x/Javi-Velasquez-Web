'use client';

import Link from 'next/link';
import { Github, Linkedin, Twitter, Instagram, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-[#050505] pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Brand & Misión */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-headline text-2xl font-bold tracking-tight text-foreground">
                Javier Velásquez<span className="text-indigo-500">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Socio Tecnológico para negocios que buscan escalar. Diseño ecosistemas digitales de alto rendimiento, no solo páginas web.
            </p>
            {/* <div className="flex gap-4">
              <SocialLink href="https://github.com/javivelasquez" icon={Github} label="GitHub" />
              <SocialLink href="https://linkedin.com/in/javivelasquez" icon={Linkedin} label="LinkedIn" />
              <SocialLink href="https://twitter.com/javivelasquez" icon={Twitter} label="Twitter" />
              <SocialLink href="https://instagram.com/javivelasquez" icon={Instagram} label="Instagram" />
            </div>*/}
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Explorar</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link href="/#portfolio" className="hover:text-indigo-500 transition-colors">Portafolio</Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-indigo-500 transition-colors">Servicios</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-500 transition-colors">Sobre Mí</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-indigo-500 transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto & Legal */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a href="mailto:hey@javivelasquez.com" className="hover:text-indigo-500 transition-colors flex items-center gap-2">
                  <Mail size={14} /> hey@javivelasquez.com
                </a>
              </li>
              <li>
                <span className="block">Santiago, Chile</span>
              </li>
              <li className="pt-4">
                <Link href="/privacy" className="text-xs hover:text-foreground transition-colors">Política de Privacidad</Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs hover:text-foreground transition-colors">Términos de Servicio</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior: Copyright */}
        <div className="border-t border-neutral-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            © {currentYear} Javier Velásquez. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1">
            Hecho con <Heart size={10} className="fill-red-500 text-red-500 animate-pulse" /> y mucho café.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Componente auxiliar para Iconos Sociales
function SocialLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-2 rounded-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/30 dark:hover:text-white transition-all hover:scale-110"
      aria-label={label}
    >
      <Icon size={18} />
    </a>
  );
}