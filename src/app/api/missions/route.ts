import { NextResponse } from "next/server";

// Legacy endpoint - replaced by /api/quests
export async function GET() {
  return NextResponse.json(
    { error: "This endpoint has been replaced. Use /api/quests instead." },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "This endpoint has been replaced. Use /api/quests/complete instead." },
    { status: 410 }
  );
}
