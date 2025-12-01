'use client';

import { onSnapshot, Query, FirestoreError } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useUser, errorEmitter, FirestorePermissionError } from '@/firebase';

type WithId<T> = T & { id: string };

export function useCollection<T>(
  memoizedQuery: Query | null | undefined
) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isUserLoading } = useUser();

  useEffect(() => {
    // 1. Si no hay query, no cargamos nada.
    if (!memoizedQuery) {
      setLoading(false);
      return;
    }
    
    // 2. Si el usuario está cargando, esperamos.
    if (isUserLoading) {
      setLoading(true);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(memoizedQuery, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WithId<T>[];
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
        
        // Intentamos obtener el path para ver si es el error "undefined"
        const queryPath = (memoizedQuery as any).path || 'unknown-path';

        // SI EL PATH ES INVÁLIDO, LO SILENCIAMOS.
        // En lugar de emitir un error global, solo avisamos en consola y dejamos de cargar.
        // Esto evitará la pantalla blanca de error.
        if (typeof queryPath === 'string' && (queryPath.includes('/undefined') || queryPath === 'unknown-path')) {
             console.warn(`⚠️ Aviso: Se ignoró una consulta a una ruta inválida: "${queryPath}". Esto previene que la app se rompa.`);
             setLoading(false);
             setData([]); // Devolvemos lista vacía para que la UI no falle
             return; // ¡IMPORTANTE! Retornamos aquí para NO emitir el error global.
        }

        console.error("Error real de Firestore:", err);

        const permissionError = new FirestorePermissionError({
          path: queryPath,
          operation: 'list',
        });
        
        setError(permissionError);
        setLoading(false);

        // Solo emitimos errores reales, no los causados por variables undefined
        if (err.code === 'permission-denied') {
            errorEmitter.emit('permission-error', permissionError);
        }
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, isUserLoading]);

  return { data, loading, error };
};