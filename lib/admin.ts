export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "jerinakter43211@gmail.com";

export function isConfiguredAdmin(email: string | null | undefined) {
  return Boolean(email && email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase());
}
