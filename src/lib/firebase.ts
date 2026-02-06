import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;
let db: Firestore;

export function getDb(): Firestore {
  if (!db) {
    if (getApps().length === 0) {
      // If GOOGLE_APPLICATION_CREDENTIALS is set or running in Firebase/GCP,
      // credentials are automatic. Otherwise use service account JSON from env.
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id,
        });
      } else {
        app = initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
      }
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
  }
  return db;
}
