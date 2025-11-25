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
    if (!firestore) {
      return null;
    }
    // If a clientId is expected but not provided, wait.
    if (options?.clientId === undefined) {
      return null;
    }

    const queryConstraints: QueryConstraint[] = [orderBy('title', 'asc')];
    
    // Only add the where clause if a valid clientId is provided.
    // If no clientId is provided, it fetches all projects (for owner view).
    if (typeof options.clientId === 'string' && options.clientId.length > 0) {
      queryConstraints.push(where('clientId', '==', options.clientId));
    }
  
    if (options?.status) {
      queryConstraints.push(where('status', '==', options.status));
    }

    return query(collection(firestore, 'client-projects'), ...queryConstraints);

  }, [firestore, options?.clientId, options?.status]);


  return useCollection<ClientProject>(clientProjectsQuery);
};
