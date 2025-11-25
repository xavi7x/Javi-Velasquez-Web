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
    if (!firestore) {
      return null;
    }
    
    const queryConstraints: QueryConstraint[] = [
      where('type', '==', 'client'),
      orderBy('createdAt', 'desc')
    ];
    
    if (options?.clientId) {
      // This case is for the client portal, fetching only their own projects.
      queryConstraints.push(where('clientId', '==', options.clientId));
    }
    // If no clientId is provided, the hook will fetch ALL client projects,
    // which is the desired behavior for the owner's panel.

    return query(collection(firestore, 'projects'), ...queryConstraints);

  }, [firestore, options?.clientId]);


  return useCollection<Project>(clientProjectsQuery);
};
