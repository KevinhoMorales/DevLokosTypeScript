export type AdminCourse = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  difficulty?: string;
  duration?: number;
  learningPaths?: string[];
  modules?: { id?: string; title?: string; description?: string; order?: number }[];
  learningObjectives?: string[];
  professor?: string;
  link?: string | null;
  isPublished: boolean;
  isPaid: boolean;
  price?: number | null;
  enrollmentCount?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type AdminEvent = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  eventDate: string;
  location?: string;
  city?: string;
  registrationUrl?: string;
  isActive: boolean;
  createdAt?: string;
};

export type AdminService = {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  order: number;
  isPublished: boolean;
};

export type AdminPortfolio = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  technologies: string[];
  category: string;
  projectUrl?: string;
  caseStudyUrl?: string;
  isPublished: boolean;
  order: number;
  createdAt?: string;
};

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const LEARNING_PATHS = [
  'Mobile',
  'Frontend',
  'Backend',
  'Web Full-Stack',
  'Cross-Platform',
  'Flutter',
  'React / Next.js',
  'Swift / iOS',
  'Android / Kotlin',
  'Kotlin Multiplatform',
  'Node.js',
  'Python',
  'Java / Spring',
  'Base de datos',
  'Firebase / Firestore',
  'Cloud',
  'AWS',
  'Google Cloud',
  'Serverless',
  'DevOps',
  'AI / ML',
  'Product',
  'Soft Skills',
] as const;
