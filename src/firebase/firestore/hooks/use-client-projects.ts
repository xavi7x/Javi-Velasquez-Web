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
    // Definitive fix: Do not build the query unless clientId is a valid, non-empty string.
    // This prevents the 'undefined' path error.
    if (!firestore || typeof options?.clientId !== 'string' || options.clientId.trim() === '') {
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
