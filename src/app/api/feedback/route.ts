import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, getUserByUid } from "@/lib/auth";
import { getDb } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  try {
    await verifyIdToken(idToken);
    const db = getDb();
    const snap = await db
      .collection("feedback")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const items = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ feedback: items });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ error: error.message || "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(idToken);
    const user = await getUserByUid(decoded.uid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const message = (body.message || "").trim();

    if (!message || message.length > 500) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const db = getDb();
    const feedbackData = {
      userId: decoded.uid,
      username: user.username,
      message,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("feedback").add(feedbackData);

    return NextResponse.json({ id: docRef.id, ...feedbackData });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ error: error.message || "Error" }, { status: 500 });
  }
}
