'use client';

import { collection, query, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { useCollection } from '../use-collection';
import { Project } from '@/lib/project-types';
import { useFirestore, useMemoFirebase } from '@/firebase';

export const useClientProjects = (options?: {
  clientId?: string;
}) => {
  const firestore = useFirestore();

  const clientProjectsQuery = useMemoFirebase(() => {
    // STRICT GUARD: Do not proceed if firestore is not available or if the clientId is invalid.
    // This is the primary fix to prevent queries with "undefined" paths.
    if (!firestore || !options?.clientId || typeof options.clientId !== 'string' || options.clientId.trim() === '') {
      return null;
    }
    
    const queryConstraints: QueryConstraint[] = [
      where('clientId', '==', options.clientId)
    ];
    
    queryConstraints.push(orderBy('createdAt', 'desc'));

    // The collection is 'client-projects'.
    return query(collection(firestore, 'client-projects'), ...queryConstraints);

  }, [firestore, options?.clientId]);


  return useCollection<Project>(clientProjectsQuery);
};
