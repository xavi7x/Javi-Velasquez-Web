
import { collection, query, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { useCollection } from '../use-collection';
import { ClientProject } from '@/types/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';

export const useClientProjects = (options?: {
  clientId?: string;
  status?: 'active' | 'completed' | 'on-hold';
}) => {
  const firestore = useFirestore();

  const clientProjectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;

    const queryConstraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc')
    ];
  
    if (options?.clientId) {
      queryConstraints.push(where('clientId', '==', options.clientId));
    }
  
    if (options?.status) {
      queryConstraints.push(where('status', '==', options.status));
    }

    return query(collection(firestore, 'client-projects'), ...queryConstraints);

  }, [firestore, options]);


  return useCollection<ClientProject>(clientProjectsQuery);
};
