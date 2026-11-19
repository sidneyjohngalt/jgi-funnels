import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * The applicant's place in the funnel, kept in a signed, http-only cookie.
 * Holds IDs and progress only; no answers beyond first name and email.
 */
export type FunnelSession = {
  v: 1;
  contactId: string;
  opportunityId?: string;
  firstName: string;
  email: string;
  step: "started" | "applied" | "qualified" | "not-qualified" | "booked" | "nda-signed" | "nda-skipped";
  booking?: { start: string; end: string; timezone: string };
  nda?: { signedAt: string; name: string };
};

const COOKIE = "jgi_funnel";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const s = process.env.FUNNEL_SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.GHL_LIVE === "true") {
    throw new Error("FUNNEL_SESSION_SECRET (32+ chars) is required when GHL_LIVE=true");
  }
  // Preview and dry-run only. Live mode refuses to run without a real secret.
  return "jgi-funnels-preview-only-not-for-live-use-000000";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function encode(s: FunnelSession): string {
  const payload = Buffer.from(JSON.stringify(s)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decode(raw: string | undefined): FunnelSession | null {
  if (!raw) return null;
  const [payload, mac] = raw.split(".");
  if (!payload || !mac) return null;
  const expected = sign(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString()) as FunnelSession;
    return s?.v === 1 ? s : null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<FunnelSession | null> {
  const jar = await cookies();
  return decode(jar.get(COOKIE)?.value);
}

export async function setSession(s: FunnelSession) {
  const jar = await cookies();
  jar.set(COOKIE, encode(s), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
