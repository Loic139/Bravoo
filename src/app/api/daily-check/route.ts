import { NextResponse } from "next/server";
import { processMonthlyReset } from "@/lib/business";

export async function POST() {
  const monthlyReset = await processMonthlyReset();

  return NextResponse.json({
    monthlyResets: monthlyReset,
  });
}
