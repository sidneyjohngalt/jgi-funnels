import { NextResponse } from "next/server";
import { decode, setSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Personal rebook link from GHL emails: restores the signed session, then opens /rebook to pick a new time. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const s = decode(url.searchParams.get("t") ?? undefined);
  if (!s?.booking) return NextResponse.redirect(new URL("/apply", url.origin));
  await setSession(s);
  const res = NextResponse.redirect(new URL("/rebook", url.origin));
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Referrer-Policy", "no-referrer");
  return res;
}
