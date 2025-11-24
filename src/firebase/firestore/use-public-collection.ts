'use client';

import { collection, query, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../config';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * React hook to subscribe to a public Firestore collection in real-time.
 * Handles nullable queries gracefully.
 *
 * @template T - The type of the documents in the collection.
 * @param {Query | null | undefined} memoizedQuery - The memoized Firestore Query object. Hook execution will wait if it's null or undefined.
 * @returns An object containing the collection data, loading state, and any error.
 */
export function usePublicCollection<T>(
  path: string, 
  queryConstraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
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
          })) as WithId<T>[];
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
}
