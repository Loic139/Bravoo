import { NextResponse } from "next/server";
import { processDailyCheck, processMonthlyReset } from "@/lib/business";

export async function POST() {
  const monthlyReset = await processMonthlyReset();
  const dailyDeductions = await processDailyCheck();

  return NextResponse.json({
    monthlyResets: monthlyReset,
    starDeductions: dailyDeductions,
  });
}
