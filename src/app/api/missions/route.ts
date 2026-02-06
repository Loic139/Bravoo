import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/auth";
import { getTodaysMissions, getMissionTimeWindow } from "@/lib/missions";
import { completeMission, getDailyActivity } from "@/lib/business";

export async function GET(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(idToken);
    const missions = getTodaysMissions();
    const timeWindow = getMissionTimeWindow();
    const today = new Date().toISOString().split("T")[0];

    const activity = await getDailyActivity(decoded.uid, today);

    return NextResponse.json({
      morning: {
        ...missions.morning,
        available: timeWindow.isMorning,
        completed: activity?.morningCompleted === true,
      },
      evening: {
        ...missions.evening,
        available: timeWindow.isEvening,
        completed: activity?.eveningCompleted === true,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(idToken);

    const { missionType } = await req.json();
    if (missionType !== "morning" && missionType !== "evening") {
      return NextResponse.json(
        { error: "Invalid mission type" },
        { status: 400 }
      );
    }

    const timeWindow = getMissionTimeWindow();
    if (missionType === "morning" && !timeWindow.isMorning) {
      return NextResponse.json(
        { error: "Morning mission is no longer available" },
        { status: 400 }
      );
    }
    if (missionType === "evening" && !timeWindow.isEvening) {
      return NextResponse.json(
        { error: "Evening mission is not yet available" },
        { status: 400 }
      );
    }

    const result = await completeMission(decoded.uid, missionType);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
