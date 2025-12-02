'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ProjectDetailPage() {
  // Mock data - replace with real data from Firestore
  const projectName = 'Diseño de App Móvil';

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Proyecto: {projectName}</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Proyecto</CardTitle>
          <CardDescription>
            Aquí verás el cronograma, solicitudes, archivos y más.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>El contenido detallado del proyecto se implementará en la siguiente fase.</p>
        </CardContent>
      </Card>
    </div>
  );
}
