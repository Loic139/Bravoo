import { getDb } from "./firebase";
import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";

export interface User {
  id: string;
  username: string;
  stars: number;
  rank: string;
  lastActiveDate: string | null;
  createdAt: string;
}

export async function verifyIdToken(idToken: string) {
  // Ensure Firebase is initialized
  getDb();
  const authAdmin = getAuth(getApps()[0]);
  return authAdmin.verifyIdToken(idToken);
}

export async function getOrCreateUser(
  uid: string,
  displayName: string | undefined,
  email: string | undefined
): Promise<User> {
  const db = getDb();
  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();

  if (userSnap.exists) {
    return { id: uid, ...userSnap.data() } as User;
  }

  // Create new user
  const username = displayName || email?.split("@")[0] || "Player";
  const now = new Date().toISOString();

  const userData = {
    username,
    stars: 0,
    rank: "Bronze",
    lastActiveDate: null,
    createdAt: now,
  };

  await userRef.set(userData);

  return { id: uid, ...userData };
}

export async function getUserByUid(uid: string): Promise<User | null> {
  const db = getDb();
  const userSnap = await db.collection("users").doc(uid).get();

  if (!userSnap.exists) return null;

  return { id: uid, ...userSnap.data() } as User;
}
