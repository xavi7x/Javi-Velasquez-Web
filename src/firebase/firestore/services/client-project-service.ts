
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../../config';
import { ClientProject } from '@/types/firestore';

export const ClientProjectService = {
  // Crear nuevo proyecto de cliente
  createClientProject: async (project: Omit<ClientProject, 'id' | 'createdAt'>) => {
    const projectWithMetadata = {
      ...project,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'client-projects'), projectWithMetadata);
    // After creating, update the document with its own ID.
    await updateDoc(docRef, { id: docRef.id });
    return { id: docRef.id, ...projectWithMetadata };
  },

  // Actualizar proyecto existente
  updateClientProject: async (projectId: string, updates: Partial<ClientProject>) => {
    await updateDoc(doc(db, 'client-projects', projectId), updates);
  },

  // Eliminar proyecto
  deleteClientProject: async (projectId: string) => {
    await deleteDoc(doc(db, 'client-projects', projectId));
  },

  // Migrar proyecto existente del portfolio a client-projects
  migrateToClientProject: async (portfolioProjectId: string, clientId: string) => {
    // Esto lo implementaremos después
  }
};
