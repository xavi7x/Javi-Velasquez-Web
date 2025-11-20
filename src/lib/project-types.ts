import type { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
