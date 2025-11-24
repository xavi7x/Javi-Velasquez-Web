'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function ProjectsView() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Proyectos</CardTitle>
        </CardHeader>
        <CardContent className="h-48 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Sección en Desarrollo</h3>
            <p className="text-muted-foreground">
                Estamos trabajando para mejorar la gestión de proyectos. Esta vista estará disponible pronto.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
