
import { orderBy, where, QueryConstraint } from 'firebase/firestore';
import { useCollection } from '../use-collection';
import { ClientProject } from '@/types/firestore';

export const useClientProjects = (options?: {
  clientId?: string;
  status?: 'active' | 'completed' | 'on-hold';
}) => {
  const queryConstraints: QueryConstraint[] = [
    orderBy('createdAt', 'desc')
  ];

  if (options?.clientId) {
    queryConstraints.push(where('clientId', '==', options.clientId));
  }

  if (options?.status) {
    queryConstraints.push(where('status', '==', options.status));
  }

  return useCollection<ClientProject>('client-projects', queryConstraints, {
    requireAuth: true,
    userFilter: !options?.clientId // Filtra por usuario si no se especifica clientId
  });
};
