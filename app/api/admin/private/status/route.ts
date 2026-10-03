import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isConfiguredAdmin } from "@/lib/admin";
import { Pool } from "pg";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!isConfiguredAdmin(session?.user?.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const body = await request.json();
  const id = typeof body?.id === "string" ? body.id : "";
  const status = ["new","reviewed","closed"].includes(body?.status) ? body.status : null;
  if (!id || !status) return NextResponse.json({ error: "Valid id and status are required" }, { status: 400 });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
  try {
    const r = await pool.query("update private_submissions set status=$1 where id=$2 returning id,status",[status,id]);
    if (!r.rowCount) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    return NextResponse.json(r.rows[0]);
  } finally { await pool.end().catch(() => undefined); }
}
