export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  createdAt: Date;
  published: boolean;
  category: string;
  // Mantenemos compatibilidad con lo existente
  [key: string]: any;
}

export interface ProgressUpdate {
  progress: number;
  comment: string;
  date: Date;
}

export interface ClientProject {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: 'active' | 'completed' | 'on-hold';
  deadline: Date;
  budget?: number;
  createdAt: Date;
  clientName?: string;
  progress?: number;
  progressHistory?: ProgressUpdate[];
  // Para migración gradual
  isLegacy?: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  createdAt: Date;
  userId: string; // Relación con auth
}
