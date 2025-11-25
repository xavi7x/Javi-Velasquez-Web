import { collection, query, where, orderBy } from 'firebase/firestore';
import { useCollection } from '../use-collection';
import { useFirestore } from '@/firebase';

interface UseClientProjectsOptions {
  clientId?: string | null;
  status?: string;
}

export const useClientProjects = (options?: UseClientProjectsOptions) => {
  const firestore = useFirestore();
  
  const { clientId, status } = options || {};

  // DEBUG: Agrega esto para ver qué está llegando
  console.log('useClientProjects - clientId:', clientId);
  console.log('useClientProjects - firestore:', firestore);

  // Si no hay clientId o firestore, retornar datos vacíos
  if (!clientId || !firestore) {
    console.log('useClientProjects - Retornando null porque clientId o firestore es undefined');
    return { 
      data: null, 
      loading: false, 
      error: null 
    };
  }

  try {
    let projectsQuery = query(
      collection(firestore, 'client-projects'),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );

    // Si se especifica status, agregar filtro
    if (status) {
      projectsQuery = query(
        projectsQuery,
        where('status', '==', status)
      );
    }

    console.log('useClientProjects - Query creada correctamente');
    return useCollection(projectsQuery);
  } catch (error) {
    console.error('useClientProjects - Error creando query:', error);
    return { 
      data: null, 
      loading: false, 
      error: error as Error 
    };
  }
};