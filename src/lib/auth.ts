import { getDb } from "./db";
import crypto from "crypto";

export interface User {
  id: number;
  username: string;
  stars: number;
  rank: string;
  token: string;
  last_active_date: string | null;
  created_at: string;
}

export function createUser(username: string): User {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");

  db.prepare(
    "INSERT INTO users (username, token) VALUES (?, ?)"
  ).run(username, token);

  return db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username) as User;
}

export function loginUser(username: string): User | null {
  const db = getDb();
  return (
    (db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username) as User) || null
  );
}

export function getUserByToken(token: string): User | null {
  const db = getDb();
  return (
    (db
      .prepare("SELECT * FROM users WHERE token = ?")
      .get(token) as User) || null
  );
}

export function getUserById(id: number): User | null {
  const db = getDb();
  return (
    (db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User) || null
  );
}
