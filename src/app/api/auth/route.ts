import { NextRequest, NextResponse } from "next/server";
import { createUser, loginUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  if (!username || typeof username !== "string") {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const trimmed = username.trim();
  if (trimmed.length < 2 || trimmed.length > 20) {
    return NextResponse.json(
      { error: "Username must be 2-20 characters" },
      { status: 400 }
    );
  }

  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return NextResponse.json(
      { error: "Username can only contain letters, numbers, and underscores" },
      { status: 400 }
    );
  }

  // Try to login first
  let user = await loginUser(trimmed);
  if (user) {
    return NextResponse.json({ user, isNew: false });
  }

  // Create new user
  try {
    user = await createUser(trimmed);
    return NextResponse.json({ user, isNew: true });
  } catch {
    return NextResponse.json(
      { error: "Could not create user" },
      { status: 500 }
    );
  }
}
