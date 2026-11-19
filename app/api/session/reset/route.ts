import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

/**
 * Start the funnel fresh: clears this browser's funnel progress, then goes to `to` (default /apply).
 * Used by the preview links so testers can run the application again after booking.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const to = url.searchParams.get("to") || "/apply";
  const safe = to.startsWith("/") && !to.startsWith("//") ? to : "/apply";
  await clearSession();
  const res = NextResponse.redirect(new URL(safe, url.origin));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
