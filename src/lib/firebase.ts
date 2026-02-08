import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

let app: App;
let db: Firestore;

function loadServiceAccount(): Record<string, string> | null {
  // 1. From FIREBASE_SERVICE_ACCOUNT env (injected at build time by webpack)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT");
    }
  }

  // 2. From local file (dev environment)
  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (filePath) {
    const resolved = resolve(filePath);
    if (existsSync(resolved)) {
      try {
        return JSON.parse(readFileSync(resolved, "utf-8"));
      } catch {
        console.error("Failed to parse service account file:", resolved);
      }
    }
  }

  return null;
}

export function getDb(): Firestore {
  if (!db) {
    if (getApps().length === 0) {
      const sa = loadServiceAccount();
      if (sa) {
        // Always use cert() with parsed object - never rely on file paths
        app = initializeApp({
          credential: cert(sa),
          projectId: sa.project_id,
        });
      } else {
        // Cloud Run ADC: clear any stale file path to prevent ENOENT errors
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
