// CRITICAL: Clear GOOGLE_APPLICATION_CREDENTIALS immediately at module load
// to prevent firebase-admin from trying to read a file that doesn't exist on Cloud Run.
// This MUST happen before any firebase-admin function is called.
delete process.env.GOOGLE_APPLICATION_CREDENTIALS;

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;
let db: Firestore;

export function getDb(): Firestore {
  if (!db) {
    if (getApps().length === 0) {
      // 1. From FIREBASE_SERVICE_ACCOUNT (injected at build time by webpack DefinePlugin)
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
          const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
          app = initializeApp({
            credential: cert(sa),
            projectId: sa.project_id,
          });
        } catch (e) {
          console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", e);
          app = initializeApp();
        }
      } else {
        // 2. Cloud Run ADC (Application Default Credentials)
        app = initializeApp();
      }
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
  }
  return db;
}
