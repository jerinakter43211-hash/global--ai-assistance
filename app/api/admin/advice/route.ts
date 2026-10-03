import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isConfiguredAdmin } from "@/lib/admin";
import { Pool } from "pg";

async function admin() {
  const session = await auth();
  return isConfiguredAdmin(session?.user?.email);
}

export async function GET() {
  if (!(await admin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
  try {
    const r = await pool.query("select id,title,body,status,created_at,published_at from daily_advice order by created_at desc limit 100");
    return NextResponse.json({ advice: r.rows });
  } finally { await pool.end().catch(() => undefined); }
}

export async function POST(request: Request) {
  if (!(await admin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const body = await request.json();
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const text = typeof body?.body === "string" ? body.body.trim() : "";
  if (!title || !text) return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
  try {
    const r = await pool.query("insert into daily_advice(title,body,status) values($1,$2,'draft') returning *",[title,text]);
    return NextResponse.json({ advice: r.rows[0] }, { status: 201 });
  } finally { await pool.end().catch(() => undefined); }
}

export async function PATCH(request: Request) {
  if (!(await admin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  const body = await request.json();
  const id = typeof body?.id === "string" ? body.id : "";
  const status = ["draft","approved","published","rejected"].includes(body?.status) ? body.status : null;
  if (!id || !status) return NextResponse.json({ error: "Valid id and status are required" }, { status: 400 });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
  try {
    const r = await pool.query("update daily_advice set status=$1, published_at=case when $1='published' then now() else published_at end where id=$2 returning *",[status,id]);
    if (!r.rowCount) return NextResponse.json({ error: "Advice not found" }, { status: 404 });
    return NextResponse.json({ advice: r.rows[0] });
  } finally { await pool.end().catch(() => undefined); }
}
