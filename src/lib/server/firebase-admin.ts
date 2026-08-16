/**
 * Server-Side Firebase Admin SDK
 * Development Mission 10E
 *
 * Uses Application Default Credentials (ADC) or system service identity.
 * Strictly server-only. No committed credentials or private keys.
 */

import 'server-only';
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

const PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.GCP_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  'tinubu-achievement-stg';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp({
    projectId: PROJECT_ID,
  });
}

let adminAuthInstance: Auth | null = null;

export function getAdminAuth(): Auth {
  if (!adminAuthInstance) {
    const app = getAdminApp();
    adminAuthInstance = getAuth(app);
  }
  return adminAuthInstance;
}
