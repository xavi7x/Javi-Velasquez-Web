
import { orderBy, where, QueryConstraint } from 'firebase/firestore';
import { usePublicCollection } from '../use-public-collection';
import { PortfolioProject } from '@/types/firestore';

export const usePortfolio = (filters?: {
  category?: string;
  featured?: boolean;
}) => {
  const queryConstraints: QueryConstraint[] = [
    orderBy('createdAt', 'desc'),
    where('published', '==', true)
  ];

  if (filters?.category) {
    queryConstraints.push(where('category', '==', filters.category));
  }

  if (filters?.featured) {
    queryConstraints.push(where('featured', '==', true));
  }

  return usePublicCollection<PortfolioProject>('projects', queryConstraints);
};
