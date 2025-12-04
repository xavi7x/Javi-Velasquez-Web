'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Terminal } from 'lucide-react';

export function ContactCTA() {
  const [text, setText] = useState('');
  const fullText = "Aplica para trabajar conmigo...";
  const [showCursor, setShowCursor] = useState(true);

  // Efecto de escritura (Typewriter)
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Velocidad de escritura

    return () => clearInterval(typingInterval);
  }, []);

  // Efecto de parpadeo del cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section
      id="contact-cta"
      className="w-full py-24 md:py-32 relative overflow-hidden bg-neutral-50 dark:bg-black/40 border-t border-neutral-200 dark:border-white/5"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full bg-indigo-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          
          {/* Icono decorativo */}
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 shadow-xl">
            <Terminal size={32} className="text-indigo-600 dark:text-indigo-400" />
          </div>

          {/* Título con efecto Typewriter */}
          <h2 className="font-mono text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6 min-h-[1.2em]">
            <span className="text-slate-900 dark:text-slate-100">
              {text}
            </span>
            <span className={`inline-block w-3 h-8 md:h-10 ml-1 align-middle bg-indigo-500 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
          </h2>

          {/* Subtítulo con Escasez (Scarcity) */}
          <p className="mx-auto mt-6 max-w-[600px] text-slate-600 dark:text-slate-400 text-lg md:text-xl/relaxed font-light">
            No soy una agencia masiva. Tomo máximo <span className="font-bold text-indigo-600 dark:text-indigo-400">2 nuevos proyectos</span> al mes para garantizar calidad obsesiva.
            <br className="hidden md:block" />
            ¿Es tu proyecto el siguiente?
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 rounded-full text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105">
              <Link href="/contact">
                Iniciar Solicitud
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <span className="text-sm text-slate-400 dark:text-slate-500 font-mono">
              Respuesta en &lt; 24h
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}