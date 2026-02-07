import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/auth";
import { generateQuests, getWeeklyProgress } from "@/lib/business";

export async function GET(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(idToken);
    const quests = await generateQuests(decoded.uid);
    const progress = await getWeeklyProgress(decoded.uid);

    return NextResponse.json({ quests, progress });
  } catch (err: unknown) {
    const error = err as { message?: string; code?: string };
    console.error("Quests API error:", error.message || error.code || err);
    return NextResponse.json(
      { error: error.message || "Unauthorized", code: error.code },
      { status: 500 }
    );
  }
}
