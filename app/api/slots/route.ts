import { NextResponse } from "next/server";
import { BOOKING } from "@/config/investor";
import { bookingWindow, inWindow, sampleSlots } from "@/lib/booking";
import { calendarId, ghl } from "@/lib/ghl";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, message: "Please start the application again." }, { status: 401 });

  const tz = new URL(req.url).searchParams.get("tz") || BOOKING.timezoneDefault;
  const g = ghl("book");
  const live = g.live && !!calendarId();

  let slots: Record<string, string[]>;
  if (live) {
    const { start, end } = bookingWindow();
    try {
      slots = await g.freeSlots({ startMs: start, endMs: end, timezone: tz });
    } catch {
      return NextResponse.json({ ok: false, message: "We could not load times just now. Please refresh." }, { status: 502 });
    }
  } else {
    slots = sampleSlots();
  }

  // Enforce the 48 hour to 6 day window whatever the calendar returns.
  const flat = Object.values(slots).flat().filter((iso) => inWindow(iso)).sort();
  return NextResponse.json({ ok: true, mode: live ? "live" : "sample", slots: flat, durationMinutes: BOOKING.durationMinutes });
}
