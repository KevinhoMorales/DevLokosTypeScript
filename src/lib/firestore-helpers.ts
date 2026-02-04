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
    isPublished: data.isPublished as boolean,
    createdAt: createdAt instanceof Date ? createdAt : new Date(),
    updatedAt: updatedAt instanceof Date ? updatedAt : new Date(),
    publishedAt: publishedAt instanceof Date ? publishedAt : null,
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
