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
    // The query can only be constructed if firestore is available.
    // If an options object is provided, we MUST have a valid clientId string.
    if (!firestore || (options && typeof options.clientId !== 'string')) {
      return null;
    }
    
    const queryConstraints: QueryConstraint[] = [
      where('type', '==', 'client'),
    ];
    
    // Only add the clientId filter if it's provided. Otherwise, it fetches all client projects (for owner view).
    if (options?.clientId) {
      queryConstraints.push(where('clientId', '==', options.clientId));
    }
    
    queryConstraints.push(orderBy('createdAt', 'desc'));

    return query(collection(firestore, 'projects'), ...queryConstraints);

  }, [firestore, options?.clientId, options?.status]);


  return useCollection<Project>(clientProjectsQuery);
};
