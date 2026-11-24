import { NextResponse } from "next/server";
import { BOOKING, FIELDS, TAGS } from "@/config/investor";
import { inWindow } from "@/lib/booking";
import { calendarId, ghl } from "@/lib/ghl";
import { clean } from "@/lib/request";
import { currentCall } from "@/lib/appointment";
import { confirmationLink, getSession, rebookLink, setSession } from "@/lib/session";

/**
 * Event 4: book the first call. The code creates the GHL appointment and writes the person's signed
 * confirmation page link. CRM's Call booked workflow (triggered by the appointment) adds call:booked,
 * moves the card to Call Booked and sends the emails.
 * Rebooking (from /rebook): GHL has no Rescheduled trigger, so a call is never moved in place (Reconciled
 * decisions, "Reschedules", 24 Nov). When GHL still holds an active appointment, the code adds call:rescheduled,
 * cancels the old appointment, waits a few seconds and books the new time. CRM's Call cancelled (16) sees the tag
 * and sends nothing; Call booked (5) treats the new appointment as a move. After a cancel, a new appointment is
 * simply created.
 */
const MOVE_WAIT_MS = 3000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Live only: is this start time still free on the calendar? null when GHL gave no slots to check against. */
async function slotIsFree(g: ReturnType<typeof ghl>, start: string, timezone: string): Promise<boolean | null> {
  const t = Date.parse(start);
  const slots = await g.freeSlots({ startMs: t - 86400_000, endMs: t + 86400_000, timezone });
  const all = Object.values(slots).flat();
  if (!all.length) return null;
  return all.some((x) => Date.parse(x) === t);
}
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, message: "Please start the application again." }, { status: 401 });
  if (s.step === "started" || s.step === "applied" || s.step === "not-qualified") {
    return NextResponse.json({ ok: false, message: "Please finish the application first." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const start = clean(body.start, 40);
  const timezone = clean(body.timezone, 60) || BOOKING.timezoneDefault;
  if (!inWindow(start)) {
    return NextResponse.json(
      { ok: false, message: `Please choose a time at least ${BOOKING.minHoursAhead} hours and no more than ${BOOKING.maxDaysAhead} days away.` },
      { status: 400 },
    );
  }
  const g = ghl("book");
  if (g.live && !calendarId()) {
    return NextResponse.json({ ok: false, message: "Booking is not open yet. We will be in touch to arrange a time." }, { status: 503 });
  }
  const end = new Date(Date.parse(start) + BOOKING.durationMinutes * 60000).toISOString();

  try {
    const rebooking = !!s.booking;
    const now = rebooking ? await currentCall(s) : ({ status: "none" } as const);
    let appointmentId: string | undefined;
    const title = `First call with ${BOOKING.hostName}: ${s.firstName}`;
    if (now.status === "booked" && now.appointmentId) {
      // A move: tag, cancel, wait, book. Check the new time first so we never cancel for a taken slot.
      if (g.live && (await slotIsFree(g, start, timezone)) === false) throw new Error("slot taken");
      await g.addTags(s.contactId, [TAGS.callRescheduled]);
      await g.cancelAppointment(now.appointmentId, s.contactId);
      if (g.live) await sleep(MOVE_WAIT_MS);
      try {
        appointmentId = (await g.createAppointment({ contactId: s.contactId, startTime: start, endTime: end, title })).appointmentId;
      } catch (e) {
        // The old call is already cancelled: put it back at its old time if it is still ahead, so nobody is left without a call.
        if (Date.parse(now.start) > Date.now()) {
          try {
            const back = await g.createAppointment({ contactId: s.contactId, startTime: now.start, endTime: now.end, title });
            await setSession({ ...s, booking: { start: now.start, end: now.end, timezone: s.booking?.timezone ?? timezone }, appointmentId: back.appointmentId });
          } catch (e2) {
            console.error("rebook restore failed", e2);
          }
        }
        throw e;
      }
    } else {
      appointmentId = (await g.createAppointment({ contactId: s.contactId, startTime: start, endTime: end, title })).appointmentId;
    }
    const step = s.nda ? ("nda-signed" as const) : s.step === "nda-skipped" ? ("nda-skipped" as const) : ("booked" as const);
    const next = { ...s, step, booking: { start, end, timezone }, appointmentId };
    await g.updateContact(s.contactId, {
      customFields: [
        { key: FIELDS.confirmationPageLink, field_value: confirmationLink(next, req) },
        { key: FIELDS.rebookLink, field_value: rebookLink(next, req) },
      ],
    });
    await setSession(next);
    return NextResponse.json({ ok: true, next: step === "booked" && !rebooking ? "/nda" : "/confirmed" });
  } catch (e) {
    console.error("book failed", e);
    return NextResponse.json({ ok: false, message: "That time may have just been taken. Please pick another." }, { status: 409 });
  }
}
