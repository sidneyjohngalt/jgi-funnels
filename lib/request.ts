import "server-only";
import { headers } from "next/headers";

export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function userAgent(): Promise<string> {
  const h = await headers();
  return h.get("user-agent") ?? "unknown";
}

export function clean(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function validEmail(e: string): boolean {
  return /^[^ @]+@[^ @]+[.][^ @]{2,}$/.test(e);
}

export function validPhone(p: string): boolean {
  return p.replace(/[^0-9]/g, "").length >= 7;
}

/** Normalise US numbers to E.164 when possible; otherwise return as typed. */
export function normalisePhone(p: string): string {
  const digits = p.replace(/[^0-9]/g, "");
  if (p.trim().startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return p.trim();
}
