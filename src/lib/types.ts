export interface Project {
  slug: string;
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
}
