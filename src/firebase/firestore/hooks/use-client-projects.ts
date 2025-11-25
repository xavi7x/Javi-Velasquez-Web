'use client';

import { collection, query, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { useCollection } from '../use-collection';
import { Project } from '@/lib/project-types';
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
    
    const queryConstraints: QueryConstraint[] = [
      where('type', '==', 'client'),
    ];
    
    if (options?.clientId) {
      // For client portal, we MUST have a clientId to query.
      // If it's not a valid string, return null and wait.
      if (typeof options.clientId !== 'string' || options.clientId.length === 0) {
        return null;
      }
      queryConstraints.push(where('clientId', '==', options.clientId));
    }
    
    queryConstraints.push(orderBy('createdAt', 'desc'));


    return query(collection(firestore, 'projects'), ...queryConstraints);

  }, [firestore, options?.clientId, options?.status]);


  return useCollection<Project>(clientProjectsQuery);
};
