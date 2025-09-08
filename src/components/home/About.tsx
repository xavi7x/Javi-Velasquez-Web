import Image from 'next/image';
import { Code, PenTool, LayoutTemplate, BarChart } from 'lucide-react';

const skills = [
  { name: 'Diseño UI/UX', icon: PenTool },
  { name: 'Desarrollo Web', icon: Code },
  { name: 'Prototipado', icon: LayoutTemplate },
  { name: 'Análisis de Datos', icon: BarChart },
];

export function About() {
  return (
    <section id="about" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex items-center justify-center">
            <div className="relative">
              <Image
                src="https://picsum.photos/500/500"
                width={500}
                height={500}
                alt="Foto Profesional"
                className="rounded-full object-cover shadow-2xl"
                data-ai-hint="professional portrait"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Sobre Mí
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Soy un diseñador y desarrollador apasionado y orientado a resultados con un don para crear
                experiencias digitales hermosas, funcionales y centradas en el usuario.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-4">
              {skills.map((skill) => (
                <li key={skill.name} className="flex items-center gap-3">
                  <skill.icon className="h-8 w-8 text-accent" />
                  <span className="font-medium">{skill.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
