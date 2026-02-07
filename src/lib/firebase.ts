import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { existsSync } from "fs";

let app: App;
let db: Firestore;

export function getDb(): Firestore {
  if (!db) {
    if (getApps().length === 0) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id,
        });
      } else if (
        process.env.GOOGLE_APPLICATION_CREDENTIALS &&
        existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)
      ) {
        // Local dev with service account file
        app = initializeApp();
      } else {
        // Cloud Run / Cloud Functions: clear invalid file path and use auto credentials
        delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
        app = initializeApp();
      }
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
  }
  return db;
}
