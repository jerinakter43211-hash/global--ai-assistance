import crypto from "node:crypto";

function getKey() {
  const raw = process.env.PRIVATE_DATA_ENCRYPTION_KEY;
  if (!raw) throw new Error("PRIVATE_DATA_ENCRYPTION_KEY is not configured");
  const key = Buffer.from(raw, "hex");
  if (key.length !== 32) throw new Error("PRIVATE_DATA_ENCRYPTION_KEY must be 64 hex characters");
  return key;
}

export function encryptPrivateData(value: unknown) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64url");
}

export function decryptPrivateData(payload: string) {
  const raw = Buffer.from(payload, "base64url");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ciphertext = raw.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8"));
}
