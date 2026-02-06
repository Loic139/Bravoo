import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

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
      } else {
        // In Cloud Functions / Cloud Run, credentials are automatic
        app = initializeApp();
      }
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
  }
  return db;
}
