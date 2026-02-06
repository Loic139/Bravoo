import { NextResponse } from "next/server";
import { processDailyCheck, processMonthlyReset } from "@/lib/business";

export async function POST() {
  const monthlyReset = processMonthlyReset();
  const dailyDeductions = processDailyCheck();

  return NextResponse.json({
    monthlyResets: monthlyReset,
    starDeductions: dailyDeductions,
  });
}
