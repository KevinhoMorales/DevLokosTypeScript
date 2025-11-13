import admin from 'firebase-admin';

// Inicializar Firebase Admin solo una vez
let adminApp: admin.app.App | undefined;

function getAdminApp(): admin.app.App {
  if (adminApp) {
    return adminApp;
  }

  // Intentar usar las credenciales desde variables de entorno
  if (process.env.FIREBASE_ADMIN_SDK_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY);
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('Error parsing FIREBASE_ADMIN_SDK_KEY:', error);
    }
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Si no hay credenciales, usar Application Default Credentials (para producción en GCP)
    adminApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    // Usar project ID por defecto de devlokos
    adminApp = admin.initializeApp({
      projectId: 'devlokos',
    });
  }

  return adminApp!;
}

/**
 * Obtiene el YouTube API Key desde Firebase Remote Config (versión servidor)
 * @param paramName Nombre del parámetro en Remote Config (default: 'youtube_api_key')
 * @returns Promise<string> El API key de YouTube
 */
export async function getYouTubeApiKeyFromRemoteConfig(
  paramName: string = 'youtube_api_key'
): Promise<string> {
  try {
    const app = getAdminApp();
    const remoteConfig = admin.remoteConfig(app);

    // Obtener la configuración remota
    const template = await remoteConfig.getTemplate();

    // Buscar el parámetro
    const parameter = template.parameters[paramName];

    if (!parameter) {
      throw new Error(`No se encontró el parámetro '${paramName}' en Remote Config`);
    }

    // Obtener el valor (puede ser un valor por defecto o un valor condicional)
    let value: string | undefined;

    if (parameter.defaultValue) {
      value = (parameter.defaultValue as any).value || parameter.defaultValue;
    }

    // Si hay valores condicionales, usar el primero disponible
    if (!value && parameter.conditionalValues) {
      const firstConditional = Object.values(parameter.conditionalValues)[0];
      if (firstConditional) {
        value = (firstConditional as any).value || firstConditional;
      }
    }

    if (!value) {
      throw new Error(`El parámetro '${paramName}' no tiene un valor configurado`);
    }

    return value;
  } catch (error) {
    console.error('Error obteniendo YouTube API Key desde Remote Config:', error);
    
    // Fallback: intentar obtener desde variable de entorno
    const envKey = process.env.YOUTUBE_API_KEY;
    if (envKey) {
      console.log('Usando YOUTUBE_API_KEY desde variable de entorno como fallback');
      return envKey;
    }

    throw error;
  }
}

