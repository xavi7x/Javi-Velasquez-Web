import Image from 'next/image';
import { Code, PenTool, LayoutTemplate, BarChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const skills = [
  { name: 'Diseño UI/UX', icon: PenTool },
  { name: 'Desarrollo Web', icon: Code },
  { name: 'Prototipado', icon: LayoutTemplate },
  { name: 'Análisis de Datos', icon: BarChart },
];

export function About() {
  return (
    <section id="about" className="w-full bg-secondary py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Sobre Mí
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Soy un diseñador y desarrollador apasionado y orientado a resultados con un don para crear
              experiencias digitales hermosas, funcionales y centradas en el usuario. Con experiencia en
              arte y ciencias de la computación, cierro la brecha entre la visión creativa y
              la ejecución técnica.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {skills.map((skill) => (
                <Card key={skill.name}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <skill.icon className="h-8 w-8 text-primary" />
                    <span className="font-medium">{skill.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="https://picsum.photos/550/550"
              width={550}
              height={550}
              alt="Foto Profesional"
              className="aspect-square rounded-full object-cover"
              data-ai-hint="professional portrait"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
