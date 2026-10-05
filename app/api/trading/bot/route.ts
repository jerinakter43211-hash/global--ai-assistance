import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const symbol = url.searchParams.get("symbol") || "BTCUSDT";
  const interval = url.searchParams.get("interval") || "5m";
  const allowed = ["1m", "5m", "15m"];
  if (!allowed.includes(interval)) {
    return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
  }
  return NextResponse.json({
    bot: "ExpertOption Signal Bot",
    symbol,
    interval,
    status: "READY",
    action: "USE /api/trading/signal",
    note: "This bot generates signals only. It does not place trades or guarantee profit."
  });
}
