import type admin from 'firebase-admin';

/** Ambiente Firestore: prod o dev. Ruta de datos: {env}/{env}/events y {env}/{env}/courses. Por defecto prod para que local y producción lean los mismos datos. */
export const FIREBASE_ENV = process.env.FIREBASE_ENV || 'prod';

/**
 * Referencia a la subcolección events: {env}/{env}/events
 */
export function getEventsRef(db: admin.firestore.Firestore) {
  return db.collection(FIREBASE_ENV).doc(FIREBASE_ENV).collection('events');
}

/**
 * Referencia a la subcolección courses: {env}/{env}/courses
 */
export function getCoursesRef(db: admin.firestore.Firestore) {
  return db.collection(FIREBASE_ENV).doc(FIREBASE_ENV).collection('courses');
}

/** Colección raíz services (Empresarial). */
export function getServicesRef(db: admin.firestore.Firestore) {
  return db.collection('services');
}

/** Colección raíz portfolio (Empresarial). */
export function getPortfolioRef(db: admin.firestore.Firestore) {
  return db.collection('portfolio');
}

/** Colección raíz products (catálogo de venta). */
export function getProductsRef(db: admin.firestore.Firestore) {
  return db.collection('products');
}

/**
 * Usuarios de la app: {env}/{env}/users.
 * Campo de acceso: `accountRole` (`user` | `member` | `admin`). Ver account-roles.ts.
 */
export function getUsersRef(db: admin.firestore.Firestore) {
  return db.collection(FIREBASE_ENV).doc(FIREBASE_ENV).collection('users');
}

/**
 * Convierte un valor de Firestore (Timestamp o lo que sea) a Date o valor original.
 */
function parseTimestamp(value: unknown): Date | string | number | null | undefined {
  if (value == null) return value;
  if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === 'string' || typeof value === 'number') return value as string | number;
  return value as Date;
}

/**
 * Parsea un documento de evento: convierte Timestamps y devuelve objeto plano.
 */
export function parseEventDoc(id: string, data: Record<string, unknown>) {
  const eventDate = parseTimestamp(data.eventDate);
  const createdAt = parseTimestamp(data.createdAt);
  const eventDateStr =
    eventDate instanceof Date ? eventDate.toISOString() : eventDate != null ? String(eventDate) : '';
  return {
    id,
    title: (data.title as string) ?? '',
    description: data.description as string | undefined,
    imageUrl: data.imageUrl as string | undefined,
    eventDate: eventDateStr,
    location: data.location as string | undefined,
    city: data.city as string | undefined,
    registrationUrl: data.registrationUrl as string | undefined,
    isActive: (data.isActive as boolean) !== false,
    createdAt: createdAt instanceof Date ? createdAt : new Date(),
  };
}

/**
 * Parsea un documento de curso: convierte Timestamps y devuelve objeto plano.
 */
export function parseCourseDoc(id: string, data: Record<string, unknown>) {
  const createdAt = parseTimestamp(data.createdAt);
  const updatedAt = parseTimestamp(data.updatedAt);
  const publishedAt = parseTimestamp(data.publishedAt);
  return {
    id,
    title: (data.title as string) ?? '',
    description: data.description as string | undefined,
    thumbnailUrl: data.thumbnailUrl as string | undefined,
    difficulty: data.difficulty as string | undefined,
    duration: data.duration as number | undefined,
    learningPaths: (data.learningPaths as string[]) ?? [],
    modules: (data.modules as Record<string, unknown>[]) ?? [],
    learningObjectives: (data.learningObjectives as string[]) ?? [],
    professor: data.professor as string | undefined,
    link: data.link as string | undefined,
    isPublished: Boolean(data.isPublished),
    isPaid: Boolean(data.isPaid),
    price: typeof data.price === 'number' ? data.price : null,
    enrollmentCount: typeof data.enrollmentCount === 'number' ? data.enrollmentCount : 0,
    createdAt: createdAt instanceof Date ? createdAt : new Date(),
    updatedAt: updatedAt instanceof Date ? updatedAt : new Date(),
    publishedAt: publishedAt instanceof Date ? publishedAt : null,
  };
}

export function parseServiceDoc(id: string, data: Record<string, unknown>) {
  return {
    id,
    title: (data.title as string) ?? '',
    description: (data.description as string) ?? '',
    icon: (data.icon as string) ?? '💼',
    features: (data.features as string[]) ?? [],
    order: typeof data.order === 'number' ? data.order : 0,
    isPublished: data.isPublished !== false,
  };
}

export function parsePortfolioDoc(id: string, data: Record<string, unknown>) {
  const createdAt = parseTimestamp(data.createdAt);
  return {
    id,
    title: (data.title as string) ?? '',
    description: (data.description as string) ?? '',
    thumbnailUrl: data.thumbnailUrl as string | undefined,
    technologies: (data.technologies as string[]) ?? [],
    category: (data.category as string) ?? '',
    projectUrl: data.projectUrl as string | undefined,
    caseStudyUrl: data.caseStudyUrl as string | undefined,
    isPublished: data.isPublished !== false,
    order: typeof data.order === 'number' ? data.order : 0,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : new Date().toISOString(),
  };
}

export function parseProductDoc(id: string, data: Record<string, unknown>) {
  const createdAt = parseTimestamp(data.createdAt);
  const rawLinks = Array.isArray(data.storeLinks) ? data.storeLinks : [];
  const storeLinks = rawLinks
    .map((link) => {
      if (!link || typeof link !== 'object') return null;
      const l = link as { label?: unknown; url?: unknown };
      const label = String(l.label || '').trim();
      const url = String(l.url || '').trim();
      if (!label || !url) return null;
      return { label, url };
    })
    .filter((x): x is { label: string; url: string } => x != null);

  return {
    id,
    title: (data.title as string) ?? '',
    description: (data.description as string) ?? '',
    thumbnailUrl: data.thumbnailUrl as string | undefined,
    type: (data.type as string) ?? 'other',
    storeLinks,
    isPublished: data.isPublished !== false,
    order: typeof data.order === 'number' ? data.order : 0,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : new Date().toISOString(),
  };
}

/**
 * Un evento está en el pasado si la fecha actual es posterior al final del día del evento.
 */
export function isEventPast(eventDate: string | Date): boolean {
  if (!eventDate) return false;
  const endOfDay = new Date(eventDate);
  endOfDay.setHours(23, 59, 59, 999);
  return new Date() > endOfDay;
}
