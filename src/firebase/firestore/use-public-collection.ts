'use client';

import { onSnapshot, Query, FirestoreError } from 'firebase/firestore';
import { useState, useEffect } from 'react';

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
  memoizedQuery: Query | null | undefined
) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedQuery) {
      setData(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    const unsubscribe = onSnapshot(memoizedQuery, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WithId<T>[];
        setData(items);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error(`Error in public collection listener for path: ${memoizedQuery.path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery]);

  return { data, loading, error };
}
