import { NextResponse } from "next/server";

export async function GET() {
  const aiConfigured = Boolean(process.env.OPENAI_API_KEY);
  const databaseConfigured = Boolean(process.env.DATABASE_URL);
  const encryptionConfigured = Boolean(process.env.PRIVATE_DATA_ENCRYPTION_KEY);
  const authConfigured = Boolean(
    process.env.AUTH_SECRET &&
    process.env.AUTH_GOOGLE_ID &&
    process.env.AUTH_GOOGLE_SECRET &&
    process.env.ADMIN_EMAIL,
  );

  return NextResponse.json({
    ok: true,
    service: "global-ai-assistance",
    status: aiConfigured && databaseConfigured && encryptionConfigured && authConfigured ? "ready" : "configuration_required",
    aiConfigured,
    databaseConfigured,
    encryptionConfigured,
    authConfigured,
  });
}
