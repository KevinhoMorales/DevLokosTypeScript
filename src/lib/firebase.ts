import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getRemoteConfig, getValue, fetchAndActivate, RemoteConfig } from 'firebase/remote-config';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'devlokos.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'devlokos',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'devlokos.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '458512617441',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:458512617441:web:9423dc5de210ad4f9c8ca0',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-X7DLGDN6HV',
};

const hasFirebaseConfig =
  typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 0;

let app: FirebaseApp | undefined;
let analytics: Analytics | undefined;
let auth: Auth | undefined;

function ensureApp(): FirebaseApp | undefined {
  if (typeof window === 'undefined' || !hasFirebaseConfig) return undefined;
  if (app) return app;
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0] as FirebaseApp;
  }
  return app;
}

if (typeof window !== 'undefined' && hasFirebaseConfig) {
  ensureApp();
  if (app) {
    try {
      analytics = getAnalytics(app);
    } catch {
      // Analytics puede fallar en SSR/edge
    }
    auth = getAuth(app);
  }
}

let remoteConfig: RemoteConfig | undefined;

if (typeof window !== 'undefined' && app) {
  remoteConfig = getRemoteConfig(app);
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
}

export function getFirebaseAuth(): Auth {
  const a = ensureApp();
  if (!a) throw new Error('Firebase no está inicializado. Configura NEXT_PUBLIC_FIREBASE_API_KEY.');
  if (!auth) auth = getAuth(a);
  return auth;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  return credential.user;
}

export async function logoutFirebase(): Promise<void> {
  await signOut(getFirebaseAuth());
}

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function getYouTubeApiKey(paramName: string = 'youtube_api_key'): Promise<string> {
  const a = ensureApp();
  if (!a) throw new Error('Firebase no está inicializado');

  if (!remoteConfig) {
    remoteConfig = getRemoteConfig(a);
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
  }

  try {
    await fetchAndActivate(remoteConfig);
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

export { app, analytics, auth };
export type { User };
