import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getRemoteConfig, getValue, RemoteConfig } from 'firebase/remote-config';

// Configuración de Firebase (apiKey es obligatorio para inicializar)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "devlokos.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "devlokos",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "devlokos.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "458512617441",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:458512617441:web:9423dc5de210ad4f9c8ca0",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-X7DLGDN6HV",
};

const hasFirebaseConfig =
  typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 0;

// Inicializar Firebase solo cuando hay credenciales (evita "Missing apiKey")
let app: FirebaseApp | undefined;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined' && hasFirebaseConfig) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
  } else {
    app = getApps()[0] as FirebaseApp;
    analytics = getAnalytics(app);
  }
}

// Obtener Remote Config solo si Firebase está inicializado
let remoteConfig: RemoteConfig | undefined;

if (typeof window !== 'undefined' && app) {
  remoteConfig = getRemoteConfig(app);
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hora
}

/**
 * Obtiene el YouTube API Key desde Firebase Remote Config
 * @param paramName Nombre del parámetro en Remote Config (default: 'youtube_api_key')
 * @returns Promise<string> El API key de YouTube
 */
export async function getYouTubeApiKey(paramName: string = 'youtube_api_key'): Promise<string> {
  if (!app) {
    throw new Error('Firebase no está inicializado');
  }

  if (!remoteConfig) {
    remoteConfig = getRemoteConfig(app);
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
  }

  try {
    // Fetch y activar los valores de Remote Config
    await (remoteConfig as any).fetchAndActivate();
    
    // Obtener el valor del parámetro
    const configValue = getValue(remoteConfig, paramName);
    
    if (!configValue || !configValue.asString()) {
      throw new Error(`No se encontró el parámetro '${paramName}' en Remote Config`);
    }

    return configValue.asString();
  } catch (error) {
    console.error('Error obteniendo YouTube API Key desde Remote Config:', error);
    throw error;
  }
}

export { app, analytics };

