
import { collection, query, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { usePublicCollection } from '../use-public-collection';
import { Project } from '@/lib/project-types';
import { useFirestore, useMemoFirebase } from '@/firebase';

export const usePortfolio = (filters?: {
  category?: string;
  featured?: boolean;
}) => {
  const firestore = useFirestore();

  const portfolioQuery = useMemoFirebase(() => {
    if (!firestore) return null;

    const constraints: QueryConstraint[] = [
      where('isPublic', '==', true),
      orderBy('order', 'asc'),
    ];
  
    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }
  
    if (filters?.featured) {
      constraints.push(where('featured', '==', true));
    }
    
    return query(collection(firestore, 'projects'), ...constraints);

  }, [firestore, filters]);


  return usePublicCollection<Project>(portfolioQuery);
};
