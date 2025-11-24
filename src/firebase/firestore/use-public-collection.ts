
import { collection, query, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../config';

export const usePublicCollection = <T>(
  path: string, 
  queryConstraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const q = query(collection(db, path), ...queryConstraints);
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          setData(items);
          setLoading(false);
        },
        (err) => {
          console.error(`Error en colección pública ${path}:`, err);
          setError(err);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return () => {}; // Función cleanup vacía
    }
  }, [path, JSON.stringify(queryConstraints)]);

  return { data, loading, error };
};
