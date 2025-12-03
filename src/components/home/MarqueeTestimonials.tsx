'use client';

import { ShieldCheck, Star, Cpu, Globe, Code2, Zap } from 'lucide-react';

const testimonials = [
  {
    client: "MMYD Seguridad",
    text: "Cerramos contratos B2B un 20% más rápido con la nueva imagen.",
    type: "Web Corporativa",
    icon: ShieldCheck,
    color: "text-blue-400"
  },
  {
    client: "Le Flaubert",
    text: "El sistema de reservas automatizado es nuestro mejor empleado.",
    type: "Restaurante App",
    icon: Star,
    color: "text-rose-400"
  },
  {
    client: "Lynthex",
    text: "Arquitectura SaaS impecable. El dashboard vuela.",
    type: "Plataforma SaaS",
    icon: Cpu,
    color: "text-indigo-400"
  },
  {
    client: "Au Bon Goût",
    text: "Recuperamos 10 horas semanales de gestión administrativa.",
    type: "E-commerce",
    icon: Globe,
    color: "text-emerald-400"
  },
  {
    client: "Appli Ingeniería",
    text: "Una web que habla el lenguaje técnico de nuestros ingenieros.",
    type: "Consultoría",
    icon: Code2,
    color: "text-cyan-400"
  },
];

export function MarqueeTestimonials() {
  return (
    <section className="w-full py-12 border-y border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden mb-16">
      <div className="container mx-auto px-4 mb-8 text-center">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium backdrop-blur-md">
            <Zap size={12} className="fill-indigo-500" />
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
                className="w-[300px] md:w-[350px] mx-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex-shrink-0 hover:bg-white/[0.05] transition-colors group cursor-default"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${item.color} group-hover:bg-white/10 transition-colors`}>
                    <Icon size={20} />
                  </div>
                  {/* ESTRELLAS AGREGADAS */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-4 font-light">
                  "{item.text}"
                </p>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-xs font-bold text-slate-200">{item.client}</span>
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