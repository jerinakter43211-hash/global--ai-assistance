import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isConfiguredAdmin } from "@/lib/admin";
import { decryptPrivateData } from "@/lib/private-data";
import { Pool } from "pg";

export async function GET() {
  const session = await auth();
  if (!isConfiguredAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
  try {
    const result = await pool.query(
      "select id, kind, payload_ciphertext, status, created_at from private_submissions order by created_at desc limit 100",
    );
    return NextResponse.json({
      submissions: result.rows.map(row => ({
        id: row.id,
        kind: row.kind,
        status: row.status,
        createdAt: row.created_at,
        payload: decryptPrivateData(row.payload_ciphertext),
      })),
    });
  } finally {
    await pool.end().catch(() => undefined);
  }
}
