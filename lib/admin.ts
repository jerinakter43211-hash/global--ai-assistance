export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

export function isConfiguredAdmin(email: string | null | undefined) {
  const configured = normalizeEmail(ADMIN_EMAIL);
  const candidate = normalizeEmail(email);
  return Boolean(configured && candidate && configured === candidate);
}
