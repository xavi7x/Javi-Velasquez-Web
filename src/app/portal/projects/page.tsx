'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export default function ProjectsPage() {

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver el estado y el progreso de todos tus proyectos.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Proyectos</CardTitle>
          <CardDescription>Un resumen de los proyectos activos y pasados.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="h-48 text-center flex flex-col items-center justify-center">
              <Briefcase className="h-12 w-12 text-muted-foreground" />
              <h3 className="font-semibold mt-4">Gestión de proyectos de clientes desactivada</h3>
              <p className="text-muted-foreground text-sm">
                Esta sección está temporalmente desactivada para enfocarnos en la web pública.
              </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
