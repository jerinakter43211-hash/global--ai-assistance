import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Emergency directory is not configured" }, { status: 503 });
  const country = new URL(request.url).searchParams.get("country")?.trim().toUpperCase();
  if (!country || !/^[A-Z]{2}$/.test(country)) return NextResponse.json({ error: "Two-letter country code is required" }, { status: 400 });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
  try {
    const r = await pool.query(
      "select service_type,service_name,phone,website,verified_at from emergency_services where country_code=$1 and is_active=true order by service_type,service_name",
      [country],
    );
    return NextResponse.json({ country, services: r.rows });
  } finally { await pool.end().catch(() => undefined); }
}
