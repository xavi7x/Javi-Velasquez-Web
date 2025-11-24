'use client';

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { ClientProject } from '@/lib/project-types';

export const ClientProjectService = {
  // Crear nuevo proyecto de cliente
  createClientProject: async (db: Firestore, project: Omit<ClientProject, 'id' | 'createdAt'>) => {
    const projectWithMetadata = {
      ...project,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'client-projects'), projectWithMetadata);
    // After creating, update the document with its own ID.
    await updateDoc(docRef, { id: docRef.id });
    return { id: docRef.id, ...projectWithMetadata };
  },

  // Actualizar proyecto existente
  updateClientProject: async (db: Firestore, projectId: string, updates: Partial<ClientProject>) => {
    await updateDoc(doc(db, 'client-projects', projectId), updates);
  },

  // Eliminar proyecto
  deleteClientProject: async (db: Firestore, projectId: string) => {
    await deleteDoc(doc(db, 'client-projects', projectId));
  },

  // Migrar proyecto existente del portfolio a client-projects
  migrateToClientProject: async (db: Firestore, portfolioProjectId: string, clientId: string) => {
    // Esto lo implementaremos después
  }
};
