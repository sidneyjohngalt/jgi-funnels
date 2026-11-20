import "server-only";
import { calendarId, ghl, type GhlAppointment } from "@/lib/ghl";
import type { FunnelSession } from "@/lib/session";

export type CurrentCall =
  | { status: "booked"; start: string; end: string; appointmentId?: string; from: "ghl" | "cookie" }
  | { status: "cancelled"; appointmentId?: string; from: "ghl" }
  | { status: "none" };

const ACTIVE = new Set(["confirmed", "new", "booked", ""]);
const GRACE_MS = 2 * 3600_000; // a call that started under 2 hours ago still counts as the current one

/**
 * The person's current first call. Live (event 4 switched on, real contact): read from GHL, so a cancel,
 * a reschedule or a rebooking outside the funnel shows correctly. Dry-run, or if GHL cannot be read:
 * the time saved in the cookie at booking.
 */
export async function currentCall(s: FunnelSession, now = Date.now()): Promise<CurrentCall> {
  const fromCookie: CurrentCall = s.booking
    ? { status: "booked", start: s.booking.start, end: s.booking.end, appointmentId: s.appointmentId, from: "cookie" }
    : { status: "none" };

  const g = ghl("book");
  if (!g.live || !calendarId() || s.contactId.startsWith("dry_")) return fromCookie;

  let list: GhlAppointment[];
  try {
    list = await g.contactAppointments(s.contactId);
  } catch (e) {
    console.error("current call lookup failed", e);
    return fromCookie;
  }
  return pickCall(list, calendarId()!, s, now) ?? fromCookie;
}

/** Pure choice of the current call from GHL's list (exported for tests). */
export function pickCall(list: GhlAppointment[], cal: string, s: FunnelSession, now: number): CurrentCall | null {
  const mine = list.filter((a) => !a.calendarId || a.calendarId === cal);
  if (!mine.length) return null;

  const upcoming = mine
    .filter((a) => ACTIVE.has(a.status) && a.start && Date.parse(a.start) > now - GRACE_MS)
    .sort((a, b) => Date.parse(a.start!) - Date.parse(b.start!));
  if (upcoming.length) {
    const a = upcoming[0];
    return { status: "booked", start: a.start!, end: a.end ?? a.start!, appointmentId: a.id, from: "ghl" };
  }

  // An active appointment whose time GHL gave without an offset: keep the cookie's time, but it is still booked.
  const activeNoTime = mine.find((a) => ACTIVE.has(a.status) && !a.start);
  if (activeNoTime && s.booking) {
    return { status: "booked", start: s.booking.start, end: s.booking.end, appointmentId: activeNoTime.id, from: "cookie" };
  }

  const ours = s.appointmentId ? mine.find((a) => a.id === s.appointmentId) : undefined;
  if (ours?.status === "cancelled" || (!ours && mine.every((a) => a.status === "cancelled"))) {
    return { status: "cancelled", appointmentId: ours?.id, from: "ghl" };
  }
  return null;
}
