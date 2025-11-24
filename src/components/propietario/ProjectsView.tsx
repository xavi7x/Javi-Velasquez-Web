'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Client } from '@/lib/project-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '../ui/skeleton';

// Este componente ahora estaría dentro de ProjectsView o en un archivo separado
const ClientProjects = ({ clientId }: { clientId: string }) => {
    // Aquí iría la lógica para mostrar y gestionar los proyectos de un cliente específico
    // Por ahora, mostramos un placeholder para indicar que la selección funciona.
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Proyectos para el Cliente Seleccionado</CardTitle>
                <CardDescription>ID del Cliente: {clientId}</CardDescription>
            </CardHeader>
             <CardContent className="h-48 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
                <h3 className="text-lg font-semibold">Sección en Desarrollo</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                    La gestión detallada de proyectos para este cliente estará disponible pronto.
                </p>
            </CardContent>
        </Card>
    );
}


export function ProjectsView() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const firestore = useFirestore();

  const clientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'clients'), orderBy('name', 'asc'));
  }, [firestore]);

  const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Proyectos de Clientes</CardTitle>
          <CardDescription>Selecciona un cliente para ver y administrar sus proyectos privados.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoadingClients ? (
                <Skeleton className="h-10 w-full" />
            ) : (
                <Select onValueChange={setSelectedClientId} value={selectedClientId || ''}>
                    <SelectTrigger className="w-full md:w-1/2">
                        <SelectValue placeholder="Selecciona un cliente..." />
                    </SelectTrigger>
                    <SelectContent>
                        {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                                {client.name} ({client.companyName})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </CardContent>
      </Card>
      
      {selectedClientId && <ClientProjects clientId={selectedClientId} />}
      
    </div>
  );
}
