/**
 * Client-Side Firebase Authentication SDK
 * Development Mission 10E
 *
 * Configured with ephemeral in-memory persistence so credentials and ID tokens
 * are not retained in client localStorage. The server session cookie is authoritative.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  setPersistence,
  inMemoryPersistence,
  browserSessionPersistence,
  type Auth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyPlaceholderForStagingClientEnvKey',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tinubu-achievement-stg.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tinubu-achievement-stg',
};

function getFirebaseClientApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

let clientAuthInstance: Auth | null = null;

export function getClientAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('getClientAuth() must only be called on the client side.');
  }

  if (!clientAuthInstance) {
    const app = getFirebaseClientApp();
    clientAuthInstance = getAuth(app);
    // Set persistence to inMemory / session so client localStorage does not persist credentials
    try {
      setPersistence(clientAuthInstance, inMemoryPersistence).catch(() => {
        setPersistence(clientAuthInstance!, browserSessionPersistence).catch(() => {});
      });
    } catch {
      // Fallback gracefully
    }
  }

  return clientAuthInstance;
}

export interface ClientAuthResult {
  idToken: string;
  email: string;
  emailVerified: boolean;
}

/**
 * Authenticates staff with email and password via Firebase Auth,
 * retrieves ID token for server session exchange, and returns the token.
 */
export async function clientStaffSignIn(
  email: string,
  password: string
): Promise<ClientAuthResult> {
  const auth = getClientAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const idToken = await userCredential.user.getIdToken(true);

  return {
    idToken,
    email: userCredential.user.email || email,
    emailVerified: userCredential.user.emailVerified,
  };
}

/**
 * Initiates Firebase password reset email flow
 */
export async function clientStaffForgotPassword(email: string): Promise<void> {
  const auth = getClientAuth();
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Ephemeral client sign out to clean local state
 */
export async function clientStaffSignOut(): Promise<void> {
  try {
    const auth = getClientAuth();
    await firebaseSignOut(auth);
  } catch {
    // Ignore sign-out cleanup error
  }
}
