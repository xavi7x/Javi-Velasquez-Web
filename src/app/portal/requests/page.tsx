'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RequestsPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis Solicitudes</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver el estado de todos tus requerimientos.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Tablero de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>El tablero de tickets se implementará en la siguiente fase.</p>
        </CardContent>
      </Card>
    </div>
  );
}

    