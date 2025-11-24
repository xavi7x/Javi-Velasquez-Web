'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function MyWebView() {

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Proyectos Públicos (Portafolio)</CardTitle>
            <CardDescription>Gestiona los proyectos que se muestran en tu página de inicio.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="h-48 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Sección en Desarrollo</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
                Estamos trabajando para que puedas gestionar los proyectos de tu portafolio desde aquí. ¡Estará listo pronto!
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
