import { NextResponse } from "next/server";
import { ghlIsLive } from "@/lib/ghl";
import { setSession } from "@/lib/session";

/**
 * Preview only: open the confirmation page straight away as a test person who has booked.
 * /api/session/demo?nda=signed shows the open data room; ?nda=skipped shows the locked one.
 * Uses a fake contact and sends nothing. Switched off as soon as any GHL event is live.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (ghlIsLive()) return NextResponse.redirect(new URL("/", url.origin));
  const signed = url.searchParams.get("nda") !== "skipped";
  const start = new Date(Date.now() + 3 * 24 * 3600 * 1000);
  start.setUTCHours(15, 0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  await setSession({
    v: 1,
    contactId: "dry_contact_demo",
    opportunityId: "dry_opp_demo",
    firstName: "Ada",
    email: "test@example.com",
    step: signed ? "nda-signed" : "nda-skipped",
    booking: { start: start.toISOString(), end: end.toISOString(), timezone: "America/Chicago" },
    nda: signed ? { signedAt: new Date().toISOString(), name: "Ada Test" } : undefined,
  });
  const res = NextResponse.redirect(new URL("/confirmed", url.origin));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
