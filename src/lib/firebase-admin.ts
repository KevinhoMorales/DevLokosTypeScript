import admin from 'firebase-admin';

const GLOBAL_APP_KEY = '__DEVLOKOS_FIREBASE_ADMIN_APP';

declare global {
  // eslint-disable-next-line no-var
  var __DEVLOKOS_FIREBASE_ADMIN_APP: admin.app.App | undefined;
}

// Inicializar Firebase Admin solo una vez (módulo + global para evitar doble init entre workers/bundles)
let adminApp: admin.app.App | undefined;
let initError: Error | null = null;

/**
 * Convierte \n literales en private_key a saltos de línea reales (necesario cuando el JSON está en .env).
 */
function normalizeServiceAccount(parsed: Record<string, unknown>): admin.ServiceAccount {
  const key = parsed.private_key;
  if (typeof key === 'string' && key.includes('\\n')) {
    parsed = { ...parsed, private_key: key.replace(/\\n/g, '\n') };
  }
  return parsed as admin.ServiceAccount;
}

type AdminWithGetApps = { app: { getApps?: () => admin.app.App[] } };

/** Obtiene la app [DEFAULT] si ya existe. No usa getApps() para compatibilidad con Turbopack. */
function getExistingDefaultApp(): admin.app.App | null {
  try {
    const adminNamespace = admin as AdminWithGetApps;
    if (typeof adminNamespace.app?.getApps === 'function') {
      const apps = adminNamespace.app.getApps();
      if (apps?.length > 0) return apps[0] as admin.app.App;
    }
  } catch {
    // ignore
  }
  try {
    return admin.app();
  } catch {
    return null;
  }
}

function getAdminApp(): admin.app.App {
  const g = typeof globalThis !== 'undefined' ? (globalThis as unknown as Record<string, admin.app.App | undefined>) : undefined;
  if (g?.[GLOBAL_APP_KEY]) {
    adminApp = g[GLOBAL_APP_KEY]!;
    return g[GLOBAL_APP_KEY]!;
  }
  if (adminApp) {
    if (g) g[GLOBAL_APP_KEY] = adminApp;
    return adminApp;
  }
  const existing = getExistingDefaultApp();
  if (existing) {
    adminApp = existing;
    if (g) g[GLOBAL_APP_KEY] = adminApp;
    return adminApp;
  }
  if (initError) throw initError;

  const envKey = process.env.FIREBASE_ADMIN_SDK_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID || 'devlokos';

  if (envKey) {
    try {
      const parsed = JSON.parse(envKey) as Record<string, unknown>;
      const serviceAccount = normalizeServiceAccount(parsed);
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: (serviceAccount as { projectId?: string; project_id?: string }).projectId
        || (serviceAccount as { project_id?: string }).project_id
        || projectId,
      });
      if (g) g[GLOBAL_APP_KEY] = adminApp;
      return adminApp;
    } catch (error) {
      initError = error instanceof Error ? error : new Error(String(error));
      console.error('[Firebase Admin] Error con FIREBASE_ADMIN_SDK_KEY:', initError.message);
      const again = getExistingDefaultApp();
      if (again) {
        initError = null;
        adminApp = again;
        if (g) g[GLOBAL_APP_KEY] = adminApp;
        return adminApp;
      }
    }
  }

  try {
    adminApp = admin.initializeApp({ projectId });
    if (g) g[GLOBAL_APP_KEY] = adminApp;
    return adminApp;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    initError = err;
    console.error('[Firebase Admin] Error inicializando:', err.message);
    const again = getExistingDefaultApp();
    if (again) {
      initError = null;
      adminApp = again;
      if (g) g[GLOBAL_APP_KEY] = adminApp;
      return adminApp;
    }
    throw err;
  }
}

/** Nombres de parámetro que se prueban en Remote Config para la API key de YouTube */
const YOUTUBE_API_KEY_PARAM_NAMES = ['youtube_api_key', 'youtube-api-key', 'YOUTUBE_API_KEY'];

function extractRemoteConfigValue(parameter: { defaultValue?: unknown; conditionalValues?: Record<string, unknown> }): string | undefined {
  if (parameter.defaultValue != null) {
    const def = parameter.defaultValue as Record<string, unknown> | string;
    if (typeof def === 'string') return def.trim() || undefined;
    const v = def?.value;
    if (typeof v === 'string') return v.trim() || undefined;
  }
  if (parameter.conditionalValues && typeof parameter.conditionalValues === 'object') {
    const first = Object.values(parameter.conditionalValues)[0] as Record<string, unknown> | string | undefined;
    if (typeof first === 'string') return first.trim() || undefined;
    if (first && typeof (first as Record<string, unknown>).value === 'string') return ((first as Record<string, unknown>).value as string).trim() || undefined;
  }
  return undefined;
}

/**
 * Obtiene el YouTube API Key desde Firebase Remote Config (versión servidor).
 * Prueba varios nombres de parámetro y hace fallback a YOUTUBE_API_KEY en env.
 */
export async function getYouTubeApiKeyFromRemoteConfig(
  paramName?: string
): Promise<string> {
  const namesToTry = paramName
    ? [paramName, ...YOUTUBE_API_KEY_PARAM_NAMES.filter((n) => n !== paramName)]
    : YOUTUBE_API_KEY_PARAM_NAMES;

  try {
    const app = getAdminApp();
    const remoteConfig = admin.remoteConfig(app);
    const template = await remoteConfig.getTemplate();

    for (const name of namesToTry) {
      const parameter = template.parameters?.[name];
      if (!parameter) continue;

      const value = extractRemoteConfigValue(parameter);
      if (value) return value;
    }

    throw new Error(`No se encontró parámetro de YouTube API key en Remote Config (probados: ${namesToTry.join(', ')})`);
  } catch (error) {
    console.error('Error obteniendo YouTube API Key desde Remote Config:', error);

    const envKey = (process.env.YOUTUBE_API_KEY || '').trim();
    if (envKey) {
      console.log('Usando YOUTUBE_API_KEY desde variable de entorno como fallback');
      return envKey;
    }

    throw error;
  }
}

/**
 * Obtiene un valor string de Firebase Remote Config.
 */
export async function getRemoteConfigValue(paramName: string): Promise<string | null> {
  try {
    const app = getAdminApp();
    const remoteConfig = admin.remoteConfig(app);
    const template = await remoteConfig.getTemplate();
    const parameter = template.parameters[paramName];
    if (!parameter?.defaultValue) return null;
    const value = (parameter.defaultValue as { value?: string })?.value ?? null;
    return value;
  } catch {
    return null;
  }
}

/** Firestore instance for server-side reads. Sin FIREBASE_ADMIN_SDK_KEY las lecturas fallarán con error de permisos. */
export function getFirestore() {
  return admin.firestore(getAdminApp());
}

