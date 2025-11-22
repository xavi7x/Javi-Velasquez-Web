'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ProjectsPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver el estado de todos tus proyectos.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>La lista de proyectos se implementará en la siguiente fase.</p>
        </CardContent>
      </Card>
    </div>
  );
}

    