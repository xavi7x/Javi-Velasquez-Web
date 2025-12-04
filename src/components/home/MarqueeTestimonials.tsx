'use client';

import { ShieldCheck, Star, Cpu, Globe, Code2, Zap, Smartphone } from 'lucide-react';

const testimonials = [
  {
    client: "MMYD Seguridad",
    text: "Cerramos contratos B2B un 20% más rápido con la nueva imagen.",
    type: "Web Corporativa",
    icon: ShieldCheck,
    // Adaptamos el color: más oscuro en light mode, neón en dark mode
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    client: "Le Flaubert",
    text: "El sistema de reservas automatizado es nuestro mejor empleado.",
    type: "Restaurante App",
    icon: Star,
    color: "text-rose-600 dark:text-rose-400"
  },
  {
    client: "Al Punto App",
    text: "La implementación PWA mejoró la gestión de nuestro restaurante en un 40%.",
    type: "Aplicación Web",
    icon: Smartphone,
    color: "text-orange-600 dark:text-orange-400"
  },
  {
    client: "Lynthex",
    text: "Arquitectura SaaS impecable. El dashboard vuela.",
    type: "Plataforma SaaS",
    icon: Cpu,
    color: "text-indigo-600 dark:text-indigo-400"
  },
  {
    client: "Au Bon Goût",
    text: "Recuperamos 10 horas semanales de gestión administrativa.",
    type: "E-commerce",
    icon: Globe,
    color: "text-emerald-600 dark:text-emerald-400"
  },
  {
    client: "Appli Ingeniería",
    text: "Una web que habla el lenguaje técnico de nuestros ingenieros.",
    type: "Consultoría",
    icon: Code2,
    color: "text-cyan-600 dark:text-cyan-400"
  },
];

export function MarqueeTestimonials() {
  return (
    // SECCIÓN: Fondo claro sutil en día / oscuro translúcido en noche
    <section className="w-full py-12 border-y border-neutral-200 dark:border-white/5 bg-neutral-50/50 dark:bg-black/20 backdrop-blur-sm overflow-hidden mb-16 transition-colors duration-300">
      <div className="container mx-auto px-4 mb-8 text-center">
         {/* BADGE: Estilo píldora adaptativo */}
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-medium backdrop-blur-md">
            <Zap size={12} className="fill-indigo-600 text-indigo-600 dark:fill-indigo-500 dark:text-indigo-500" />
            <span>Impacto Real en Negocios Reales</span>
          </div>
      </div>
      
      {/* Contenedor del Scroll */}
      <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex animate-infinite-scroll hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                // CARD: Fondo blanco + sombra en día / Fondo cristal en noche
                className="w-[300px] md:w-[350px] mx-4 p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-xl flex-shrink-0 hover:border-indigo-300 dark:hover:bg-white/[0.05] transition-all group cursor-default"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-neutral-100 dark:bg-white/5 ${item.color} dark:group-hover:bg-white/10 transition-colors`}>
                    <Icon size={20} />
                  </div>
                  {/* ESTRELLAS: Amarillo más fuerte en día */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500" />
                    ))}
                  </div>
                </div>
                
                {/* TEXTO: Gris oscuro en día / Gris claro en noche */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 font-light">
                  "{item.text}"
                </p>

                <div className="flex items-center justify-between border-t border-neutral-100 dark:border-white/5 pt-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{item.client}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{item.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}