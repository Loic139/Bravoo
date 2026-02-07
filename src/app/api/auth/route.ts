import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, getOrCreateUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "ID token is required" }, { status: 400 });
  }

  try {
    const decoded = await verifyIdToken(idToken);
    const user = await getOrCreateUser(decoded.uid, decoded.name, decoded.email);

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Auth error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Auth failed: ${message}` },
      { status: 401 }
    );
  }
}
