
'use client';
    
import { collection, query, onSnapshot, QueryConstraint, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db, auth } from '../config';
import { onAuthStateChanged, User } from 'firebase/auth';

interface UseCollectionOptions {
  requireAuth?: boolean;
  userFilter?: boolean;
}

// Para datos que REQUIEREN autenticación
export const useCollection = <T>(
  path: string, 
  queryConstraints: QueryConstraint[] = [],
  options: UseCollectionOptions = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const { requireAuth = true, userFilter = false } = options;

  useEffect(() => {
    // Si no requiere auth, consulta directamente (para compatibilidad)
    if (!requireAuth) {
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
          console.error(`Error en colección ${path}:`, err);
          setError(err);
          setLoading(false);
        }
      );
      return unsubscribe;
    }

    // Si requiere auth, espera al usuario
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        let finalConstraints = [...queryConstraints];
        
        // Filtra por usuario si es necesario
        if (userFilter) {
          finalConstraints = [...finalConstraints, where('userId', '==', currentUser.uid)];
        }
        
        try {
          const q = query(collection(db, path), ...finalConstraints);
          const unsubscribeFirestore = onSnapshot(q, 
            (snapshot) => {
              const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as T[];
              setData(items);
              setLoading(false);
            },
            (err) => {
              console.error(`Error en colección autenticada ${path}:`, err);
              setError(err);
              setLoading(false);
            }
          );
          
          return () => unsubscribeFirestore(); // Corrected cleanup
        } catch (err) {
          console.error(`Error creando query para ${path}:`, err);
          setError(err as Error);
          setLoading(false);
        }
      } else {
        // No hay usuario autenticado
        setData([]);
        setLoading(false);
        if (requireAuth) {
          setError(new Error('Authentication required'));
        }
      }
    });

    return () => unsubscribeAuth();
  }, [path, requireAuth, userFilter, JSON.stringify(queryConstraints)]);

  return { data, loading, error, user };
};
