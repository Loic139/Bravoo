import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/auth";
import { rerollQuest } from "@/lib/business";

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

    const result = await rerollQuest(decoded.uid, questId);

    if (!result) {
      return NextResponse.json({ error: "Cannot reroll this quest" }, { status: 400 });
    }

    return NextResponse.json({ quest: result });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
