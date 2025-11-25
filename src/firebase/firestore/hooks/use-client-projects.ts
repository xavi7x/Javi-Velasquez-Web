'use client';

import { collection, query, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { useCollection } from '../use-collection';
import { ClientProject } from '@/lib/project-types';
import { useFirestore, useMemoFirebase } from '@/firebase';

export const useClientProjects = (options?: {
  clientId?: string;
  status?: 'active' | 'completed' | 'on-hold';
}) => {
  const firestore = useFirestore();

  const clientProjectsQuery = useMemoFirebase(() => {
    // CONDICIÓN REFORZADA: No construir la consulta a menos que clientId sea una cadena válida.
    // Esto previene el error "undefined" de forma definitiva.
    if (!firestore || typeof options?.clientId !== 'string' || !options.clientId) {
      return null;
    }

    const queryConstraints: QueryConstraint[] = [
      where('clientId', '==', options.clientId),
      orderBy('title', 'asc')
    ];
  
    if (options?.status) {
      queryConstraints.push(where('status', '==', options.status));
    }

    return query(collection(firestore, 'client-projects'), ...queryConstraints);

  }, [firestore, options?.clientId, options?.status]);


  return useCollection<ClientProject>(clientProjectsQuery);
};
