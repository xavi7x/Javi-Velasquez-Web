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
    
    // For owner's panel, no clientId is provided, so we fetch all client projects.
    if (options?.clientId) {
      // For client portal, we MUST have a clientId to query.
      if (typeof options.clientId !== 'string' || options.clientId.length === 0) {
        return null; // Return null if clientId is not a valid string, preventing the bad query.
      }
      queryConstraints.push(where('clientId', '==', options.clientId));
    }
    
    // Always add an order by constraint.
    queryConstraints.push(orderBy('createdAt', 'desc'));


    return query(collection(firestore, 'projects'), ...queryConstraints);

  }, [firestore, options?.clientId, options?.status]);


  return useCollection<Project>(clientProjectsQuery);
};
