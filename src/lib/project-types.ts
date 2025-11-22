import type { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  clientId?: string;
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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Client {
    id: string; // Corresponds to Firebase Auth UID
    name: string;
    email: string;
    companyName: string;
}
