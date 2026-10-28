import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "mira_admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "mira-dev-secret";
}

function getAdminEmail() {
  return (
    process.env.ADMIN_EMAIL || "semiramohammed988@gmail.com"
  ).toLowerCase();
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "miraadmin123";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function verifyCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === getAdminEmail() &&
    password === getAdminPassword()
  );
}

export async function createSession() {
  const payload = `admin:${getAdminEmail()}`;
  const signature = sign(payload);
  const token = `${Buffer.from(payload).toString("base64url")}.${signature}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  try {
    const payload = Buffer.from(encoded, "base64url").toString("utf8");
    const expected = sign(payload);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    return payload === `admin:${getAdminEmail()}`;
  } catch {
    return false;
  }
}
