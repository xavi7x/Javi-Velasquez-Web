'use client';

import { onSnapshot, Query, FirestoreError } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * React hook to subscribe to a Firestore collection in real-time, gated by authentication.
 * Handles nullable queries gracefully.
 *
 * @template T - The type of the documents in the collection.
 * @param {Query | null | undefined} memoizedQuery - The memoized Firestore Query object. Hook execution will wait if it's null or undefined.
 * @returns An object containing the collection data, loading state, and any error.
 */
export function useCollection<T>(
  memoizedQuery: Query | null | undefined
) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // Don't run if the user state is still loading or if the query is not ready
    if (isUserLoading || !memoizedQuery) {
      setLoading(isUserLoading); // Set loading to true while user is loading
      setData(null);
      return;
    }
    
    // If there's no authenticated user, we don't proceed.
    if (!user) {
      setData(null);
      setLoading(false);
      setError(new Error("Authentication required."));
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
        console.error(`Error in authenticated collection listener for path: ${memoizedQuery.path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, user, isUserLoading]);

  return { data, loading, error };
};
