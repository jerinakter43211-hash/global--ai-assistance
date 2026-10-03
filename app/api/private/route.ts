import { NextResponse } from "next/server";
import { encryptPrivateData } from "@/lib/private-data";
import { Pool } from "pg";

const MAX_TEXT = 8000;

export async function POST(request: Request) {
  let pool: Pool | undefined;
  try {
    const body = await request.json();
    const kind = body?.kind === "high_alert" ? "high_alert" : body?.kind === "private_share" ? "private_share" : null;
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const countryCode = typeof body?.countryCode === "string" ? body.countryCode.trim().toUpperCase() : null;

    if (!kind || !text) return NextResponse.json({ error: "kind and text are required" }, { status: 400 });
    if (text.length > MAX_TEXT) return NextResponse.json({ error: "Submission is too long" }, { status: 400 });

    const encrypted = encryptPrivateData({
      text,
      countryCode,
      location: body?.location ?? null,
      createdAt: new Date().toISOString(),
    });

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Private storage is not configured yet." }, { status: 503 });
    }

    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
    await pool.query(
      "insert into private_submissions (kind, payload_ciphertext) values ($1, $2)",
      [kind, encrypted],
    );

    return NextResponse.json({ ok: true, message: "Submission received privately." });
  } catch (error) {
    console.error("Private submission error:", error);
    return NextResponse.json({ error: "Private submission could not be stored." }, { status: 500 });
  } finally {
    await pool?.end().catch(() => undefined);
  }
}
