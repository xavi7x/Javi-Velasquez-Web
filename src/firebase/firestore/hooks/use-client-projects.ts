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
    if (!firestore) return null;
    
    const queryConstraints: QueryConstraint[] = [
      where('type', '==', 'client')
    ];
    
    // If filtering by a specific client, ensure the ID is valid before adding the constraint.
    if (options?.clientId && options.clientId.trim() !== '') {
      queryConstraints.push(where('clientId', '==', options.clientId));
    }
    
    queryConstraints.push(orderBy('createdAt', 'desc'));

    // Note: The collection is 'projects' not 'client-projects' based on recent changes.
    // This allows public (portfolio) and private (client) projects to live together,
    // differentiated by the 'type' field.
    return query(collection(firestore, 'projects'), ...queryConstraints);

  }, [firestore, options?.clientId, options?.status]);


  return useCollection<Project>(clientProjectsQuery);
};
