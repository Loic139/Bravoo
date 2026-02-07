import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/auth";
import { completeQuest } from "@/lib/business";

export async function POST(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(idToken);
    const { questId } = await req.json();

    if (!questId || typeof questId !== "string") {
      return NextResponse.json({ error: "Quest ID is required" }, { status: 400 });
    }

    const result = await completeQuest(decoded.uid, questId);

    if (!result) {
      return NextResponse.json({ error: "Quest not found or already completed" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
