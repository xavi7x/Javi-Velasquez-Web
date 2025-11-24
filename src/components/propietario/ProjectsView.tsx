'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';


export function ProjectsView() {

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Proyectos de Clientes</CardTitle>
          <CardDescription>Esta funcionalidad está temporalmente desactivada.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex flex-col items-center justify-center text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
            <h3 className="font-semibold mt-4">Gestión de proyectos de clientes desactivada</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Para simplificar y resolver el problema de la página pública, esta sección se ha desactivado temporalmente. Los proyectos del portafolio se gestionan ahora desde "Mi Web".
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
