
import { collection, query, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { usePublicCollection } from '../use-public-collection';
import { Project } from '@/lib/project-types';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useMemo } from 'react';

export const usePortfolio = (filters?: {
  category?: string;
  featured?: boolean;
}) => {
  const firestore = useFirestore();

  const portfolioQuery = useMemoFirebase(() => {
    if (!firestore) return null;

    const constraints: QueryConstraint[] = [
      where('isPublic', '==', true),
      // orderBy('order', 'asc'), // This requires a composite index. We will sort on the client.
    ];
  
    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }
  
    if (filters?.featured) {
      constraints.push(where('featured', '==', true));
    }
    
    return query(collection(firestore, 'projects'), ...constraints);

  }, [firestore, filters]);

  const { data, loading, error } = usePublicCollection<Project>(portfolioQuery);

  const sortedData = useMemo(() => {
    if (!data) return null;
    return [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [data]);

  return { data: sortedData, loading, error };
};
