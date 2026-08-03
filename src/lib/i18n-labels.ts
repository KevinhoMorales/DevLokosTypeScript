/** Etiquetas en español para valores guardados en inglés (Firestore / CMS). */

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

const LEARNING_PATH_LABELS: Record<string, string> = {
  Mobile: 'Móvil',
  Frontend: 'Frontend',
  Backend: 'Backend',
  'Web Full-Stack': 'Web full-stack',
  'Cross-Platform': 'Multiplataforma',
  Cloud: 'Nube',
  Serverless: 'Serverless',
  Testing: 'Pruebas',
  Performance: 'Rendimiento',
  Monitoring: 'Monitoreo',
  'Prompt Engineering': 'Ingeniería de prompts',
  'AI in Apps': 'IA en apps',
  Automation: 'Automatización',
  'Software Architecture': 'Arquitectura de software',
  'Clean Architecture': 'Arquitectura limpia',
  Microservices: 'Microservicios',
  'Product Management': 'Gestión de producto',
  Product: 'Producto',
  'Soft Skills': 'Habilidades blandas',
};

export function difficultyLabel(value: string | undefined | null): string {
  if (!value) return '—';
  const key = value.trim().toLowerCase();
  return DIFFICULTY_LABELS[key] ?? value;
}

export function learningPathLabel(value: string | undefined | null): string {
  if (!value) return '';
  return LEARNING_PATH_LABELS[value] ?? value;
}
