'use client';

import { onSnapshot, Query, FirestoreError } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useUser, errorEmitter, FirestorePermissionError } from '@/firebase';

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
    // If the query is not ready, or the user is still loading, set to loading and wait.
    if (!memoizedQuery || isUserLoading) {
      setLoading(true);
      setData(null);
      return;
    }
    
    // If there's no authenticated user, we don't proceed. This is an expected state.
    if (!user) {
      setLoading(false);
      setData(null);
      // We don't set an error here because it's a valid state (e.g., logged out).
      return;
    }
    
    // At this point, we have a user and a query, so we can start the subscription.
    setLoading(true);

    const unsubscribe = onSnapshot(memoizedQuery, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WithId<T>[];
        setData(items);
        setLoading(false);
        setError(null); // Clear previous errors on success
      },
      (err: FirestoreError) => {
        if (!memoizedQuery) return;
        // Create a rich, contextual error for better debugging
        const permissionError = new FirestorePermissionError({
          path: memoizedQuery.path,
          operation: 'list',
        });
        setError(permissionError);
        setLoading(false);

        // Emit the error for the global listener to catch and display
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [memoizedQuery, user, isUserLoading]);

  return { data, loading, error };
};
