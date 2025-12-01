'use client';

import { onSnapshot, Query, FirestoreError } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useUser, errorEmitter, FirestorePermissionError } from '@/firebase';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * React hook to subscribe to a Firestore collection in real-time.
 * Handles nullable queries gracefully.
 */
export function useCollection<T>(
  memoizedQuery: Query | null | undefined
) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Obtenemos el estado de carga del usuario para evitar condiciones de carrera,
  // pero NO bloqueamos la ejecución si el usuario es null (para permitir queries públicas).
  const { isUserLoading } = useUser();

  useEffect(() => {
    // 1. GUARDIA PRINCIPAL: Si la query es null/undefined, no hacemos nada.
    // Esto es lo que detiene las llamadas cuando los datos no están listos.
    if (!memoizedQuery) {
      setLoading(false);
      // Opcional: setData(null) si quieres limpiar los datos al perder la query.
      return;
    }
    
    // 2. GUARDIA DE CARGA: Si la autenticación aún está cargando, esperamos.
    // Esto evita que se lancen queries que dependen del usuario antes de saber si existe.
    if (isUserLoading) {
      setLoading(true);
      return;
    }

    // (Eliminado el bloque "if (!user) return" para permitir colecciones públicas)

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
        console.error("Error en useCollection:", err);

        // Intento seguro de obtener el path para depuración
        // En consultas complejas (Query), .path no siempre es accesible directamente en tipado estricto
        const queryPath = (memoizedQuery as any).path || 'unknown-path';

        // DETECCIÓN INTELIGENTE DEL ERROR "UNDEFINED"
        if (typeof queryPath === 'string' && queryPath.includes('/undefined')) {
             console.warn(`🚨 ALERTA CRÍTICA: Se intentó consultar la ruta "${queryPath}". Revisa el componente que llama a este hook, está pasando una variable undefined como nombre de colección o ID.`);
        }

        const permissionError = new FirestorePermissionError({
          path: queryPath,
          operation: 'list',
        });
        
        setError(permissionError);
        setLoading(false);

        // Solo emitimos al escuchador global si es un error real de permisos
        if (err.code === 'permission-denied') {
            errorEmitter.emit('permission-error', permissionError);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [memoizedQuery, isUserLoading]); // Quitamos 'user' de dependencias para evitar re-suscripciones innecesarias

  return { data, loading, error };
};