'use client';
    
import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  FirestoreError,
  DocumentData,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * React hook to subscribe to a Firestore collection in real-time.
 * It is designed to work with a memoized query object.
 * 
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedFirestoreQuery or BAD THINGS WILL HAPPEN.
 * Use useMemoFirebase to memoize it per React guidance. Also, ensure that its dependencies are stable references.
 *
 * @template T The expected type of the documents in the collection.
 * @param {Query<DocumentData> | null | undefined} memoizedFirestoreQuery - The memoized Firestore query object. The hook will not run if this is null or undefined.
 * @returns {UseCollectionResult<T>} An object containing the collection data, loading state, and any errors.
 */
export function useCollection<T = any>(
  memoizedFirestoreQuery: Query<DocumentData> | null | undefined
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    // If the query is not ready (e.g., waiting for user auth), do nothing.
    if (!memoizedFirestoreQuery) {
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      memoizedFirestoreQuery,
      (querySnapshot) => {
        const result: WithId<T>[] = [];
        querySnapshot.forEach((doc) => {
          result.push({ ...(doc.data() as T), id: doc.id });
        });
        setData(result);
        setIsLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        const path = (memoizedFirestoreQuery as any)._query.path.canonicalString();
        
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        })
        
        setError(contextualError);
        setData(null);
        setIsLoading(false);
        
        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [memoizedFirestoreQuery]); // Effect depends only on the memoized query

  return { data, isLoading, error };
}
