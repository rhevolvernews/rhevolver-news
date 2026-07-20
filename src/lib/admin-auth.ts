const COOKIE_NAME = "rhevolver_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function sign(value: string) {
  const secret = getSecret();
  if (!secret) return "";

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );

  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createAdminSessionValue(username: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `${username}.${expiresAt}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function isValidAdminSession(value?: string | null) {
  if (!value) return false;

  const [username, expiresAtRaw, suppliedSignature] = value.split(".");
  if (!username || !expiresAtRaw || !suppliedSignature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }

  if (username !== process.env.ADMIN_USERNAME) return false;

  const expectedSignature = await sign(`${username}.${expiresAtRaw}`);
  if (!expectedSignature || expectedSignature.length !== suppliedSignature.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < expectedSignature.length; index += 1) {
    difference |= expectedSignature.charCodeAt(index) ^ suppliedSignature.charCodeAt(index);
  }

  return difference === 0;
}

export const adminSession = {
  cookieName: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
};
