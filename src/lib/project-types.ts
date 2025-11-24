import type { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  clientId?: string;
  type: 'portfolio' | 'client';
  slug?: string;
  title: string;
  tagline: string;
  thumbnail: string;
  images: string[];
  description: {
    challenge: string;
    solution: string;
    results: string;
  };
  skills: string[];
  order: number;
  progress?: number;
  stages?: { name: string; status: 'Completed' | 'In Progress' | 'Pending' }[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Client {
    id: string; // Corresponds to Firebase Auth UID
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
