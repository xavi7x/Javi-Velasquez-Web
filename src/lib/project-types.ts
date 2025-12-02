import type { Timestamp } from 'firebase/firestore';

export interface ProjectDescription {
  challenge: string;
  solution: string;
  results: string;
}

export interface Project {
  id: string;
  clientId?: string;
  type: 'portfolio' | 'client';
  slug?: string;
  title: string;
  tagline: string;
  thumbnail: string;
  images: string[];
  description: ProjectDescription;
  skills: string[];
  order: number;
  isPublic?: boolean;
  progress?: number;
  stages?: { name: string; status: 'Completed' | 'In Progress' | 'Pending' }[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ProgressUpdate {
  progress: number;
  comment: string;
  date: Date | Timestamp;
}

export interface ClientProject {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName?: string;
  status: 'active' | 'completed' | 'on-hold';
  deadline?: Date | Timestamp;
  progress?: number;
  progressHistory?: ProgressUpdate[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  downloadUrl?: string; // Nuevo campo
  invoiceId?: string; // Nuevo campo
}

export interface Client {
    id: string; // Corresponds to Firebase Auth UID
    uid: string;
    name: string;
    email: string;
    companyName: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  clientId: string;
  invoiceNumber: string;
  concept: string;
  amount: number;
  issueDate: string; // ISO Date String
  dueDate: string;   // ISO Date String
  status: 'Pending' | 'Paid' | 'Overdue';
  pdfUrl?: string;
}

export interface Message {
  id: string;
  name: string;
  phone: string;
  message: string;
  submissionDate: string; // ISO string
  status: 'new' | 'read' | 'archived';
  attachmentUrl?: string;
  url?: string;
}
