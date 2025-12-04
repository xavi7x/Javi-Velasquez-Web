'use client';

import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CursorGradientWrapper } from '@/components/shared/CursorGradientWrapper';
import { 
  Copy, 
  Check, 
  Mail, 
  Calendar, 
  ArrowUpRight, 
  Clock,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const { toast } = useToast();
  const email = 'hey@javivelasquez.com';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast({
      description: 'Email copiado al portapapeles',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CursorGradientWrapper>
      <Header />
      {/* Fondo transparente para que brille el gradiente del Wrapper */}
      <main className="flex-1 relative overflow-hidden min-h-screen pt-24 pb-20">
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* Header de Sección */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Sin Burocracia.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Acceso Directo.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-light leading-relaxed">
              ¿Tienes un proyecto High-Ticket en mente? Saltémonos los formularios eternos. 
              Elige cómo prefieres iniciar la conversación.
            </p>
          </div>

          {/* Grid de Contacto (Ajustado sin LinkedIn) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* 1. Tarjeta Principal: Email (Columna Izquierda) */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 p-8 flex flex-col justify-between min-h-[320px]">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                <Mail size={140} className="text-foreground rotate-12" />
              </div>
              
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-medium border border-indigo-500/20 mb-6 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  Respuesta prioritaria &lt; 24h
                </span>
                <h3 className="text-2xl font-bold text-foreground mb-2">Envíame un correo</h3>
                <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                  Para propuestas detalladas o dudas técnicas. Reviso mi inbox personalmente.
                </p>
              </div>

              <div className="mt-8 relative z-10">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/10 hover:border-indigo-500/50 transition-all group/btn"
                >
                  <span className="font-mono text-base md:text-lg text-foreground truncate pr-4">{email}</span>
                  <div className={`p-2 rounded-lg transition-colors ${copied ? 'bg-emerald-500/20 text-emerald-500' : 'bg-black/5 dark:bg-white/5 text-muted-foreground group-hover/btn:bg-indigo-500 group-hover/btn:text-white'}`}>
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Tarjeta Secundaria: Agenda (Columna Derecha) */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 hover:from-indigo-500/10 hover:to-purple-500/10 hover:border-indigo-500/40 transition-all duration-300 p-8 flex flex-col justify-center text-center min-h-[320px]">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                   <Calendar size={40} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Agenda una Llamada</h3>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed px-4">
                Sesión de estrategia de 15 min para ver si hacemos match. Sin compromiso.
              </p>
              <Button asChild className="w-full h-12 text-base bg-foreground text-background hover:bg-foreground/90 font-bold transition-all shadow-lg hover:shadow-xl">
                <Link 
                    href="https://calendly.com/" // TODO: URL de Calendly
                    target="_blank"
                    className="flex items-center gap-2"
                >
                    Reservar Horario
                    <ArrowUpRight size={18} />
                </Link>
              </Button>
            </div>

            {/* 3. Tarjeta Inferior: Info & Disponibilidad (Ancho Completo) */}
            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-white/10 transition-colors">
               <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                     <Clock size={24} />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-foreground">Disponibilidad Actual</h4>
                     <p className="text-xs text-muted-foreground mt-0.5">
                        Aceptando nuevos proyectos para <span className="text-emerald-500 font-medium">Q1 2026</span>
                     </p>
                  </div>
               </div>
               <div className="w-full sm:w-auto px-4 py-2 rounded-full border border-white/10 bg-black/5 dark:bg-black/40 text-xs text-muted-foreground font-mono flex items-center justify-center gap-2">
                  <MapPin size={12} />
                  Santiago, Chile (GMT-3)
               </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </CursorGradientWrapper>
  );
}