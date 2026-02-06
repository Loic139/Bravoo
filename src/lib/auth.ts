import { getDb } from "./firebase";
import crypto from "crypto";

export interface User {
  id: string;
  username: string;
  stars: number;
  rank: string;
  token: string;
  lastActiveDate: string | null;
  createdAt: string;
}

export async function createUser(username: string): Promise<User> {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date().toISOString();

  const userData = {
    username,
    stars: 0,
    rank: "Bronze",
    token,
    lastActiveDate: null,
    createdAt: now,
  };

  const docRef = await db.collection("users").add(userData);

  return { id: docRef.id, ...userData };
}

export async function loginUser(username: string): Promise<User | null> {
  const db = getDb();
  const snapshot = await db
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
}

export async function getUserByToken(token: string): Promise<User | null> {
  const db = getDb();
  const snapshot = await db
    .collection("users")
    .where("token", "==", token)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
}
