'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Client } from '@/lib/project-types';

export function ProjectsView() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const firestore = useFirestore();

  const clientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'clients'), orderBy('name', 'asc'));
  }, [firestore]);

  const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);

  // TODO: Add component to manage projects for the selected client
  // const ClientProjects = ({ clientId }) => { ... };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Proyectos de Clientes</CardTitle>
          <CardDescription>Selecciona un cliente para ver y administrar sus proyectos privados.</CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Sección en Desarrollo</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
                Estamos trabajando para que puedas gestionar los proyectos de tus clientes desde aquí. ¡Estará listo pronto!
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
